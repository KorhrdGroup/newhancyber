/**
 * 쿠폰 — 화면(결제하기 미리 보기 · 마이페이지)과 서버가 같이 쓰는 규칙. DB 는 coupon_masters · coupons (LMS 「쿠폰 관리」 DB 018).
 * LMS 규칙 (newhancyber-lms src/lib/couponMessages.ts · payments.ts):
 *   - scope 「주문」: 결제 한 건 전체 할인. 할인 방식 율(%) · 총액(원) · 과목당(원 × 과목 수). 쿠폰 번호가 있으면 홈페이지에서 번호로 받는다.
 *   - scope 「과목」: 특정 차수(class_id)에 붙은 쿠폰 — 그 과목 결제 줄에서만 깎인다. 할인 방식 율 · 총액.
 * 결제 줄마다 깎는 금액은 아래 couponLineDiscounts 가 정한다 — 서버(src/lib/db/payments.ts)도 같은 식을 SQL 로 쓴다.
 *   율    : 줄마다 ⌊금액 × 율 / 100⌋
 *   과목당 : 줄마다 min(값, 금액)
 *   총액   : 줄 순서대로 남은 할인액을 채운다 (min(남은 값, 금액))
 *   과목 쿠폰은 그 차수 줄 하나에만 위 식(율 · 총액)을 쓴다.
 */

export type CouponScope = "주문" | "과목";
export type CouponDiscountType = "율" | "총액" | "과목당";

/** 결제하기에서 고를 수 있는 쿠폰 */
export interface UsableCoupon {
  couponId: number;
  name: string;
  scope: CouponScope;
  discountType: CouponDiscountType;
  discountValue: number;
  /** 과목 쿠폰이 붙은 차수 (주문 쿠폰은 null) */
  classId: number | null;
  /** 「2026.12.31까지」 */
  expiresOn: string;
}

/** 「10% 할인」 · 「50,000원 할인」 · 「과목당 30,000원 할인」 */
export function couponDiscountLabel(type: CouponDiscountType, value: number): string {
  const won = `${value.toLocaleString("ko-KR")}원`;
  if (type === "율") return `${value}% 할인`;
  if (type === "과목당") return `과목당 ${won} 할인`;
  return `${won} 할인`;
}

/**
 * 결제 줄마다 깎는 금액 (lines 와 같은 순서). 쿠폰이 이 결제에 맞지 않으면(과목 쿠폰인데 그 차수가 없음) 모두 0.
 * lines.fee 는 할인가를 반영한 줄 금액(쿠폰 전).
 */
export function couponLineDiscounts(
  coupon: Pick<UsableCoupon, "scope" | "discountType" | "discountValue" | "classId">,
  lines: { classId: number | null; fee: number }[],
): number[] {
  const value = Math.max(0, Math.floor(coupon.discountValue));
  const byType = (fee: number) => (coupon.discountType === "율" ? Math.floor((fee * Math.min(value, 100)) / 100) : Math.min(value, fee));
  if (coupon.scope === "과목") {
    return lines.map((l) => (l.classId !== null && l.classId === coupon.classId ? byType(l.fee) : 0));
  }
  if (coupon.discountType === "총액") {
    let left = value;
    return lines.map((l) => {
      const d = Math.min(left, l.fee);
      left -= d;
      return d;
    });
  }
  return lines.map((l) => byType(l.fee));
}
