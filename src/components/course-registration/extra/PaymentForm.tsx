"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { formatPrice, sampleCartCourses } from "../courseData";
import { payMethods, sampleCoupons, type PayMethod } from "./extraData";

/** 결제하기: 주문 과목 · 쿠폰 할인 · 결제 수단 · 약관 동의 · 최종 결제 금액 */
export default function PaymentForm() {
  // TODO: API 장바구니에서 고른 과목 조회 (지금은 장바구니 샘플 전체)
  const courses = sampleCartCourses;
  const [couponId, setCouponId] = useState(sampleCoupons[0].id);
  const [couponCode, setCouponCode] = useState("");
  const [method, setMethod] = useState<PayMethod>("card");
  const [agreed, setAgreed] = useState(false);

  const totalFee = courses.reduce((sum, course) => sum + course.currentPrice, 0);
  const coupon = sampleCoupons.find((c) => c.id === couponId) ?? sampleCoupons[0];
  const discount = coupon.discount(totalFee);
  const finalAmount = Math.max(totalFee - discount, 0);
  const methodInfo = payMethods.find((m) => m.key === method) ?? payMethods[0];

  const handleCouponCode = () => {
    // TODO: API 쿠폰 번호 확인·등록
    alert(couponCode.trim() ? "쿠폰 등록 API 연동 전입니다." : "쿠폰 번호를 입력해 주세요.");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: PG 결제 연동 (과목, couponId, method, finalAmount)
    alert(`${methodInfo.label}로 ${formatPrice(finalAmount)}원 결제 — PG 결제 연동 전입니다.`);
  };

  return (
    <form className="ex-pay" onSubmit={handleSubmit}>
      <div className="ex-pay-main">
        <section className="ex-box">
          <h2 className="ex-section-title">주문 과목 ({courses.length})</h2>
          <ul className="ex-order">
            {courses.map((course, i) => (
              <li key={i} className="ex-order-item">
                <span className="ex-order-icon">{course.icon}</span>
                <span className="ex-order-name">{course.name}</span>
                <span className="ex-order-price">
                  {course.originalPrice !== course.currentPrice && <del>{formatPrice(course.originalPrice)}원</del>}
                  {formatPrice(course.currentPrice)}원
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="ex-box">
          <h2 className="ex-section-title">쿠폰 할인</h2>
          <div className="ex-coupon">
            <label className="ds-label" htmlFor="payCoupon">
              보유 쿠폰
            </label>
            <select id="payCoupon" className="ds-select" value={couponId} onChange={(e) => setCouponId(e.target.value)}>
              {sampleCoupons.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <div className="ex-coupon-row">
              <input
                type="text"
                className="ds-input"
                placeholder="쿠폰 번호를 입력해 주세요"
                aria-label="쿠폰 번호"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button type="button" className="ds-btn ds-btn--secondary" onClick={handleCouponCode}>
                등록
              </button>
            </div>
          </div>
        </section>

        <section className="ex-box">
          <h2 className="ex-section-title">결제 수단</h2>
          <div className="ex-methods" role="radiogroup" aria-label="결제 수단">
            {payMethods.map((m) => (
              <label key={m.key} className={`ex-method${m.key === method ? " is-active" : ""}`}>
                <input
                  type="radio"
                  className="ds-radio"
                  name="payMethod"
                  value={m.key}
                  checked={m.key === method}
                  onChange={() => setMethod(m.key)}
                />
                {m.label}
              </label>
            ))}
          </div>
          <p className="ex-method-guide">
            {methodInfo.guide}
            {method === "voucher" && (
              <>
                {" "}
                <Link href="/course-registration/voucher" className="ex-link">
                  바우처 안내 보기
                </Link>
              </>
            )}
          </p>
        </section>
      </div>

      <aside className="ex-pay-side ex-box">
        <h2 className="ex-section-title">결제 금액</h2>
        <div className="ex-sum">
          <div className="ex-sum-row">
            <span>총 수강료</span>
            <strong>{formatPrice(totalFee)}원</strong>
          </div>
          <div className="ex-sum-row">
            <span>쿠폰 할인</span>
            <strong className="is-discount">-{formatPrice(discount)}원</strong>
          </div>
          <div className="ex-sum-total">
            <span>최종 결제 금액</span>
            <strong>{formatPrice(finalAmount)}원</strong>
          </div>
        </div>
        <label className="ds-check ex-agree">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>
            (필수) 주문 과목과 결제 금액을 확인했으며,{" "}
            <Link href="/course-registration/refund" className="ex-link">
              환불 규정
            </Link>
            을 포함한 결제 약관에 동의합니다.
          </span>
        </label>
        <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg ex-pay-btn" disabled={!agreed}>
          {formatPrice(finalAmount)}원 결제하기
        </button>
      </aside>
    </form>
  );
}
