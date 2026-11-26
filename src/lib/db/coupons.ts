import "server-only";
import type { CouponDiscountType, CouponScope, UsableCoupon } from "../coupons";
import { couponDiscountLabel } from "../coupons";
import { getPool, sql } from "./client";

/**
 * 쿠폰 (홈페이지 쪽) — dbo.coupon_masters · coupons. 쿠폰 만들기 · 발급은 LMS 「쿠폰 관리 · 쿠폰 발행 관리 · 장바구니 쿠폰…」가 한다.
 * 홈페이지가 하는 일: 회원 쿠폰 목록 · 쿠폰 번호 등록(issue_type 「코드 등록」) · 결제하기에서 쓸 수 있는 쿠폰 고르기.
 * 쿠폰을 「사용」으로 바꾸는 일은 결제 트랜잭션(src/lib/db/payments.ts)이 한다.
 * 「쓸 수 있는」 쿠폰: 그 회원의 「미사용」 · 기한(expires_on)이 오늘(한국)이나 그 뒤 · 마스터 사용 중 · 기간 쿠폰이면 시작일이 지남.
 */

const KST_TODAY = "CAST(DATEADD(HOUR, 9, SYSUTCDATETIME()) AS DATE)";
const DOT = (col: string) => `REPLACE(CONVERT(CHAR(10), ${col}, 23), '-', '.')`;

/** 쓸 수 있는 쿠폰 조건 (cp = coupons, cm = coupon_masters) */
export const USABLE_COUPON_SQL = `
  cp.status = N'미사용' AND cp.expires_on >= ${KST_TODAY} AND cm.is_active = 1
  AND (cm.expire_type <> N'기간' OR cm.start_date IS NULL OR cm.start_date <= ${KST_TODAY})`;

// ── 마이페이지 쿠폰 사용내역 ─────────────────────────────────

/** 마이페이지 목록 한 줄 — myPageDataA.ts 의 Coupon 모양 */
export interface MemberCouponRow {
  id: string;
  name: string;
  discount: string;
  validFrom: string;
  validTo: string;
  status: "사용 가능" | "사용 완료" | "기간 만료" | "사용 취소";
  usedAt?: string;
  usedCourse?: string;
}

export async function listMemberCoupons(memberId: number): Promise<MemberCouponRow[]> {
  const pool = await getPool();
  const r = await pool.request().input("m", sql.Int, memberId).query<{
    couponId: number;
    name: string;
    scope: CouponScope;
    discountType: CouponDiscountType;
    discountValue: number;
    validFrom: string;
    validTo: string;
    status: string;
    usable: boolean;
    usedAt: string | null;
    usedCourse: string | null;
    classCourse: string | null;
  }>(`
    SELECT cp.coupon_id AS couponId, cm.name, cm.scope, cm.discount_type AS discountType, cm.discount_value AS discountValue,
      ${DOT("CASE WHEN cm.expire_type = N'기간' AND cm.start_date IS NOT NULL THEN cm.start_date ELSE CAST(DATEADD(HOUR, 9, cp.created_at) AS DATE) END")} AS validFrom,
      ${DOT("cp.expires_on")} AS validTo,
      cp.status,
      CAST(CASE WHEN ${USABLE_COUPON_SQL} THEN 1 ELSE 0 END AS BIT) AS usable,
      ${DOT("CAST(DATEADD(HOUR, 9, cp.used_at) AS DATE)")} AS usedAt,
      -- 쓴 과목: 과목 쿠폰은 그 줄, 주문 쿠폰은 결제의 첫 과목 「외 n과목」
      COALESCE(uc.name, CASE WHEN cp.payment_id IS NULL THEN NULL ELSE
        (SELECT TOP 1 co.name FROM dbo.payment_items i JOIN dbo.classes cl ON cl.class_id = i.class_id JOIN dbo.courses co ON co.course_id = cl.course_id
         WHERE i.payment_id = cp.payment_id ORDER BY i.payment_item_id)
        + CASE WHEN (SELECT COUNT(*) FROM dbo.payment_items i WHERE i.payment_id = cp.payment_id) > 1
               THEN N' 외 ' + CAST((SELECT COUNT(*) FROM dbo.payment_items i WHERE i.payment_id = cp.payment_id) - 1 AS NVARCHAR(5)) + N'과목' ELSE N'' END END) AS usedCourse,
      kc.name AS classCourse
    FROM dbo.coupons cp
    JOIN dbo.coupon_masters cm ON cm.master_id = cp.master_id
    LEFT JOIN dbo.payment_items ui ON ui.payment_item_id = cp.payment_item_id
    LEFT JOIN dbo.classes ucl ON ucl.class_id = ui.class_id
    LEFT JOIN dbo.courses uc ON uc.course_id = ucl.course_id
    LEFT JOIN dbo.classes kcl ON kcl.class_id = cp.class_id
    LEFT JOIN dbo.courses kc ON kc.course_id = kcl.course_id
    WHERE cp.member_id = @m
    ORDER BY CASE WHEN cp.status = N'미사용' THEN 0 ELSE 1 END, cp.expires_on, cp.coupon_id DESC`);
  return r.recordset.map((c) => ({
    id: String(c.couponId),
    // 과목 쿠폰은 어느 과목용인지 이름 뒤에
    name: c.scope === "과목" && c.classCourse ? `${c.name} (${c.classCourse} 전용)` : c.name,
    discount: couponDiscountLabel(c.discountType, c.discountValue),
    validFrom: c.validFrom,
    validTo: c.validTo,
    status: c.status === "사용" ? "사용 완료" : c.status === "사용 취소" ? "사용 취소" : c.usable ? "사용 가능" : "기간 만료",
    usedAt: c.usedAt ?? undefined,
    usedCourse: c.usedCourse ?? undefined,
  }));
}

