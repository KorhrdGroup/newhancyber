"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMobileMenu } from "@/components/layout/MobileMenuContext";
import { openPopup } from "@/components/my-classroom/PopupButton";
import { formatPrice, sampleCartCourses, sampleLectureHref } from "./courseData";
import MajorBadges from "./MajorBadges";

/** 장바구니 — 결제하기 화면과 같은 틀 (휴대폰은 한 줄로 쌓고 결제 버튼을 아래에 고정) */
export default function CartContent() {
  // TODO: 장바구니 조회 API. 원본 샘플은 처음에 모두 선택된 상태
  const [checked, setChecked] = useState(() => sampleCartCourses.map(() => true));
  const { isOpen: isSidebarOpen } = useMobileMenu();
  const router = useRouter();

  const totalFee = sampleCartCourses.reduce((sum, course, i) => (checked[i] ? sum + course.currentPrice : sum), 0);
  const selectedCount = checked.filter(Boolean).length;
  const allChecked = selectedCount === sampleCartCourses.length;
  const toggle = (i: number, value: boolean) => setChecked((prev) => prev.map((c, j) => (j === i ? value : c)));
  // TODO: 고른 과목을 결제 화면에 넘기기 (API)
  const goPayment = () => router.push("/course-registration/payment");

  return (
    <main className="wrapper">
      {/* 쿠폰 할인은 결제하기 화면에서 고른다 */}
      <div className="ex-page ex-cart">
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
                  <label className="ds-check ex-cart-check">
                    <input
                      type="checkbox"
                      aria-label={`${course.name} 선택`}
                      checked={checked[i]}
                      onChange={(e) => toggle(i, e.target.checked)}
                    />
                  </label>
                  <span className="ex-order-name">
                    {course.name}
                    <MajorBadges name={course.name} />
                  </span>
                  {/* TODO: 강의계획서 팝업 연결 */}
                  <span className="ex-cart-links">
                    <button
                      type="button"
                      className="ds-btn ds-btn--ghost ds-btn--sm"
                      onClick={() => openPopup(sampleLectureHref(course.name))}
                    >
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


      {/* 휴대폰 아래 고정 결제 버튼 — 사이드바가 열리면 숨김 */}
      <div className="ex-cart-float" hidden={isSidebarOpen}>
        <button type="button" className="ds-btn ds-btn--primary ds-btn--lg" disabled={selectedCount === 0} onClick={goPayment}>
          {selectedCount}과목 결제하기 · {formatPrice(totalFee)}원
        </button>
      </div>
    </main>
  );
}
