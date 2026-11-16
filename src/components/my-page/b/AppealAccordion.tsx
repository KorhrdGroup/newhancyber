"use client";

import { useState } from "react";
import type { Appeal } from "../myPageDataB";
import { AppealBadge, AppealBody, AppealResult } from "./AppealDetail";

/** 이의신청 목록 — 1:1 문의 목록과 같은 펼침 목록. 줄을 누르면 그 자리에서 사유와 처리 결과가 펼쳐진다. */
export default function AppealAccordion({ items }: { items: Appeal[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="ds-accordion lx-inquiry-list">
      {items.length === 0 && <p className="ds-accordion-empty">신청한 이의신청이 없습니다.</p>}
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `appeal-${item.id}`;
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
                <AppealBadge appeal={item} />
              </span>
              <span className="ds-accordion-text">
                <span className="lx-inquiry-cat">
                  {item.title ? `${item.courseTitle} · ${item.item}` : item.item}
                </span>
                {item.title ?? item.courseTitle}
              </span>
              <span className="lx-inquiry-date">{item.appliedAt}</span>
              <img src="/resources/images/ds/select-chevron.svg" alt="" className="ds-accordion-chevron" />
            </button>
            <div id={panelId} className="ds-accordion-panel" inert={!isOpen}>
              <div className="ds-accordion-panel-inner">
                <div className="lx-inquiry-detail">
                  <AppealBody appeal={item} />
                  <AppealResult appeal={item} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
