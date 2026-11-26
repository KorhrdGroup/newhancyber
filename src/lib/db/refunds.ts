import "server-only";
import { getPool, sql } from "./client";

/**
 * 환불 신청 (학습자) — dbo.refunds · refund_items. LMS 「환불 관리」가 이 신청을 처리한다(환불 진행 중 → 완료 / 반려).
 * 규칙은 newhancyber-lms src/lib/db/refunds.ts · payments.ts 를 따른다:
 *   - 신청할 수 있는 과목: 그 회원의 결제 항목 중 「결제 완료」이고, 진행 중인 환불(환불 접수 · 환불 진행 중)에 들어 있지 않은 것
 *   - 환불 단계(4단계)는 신청일(한국 날짜) 기준, 학기 수강 기간으로 센다 — LMS refundGrade() 와 같은 식:
 *       지난 날 = 오늘 − 수강 시작일 + 1, 전체 = 수강 끝 − 시작 + 1
 *       지난 날 < 1 → 전액 · < ⌈전체/3⌉ → 2/3 · < ⌈전체/2⌉ → 1/2 · 그 뒤 → 0원 (금액 = 낸 돈 × 비율, 원 아래 버림)
 *   - 신청하면 결제 상태는 「환불 접수」(LMS RECOMPUTE_PAYMENT_SQL 과 같은 우선순위 — 진행 중인 환불이 있으면 「환불 진행 중」)
 *   - 수강(enrollments)은 건드리지 않는다 — LMS 가 환불을 완료할 때 「수강 취소」로 바꾼다
 * 잠금 순서는 LMS 와 같다: payments → payment_items → refunds.
 */

const KST_TODAY = "CAST(DATEADD(HOUR, 9, SYSUTCDATETIME()) AS DATE)";

/** 결제 항목 i · 학기 s 로 오늘 기준 환불 단계와 금액 (paid = ISNULL(i.paid_amount, i.price)) */
const GRADE_SQL = `
  CROSS APPLY (SELECT DATEDIFF(DAY, s.study_start, ${KST_TODAY}) + 1 AS passed,
                      DATEDIFF(DAY, s.study_start, s.study_end) + 1 AS total,
                      ISNULL(i.paid_amount, i.price) AS paid) d
  CROSS APPLY (SELECT CASE WHEN d.passed < 1 THEN N'전액'
                           WHEN d.passed < CEILING(d.total / 3.0) THEN N'2/3'
                           WHEN d.passed < CEILING(d.total / 2.0) THEN N'1/2'
                           ELSE N'0원' END AS grade) g
  CROSS APPLY (SELECT CASE g.grade WHEN N'전액' THEN d.paid WHEN N'2/3' THEN d.paid * 2 / 3
                                   WHEN N'1/2' THEN d.paid / 2 ELSE 0 END AS amount) a`;

/** 진행 중인 환불(접수 · 진행 중)에 들어 있는 결제 항목인가 (i = payment_items) */
const IN_OPEN_REFUND = `EXISTS (SELECT 1 FROM dbo.refund_items ri JOIN dbo.refunds r ON r.refund_id = ri.refund_id
                               WHERE ri.payment_item_id = i.payment_item_id AND r.status IN (N'환불 접수', N'환불 진행 중'))`;

export interface RefundLine {
  itemId: number;
  name: string;
  semester: string;
  /** 수강 기간 「2026.12.10 ~ 2027.03.24」 */
  studyPeriod: string;
  paid: number;
  grade: string;
  /** 오늘 신청하면 돌려받을 예상 금액 */
  amount: number;
  /** 신청할 수 있는가 — 아니면 note 에 까닭 */
  refundable: boolean;
  note: string | null;
}

export interface RefundForm {
  paymentId: number;
  title: string;
  method: string;
  paidAmount: number;
  lines: RefundLine[];
  /** 회원가입 때 적은 환불 계좌 (미리 채우기) */
  refundBank: string | null;
  refundAccount: string | null;
  memberName: string;
}

