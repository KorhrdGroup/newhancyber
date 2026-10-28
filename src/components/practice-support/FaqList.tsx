"use client";

import { useState } from "react";
import type { FaqItem } from "./faqData";

interface FaqListProps {
  title: string;
  items: FaqItem[];
}

/** FAQ 아코디언 — 하나를 열면 나머지는 닫힌다 (원본 .faq-question 스크립트) */
export default function FaqList({ title, items }: FaqListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question} className={`faq-item${isOpen ? " active" : ""}`}>
            {/* 원본은 페이지 제목이 첫 번째 항목 안에 있다 */}
            {i === 0 && <h1 className="page-title">{title}</h1>}
            <button
              type="button"
              className="faq-question"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span className="faq-q">Q.</span>
              <span className="faq-text">{item.question}</span>
              <img
                src="/resources/images/credit-bank/icon_arrow_down.png"
                alt="펼치기"
                className={`faq-arrow${isOpen ? " active" : ""}`}
              />
            </button>
            <div className="faq-answer" style={isOpen ? { display: "block" } : undefined}>
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
