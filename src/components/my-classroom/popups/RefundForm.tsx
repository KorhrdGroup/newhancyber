"use client";

import { useState } from "react";
import { closePopup } from "../PopupActions";

const reasons = ["개인 사정으로 수강이 어려움", "다른 과목으로 바꾸고 싶음", "학습 사이트 이용이 불편함", "기타"];

/** 환불 신청서. needAccount: 무통장 입금이라 돌려받을 계좌가 필요한 경우 */
export default function RefundForm({ needAccount }: { needAccount: boolean }) {
  const [agreed, setAgreed] = useState(false);
  const [reason, setReason] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      alert("환불 사유를 골라 주세요.");
      return;
    }
    if (!confirm("환불을 신청할까요? 신청하면 해당 과목은 바로 수강이 멈춥니다.")) return;
    // TODO: API 환불 신청
    alert("환불 신청 API 연동 전입니다.");
    closePopup();
  };

  return (
    <form onSubmit={submit} className="pp-box">
      <h2 className="pp-box-title">환불 신청</h2>
      <div className="pp-field">
        <label className="ds-label" htmlFor="refund-reason">
          환불 사유
        </label>
        <select id="refund-reason" className="ds-select" value={reason} onChange={(e) => setReason(e.target.value)}>
          <option value="">골라 주세요</option>
          {reasons.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      {reason === "기타" && (
        <div className="pp-field">
          <textarea className="ds-textarea ds-textarea--sm" placeholder="사유를 적어 주세요." aria-label="기타 사유" />
        </div>
      )}
      {needAccount && (
        <div className="pp-field">
          <span className="ds-label">돌려받을 계좌</span>
          <div className="pp-row">
            <input className="ds-input pp-input-bank" placeholder="은행" aria-label="은행" />
            <input className="ds-input" placeholder="계좌번호 (- 없이)" aria-label="계좌번호" inputMode="numeric" />
            <input className="ds-input pp-input-holder" placeholder="예금주" aria-label="예금주" />
          </div>
        </div>
      )}
      <div className="pp-field">
        <label className="ds-check">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          환불 규정과 유의사항을 모두 읽었고, 이에 동의합니다.
        </label>
      </div>
      <div className="pp-actions">
        <button type="button" className="ds-btn ds-btn--secondary" onClick={closePopup}>
          취소
        </button>
        <button type="submit" className="ds-btn ds-btn--danger" disabled={!agreed}>
          환불 신청
        </button>
      </div>
    </form>
  );
}