/** 환불 신청 화면 — 그 회원의 결제만 (다른 회원 결제면 null) */
export async function readRefundForm(memberId: number, paymentId: number): Promise<RefundForm | null> {
  const pool = await getPool();
  const req = () => pool.request().input("m", sql.Int, memberId).input("p", sql.Int, paymentId);
  const [head, lines] = await Promise.all([
    req().query<Omit<RefundForm, "lines" | "title"> & { title: string | null }>(`
      SELECT p.payment_id AS paymentId, p.title, p.method, ISNULL(p.paid_amount, 0) AS paidAmount,
        m.refund_bank AS refundBank, m.refund_account AS refundAccount, m.name AS memberName
      FROM dbo.payments p JOIN dbo.members m ON m.member_id = p.member_id
      WHERE p.payment_id = @p AND p.member_id = @m`),
    req().query<Omit<RefundLine, "refundable"> & { itemStatus: string; inOpen: boolean }>(`
      SELECT i.payment_item_id AS itemId,
        co.name + CASE WHEN (SELECT COUNT(*) FROM dbo.classes x WHERE x.semester_id = cl.semester_id AND x.course_id = cl.course_id AND x.is_active = 1) > 1
                       THEN N' ' + CAST(cl.class_no AS NVARCHAR(5)) + N'반' ELSE N'' END AS name,
        s.name AS semester,
        REPLACE(CONVERT(CHAR(10), s.study_start, 23), '-', '.') + N' ~ ' + REPLACE(CONVERT(CHAR(10), s.study_end, 23), '-', '.') AS studyPeriod,
        d.paid, g.grade, a.amount, i.status AS itemStatus,
        CAST(CASE WHEN ${IN_OPEN_REFUND} THEN 1 ELSE 0 END AS BIT) AS inOpen,
        CAST(NULL AS NVARCHAR(30)) AS note
      FROM dbo.payment_items i
      JOIN dbo.payments p ON p.payment_id = i.payment_id
      JOIN dbo.classes cl ON cl.class_id = i.class_id
      JOIN dbo.courses co ON co.course_id = cl.course_id
      JOIN dbo.semesters s ON s.semester_id = cl.semester_id
      ${GRADE_SQL}
      WHERE i.payment_id = @p AND p.member_id = @m
      ORDER BY i.payment_item_id`),
  ]);
  const h = head.recordset[0];
  if (!h) return null;
  const items = lines.recordset.map(({ itemStatus, inOpen, ...l }): RefundLine => {
    const note = inOpen ? "환불 신청 중" : itemStatus !== "결제 완료" ? itemStatus : null;
    return { ...l, refundable: note === null, note };
  });
  const fallback = items.length ? `${items[0].name}${items.length > 1 ? ` 외 ${items.length - 1}과목` : ""}` : "(과목 없음)";
  return { ...h, title: h.title?.trim() || fallback, lines: items };
}

export type RefundRequestResult = { ok: true; refundId: number } | { ok: false; reason: "notFound" | "notRefundable" };

/**
 * 환불 신청 — 고른 결제 항목으로 「환불 접수」 한 건. 단계 · 금액은 서버가 오늘 기준으로 다시 센다 (브라우저 금액은 받지 않는다).
 * 고른 항목 중 하나라도 신청할 수 없으면(이미 신청 중 · 결제 완료 아님 · 다른 결제) 아무것도 쓰지 않는다.
 */
export async function createRefundRequest(input: {
  memberId: number;
  paymentId: number;
  itemIds: number[];
  reason: string;
  reasonEtc: string | null;
  bank: string | null;
  account: string | null;
  holder: string | null;
}): Promise<RefundRequestResult> {
  const ids = [...new Set(input.itemIds.filter((n) => Number.isInteger(n) && n > 0))];
  if (ids.length === 0) return { ok: false, reason: "notRefundable" };
  const pool = await getPool();
  const r = await pool
    .request()
    .input("m", sql.Int, input.memberId)
    .input("pid", sql.Int, input.paymentId)
    .input("ids", sql.NVarChar(sql.MAX), ids.join(","))
    .input("reason", sql.NVarChar(50), input.reason)
    .input("reasonEtc", sql.NVarChar(500), input.reasonEtc)
    .input("bank", sql.NVarChar(30), input.bank)
    .input("account", sql.NVarChar(50), input.account)
    .input("holder", sql.NVarChar(50), input.holder)
    .query<{ result: string; refundId: number | null }>(`
      SET XACT_ABORT ON;
      BEGIN TRANSACTION;

      -- 결제를 먼저 잠근다 (LMS 와 같은 순서) — 그 회원의 결제가 아니면 끝
      IF NOT EXISTS (SELECT 1 FROM dbo.payments WITH (UPDLOCK, HOLDLOCK) WHERE payment_id = @pid AND member_id = @m)
      BEGIN
        ROLLBACK TRANSACTION;
        SELECT N'notFound' AS result, CAST(NULL AS INT) AS refundId;
        RETURN;
      END

      DECLARE @want TABLE (id INT PRIMARY KEY);
      INSERT INTO @want (id)
        SELECT DISTINCT TRY_CAST(value AS INT) FROM STRING_SPLIT(@ids, ',') WHERE TRY_CAST(value AS INT) IS NOT NULL;

      -- 고른 항목을 잠그고 오늘 기준 단계 · 금액을 센다 — 신청할 수 없는 항목이 섞이면 끝
      DECLARE @sel TABLE (id INT PRIMARY KEY, paid INT NOT NULL, grade NVARCHAR(10) NOT NULL, amount INT NOT NULL, ok BIT NOT NULL);
      INSERT INTO @sel (id, paid, grade, amount, ok)
        SELECT i.payment_item_id, d.paid, g.grade, a.amount,
          CAST(CASE WHEN i.status = N'결제 완료' AND NOT ${IN_OPEN_REFUND} THEN 1 ELSE 0 END AS BIT)
        FROM dbo.payment_items i WITH (UPDLOCK, HOLDLOCK)
        JOIN dbo.classes cl ON cl.class_id = i.class_id
        JOIN dbo.semesters s ON s.semester_id = cl.semester_id
        ${GRADE_SQL}
        WHERE i.payment_id = @pid AND i.payment_item_id IN (SELECT id FROM @want);

      IF (SELECT COUNT(*) FROM @sel) <> (SELECT COUNT(*) FROM @want) OR EXISTS (SELECT 1 FROM @sel WHERE ok = 0)
      BEGIN
        ROLLBACK TRANSACTION;
        SELECT N'notRefundable' AS result, CAST(NULL AS INT) AS refundId;
        RETURN;
      END

      INSERT INTO dbo.refunds (payment_id, status, requested_by, reason, reason_etc, amount, bank, account, holder, requested_at)
        VALUES (@pid, N'환불 접수', N'학습자', @reason, @reasonEtc, (SELECT SUM(amount) FROM @sel), @bank, @account, @holder, SYSDATETIME());
      DECLARE @rid INT = CAST(SCOPE_IDENTITY() AS INT);
      INSERT INTO dbo.refund_items (refund_id, payment_item_id, original_amount, refund_amount, refund_grade)
        SELECT @rid, id, paid, amount, grade FROM @sel;

      -- 결제 상태 — LMS 와 같은 우선순위 (진행 중인 환불이 있으면 그대로 「환불 진행 중」)
      UPDATE dbo.payments
        SET status = CASE WHEN EXISTS (SELECT 1 FROM dbo.refunds r WHERE r.payment_id = @pid AND r.status = N'환불 진행 중')
                          THEN N'환불 진행 중' ELSE N'환불 접수' END,
            updated_at = SYSDATETIME()
        WHERE payment_id = @pid;

      COMMIT TRANSACTION;
      SELECT N'ok' AS result, @rid AS refundId;`);
  const row = r.recordset[0];
  if (row?.result === "ok" && row.refundId) return { ok: true, refundId: row.refundId };
  return { ok: false, reason: row?.result === "notFound" ? "notFound" : "notRefundable" };
}

