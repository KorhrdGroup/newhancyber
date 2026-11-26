import "server-only";
import { getPool, sql } from "./client";

/**
 * 결제 신청 — dbo.payments · payment_items · enrollments (LMS 「결제 관리」가 보는 표). 표 뜻은 newhancyber-lms
 * src/lib/db/payments.ts 와 DB 018 맨 위 주석을 따른다.
 *
 * ⚠️ PG(나이스페이)는 아직 연결하지 않았다 (사용자 결정 2026-11-26: 「결제 신청하면 그냥 결제되게」).
 *    그래서 어떤 결제 수단이든 바로 「결제 완료」로 남기고, 관리자 메모에 그 사실을 적는다.
 *    나이스페이를 붙이면: 「입금 대기」로 만들고 → PG 승인 콜백에서 결제 완료 · pg_tid 등을 채우도록 바꾼다.
 *
 * 한 트랜잭션에서:
 *   1. 고른 차수를 잠그고(UPDLOCK) 지금 값으로 다시 본다 — 수강신청 기간 · 마감 · 정원 · 이미 신청한 과목
 *      하나라도 안 되면 아무것도 쓰지 않고 그 까닭을 돌려준다
 *   2. payments 1줄 + payment_items 차수마다 1줄 (가격은 DB 의 차수 값 — 브라우저 금액은 믿지 않는다)
 *   3. enrollments 「수강 대기」(LMS 입금 확인과 같은 상태) — 예전에 수강 취소한 줄이 있으면 그 줄을 되살린다
 *      (UQ_enrollments_class_member: 회원 · 차수당 한 줄)
 *   4. 그 차수들을 장바구니(cart_items)에서 뺀다
 * 금액 칸: 정가(classes.price)는 list_price, 할인가와의 차이는 extra_discount, 실제 낸 돈은 paid_amount ·
 *   payments.total_amount = 정가 합, paid_amount = 낸 돈 합 — LMS 결제 상세에 「금액 조정」 없이 보이는 모양.
 * 시각은 다른 표와 같이 SYSDATETIME() (Azure 는 UTC).
 */

/** 홈페이지 결제 수단 → DB payments.method (LMS src/lib/payments.ts PAYMENT_METHODS 의 이름) */
export const PAYMENT_METHOD_NAMES = {
  card: "신용카드",
  transfer: "계좌이체",
  vbank: "가상계좌",
  voucher: "평생교육바우처",
} as const;
export type PaymentMethodKey = keyof typeof PAYMENT_METHOD_NAMES;

/** 결제할 수 없는 까닭 (차수마다) */
export type PaymentBlockReason = "notFound" | "notOpen" | "closed" | "applied";

export type CreatePaymentResult =
  | { ok: true; paymentId: number }
  | { ok: false; blocked: { classId: number; reason: PaymentBlockReason }[] }
  /** 고른 쿠폰을 쓸 수 없음 (그사이 쓰였거나 기한이 지남 · 과목 쿠폰인데 그 과목이 없음) */
  | { ok: false; coupon: true };

const ADMIN_MEMO = "PG(나이스페이) 연결 전 — 홈페이지에서 결제 신청과 함께 바로 결제 완료로 기록됨";
const KST_TODAY = "CAST(DATEADD(HOUR, 9, SYSUTCDATETIME()) AS DATE)";

/**
 * 쿠폰 (couponId 를 주면) — 같은 트랜잭션에서 잠그고 「쓸 수 있는」지 다시 본 뒤(src/lib/db/coupons.ts USABLE_COUPON_SQL),
 * 줄마다 깎을 금액을 src/lib/coupons.ts couponLineDiscounts 와 같은 식으로 센다 (총액은 차수 번호 순으로 채운다 — 합계는 순서와 상관없다).
 * 결제 줄 coupon_discount · paid_amount, 결제 coupon_discount · paid_amount 에 반영하고,
 * 쿠폰은 「사용」 · used_at · payment_id · (과목 쿠폰이면) payment_item_id · discount_amount 를 남긴다 — LMS 결제 상세 「이 결제에 쓴 쿠폰」.
 */
