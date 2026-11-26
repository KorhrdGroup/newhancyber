import "server-only";
import { getPool, sql } from "./client";

/**
 * 장학 신청 (학습자) — dbo.scholarships · scholarship_items · scholarship_files. LMS 「장학 관리」가 확인 · 승인 · 미승인한다.
 * 규칙은 newhancyber-lms src/lib/db/scholarships.ts 머리 주석을 따른다:
 *   - 신청할 수 있는 결제: 그 회원의 결제 중 상태가 입금 대기 · 결제 완료 · 부분 환불 · 환불 반려 (LMS 가 승인할 수 있는 상태)이고,
 *     진행 중이거나 승인된 장학(신청 중 · 확인 중 · 승인)이 없는 것 — 한 결제에 승인되는 장학은 하나뿐
 *   - 대상 과목 줄: 입금 대기 · 결제 완료이고 환불 금액이 0 인 줄 (LMS 가 금액을 깎을 수 있는 줄)
 *   - before_amount: 신청할 때 줄 금액 ISNULL(paid_amount, price) — 결제와 줄 모두 (그 뒤 바뀌어도 그대로 둔다)
 *   - 상태는 「신청 중」으로 시작한다. 금액은 건드리지 않는다 — 승인할 때 LMS 가 결제 금액을 깎는다
 *   - 증빙 파일은 DB(varbinary)에 — LMS 가 내려받기로만 준다
 * 잠금 순서는 LMS 와 같다: payments → payment_items → scholarships.
 */

const OPEN_STATUSES = `N'신청 중', N'확인 중', N'승인'`;
const PAYMENT_OK = `N'입금 대기', N'결제 완료', N'부분 환불', N'환불 반려'`;
const ITEM_OK = `N'입금 대기', N'결제 완료'`;

export interface ScholarshipLine {
  itemId: number;
  name: string;
  semester: string;
  amount: number;
  eligible: boolean;
  note: string | null;
}

export interface ScholarshipForm {
  paymentId: number;
  title: string;
  paymentStatus: string;
  /** 이 결제로 지금 신청할 수 있는가 — 아니면 까닭 */
  canApply: boolean;
  blockedReason: string | null;
  lines: ScholarshipLine[];
}

const LINE_NAME = `co.name + CASE WHEN (SELECT COUNT(*) FROM dbo.classes x WHERE x.semester_id = cl.semester_id AND x.course_id = cl.course_id AND x.is_active = 1) > 1
                  THEN N' ' + CAST(cl.class_no AS NVARCHAR(5)) + N'반' ELSE N'' END`;

/** 장학 신청 화면 — 그 회원의 결제만 (다른 회원 결제면 null) */
export async function readScholarshipForm(memberId: number, paymentId: number): Promise<ScholarshipForm | null> {
  const pool = await getPool();
  const req = () => pool.request().input("m", sql.Int, memberId).input("p", sql.Int, paymentId);
  const [head, lines] = await Promise.all([
    req().query<{ paymentId: number; title: string | null; status: string; openScholarship: string | null }>(`
      SELECT p.payment_id AS paymentId, p.title, p.status,
        (SELECT TOP 1 s.status FROM dbo.scholarships s WHERE s.payment_id = p.payment_id AND s.status IN (${OPEN_STATUSES})
         ORDER BY s.scholarship_id DESC) AS openScholarship
      FROM dbo.payments p WHERE p.payment_id = @p AND p.member_id = @m`),
    req().query<{ itemId: number; name: string; semester: string; amount: number; status: string; refundAmount: number }>(`
      SELECT i.payment_item_id AS itemId, ${LINE_NAME} AS name, s.name AS semester,
        ISNULL(i.paid_amount, i.price) AS amount, i.status, i.refund_amount AS refundAmount
      FROM dbo.payment_items i
      JOIN dbo.payments p ON p.payment_id = i.payment_id
      JOIN dbo.classes cl ON cl.class_id = i.class_id
      JOIN dbo.courses co ON co.course_id = cl.course_id
      JOIN dbo.semesters s ON s.semester_id = cl.semester_id
      WHERE i.payment_id = @p AND p.member_id = @m
      ORDER BY i.payment_item_id`),
  ]);
  const h = head.recordset[0];
  if (!h) return null;
  const items = lines.recordset.map((l): ScholarshipLine => {
    const eligible = (l.status === "입금 대기" || l.status === "결제 완료") && l.refundAmount === 0;
    return { itemId: l.itemId, name: l.name, semester: l.semester, amount: l.amount, eligible, note: eligible ? null : l.status };
  });
  const payOk = ["입금 대기", "결제 완료", "부분 환불", "환불 반려"].includes(h.status);
  const blockedReason = h.openScholarship
    ? `이 결제에는 이미 장학이 ${h.openScholarship === "승인" ? "승인되었어요" : `신청되어 있어요 (${h.openScholarship})`}.`
    : !payOk
      ? `결제 상태가 「${h.status}」라 장학을 신청할 수 없어요.`
      : !items.some((l) => l.eligible)
        ? "장학을 신청할 수 있는 과목이 없어요."
        : null;
  const fallback = items.length ? `${items[0].name}${items.length > 1 ? ` 외 ${items.length - 1}과목` : ""}` : "(과목 없음)";
  return { paymentId: h.paymentId, title: h.title?.trim() || fallback, paymentStatus: h.status, canApply: blockedReason === null, blockedReason, lines: items };
}

