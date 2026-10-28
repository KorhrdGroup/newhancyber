"use client";

import { useEffect, useRef, useState } from "react";

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  /** 첫 항목은 보통 안내 문구(value "") */
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** 각 항목(li)에 붙일 클래스. 메인 상담 폼은 "custom-select-option", 회원가입 폼은 없음 */
  optionClassName?: string;
  /** 처음부터 현재 값 항목에 selected 표시 (회원가입 폼 퍼블리싱 방식) */
  markInitial?: boolean;
  /** 폼 제출용 hidden input 이름 */
  name?: string;
}

/**
 * 커스텀 드롭다운 (common.js initCustomSelect, signup-step2 스크립트).
 * 퍼블리싱 CSS 의 .custom-select 마크업을 그대로 쓴다.
 */
export default function CustomSelect({
  options,
  value,
  onChange,
  className,
  optionClassName,
  markInitial = false,
  name,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  // 원본은 한 번이라도 고르면 표시 문구에 selected 를 붙인다
  const [touched, setTouched] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // 열려 있을 때 바깥 클릭·스크롤하면 닫기
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    const onScroll = () => setIsOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isOpen]);

  const current = options.find((option) => option.value === value) ?? options[0];
  const showSelection = touched || markInitial;

  const classes = ["custom-select", className, isOpen && "active"].filter(Boolean).join(" ");

  return (
    <div ref={rootRef} className={classes}>
      <div className="custom-select-trigger" onClick={() => setIsOpen((open) => !open)}>
        <span className={`custom-select-value${touched ? " selected" : ""}`}>{current?.label}</span>
        <span className="custom-select-arrow">▼</span>
      </div>
      <ul className="custom-select-options">
        {options.map((option) => {
          const optionClasses = [
            optionClassName,
            showSelection && option.value === value && "selected",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <li
              key={option.value}
              className={optionClasses || undefined}
              onClick={() => {
                onChange(option.value);
                setTouched(true);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          );
        })}
      </ul>
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
}