// ── 쿠폰 번호 등록 ───────────────────────────────────────

export type RegisterCouponResult =
  | { ok: true; name: string; expiresOn: string }
  | { ok: false; reason: "notFound" | "expired" | "duplicate" };

/**
 * 쿠폰 번호 등록 — 주문 쿠폰 중 그 번호(대문자)이고 사용 중인 마스터를 찾아 「코드 등록」으로 한 장 발급한다.
 * 기한: 기간 쿠폰은 끝나는 날, 발급 후 쿠폰은 오늘부터 n일 (LMS 발급과 같은 식 — 오늘 + n − 1).
 * 같은 쿠폰을 이미 받았으면(미사용 · 사용) 다시 주지 않는다.
 */
export async function registerCouponCode(memberId: number, code: string): Promise<RegisterCouponResult> {
  const pool = await getPool();
  const r = await pool
    .request()
    .input("m", sql.Int, memberId)
    .input("code", sql.NVarChar(30), code)
    .query<{ result: string; name: string | null; expiresOn: string | null }>(`
      SET XACT_ABORT ON;
      BEGIN TRANSACTION;
      DECLARE @today DATE = ${KST_TODAY};
      DECLARE @master INT, @name NVARCHAR(100), @expire NVARCHAR(10), @end DATE, @days SMALLINT;
      SELECT @master = master_id, @name = name, @expire = expire_type, @end = end_date, @days = valid_days
        FROM dbo.coupon_masters WITH (UPDLOCK, HOLDLOCK)
        WHERE code = @code AND scope = N'주문' AND is_active = 1;
      IF @master IS NULL
      BEGIN ROLLBACK TRANSACTION; SELECT N'notFound' AS result, CAST(NULL AS NVARCHAR(100)) AS name, CAST(NULL AS CHAR(10)) AS expiresOn; RETURN; END

      DECLARE @expiresOn DATE = CASE WHEN @expire = N'기간' THEN @end ELSE DATEADD(DAY, ISNULL(@days, 1) - 1, @today) END;
      IF @expiresOn IS NULL OR @expiresOn < @today
      BEGIN ROLLBACK TRANSACTION; SELECT N'expired' AS result, @name AS name, CAST(NULL AS CHAR(10)) AS expiresOn; RETURN; END

      IF EXISTS (SELECT 1 FROM dbo.coupons WITH (UPDLOCK, HOLDLOCK)
                 WHERE master_id = @master AND member_id = @m AND status IN (N'미사용', N'사용'))
      BEGIN ROLLBACK TRANSACTION; SELECT N'duplicate' AS result, @name AS name, CAST(NULL AS CHAR(10)) AS expiresOn; RETURN; END

      INSERT INTO dbo.coupons (master_id, member_id, issue_type, status, expires_on)
        VALUES (@master, @m, N'코드 등록', N'미사용', @expiresOn);
      COMMIT TRANSACTION;
      SELECT N'ok' AS result, @name AS name, ${DOT("@expiresOn")} AS expiresOn;`);
  const row = r.recordset[0];
  if (row?.result === "ok" && row.name && row.expiresOn) return { ok: true, name: row.name, expiresOn: row.expiresOn };
  return { ok: false, reason: row?.result === "expired" ? "expired" : row?.result === "duplicate" ? "duplicate" : "notFound" };
}

// ── 결제하기에서 고를 쿠폰 ───────────────────────────────────

/** 지금 쓸 수 있는 그 회원의 쿠폰 — 기한이 가까운 순 */
export async function listUsableCoupons(memberId: number): Promise<UsableCoupon[]> {
  const pool = await getPool();
  const r = await pool.request().input("m", sql.Int, memberId).query<UsableCoupon>(`
    SELECT cp.coupon_id AS couponId, cm.name, cm.scope, cm.discount_type AS discountType, cm.discount_value AS discountValue,
      cp.class_id AS classId, ${DOT("cp.expires_on")} AS expiresOn
    FROM dbo.coupons cp JOIN dbo.coupon_masters cm ON cm.master_id = cp.master_id
    WHERE cp.member_id = @m AND ${USABLE_COUPON_SQL}
    ORDER BY cp.expires_on, cp.coupon_id`);
  return r.recordset;
}
