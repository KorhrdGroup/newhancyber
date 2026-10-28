"use client";

import { useState } from "react";

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

  return (
    <div className="terms-box">
      <div className="inner">
        <div className="top-txt-box">
          <div className="input-box">
            <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <label htmlFor={id}>
              <p>
                {title} <span className={required ? "essential" : "gray"}>{required ? "(필수)" : "(선택)"}</span>
              </p>
            </label>
          </div>
          <a
            href="#"
            role="button"
            aria-expanded={isOpen}
            className={`more-btn${isOpen ? " on" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setIsOpen((open) => !open);
            }}
          >
            <img src="/resources/images/member/arrow-down.png" alt="열기" className="arrow-icon" />
          </a>
        </div>
        <div className="bottom-txt-box" style={isOpen ? undefined : { display: "none" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
