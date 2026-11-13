"use client";

import { Fragment, useState } from "react";
import { faqSections, type FaqSection } from "./faqData";

const ALL = "전체";

/** 모든 질문을 한 줄로 편다. 원본 답변 앞의 "A. " 는 화면에서 따로 그리므로 뗀다 */
const flatten = (sections: FaqSection[]) =>
  sections.flatMap((section) =>
    section.items.map((item, i) => ({
      key: `${section.title}-${i}`,
      category: section.title,
      question: item.question,
      answer: item.answer.map((line, l) => (l === 0 ? line.replace(/^A\.\s*/, "") : line)),
    })),
  );

interface FaqListProps {
  title?: string;
  desc?: string;
  /** 분류가 둘 이상일 때만 위에 분류 탭이 나온다 (실습지원 FAQ 는 분류 하나 → 탭 없음) */
  sections?: FaqSection[];
}

/**
 * 자주 묻는 질문 — 학습지원 FAQ · 실습지원 FAQ 가 함께 쓴다. Figma 디자인 시스템 부품으로 짠다.
 * 분류: 상자 탭(Tabs/Box) · 검색: 입력 칸(TextField) + 버튼 · 목록: 질문 접기(Accordion), 한 번에 하나만 열린다.
 */
export default function FaqList({
  title = "자주 묻는 질문",
  desc = "궁금한 내용을 분류나 검색어로 찾아보세요. 찾는 답이 없으면 1:1 문의를 남겨 주세요.",
  sections = faqSections,
}: FaqListProps) {
  const allItems = flatten(sections);
  const tabs = sections.length > 1 ? [ALL, ...sections.map((section) => section.title)] : [];
  const [tab, setTab] = useState(ALL);
  const [draft, setDraft] = useState("");
  const [keyword, setKeyword] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);

  // TODO: API — 분류·검색어로 FAQ 목록 조회 (지금은 화면 안에서 거른다)
  const q = keyword.trim();
  const items = allItems.filter(
    (item) =>
      (tab === ALL || item.category === tab) &&
      (!q || item.question.includes(q) || item.answer.some((line) => line.includes(q))),
  );

  return (
    <div className="container lx-page lx-page--top lx-faq">
      <h1 className="page-title">{title}</h1>
      <p className="lx-desc">{desc}</p>

      {tabs.length > 0 && (
        <div className="ds-tabs-box lx-faq-tabs" role="tablist" aria-label="질문 분류">
          {tabs.map((label) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={tab === label}
              className={`ds-tab-box${tab === label ? " is-active" : ""}`}
              onClick={() => {
                setTab(label);
                setOpenKey(null);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <form
        className="lx-faq-bar"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          setKeyword(draft);
          setOpenKey(null);
        }}
      >
        <p className="lx-faq-count">
          총 <strong>{items.length}</strong>개
        </p>
        <div className="lx-faq-search">
          <input
            type="search"
            className="ds-input"
            placeholder="궁금한 내용을 입력하세요"
            aria-label="질문 검색"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit" className="ds-btn ds-btn--primary">
            검색
          </button>
        </div>
      </form>

      <div className="ds-accordion">
        {items.length === 0 && <p className="ds-accordion-empty">찾는 질문이 없어요. 다른 검색어로 찾아보세요.</p>}
        {items.map((item) => {
          const isOpen = openKey === item.key;
          const answerId = `faq-answer-${item.key}`;
          return (
            <div key={item.key} className={`ds-accordion-item${isOpen ? " is-open" : ""}`}>
              <button
                type="button"
                className="ds-accordion-q"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpenKey(isOpen ? null : item.key)}
              >
                <span className="ds-accordion-mark">Q.</span>
                <span className="ds-accordion-text">{item.question}</span>
                <img src="/resources/images/ds/select-chevron.svg" alt="" className="ds-accordion-chevron" />
              </button>
              {/* 답변은 늘 그려 두고 높이만 0 ↔ 원래 높이로 부드럽게 펼친다. 닫혀 있을 땐 inert 로 읽기·포커스 제외 */}
              <div id={answerId} className="ds-accordion-panel" inert={!isOpen}>
                <div className="ds-accordion-panel-inner">
                  <div className="ds-accordion-a">
                    <span className="ds-accordion-mark">A.</span>
                    <p className="ds-accordion-text">
                      {item.answer.map((line, l) => (
                        <Fragment key={l}>
                          {l > 0 && <br />}
                          {line}
                        </Fragment>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
