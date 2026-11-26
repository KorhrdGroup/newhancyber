"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { removeFromCart } from "@/app/course-registration/cart/actions";
import { useMobileMenu } from "@/components/layout/MobileMenuContext";
import { openPopup } from "@/components/my-classroom/PopupButton";
import { formatPrice, sampleLectureHref, type CartData, type CartItem } from "./courseData";
import MajorBadges from "./MajorBadges";

/**
 * 장바구니 — 결제하기 화면과 같은 틀 (휴대폰은 한 줄로 쌓고 결제 버튼을 아래에 고정).
 * 줄은 data(DB 차수 또는 샘플). 마감 · 수강신청 기간이 지난 차수는 까닭을 보이고 고를 수 없다 (빼기만 된다).
 */
export default function CartContent({ data }: { data: CartData }) {
  const { items } = data;
  // 처음에는 결제할 수 있는 줄을 모두 고른 상태 (원본 샘플과 같다)
  const [checkedIds, setCheckedIds] = useState<string[]>(() => items.filter((i) => i.available).map((i) => i.id));
  const [isRemoving, startRemoving] = useTransition();
  const { isOpen: isSidebarOpen } = useMobileMenu();
  const router = useRouter();

  const isChecked = (item: CartItem) => checkedIds.includes(item.id);
  const checkedItems = items.filter(isChecked);
  const payable = checkedItems.filter((i) => i.available);
  const totalFee = payable.reduce((sum, item) => sum + item.fee, 0);
  const selectedCount = checkedItems.length;
  const payCount = payable.length;
  const allChecked = items.length > 0 && selectedCount === items.length;
  const toggle = (item: CartItem, value: boolean) =>
    setCheckedIds((prev) => (value ? (prev.includes(item.id) ? prev : [...prev, item.id]) : prev.filter((id) => id !== item.id)));

  // TODO: 결제 신청을 붙일 때 고른 차수(c=4.7)를 결제 화면이 DB 에서 다시 읽게 한다 — 지금 결제 화면은 샘플
  const goPayment = () => {
    const ids = payable.map((i) => i.classId).filter((id): id is number => id !== null);
    router.push(ids.length ? `/course-registration/payment?c=${ids.join(".")}` : "/course-registration/payment");
  };

  const removeChecked = () => {
    if (data.source === "sample") {
      alert("샘플 화면에서는 뺄 수 없어요.");
      return;
    }
    const ids = checkedItems.map((i) => i.classId).filter((id): id is number => id !== null);
    // 확인 창은 띄우지 않는다 — 앱 안 브라우저는 확인 창을 막기도 하고, 뺀 과목은 수강신청에서 다시 담을 수 있다
    if (ids.length === 0) return;
    startRemoving(async () => {
      const result = await removeFromCart(ids);
      if (!result.ok) {
        alert(result.message);
        // 로그인이 풀렸으면 다시 그려서 로그인 안내를 보인다
        if (result.needLogin) router.refresh();
        return;
      }
      setCheckedIds((prev) => prev.filter((id) => !ids.map(String).includes(id)));
      router.refresh();
    });
  };

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
                  disabled={items.length === 0}
                  onChange={(e) => setCheckedIds(e.target.checked ? items.map((i) => i.id) : [])}
                />
                <span>
                  전체 선택 ({selectedCount}/{items.length})
                </span>
              </label>
              <button
                type="button"
                className="ds-btn ds-btn--secondary ds-btn--sm"
                disabled={selectedCount === 0 || isRemoving}
                onClick={removeChecked}
              >
                선택 삭제
              </button>
            </div>
            {data.needLogin ? (
              <p className="ex-empty">
                로그인하면 담아 둔 과목을 볼 수 있어요.
                <br />
                <Link
                  href={`/member/login?next=${encodeURIComponent("/course-registration/cart")}`}
                  className="ds-btn ds-btn--primary ds-btn--lg ex-pay-btn"
                >
                  로그인
                </Link>
              </p>
            ) : items.length === 0 ? (
              <p className="ex-empty">
                장바구니가 비어 있어요.
                <br />
                수강신청 화면에서 과목을 골라 담아 주세요.
              </p>
            ) : (
              <ul className="ex-order">
                {items.map((item) => (
                  <li key={item.id} className="ex-order-item">
                    <label className="ds-check ex-cart-check">
                      <input
                        type="checkbox"
                        aria-label={`${item.name} 선택`}
                        checked={isChecked(item)}
                        onChange={(e) => toggle(item, e.target.checked)}
                      />
                    </label>
                    <span className="ex-order-name">
                      {item.semester && <span className="ex-order-sub">{item.semester}</span>}
                      {item.name}
                      {item.note ? (
                        <span className="ex-order-badges">
                          <span className="ds-badge ds-badge--neutral">{item.note}</span>
                        </span>
                      ) : (
                        data.source === "sample" && <MajorBadges name={item.name} />
                      )}
                    </span>
                    {/* TODO: 강의계획서 팝업 · DB 과목의 샘플강의(courses.preview_url) 연결 */}
                    <span className="ex-cart-links">
                      <button
                        type="button"
                        className="ds-btn ds-btn--ghost ds-btn--sm"
                        onClick={() => openPopup(sampleLectureHref(item.name))}
                      >
                        샘플강의
                      </button>
                      <button type="button" className="ds-btn ds-btn--ghost ds-btn--sm">
                        강의계획서
                      </button>
                    </span>
                    <span className="ex-order-price">
                      {item.listPrice !== item.fee && <del>{formatPrice(item.listPrice)}원</del>}
                      {formatPrice(item.fee)}원
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <aside className="ex-pay-side ex-box">
            <h2 className="ex-section-title">결제 예정 금액</h2>
            <div className="ex-sum">
              <div className="ex-sum-row">
                <span>결제할 과목</span>
                <strong>{payCount}과목</strong>
              </div>
              <div className="ex-sum-total">
                <span>총 수강료</span>
                <strong>{formatPrice(totalFee)}원</strong>
              </div>
            </div>
            <button
              type="button"
              className="ds-btn ds-btn--primary ds-btn--lg ex-pay-btn"
              disabled={payCount === 0}
              onClick={goPayment}
            >
              {payCount}과목 결제하기
            </button>
            <Link href="/course-registration/register" className="ds-btn ds-btn--secondary ds-btn--lg ex-pay-btn">
              과목 더 담기
            </Link>
          </aside>
        </div>
      </div>

      {/* 휴대폰 아래 고정 결제 버튼 — 사이드바가 열리면 숨김 */}
      <div className="ex-cart-float" hidden={isSidebarOpen}>
        <button type="button" className="ds-btn ds-btn--primary ds-btn--lg" disabled={payCount === 0} onClick={goPayment}>
          {payCount}과목 결제하기 · {formatPrice(totalFee)}원
        </button>
      </div>
    </main>
  );
}
