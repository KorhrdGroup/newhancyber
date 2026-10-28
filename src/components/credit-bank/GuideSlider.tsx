"use client";

import { useState } from "react";

export interface GuideSlide {
  src: string;
  alt: string;
}

/** 가이드 이미지 슬라이더 — 이전/다음은 처음·끝에서 반대쪽으로 넘어간다 */
export default function GuideSlider({ slides }: { slides: GuideSlide[] }) {
  const [index, setIndex] = useState(0);
  const move = (step: number) => setIndex((i) => (i + step + slides.length) % slides.length);

  return (
    <div className="guide-slider">
      <button type="button" className="guide-slider-nav guide-slider-prev" aria-label="이전" onClick={() => move(-1)}>
        <img src="/resources/images/guide/arrow_left.png" alt="이전" />
      </button>
      <div className="guide-slider-container">
        <div className="guide-slider-pagination">
          ({index + 1}/{slides.length})
        </div>
        {slides.map((slide, i) => (
          <div key={slide.src} className={`guide-slide${i === index ? " active" : ""}`}>
            <div className="guide-slide-content">
              <div className="guide-slide-body">
                <img src={slide.src} alt={slide.alt} style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="guide-slider-nav guide-slider-next" aria-label="다음" onClick={() => move(1)}>
        <img src="/resources/images/guide/arrow_right.png" alt="다음" />
      </button>
    </div>
  );
}
