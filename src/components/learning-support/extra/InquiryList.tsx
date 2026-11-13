"use client";

import { useState } from "react";
import type { Inquiry } from "./inquiryData";

/**
 * 1:1 문의 목록 — FAQ 와 같은 질문 접기(Accordion). 줄을 누르면 페이지 이동 없이 그 자리에서
 * 내 문의 글과 답변(또는 답변 대기 안내)이 부드럽게 펼쳐진다. 한 번에 하나만 열린다.
 */
export default function InquiryList({ items }: { items: Inquiry[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="ds-accordion lx-inquiry-list">
      {items.length === 0 && <p className="ds-accordion-empty">남긴 문의가 없습니다.</p>}
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
                    {item.body.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  {item.fileName && (
                    // TODO: 첨부파일 다운로드 링크
                    <p className="lx-file-chip" aria-label={`첨부파일 ${item.fileName}`}>
                      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                          d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {item.fileName}
                    </p>
                  )}

                  {item.answer ? (
                    <section className="lx-answer">
                      <div className="lx-answer-head">
                        <strong>답변</strong>
                        <span className="lx-post-meta">답변일 {item.answer.date}</span>
                      </div>
                      <div className="lx-post-body">
                        {item.answer.body.map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </section>
                  ) : (
                    <section className="lx-answer lx-answer--waiting">
                      <strong>답변 대기 중입니다.</strong>
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
