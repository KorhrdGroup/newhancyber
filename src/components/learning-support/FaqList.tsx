"use client";

import { Fragment, useState } from "react";
import { faqSections } from "./faqData";

/**
 * FAQ 아코디언. 원본처럼 전체에서 한 번에 하나만 열린다.
 * 각 묶음의 첫 질문 안에 묶음 제목(h1.page-title)이 들어가는 원본 구조를 그대로 따른다.
 */
export default function FaqList() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return faqSections.map((section, s) => (
    <section key={section.title} className="faq-section">
      <div className="container" style={{ backgroundColor: "#f9f9f9" }}>
        <div className="faq-list">
          {section.items.map((item, i) => {
            const key = `${s}-${i}`;
            const isOpen = openKey === key;
            return (
              <div key={key} className={`faq-item${isOpen ? " active" : ""}`}>
                {i === 0 && <h1 className="page-title">{section.title}</h1>}
                <button type="button" className="faq-question" onClick={() => setOpenKey(isOpen ? null : key)}>
                  <span className="faq-q">Q.</span>
                  <span className="faq-text">{item.question}</span>
                  <img
                    src="/resources/images/credit-bank/icon_arrow_down.png"
                    alt="펼치기"
                    className={`faq-arrow${isOpen ? " active" : ""}`}
                  />
                </button>
                <div className="faq-answer" style={isOpen ? { display: "block" } : undefined}>
                  <p>
                    {item.answer.map((line, l) => (
                      <Fragment key={l}>
                        {l > 0 && <br />}
                        {line}
                      </Fragment>
                    ))}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  ));
}
