"use client";

import { useState } from "react";
import "@/styles/learning-extra.css";

/** 1:1 문의 한 줄 — board_posts.qna (본문 · 답변은 글자 그대로, 줄바꿈만 살려 보인다) */
export interface Inquiry {
  id: string;
  title: string;
  /** 문의일 (YY.MM.DD) */
  date: string;
  body: string;
  answer?: {
    date: string;
    body: string;
  };
}

/**
 * 1:1 문의 목록 — FAQ 와 같은 질문 접기(Accordion). 줄을 누르면 페이지 이동 없이 그 자리에서
 * 내 문의 글과 답변(또는 답변 대기 안내)이 부드럽게 펼쳐진다. 한 번에 하나만 열린다.
 * 관리자 1:1 문의는 첨부가 없어서(관리자 boards.ts files: false) 첨부 칸도 없다.
 */
export default function InquiryList({ items, emptyText = "남긴 문의가 없습니다." }: { items: Inquiry[]; emptyText?: string }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="ds-accordion lx-inquiry-list">
      {items.length === 0 && <p className="ds-accordion-empty">{emptyText}</p>}
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `inquiry-${item.id}`;
        return (
          <div key={item.id} className={`ds-accordion-item${isOpen ? " is-open" : ""}`}>
            <button
              type="button"
              className="ds-accordion-q lx-inquiry-q"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span className="lx-inquiry-status">
                {item.answer ? (
                  <span className="ds-badge ds-badge--success">답변 완료</span>
                ) : (
                  <span className="ds-badge ds-badge--neutral">답변 대기</span>
                )}
              </span>
              <span className="ds-accordion-text">{item.title}</span>
              <span className="lx-inquiry-date">{item.date}</span>
              <img src="/resources/images/ds/select-chevron.svg" alt="" className="ds-accordion-chevron" />
            </button>
            {/* FAQ 와 같이 늘 그려 두고 높이만 0 ↔ 원래 높이로 펼친다. 닫혀 있을 땐 inert 로 읽기·포커스 제외 */}
            <div id={panelId} className="ds-accordion-panel" inert={!isOpen}>
              <div className="ds-accordion-panel-inner">
                <div className="lx-inquiry-detail">
                  <div className="lx-post-body">
                    <p className="lx-article-text">{item.body}</p>
                  </div>
                  {item.answer ? (
                    <section className="lx-answer">
                      <div className="lx-answer-head">
                        <strong>답변</strong>
                        <span className="lx-post-meta">답변일 {item.answer.date}</span>
                      </div>
                      <div className="lx-post-body">
                        <p className="lx-article-text">{item.answer.body}</p>
                      </div>
                    </section>
                  ) : (
                    <section className="lx-answer lx-answer--waiting">
                      <p>답변 대기 중입니다.</p>
                      <p>담당자가 확인한 뒤 답변을 드립니다.</p>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
