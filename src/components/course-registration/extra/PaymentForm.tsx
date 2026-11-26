"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { submitPayment } from "@/app/course-registration/payment/actions";
import { registerCoupon } from "@/app/my-page/coupons/actions";
import { useMobileMenu } from "@/components/layout/MobileMenuContext";
import { couponDiscountLabel, couponLineDiscounts } from "@/lib/coupons";
import { courseCategoryTabs, findCourseByName, formatPrice, type CartData } from "../courseData";
import MajorBadges from "../MajorBadges";
import { payMethods, sampleCoupons, type PayMethod } from "./extraData";

/** 과목이 속한 과정 이름 (수강신청 과목 구분 탭 이름과 같음, 예: 사회복지사) */
const courseLabel = (name: string) => {
  const category = findCourseByName(name)?.category;
  return courseCategoryTabs.find((tab) => tab.key === category)?.label;
};

/**
 * 결제하기: 수강신청 과목 · 쿠폰 할인 · 결제 수단 · 약관 동의 · 최종 결제 금액.
 * 과목은 data (DB 차수 또는 샘플). DB 는 「결제하기」를 누르면 바로 결제 완료로 남는다 (PG 나이스페이 연결 전 — actions.ts).
 * 쿠폰 — DB 는 그 회원이 지금 쓸 수 있는 쿠폰(data.coupons) 중 하나. 과목 쿠폰은 그 과목이 이 결제에 있을 때만 고를 수 있다.
 *   할인액 미리 보기는 src/lib/coupons.ts couponLineDiscounts — 결제할 때 서버가 같은 식으로 다시 센다.
 *   쿠폰 번호를 넣으면 바로 받아서(마이페이지 쿠폰 등록과 같은 액션) 목록이 새로 그려진다.
 */