export interface ScholarshipFileInput {
  name: string;
  contentType: string;
  data: Buffer;
}

export type CreateScholarshipResult = { ok: true; scholarshipId: number } | { ok: false; reason: "notFound" | "blocked" };

/**
 * 장학 신청 — 고른 과목 줄로 「신청 중」 한 건 + 증빙 파일. 신청할 수 없는 결제 · 줄이 섞이면 아무것도 쓰지 않는다 (잠근 뒤 다시 본다).
 */
export async function createScholarship(input: {
  memberId: number;
  paymentId: number;
  itemIds: number[];
  type: string;
  etcReason: string | null;
  files: ScholarshipFileInput[];
}): Promise<CreateScholarshipResult> {
  const ids = [...new Set(input.itemIds.filter((n) => Number.isInteger(n) && n > 0))];
  if (ids.length === 0) return { ok: false, reason: "blocked" };
  const pool = await getPool();
  const req = pool
    .request()
    .input("m", sql.Int, input.memberId)
    .input("pid", sql.Int, input.paymentId)
    .input("ids", sql.NVarChar(sql.MAX), ids.join(","))
    .input("type", sql.NVarChar(20), input.type)
    .input("etc", sql.NVarChar(500), input.etcReason);
  // 파일은 고정된 이름(f0 · f1 · f2)의 파라미터로 — SQL 에 값을 붙이지 않는다
  const fileSql = input.files
    .map((f, i) => {
      req
        .input(`fn${i}`, sql.NVarChar(200), f.name)
        .input(`ft${i}`, sql.NVarChar(100), f.contentType)
        .input(`fs${i}`, sql.Int, f.data.length)
        .input(`fd${i}`, sql.VarBinary(sql.MAX), f.data);
      return `INSERT INTO dbo.scholarship_files (scholarship_id, file_name, content_type, file_size, data, created_at)
                VALUES (@sid, @fn${i}, @ft${i}, @fs${i}, @fd${i}, SYSDATETIME());`;
    })
    .join("\n");

  const r = await req.query<{ result: string; scholarshipId: number | null }>(`
    SET XACT_ABORT ON;
    BEGIN TRANSACTION;

    -- 결제를 먼저 잠그고(LMS 와 같은 순서) 그 회원 · 신청할 수 있는 상태인지 본다
    DECLARE @pstatus NVARCHAR(10);
    SELECT @pstatus = status FROM dbo.payments WITH (UPDLOCK, HOLDLOCK) WHERE payment_id = @pid AND member_id = @m;
    IF @pstatus IS NULL
    BEGIN ROLLBACK TRANSACTION; SELECT N'notFound' AS result, CAST(NULL AS INT) AS scholarshipId; RETURN; END
    IF @pstatus NOT IN (${PAYMENT_OK})
       OR EXISTS (SELECT 1 FROM dbo.scholarships WITH (UPDLOCK, HOLDLOCK) WHERE payment_id = @pid AND status IN (${OPEN_STATUSES}))
    BEGIN ROLLBACK TRANSACTION; SELECT N'blocked' AS result, CAST(NULL AS INT) AS scholarshipId; RETURN; END

    DECLARE @want TABLE (id INT PRIMARY KEY);
    INSERT INTO @want (id)
      SELECT DISTINCT TRY_CAST(value AS INT) FROM STRING_SPLIT(@ids, ',') WHERE TRY_CAST(value AS INT) IS NOT NULL;

    DECLARE @sel TABLE (id INT PRIMARY KEY, amount INT NOT NULL);
    INSERT INTO @sel (id, amount)
      SELECT i.payment_item_id, ISNULL(i.paid_amount, i.price)
      FROM dbo.payment_items i WITH (UPDLOCK, HOLDLOCK)
      WHERE i.payment_id = @pid AND i.payment_item_id IN (SELECT id FROM @want)
        AND i.status IN (${ITEM_OK}) AND i.refund_amount = 0;
    IF (SELECT COUNT(*) FROM @sel) <> (SELECT COUNT(*) FROM @want)
    BEGIN ROLLBACK TRANSACTION; SELECT N'blocked' AS result, CAST(NULL AS INT) AS scholarshipId; RETURN; END

    INSERT INTO dbo.scholarships (payment_id, member_id, scholarship_type, etc_reason, status, before_amount, requested_at)
      VALUES (@pid, @m, @type, @etc, N'신청 중', (SELECT SUM(amount) FROM @sel), SYSDATETIME());
    DECLARE @sid INT = CAST(SCOPE_IDENTITY() AS INT);
    INSERT INTO dbo.scholarship_items (scholarship_id, payment_item_id, before_amount)
      SELECT @sid, id, amount FROM @sel;
    ${fileSql}

    COMMIT TRANSACTION;
    SELECT N'ok' AS result, @sid AS scholarshipId;`);
  const row = r.recordset[0];
  if (row?.result === "ok" && row.scholarshipId) return { ok: true, scholarshipId: row.scholarshipId };
  return { ok: false, reason: row?.result === "notFound" ? "notFound" : "blocked" };
}