export async function createPaidPayment(input: {
  memberId: number;
  classIds: number[];
  method: PaymentMethodKey;
  isMobile: boolean;
  couponId: number | null;
}): Promise<CreatePaymentResult> {
  const ids = [...new Set(input.classIds.filter((id) => Number.isInteger(id) && id > 0))];
  if (ids.length === 0) return { ok: false, blocked: [] };
  const pool = await getPool();
  const r = await pool
    .request()
    .input("m", sql.Int, input.memberId)
    .input("ids", sql.NVarChar(sql.MAX), ids.join(","))
    .input("method", sql.NVarChar(10), PAYMENT_METHOD_NAMES[input.method])
    .input("mobile", sql.Bit, input.isMobile)
    .input("memo", sql.NVarChar(1000), ADMIN_MEMO)
    .input("coupon", sql.Int, input.couponId)
    .query<{ result: string; paymentId: number | null; classId: number | null }>(`
      SET XACT_ABORT ON;
      BEGIN TRANSACTION;

      DECLARE @want TABLE (id INT PRIMARY KEY);
      INSERT INTO @want (id)
        SELECT DISTINCT TRY_CAST(value AS INT) FROM STRING_SPLIT(@ids, ',') WHERE TRY_CAST(value AS INT) IS NOT NULL;

      -- 1. 차수를 잠그고 지금 값으로 다시 본다 (disc = 쿠폰으로 깎는 금액, 아래 1-2 에서 채운다)
      DECLARE @c TABLE (class_id INT PRIMARY KEY, list_price INT NOT NULL, fee INT NOT NULL, reason NVARCHAR(10) NULL, disc INT NOT NULL DEFAULT 0);
      INSERT INTO @c (class_id, list_price, fee, reason)
        SELECT cl.class_id, cl.price,
          CASE WHEN cl.sale_price IS NOT NULL AND cl.sale_price < cl.price THEN cl.sale_price ELSE cl.price END,
          CASE
            WHEN NOT (s.is_active = 1 AND cl.is_active = 1 AND co.is_active = 1
                      AND ${KST_TODAY} BETWEEN CAST(s.apply_start AS DATE) AND CAST(s.apply_end AS DATE)) THEN N'notOpen'
            WHEN EXISTS (SELECT 1 FROM dbo.enrollments e WITH (UPDLOCK, HOLDLOCK)
                         WHERE e.class_id = cl.class_id AND e.member_id = @m AND e.status <> N'수강 취소') THEN N'applied'
            WHEN EXISTS (SELECT 1 FROM dbo.payment_items pi JOIN dbo.payments p ON p.payment_id = pi.payment_id
                         WHERE p.member_id = @m AND pi.class_id = cl.class_id AND pi.status IN (N'입금 대기', N'결제 완료')) THEN N'applied'
            WHEN cl.status = N'마감'
              OR (cl.capacity IS NOT NULL AND (SELECT COUNT(*) FROM dbo.enrollments e WITH (UPDLOCK, HOLDLOCK)
                                               WHERE e.class_id = cl.class_id AND e.status <> N'수강 취소') >= cl.capacity) THEN N'closed'
            ELSE NULL
          END
        FROM dbo.classes cl WITH (UPDLOCK, HOLDLOCK)
        JOIN dbo.semesters s ON s.semester_id = cl.semester_id
        JOIN dbo.courses co ON co.course_id = cl.course_id
        WHERE cl.class_id IN (SELECT id FROM @want);

      IF EXISTS (SELECT 1 FROM @want w WHERE NOT EXISTS (SELECT 1 FROM @c c WHERE c.class_id = w.id))
         OR EXISTS (SELECT 1 FROM @c WHERE reason IS NOT NULL)
      BEGIN
        ROLLBACK TRANSACTION;
        SELECT N'notFound' AS result, CAST(NULL AS INT) AS paymentId, w.id AS classId
          FROM @want w WHERE NOT EXISTS (SELECT 1 FROM @c c WHERE c.class_id = w.id)
        UNION ALL
        SELECT reason, NULL, class_id FROM @c WHERE reason IS NOT NULL;
        RETURN;
      END

      -- 1-2. 쿠폰 — 잠그고 쓸 수 있는지 다시 본 뒤 줄마다 깎을 금액
      IF @coupon IS NOT NULL
      BEGIN
        DECLARE @cscope NVARCHAR(10), @ctype NVARCHAR(10), @cval INT, @cclass INT;
        SELECT @cscope = cm.scope, @ctype = cm.discount_type, @cval = cm.discount_value, @cclass = cp.class_id
          FROM dbo.coupons cp WITH (UPDLOCK, HOLDLOCK)
          JOIN dbo.coupon_masters cm ON cm.master_id = cp.master_id
          WHERE cp.coupon_id = @coupon AND cp.member_id = @m
            AND cp.status = N'미사용' AND cp.expires_on >= ${KST_TODAY} AND cm.is_active = 1
            AND (cm.expire_type <> N'기간' OR cm.start_date IS NULL OR cm.start_date <= ${KST_TODAY});
        IF @ctype IS NULL OR (@cscope = N'과목' AND NOT EXISTS (SELECT 1 FROM @c WHERE class_id = @cclass))
        BEGIN
          ROLLBACK TRANSACTION;
          SELECT N'coupon' AS result, CAST(NULL AS INT) AS paymentId, CAST(NULL AS INT) AS classId;
          RETURN;
        END
        DECLARE @rate BIGINT = CASE WHEN @cval > 100 THEN 100 WHEN @cval < 0 THEN 0 ELSE @cval END;
        DECLARE @val INT = CASE WHEN @cval < 0 THEN 0 ELSE @cval END;
        IF @cscope = N'주문' AND @ctype = N'총액'
        BEGIN
          -- 총액: 차수 번호 순으로 남은 할인액을 채운다
          ;WITH o AS (SELECT class_id, SUM(CAST(fee AS BIGINT)) OVER (ORDER BY class_id ROWS UNBOUNDED PRECEDING) - fee AS before FROM @c)
          UPDATE c SET disc = CASE WHEN @val - o.before <= 0 THEN 0 WHEN @val - o.before >= c.fee THEN c.fee ELSE CAST(@val - o.before AS INT) END
            FROM @c c JOIN o ON o.class_id = c.class_id;
        END
        ELSE
        BEGIN
          UPDATE @c SET disc = CASE
            WHEN @cscope = N'과목' AND class_id <> @cclass THEN 0
            WHEN @ctype = N'율' THEN CAST(CAST(fee AS BIGINT) * @rate / 100 AS INT)
            ELSE CASE WHEN @val < fee THEN @val ELSE fee END END;   -- 과목당 · 과목 쿠폰 총액
        END
      END

      -- 2. 결제 · 결제 항목 (모두 결제 완료)
      DECLARE @pid INT;
      INSERT INTO dbo.payments (member_id, status, method, is_mobile, coupon_discount, extra_discount, applied_at, paid_at,
                                total_amount, paid_amount, refunded_amount, admin_memo)
        SELECT @m, N'결제 완료', @method, @mobile, SUM(disc), SUM(list_price - fee), SYSDATETIME(), SYSDATETIME(),
               SUM(list_price), SUM(fee - disc), 0, @memo
        FROM @c;
      SET @pid = CAST(SCOPE_IDENTITY() AS INT);

      DECLARE @items TABLE (item_id INT PRIMARY KEY, class_id INT NOT NULL);
      INSERT INTO dbo.payment_items (payment_id, class_id, list_price, price, status, coupon_discount, extra_discount,
                                     paid_amount, refund_amount, paid_at)
        OUTPUT INSERTED.payment_item_id, INSERTED.class_id INTO @items (item_id, class_id)
        SELECT @pid, class_id, list_price, fee, N'결제 완료', disc, list_price - fee, fee - disc, 0, SYSDATETIME() FROM @c;

      -- 2-2. 쓴 쿠폰 기록 (LMS 결제 상세 「이 결제에 쓴 쿠폰」)
      IF @coupon IS NOT NULL
        UPDATE dbo.coupons
          SET status = N'사용', used_at = SYSDATETIME(), payment_id = @pid,
              payment_item_id = CASE WHEN @cscope = N'과목' THEN (SELECT item_id FROM @items WHERE class_id = @cclass) END,
              discount_amount = (SELECT SUM(disc) FROM @c)
          WHERE coupon_id = @coupon;

      -- 3. 수강 (수강 대기) — 예전에 수강 취소한 줄은 되살리고, 없으면 새로
      UPDATE e SET status = N'수강 대기', payment_item_id = i.item_id
        FROM dbo.enrollments e JOIN @items i ON i.class_id = e.class_id
        WHERE e.member_id = @m AND e.status = N'수강 취소';
      INSERT INTO dbo.enrollments (class_id, member_id, status, payment_item_id)
        SELECT i.class_id, @m, N'수강 대기', i.item_id FROM @items i
        WHERE NOT EXISTS (SELECT 1 FROM dbo.enrollments e WHERE e.class_id = i.class_id AND e.member_id = @m);

      -- 4. 장바구니에서 빼기
      DELETE FROM dbo.cart_items WHERE member_id = @m AND class_id IN (SELECT class_id FROM @items);

      COMMIT TRANSACTION;
      SELECT N'ok' AS result, @pid AS paymentId, CAST(NULL AS INT) AS classId;`);

  const rows = r.recordset;
  if (rows[0]?.result === "ok" && rows[0].paymentId) return { ok: true, paymentId: rows[0].paymentId };
  if (rows[0]?.result === "coupon") return { ok: false, coupon: true };
  return {
    ok: false,
    blocked: rows
      .filter((row): row is { result: PaymentBlockReason; paymentId: null; classId: number } => row.classId !== null)
      .map((row) => ({ classId: row.classId, reason: row.result })),
  };
}

