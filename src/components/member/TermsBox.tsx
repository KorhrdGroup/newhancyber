"use client";

import { useId, useState } from "react";

interface TermsBoxProps {
  id: string;
  title: string;
  required?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** 펼쳤을 때 보이는 약관 본문 */
  children: React.ReactNode;
}

/** 약관 한 개: 동의 체크박스 + 내용 펼치기 */
export default function TermsBox({ id, title, required = false, checked, onChange, children }: TermsBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
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
          onClick={() => setIsOpen((open) => !open)}
        >
          <img src="/resources/images/member/arrow-down.png" alt="" />
        </button>
      </div>
      <div id={bodyId} className="signup-term-body" hidden={!isOpen}>
        {children}
      </div>
    </li>
  );
}