// ── 마이페이지 장학 현황 ─────────────────────────────────────

export interface MemberScholarshipRow {
  scholarshipId: number;
  paymentId: number;
  type: string;
  /** 첫 과목의 학기 이름 */
  semester: string;
  /** 신청할 때 대상 금액 */
  beforeAmount: number;
  /** 감면된 금액 (승인일 때만 — 승인한 줄의 신청 때 금액 − 승인 후 금액) */
  cutAmount: number | null;
  /** 신청 중 · 확인 중 · 승인 · 미승인 (LMS 장학 관리) */
  status: string;
  rejectReason: string | null;
  requestedAt: string;
}

export async function listMemberScholarships(memberId: number): Promise<MemberScholarshipRow[]> {
  const pool = await getPool();
  const r = await pool.request().input("m", sql.Int, memberId).query<MemberScholarshipRow>(`
    SELECT s.scholarship_id AS scholarshipId, s.payment_id AS paymentId, s.scholarship_type AS type,
      ISNULL((SELECT TOP 1 se.name FROM dbo.scholarship_items si
              JOIN dbo.payment_items i ON i.payment_item_id = si.payment_item_id
              JOIN dbo.classes cl ON cl.class_id = i.class_id JOIN dbo.semesters se ON se.semester_id = cl.semester_id
              WHERE si.scholarship_id = s.scholarship_id ORDER BY si.payment_item_id), N'-') AS semester,
      s.before_amount AS beforeAmount,
      CASE WHEN s.status = N'승인' THEN
        (SELECT ISNULL(SUM(si.before_amount - si.after_amount), 0) FROM dbo.scholarship_items si
         WHERE si.scholarship_id = s.scholarship_id AND si.after_amount IS NOT NULL) END AS cutAmount,
      s.status, CASE WHEN s.status = N'미승인' THEN s.reject_reason END AS rejectReason,
      REPLACE(CONVERT(CHAR(10), DATEADD(HOUR, 9, s.requested_at), 23), '-', '.') AS requestedAt
    FROM dbo.scholarships s
    WHERE s.member_id = @m
    ORDER BY s.requested_at DESC, s.scholarship_id DESC`);
  return r.recordset;
}