export default function PaymentForm({ data }: { data: CartData }) {
  const isDb = data.source === "db";
  // 마감 · 신청 기간이 지난 차수는 보여 주되 결제 금액 · 결제 대상에서 뺀다
  const courses = data.items;
  const payable = courses.filter((c) => c.available);
  const dbCoupons = (data.coupons ?? []).filter(
    (c) => c.scope === "주문" || payable.some((p) => p.classId !== null && p.classId === c.classId),
  );
  const [couponId, setCouponId] = useState(sampleCoupons[0].id);
  /** DB 쿠폰 — 고른 쿠폰 번호 (안 쓰면 "") */
  const [dbCouponId, setDbCouponId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [isRegistering, startRegistering] = useTransition();
  const [method, setMethod] = useState<PayMethod>("card");
  const [agreed, setAgreed] = useState(false);
  const [isPaying, startPaying] = useTransition();
  /** 결제하지 못한 까닭 — 결제 버튼 위에 보인다 */
  const [payError, setPayError] = useState<string | null>(null);
  const { isOpen: isSidebarOpen } = useMobileMenu();
  const router = useRouter();

  const listTotal = payable.reduce((sum, course) => sum + course.listPrice, 0);
  const totalFee = payable.reduce((sum, course) => sum + course.fee, 0);
  const coupon = sampleCoupons.find((c) => c.id === couponId) ?? sampleCoupons[0];
  const dbCoupon = dbCoupons.find((c) => String(c.couponId) === dbCouponId) ?? null;
  const dbDiscount = dbCoupon
    ? couponLineDiscounts(dbCoupon, payable.map((p) => ({ classId: p.classId, fee: p.fee }))).reduce((s, d) => s + d, 0)
    : 0;
  const discount = isDb ? dbDiscount : coupon.discount(totalFee);
  const finalAmount = Math.max(totalFee - discount, 0);
  const methodInfo = payMethods.find((m) => m.key === method) ?? payMethods[0];

  const handleCouponCode = () => {
    if (!couponCode.trim()) {
      setCouponMsg({ ok: false, text: "쿠폰 번호를 입력해 주세요." });
      return;
    }
    if (!isDb) {
      setCouponMsg({ ok: false, text: "샘플 화면이라 등록하지 않아요." });
      return;
    }
    setCouponMsg(null);
    startRegistering(async () => {
      const result = await registerCoupon(couponCode);
      setCouponMsg({ ok: result.ok, text: result.message });
      if (result.ok) {
        setCouponCode("");
        router.refresh(); // 쓸 수 있는 쿠폰 목록을 다시 받는다
      }
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isDb) {
      alert(`${methodInfo.label}로 ${formatPrice(finalAmount)}원 결제 — 샘플 화면이라 결제하지 않아요.`);
      return;
    }
    const classIds = payable.map((c) => c.classId).filter((id): id is number => id !== null);
    if (classIds.length === 0) {
      setPayError("결제할 수 있는 과목이 없어요. 장바구니에서 다시 골라 주세요.");
      return;
    }
    // 따로 확인 창(confirm)을 띄우지 않는다 — 필수 약관 동의가 확인이고, 앱 안 브라우저(카카오톡 등)는 확인 창을 막기도 한다.
    // 알림도 화면 안에 보인다 (alert 대신 payError)
    setPayError(null);
    startPaying(async () => {
      // 성공하면 서버가 결제 완료 화면으로 보낸다 — 돌아온 값은 실패일 때만
      const result = await submitPayment(classIds, method, dbCoupon ? dbCoupon.couponId : null);
      if (result.needLogin) {
        router.push(`/member/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }
      setPayError(result.message);
      router.refresh();
    });
  };

  return (
    <form className="ex-pay ex-pay--float" onSubmit={handleSubmit}>
      <div className="ex-pay-main">
        <section className="ex-box">
          <div className="ex-order-head">
            <h2 className="ex-section-title">수강신청 과목 ({payable.length})</h2>
            <Link href="/course-registration/cart" className="ds-btn ds-btn--secondary ds-btn--sm">
              과목 변경
            </Link>
          </div>
          {courses.length === 0 ? (
            <p className="ex-empty">결제할 과목이 없어요. 장바구니에서 과목을 골라 주세요.</p>
          ) : (
            <ul className="ex-order">
              {courses.map((course) => (
                <li key={course.id} className="ex-order-item">
                  <span className="ex-order-name">
                    {course.semester && <span className="ex-order-sub">{course.semester}</span>}
                    {!isDb && courseLabel(course.name) && <span className="ex-order-course">{courseLabel(course.name)}</span>}
                    {course.name}
                    {course.note ? (
                      <span className="ex-order-badges">
                        <span className="ds-badge ds-badge--neutral">{course.note} · 결제에서 빠짐</span>
                      </span>
                    ) : (
                      !isDb && <MajorBadges name={course.name} />
                    )}
                  </span>
                  <span className="ex-order-price">
                    {course.listPrice !== course.fee && <del>{formatPrice(course.listPrice)}원</del>}
                    {formatPrice(course.fee)}원
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 쿠폰 — DB: 쓸 수 있는 내 쿠폰 중 하나 (한 결제에 한 장) · 샘플: 퍼블리싱 샘플 쿠폰 */}
        <section className="ex-box">
          <h2 className="ex-section-title">쿠폰 할인</h2>
          <div className="ex-coupon">
            <label className="ds-label" htmlFor="payCoupon">
              보유 쿠폰
            </label>
            {isDb ? (
              <select id="payCoupon" className="ds-select" value={dbCouponId} onChange={(e) => setDbCouponId(e.target.value)}>
                <option value="">{dbCoupons.length ? "쿠폰 사용 안 함" : "쓸 수 있는 쿠폰이 없어요"}</option>
                {dbCoupons.map((c) => (
                  <option key={c.couponId} value={String(c.couponId)}>
                    {c.name} · {couponDiscountLabel(c.discountType, c.discountValue)}
                    {c.scope === "과목" ? ` · ${payable.find((p) => p.classId === c.classId)?.name ?? ""} 전용` : ""} ({c.expiresOn}까지)
                  </option>
                ))}
              </select>
            ) : (
              <select id="payCoupon" className="ds-select" value={couponId} onChange={(e) => setCouponId(e.target.value)}>
                {sampleCoupons.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            )}
            <div className="ex-coupon-row">
              <input
                type="text"
                className="ds-input"
                placeholder="쿠폰 번호를 입력해 주세요"
                aria-label="쿠폰 번호"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                autoComplete="off"
              />
              <button type="button" className="ds-btn ds-btn--secondary" onClick={handleCouponCode} disabled={isRegistering}>
                등록
              </button>
            </div>
            {couponMsg && (
              <p className={couponMsg.ok ? "ex-method-guide" : "ex-pay-error"} role={couponMsg.ok ? "status" : "alert"}>
                {couponMsg.text}
              </p>
            )}
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
            <strong>{formatPrice(isDb ? listTotal : totalFee)}원</strong>
          </div>
          {isDb && listTotal > totalFee && (
            <div className="ex-sum-row">
              <span>할인</span>
              <strong className="is-discount">-{formatPrice(listTotal - totalFee)}원</strong>
            </div>
          )}
          {(!isDb || discount > 0) && (
            <div className="ex-sum-row">
              <span>쿠폰 할인</span>
              <strong className="is-discount">-{formatPrice(discount)}원</strong>
            </div>
          )}
          <div className="ex-sum-total">
            <span>최종 결제 금액</span>
            <strong>{formatPrice(finalAmount)}원</strong>
          </div>
        </div>
        <label className="ds-check ex-agree">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>
            (필수) 수강신청 과목과 결제 금액을 확인했으며,{" "}
            <Link href="/course-registration/refund" className="ex-link">
              환불 규정
            </Link>
            을 포함한 결제 약관에 동의합니다.
          </span>
        </label>
        {payError && (
          <p className="ex-pay-error" role="alert">
            {payError}
          </p>
        )}
        <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg ex-pay-btn" disabled={!agreed || isPaying || (isDb && payable.length === 0)}>
          {formatPrice(finalAmount)}원 결제하기
        </button>
      </aside>

      {/* 휴대폰 아래 고정 결제 버튼 (장바구니와 같음) — 약관 동의 전에는 눌리지 않고, 사이드바가 열리면 숨김 */}
      <div className="ex-cart-float" hidden={isSidebarOpen}>
        <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg" disabled={!agreed || isPaying || (isDb && payable.length === 0)}>
          {formatPrice(finalAmount)}원 결제하기
        </button>
      </div>
    </form>
  );
}
