"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerCoupon } from "@/app/my-page/coupons/actions";
import StatusBadge from "./StatusBadge";
import type { Coupon } from "../myPageDataA";
import "@/styles/extra-pages.css";

const filters = [
  { label: "전체", match: () => true },
  { label: "보유한 쿠폰", match: (c: Coupon) => c.status === "사용 가능" },
  { label: "사용한 쿠폰", match: (c: Coupon) => c.status === "사용 완료" },
];

/**
 * U29 쿠폰 사용내역 — 요약, 쿠폰 등록, 목록(전체/보유/사용 거르기).
 * canRegister 면 쿠폰 번호를 실제로 등록한다 (DB). 결과는 알림 창 대신 입력칸 아래에 보인다.
 */
export default function CouponHistory({ coupons, canRegister = false }: { coupons: Coupon[]; canRegister?: boolean }) {
  const [filter, setFilter] = useState(0);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [isSending, startSending] = useTransition();
  const router = useRouter();
  const list = coupons.filter(filters[filter].match);
  const count = (status: Coupon["status"]) => coupons.filter((c) => c.status === status).length;

  const register = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setMessage({ ok: false, text: "쿠폰 번호를 적어 주세요." });
      return;
    }
    if (!canRegister) {
      setMessage({ ok: false, text: "샘플 화면이라 등록하지 않아요." });
      return;
    }
    setMessage(null);
    startSending(async () => {
      const result = await registerCoupon(code);
      if (result.needLogin) {
        router.push(`/member/login?next=${encodeURIComponent("/my-page/coupons")}`);
        return;
      }
      setMessage({ ok: result.ok, text: result.message });
      if (result.ok) {
        setCode("");
        router.refresh();
      }
    });
  };

  return (
    <>
      <div className="ds-stats ex-summary">
        <div className="ds-stat">
          <p className="ds-stat-label">사용할 수 있는 쿠폰</p>
          <p className="ds-stat-value ds-text-brand">
            {count("사용 가능")}
            <small>장</small>
          </p>
        </div>
        <div className="ds-stat">
          <p className="ds-stat-label">사용한 쿠폰</p>
          <p className="ds-stat-value">
            {count("사용 완료")}
            <small>장</small>
          </p>
        </div>
        <div className="ds-stat">
          <p className="ds-stat-label">기간이 지난 쿠폰</p>
          <p className="ds-stat-value">
            {count("기간 만료")}
            <small>장</small>
          </p>
        </div>
      </div>

      <form onSubmit={register} className="pp-box ds-mt-20">
        <label className="ds-label" htmlFor="coupon-code">
          쿠폰 등록
        </label>
        <div className="mp-inline-form">
          <input
            id="coupon-code"
            className="ds-input"
            placeholder="받으신 쿠폰 번호를 적어 주세요"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="ds-btn ds-btn--primary" disabled={isSending}>
            등록
          </button>
        </div>
        {message && (
          <p className={`ds-mt-8 ${message.ok ? "ds-text-brand" : "ds-text-danger"}`} role={message.ok ? "status" : "alert"}>
            {message.text}
          </p>
        )}
        <p className="pp-note ds-mt-8">등록한 쿠폰은 수강신청 결제 화면에서 쓸 수 있습니다.</p>
      </form>

      <section className="cr-section">
        <div className="ds-tabs-box ds-tabs-box--segment mp-filter" role="tablist" aria-label="쿠폰 거르기">
          {filters.map((f, i) => (
            <button
              key={f.label}
              type="button"
              role="tab"
              aria-selected={filter === i}
              className={`ds-tab-box${filter === i ? " is-active" : ""}`}
              onClick={() => setFilter(i)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="cr-empty">해당하는 쿠폰이 없습니다.</p>
        ) : (
          <table className="ds-table ds-table--stack">
            <thead>
              <tr>
                <th className="is-left">쿠폰명</th>
                <th>할인</th>
                <th>사용 기간</th>
                <th>상태</th>
                <th>사용일</th>
                <th>사용 과목</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td className="ds-table-stack-head is-left">{c.name}</td>
                  <td className="ds-text-brand" data-label="할인">{c.discount}</td>
                  <td className="mp-nowrap" data-label="사용 기간">
                    {c.validFrom} ~ {c.validTo}
                  </td>
                  <td data-label="상태">
                    <StatusBadge>{c.status}</StatusBadge>
                  </td>
                  <td data-label="사용일">{c.usedAt ?? "-"}</td>
                  <td data-label="사용 과목">{c.usedCourse ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