export interface PaidPaymentSummary {
  paymentId: number;
  method: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  /** 결제한 때 (한국 시각 YYYY-MM-DD HH:mm) */
  paidAt: string | null;
  items: { classId: number; name: string; semester: string; paidAmount: number }[];
}

/** 결제 완료 화면 — 그 회원의 결제만 (다른 회원 결제 번호를 넣어도 null) */
export async function readMemberPayment(memberId: number, paymentId: number): Promise<PaidPaymentSummary | null> {
  const pool = await getPool();
  const req = () => pool.request().input("m", sql.Int, memberId).input("p", sql.Int, paymentId);
  const [head, items] = await Promise.all([
    req().query<Omit<PaidPaymentSummary, "items">>(`
      SELECT payment_id AS paymentId, method, status, ISNULL(total_amount, 0) AS totalAmount, ISNULL(paid_amount, 0) AS paidAmount,
        CONVERT(VARCHAR(16), DATEADD(HOUR, 9, paid_at), 120) AS paidAt
      FROM dbo.payments WHERE payment_id = @p AND member_id = @m`),
    req().query<PaidPaymentSummary["items"][number]>(`
      SELECT i.class_id AS classId,
        co.name + CASE WHEN (SELECT COUNT(*) FROM dbo.classes x WHERE x.semester_id = cl.semester_id AND x.course_id = cl.course_id AND x.is_active = 1) > 1
                       THEN N' ' + CAST(cl.class_no AS NVARCHAR(5)) + N'반' ELSE N'' END AS name,
        s.name AS semester, ISNULL(i.paid_amount, i.price) AS paidAmount
      FROM dbo.payment_items i
      JOIN dbo.payments p ON p.payment_id = i.payment_id
      JOIN dbo.classes cl ON cl.class_id = i.class_id
      JOIN dbo.courses co ON co.course_id = cl.course_id
      JOIN dbo.semesters s ON s.semester_id = cl.semester_id
      WHERE i.payment_id = @p AND p.member_id = @m
      ORDER BY i.payment_item_id`),
  ]);
  const h = head.recordset[0];
  return h ? { ...h, items: items.recordset } : null;
}

