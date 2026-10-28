"use client";

import { useState } from "react";
import { useMobileMenu } from "@/components/layout/MobileMenuContext";
import { cartSummary, formatPrice, sampleCartCourses } from "./courseData";
import MobilePaymentSummary from "./MobilePaymentSummary";

/** 장바구니 (모바일 전용 화면, 원본 cart.html) */
export default function CartContent() {
  // TODO: 장바구니 조회 API. 원본 샘플은 처음에 모두 선택된 상태
  const [checked, setChecked] = useState(() => sampleCartCourses.map(() => true));
  const { isOpen: isSidebarOpen } = useMobileMenu();

  const { totalFee, discount, finalAmount } = cartSummary(
    sampleCartCourses.filter((_, i) => checked[i]).map((course) => course.currentPrice),
  );

  return (
    <main className="wrapper">
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
                  onChange={(e) => {
                    const value = e.target.checked;
                    setChecked((prev) => prev.map((c, j) => (j === i ? value : c)));
                  }}
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
          {/* TODO: 결제 API */}
          <button className="mobile-cart-payment-btn">
            <img src="/resources/images/mobile/mobile_card.png" alt="결제" className="mobile-cart-payment-icon" />
            <span className="mobile-cart-payment-text">결제하기</span>
          </button>
        </div>
      </div>
    </main>
  );
}
