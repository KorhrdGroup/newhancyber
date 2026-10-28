"use client";

import { useState } from "react";

export interface FaqEntry {
  question: string;
  answer: React.ReactNode;
}

/**
 * 원본 마크업은 3번 항목의 닫는 </div> 가 빠져서 4번부터는 3번 항목 안에 들어가 있다.
 * 화면이 원본과 같도록 그 구조를 그대로 따른다.
 */
const NESTED_FROM = 3;

interface FaqItemProps {
  entry: FaqEntry;
  isOpen: boolean;
  onToggle: () => void;
  heading?: React.ReactNode;
  children?: React.ReactNode;
}

function FaqItem({ entry, isOpen, onToggle, heading, children }: FaqItemProps) {
  return (
    <div className={`faq-item${isOpen ? " active" : ""}`}>
      {heading}
      <button type="button" className="faq-question" onClick={onToggle}>
        <span className="faq-q">Q.</span> <span className="faq-text">{entry.question}</span>{" "}
        <img
          src="/resources/images/credit-bank/icon_arrow_down.png"
          alt="펼치기"
          className={`faq-arrow${isOpen ? " active" : ""}`}
        />
      </button>
      <div className="faq-answer" style={isOpen ? { display: "block" } : undefined}>
        {entry.answer}
      </div>
      {children}
    </div>
  );
}

/** FAQ 아코디언 — 하나를 열면 나머지는 닫힌다 */
export default function FaqAccordion({ title, items }: { title: string; items: FaqEntry[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const renderItem = (index: number, children?: React.ReactNode) => (
    <FaqItem
      key={index}
      entry={items[index]}
      isOpen={openIndex === index}
      onToggle={() => setOpenIndex(openIndex === index ? null : index)}
      heading={index === 0 ? <h1 className="page-title">{title}</h1> : undefined}
    >
      {children}
    </FaqItem>
  );

  const outer = items.slice(0, NESTED_FROM).map((_, i) => i);
  const nested = items.slice(NESTED_FROM).map((_, i) => i + NESTED_FROM);

  return (
    <div className="faq-list">
      {outer.map((i) =>
        renderItem(i, i === NESTED_FROM - 1 ? nested.map((j) => renderItem(j)) : undefined),
      )}
    </div>
  );
}