// ── 마이페이지 결제 내역 ─────────────────────────────────────

/**
 * 마이페이지 결제 내역 한 줄 — 화면은 classroomData.ts 의 Payment 모양을 그대로 쓴다.
 * 상태는 DB 이름 그대로 (입금 대기 · 결제 완료 · 결제 취소 · 환불 접수 · 환불 진행 중 · 환불 완료 · 부분 환불 · 환불 반려).
 * 날짜는 한국 날짜 「2026.11.26」.
 */
export interface MemberPaymentRow {
  id: string;
  title: string;
  courses: { title: string; price: number }[];
  method: string;
  account?: string;
  depositor?: string;
  /** 정가 합 */
  total: number;
  /** 쿠폰 · 추가 할인 합 */
  coupon: number;
  /** 결제 금액 */
  paid: number;
  /** 환불한 금액 */
  refunded: number;
  appliedAt: string;
  paidAt?: string;
  status: string;
}

interface HeadRow {
  paymentId: number;
  title: string | null;
  method: string;
  vbankBank: string | null;
  vbankAccount: string | null;
  depositor: string | null;
  totalAmount: number;
  discount: number;
  paidAmount: number;
  refundedAmount: number;
  appliedAt: string;
  paidAt: string | null;
  status: string;
}

interface ItemRow {
  paymentId: number;
  name: string;
  semester: string;
  /** 정가 — 결제 상세 · 영수증은 과목 줄(정가) 합 = 총 금액, 그 아래 할인 · 결제 금액 */
  listPrice: number;
}

