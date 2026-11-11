"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMobileMenu } from "@/components/layout/MobileMenuContext";
import { cartSummary, formatPrice, sampleCartCourses } from "./courseData";
import MobilePaymentSummary from "./MobilePaymentSummary";

/** 장바구니 — 데스크톱은 결제하기 화면과 같은 틀, 모바일은 원본 cart.html 그대로 */
export default function CartContent() {
  // TODO: 장바구니 조회 API. 원본 샘플은 처음에 모두 선택된 상태
  const [checked, setChecked] = useState(() => sampleCartCourses.map(() => true));
  const { isOpen: isSidebarOpen } = useMobileMenu();
  const router = useRouter();

  const { totalFee, discount, finalAmount } = cartSummary(
    sampleCartCourses.filter((_, i) => checked[i]).map((course) => course.currentPrice),
  );
  const selectedCount = checked.filter(Boolean).length;
  const allChecked = selectedCount === sampleCartCourses.length;
  const toggle = (i: number, value: boolean) => setChecked((prev) => prev.map((c, j) => (j === i ? value : c)));
  // TODO: 고른 과목을 결제 화면에 넘기기 (API)
  const goPayment = () => router.push("/course-registration/payment");

  return (
    <main className="wrapper">
      {/* 데스크톱 장바구니 (원본은 모바일 화면만 있음). 쿠폰 할인은 결제하기 화면에서 고른다 */}
      <div className="ex-page ex-cart-desktop">
        <div className="ex-page-head">
          <h1 className="ex-title">장바구니</h1>
          <p className="ex-desc">수강할 과목을 골라 결제해 주세요. 쿠폰 할인은 결제 화면에서 적용할 수 있어요.</p>
        </div>
        <div className="ex-pay">
          <section className="ex-box">
            <div className="ex-cart-head">
              <label className="ds-check">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={(e) => setChecked(sampleCartCourses.map(() => e.target.checked))}
                />
                <span>
                  전체 선택 ({selectedCount}/{sampleCartCourses.length})
                </span>
              </label>
              {/* TODO: 장바구니에서 빼기 API */}
              <button
                type="button"
                className="ds-btn ds-btn--secondary ds-btn--sm"
                disabled={selectedCount === 0}
                onClick={() => alert("장바구니 삭제 API 연동 전입니다.")}
              >
                선택 삭제
              </button>
            </div>
            <ul className="ex-order">
              {sampleCartCourses.map((course, i) => (
                <li key={i} className="ex-order-item">
                  <input
                    type="checkbox"
                    className="ex-cart-check"
                    aria-label={`${course.name} 선택`}
                    checked={checked[i]}
                    onChange={(e) => toggle(i, e.target.checked)}
                  />
                  <span className="ex-order-icon">{course.icon}</span>
                  <span className="ex-order-name">{course.name}</span>
                  {/* TODO: 샘플강의·강의계획서 팝업 연결 */}
                  <span className="ex-cart-links">
                    <button type="button" className="ds-btn ds-btn--ghost ds-btn--sm">
                      샘플강의
                    </button>
                    <button type="button" className="ds-btn ds-btn--ghost ds-btn--sm">
                      강의계획서
                    </button>
                  </span>
                  <span className="ex-order-price">
                    {course.originalPrice !== course.currentPrice && <del>{formatPrice(course.originalPrice)}원</del>}
                    {formatPrice(course.currentPrice)}원
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <aside className="ex-pay-side ex-box">
            <h2 className="ex-section-title">결제 예정 금액</h2>
            <div className="ex-sum">
              <div className="ex-sum-row">
                <span>선택한 과목</span>
                <strong>{selectedCount}과목</strong>
              </div>
              <div className="ex-sum-total">
                <span>총 수강료</span>
                <strong>{formatPrice(totalFee)}원</strong>
              </div>
            </div>
            <button
              type="button"
              className="ds-btn ds-btn--primary ds-btn--lg ex-pay-btn"
              disabled={selectedCount === 0}
              onClick={goPayment}
            >
              {selectedCount}과목 결제하기
            </button>
            <Link href="/course-registration/register" className="ds-btn ds-btn--secondary ds-btn--lg ex-pay-btn">
              과목 더 담기
            </Link>
          </aside>
        </div>
      </div>

      <div className="container" style={{ backgroundColor: "#fff" }}>
        <div className="mobile-cart-list mobile-only">
          {sampleCartCourses.map((course, i) => (
            <div key={i} className="mobile-cart-item">
              <div className="mobile-cart-item-left">
                <div className="mobile-cart-item-header">
                  <div className="mobile-cart-icon">{course.icon}</div>
                  <div className="mobile-cart-title">{course.name}</div>
                </div>
                <div className="mobile-cart-item-content">
                  <div className="mobile-cart-buttons">
                    <button className="mobile-cart-sample-btn">샘플강의</button>
                    <button className="mobile-cart-syllabus-btn">강의계획서</button>
                  </div>
                </div>
              </div>
              <div className="mobile-cart-item-right">
                <div className="mobile-cart-price">
                  <span className="mobile-cart-price-original">{formatPrice(course.originalPrice)}원</span>
                  <span className="mobile-cart-price-current">{formatPrice(course.currentPrice)}원</span>
                </div>
                <input
                  type="checkbox"
                  className="mobile-cart-checkbox"
                  checked={checked[i]}
                  onChange={(e) => toggle(i, e.target.checked)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mobile-coupon-section mobile-only">
          <div className="mobile-coupon-label">쿠폰번호</div>
          {/* TODO: 쿠폰 적용 API (원본도 할인액 고정) */}
          <input
            type="text"
            className="mobile-coupon-input"
            placeholder="쿠폰번호를 입력해주세요"
            id="mobileCouponInput"
          />
        </div>

        <MobilePaymentSummary
          totalFee={`${formatPrice(totalFee)} 원`}
          discount={`-${formatPrice(discount)} 원`}
          finalAmount={`${formatPrice(finalAmount)}원`}
        />

        {/*
          원본: 모바일 사이드바가 열려 있으면 결제하기 버튼을 숨긴다.
          원본처럼 display:none 을 넣으면 .mobile-only 의 display !important 에 져서 안 숨겨지고(원본 버그),
          요소를 빼면 body:has(.mobile-cart-payment-button) 푸터 규칙이 풀리므로 visibility 로 숨긴다.
        */}
        <div
          className="mobile-cart-payment-button mobile-only"
          id="mobileCartPaymentButton"
          style={isSidebarOpen ? { visibility: "hidden" } : undefined}
        >
          <button className="mobile-cart-payment-btn" onClick={goPayment}>
            <img src="/resources/images/mobile/mobile_card.png" alt="결제" className="mobile-cart-payment-icon" />
            <span className="mobile-cart-payment-text">결제하기</span>
          </button>
        </div>
      </div>
    </main>
  );
}