// ── 마이페이지 환불 내역 ─────────────────────────────────────

export interface MemberRefundRow {
  refundId: number;
  paymentId: number;
  /** 결제명 — 비어 있으면 「첫 과목 외 n과목」 */
  title: string;
  /** 신청일 「2026.11.26」 */
  requestedAt: string;
  /** 완료 · 반려일 (없으면 null) */
  completedAt: string | null;
  /** 환불 금액 — 신청 때 금액, 관리자가 진행 중 · 완료로 저장하며 고치면 그 금액 */
  amount: number;
  /** 환불 접수 · 환불 진행 중 · 환불 완료 · 환불 반려 (LMS 환불 관리) */
  status: string;
  /** 반려 사유 (반려일 때만) */
  rejectReason: string | null;
}

/** 그 회원의 환불 (학습자 신청 · 관리자 직접 환불 모두) — 최근 신청 순. 마이페이지 환불 내역이 쓴다 */
export async function listMemberRefunds(memberId: number): Promise<MemberRefundRow[]> {
  const pool = await getPool();
  const r = await pool.request().input("m", sql.Int, memberId).query<Omit<MemberRefundRow, "title"> & { title: string | null; firstName: string | null; itemCount: number }>(`
    SELECT r.refund_id AS refundId, r.payment_id AS paymentId, p.title,
      REPLACE(CONVERT(CHAR(10), DATEADD(HOUR, 9, r.requested_at), 23), '-', '.') AS requestedAt,
      REPLACE(CONVERT(CHAR(10), DATEADD(HOUR, 9, r.completed_at), 23), '-', '.') AS completedAt,
      r.amount, r.status, CASE WHEN r.status = N'환불 반려' THEN r.reject_reason END AS rejectReason,
      (SELECT TOP 1 co.name FROM dbo.payment_items i JOIN dbo.classes cl ON cl.class_id = i.class_id
         JOIN dbo.courses co ON co.course_id = cl.course_id WHERE i.payment_id = p.payment_id ORDER BY i.payment_item_id) AS firstName,
      (SELECT COUNT(*) FROM dbo.payment_items i WHERE i.payment_id = p.payment_id) AS itemCount
    FROM dbo.refunds r JOIN dbo.payments p ON p.payment_id = r.payment_id
    WHERE p.member_id = @m
    ORDER BY r.requested_at DESC, r.refund_id DESC`);
  return r.recordset.map(({ title, firstName, itemCount, ...row }) => ({
    ...row,
    title: title?.trim() || (firstName ? `${firstName}${itemCount > 1 ? ` 외 ${itemCount - 1}과목` : ""}` : "(과목 없음)"),
  }));
}