const DOT_DATE = (col: string) => `REPLACE(CONVERT(CHAR(10), DATEADD(HOUR, 9, ${col}), 23), '-', '.')`;

/** 그 회원의 결제들 (paymentId 를 주면 그 결제 하나) — 최근 신청 순 */
async function readMemberPaymentRows(memberId: number, paymentId: number | null): Promise<MemberPaymentRow[]> {
  const pool = await getPool();
  const req = () => pool.request().input("m", sql.Int, memberId).input("p", sql.Int, paymentId);
  const [heads, items] = await Promise.all([
    req().query<HeadRow>(`
      SELECT p.payment_id AS paymentId, p.title, p.method, p.vbank_bank AS vbankBank, p.vbank_account AS vbankAccount, p.depositor,
        ISNULL(p.total_amount, 0) AS totalAmount, p.coupon_discount + p.extra_discount AS discount,
        ISNULL(p.paid_amount, 0) AS paidAmount, p.refunded_amount AS refundedAmount,
        ${DOT_DATE("p.applied_at")} AS appliedAt, ${DOT_DATE("p.paid_at")} AS paidAt, p.status
      FROM dbo.payments p
      WHERE p.member_id = @m AND (@p IS NULL OR p.payment_id = @p)
      ORDER BY p.applied_at DESC, p.payment_id DESC`),
    req().query<ItemRow>(`
      SELECT i.payment_id AS paymentId,
        co.name + CASE WHEN (SELECT COUNT(*) FROM dbo.classes x WHERE x.semester_id = cl.semester_id AND x.course_id = cl.course_id AND x.is_active = 1) > 1
                       THEN N' ' + CAST(cl.class_no AS NVARCHAR(5)) + N'반' ELSE N'' END AS name,
        s.name AS semester, i.list_price AS listPrice
      FROM dbo.payment_items i
      JOIN dbo.payments p ON p.payment_id = i.payment_id
      JOIN dbo.classes cl ON cl.class_id = i.class_id
      JOIN dbo.courses co ON co.course_id = cl.course_id
      JOIN dbo.semesters s ON s.semester_id = cl.semester_id
      WHERE p.member_id = @m AND (@p IS NULL OR p.payment_id = @p)
      ORDER BY i.payment_item_id`),
  ]);
  const byPayment = new Map<number, ItemRow[]>();
  for (const it of items.recordset) byPayment.set(it.paymentId, [...(byPayment.get(it.paymentId) ?? []), it]);
  return heads.recordset.map((h) => {
    const lines = byPayment.get(h.paymentId) ?? [];
    // 결제명 — 비어 있으면 LMS 와 같이 「첫 과목 외 n과목」
    const fallback = lines.length ? `${lines[0].name}${lines.length > 1 ? ` 외 ${lines.length - 1}과목` : ""}` : "(과목 없음)";
    return {
      id: String(h.paymentId),
      title: h.title?.trim() || fallback,
      courses: lines.map((l) => ({ title: `[${l.semester}] ${l.name}`, price: l.listPrice })),
      method: h.method,
      account: h.vbankBank && h.vbankAccount ? `${h.vbankBank} ${h.vbankAccount}` : undefined,
      depositor: h.depositor ?? undefined,
      total: h.totalAmount,
      coupon: h.discount,
      paid: h.paidAmount,
      refunded: h.refundedAmount,
      appliedAt: h.appliedAt,
      paidAt: h.paidAt ?? undefined,
      status: h.status,
    };
  });
}

export function listMemberPayments(memberId: number): Promise<MemberPaymentRow[]> {
  return readMemberPaymentRows(memberId, null);
}

/** 결제 상세 — 그 회원의 결제만 (다른 회원 결제 번호면 null) */
export async function getMemberPayment(memberId: number, paymentId: number): Promise<MemberPaymentRow | null> {
  return (await readMemberPaymentRows(memberId, paymentId))[0] ?? null;
}
