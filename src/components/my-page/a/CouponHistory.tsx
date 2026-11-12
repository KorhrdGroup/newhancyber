"use client";

import { useState } from "react";
import StatusBadge from "./StatusBadge";
import type { Coupon } from "../myPageDataA";

const filters = [
  { label: "전체", match: () => true },
  { label: "보유한 쿠폰", match: (c: Coupon) => c.status === "사용 가능" },
  { label: "사용한 쿠폰", match: (c: Coupon) => c.status === "사용 완료" },
];

/** U29 쿠폰 사용내역 — 요약, 쿠폰 등록, 목록(전체/보유/사용 거르기) */
export default function CouponHistory({ coupons }: { coupons: Coupon[] }) {
  const [filter, setFilter] = useState(0);
  const [code, setCode] = useState("");
  const list = coupons.filter(filters[filter].match);
  const count = (status: Coupon["status"]) => coupons.filter((c) => c.status === status).length;

  const register = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      alert("쿠폰 번호를 적어 주세요.");
      return;
    }
    // TODO: API 쿠폰 등록 (code)
    alert("쿠폰 등록 API 연동 전입니다.");
  };

  return (
    <>
      <div className="ds-stats">
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
          <button type="submit" className="ds-btn ds-btn--primary">
            등록
          </button>
        </div>
        <p className="pp-note ds-mt-8">등록한 쿠폰은 수강신청 결제 화면에서 쓸 수 있습니다.</p>
      </form>

      <section className="cr-section">
        <div className="page-tabs mp-subtabs" role="tablist" aria-label="쿠폰 거르기">
          {filters.map((f, i) => (
            <button
              key={f.label}
              type="button"
              role="tab"
              aria-selected={filter === i}
              className={`page-tab${filter === i ? " is-active" : ""}`}
              onClick={() => setFilter(i)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="cr-empty">해당하는 쿠폰이 없습니다.</p>
        ) : (
          <div className="cr-table-wrap">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>쿠폰명</th>
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
                    <td className="is-left">
                      <strong>{c.name}</strong>
                    </td>
                    <td className="ds-text-brand">{c.discount}</td>
                    <td className="mp-nowrap">
                      {c.validFrom} ~ {c.validTo}
                    </td>
                    <td>
                      <StatusBadge>{c.status}</StatusBadge>
                    </td>
                    <td>{c.usedAt ?? "-"}</td>
                    <td>{c.usedCourse ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
