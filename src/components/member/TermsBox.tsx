"use client";

import { useId } from "react";

interface TermsBoxProps {
  id: string;
  title: string;
  required?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** 펼침 상태는 목록이 들고 있다 — 한 번에 하나만 열리게 */
  isOpen: boolean;
  onToggle: () => void;
  /** 펼쳤을 때 보이는 약관 본문 */
  children: React.ReactNode;
}

/** 약관 한 개: 동의 체크박스 + 내용 펼치기 */
export default function TermsBox({ id, title, required = false, checked, onChange, isOpen, onToggle, children }: TermsBoxProps) {
  const bodyId = useId();

  return (
    <li className="signup-term">
      <div className="signup-term-head">
        <label className="ds-check signup-term-check" htmlFor={id}>
          <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} />
          <span>
            {title} <span className={required ? "signup-term-req" : "signup-term-opt"}>{required ? "(필수)" : "(선택)"}</span>
          </span>
        </label>
        <button
          type="button"
          className={`signup-term-toggle${isOpen ? " is-open" : ""}`}
          aria-expanded={isOpen}
          aria-controls={bodyId}
          aria-label={`${title} 내용 ${isOpen ? "접기" : "보기"}`}
          onClick={onToggle}
        >
          <img src="/resources/images/member/arrow-down.png" alt="" />
        </button>
      </div>
      {/* FAQ 처럼 늘 그려 두고 높이만 0 ↔ 원래 높이로 부드럽게 펼친다. 닫혀 있을 땐 inert 로 읽기·포커스 제외 */}
      <div id={bodyId} className={`signup-term-panel${isOpen ? " is-open" : ""}`} inert={!isOpen}>
        <div className="signup-term-panel-inner">
          <div className="signup-term-body">{children}</div>
        </div>
      </div>
    </li>
  );
}
