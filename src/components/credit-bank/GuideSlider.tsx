"use client";

import { useState } from "react";

export interface GuideSlide {
  src: string;
  alt: string;
}

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 16 16" fill="none">
    <path
      d={dir === "left" ? "M9.75 4.5 6.25 8l3.5 3.5" : "M6.25 4.5 9.75 8l-3.5 3.5"}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 가이드 이미지 슬라이더 — 이전/다음은 처음·끝에서 반대쪽으로 넘어간다 */
export default function GuideSlider({ slides }: { slides: GuideSlide[] }) {
  const [index, setIndex] = useState(0);
  const move = (step: number) => setIndex((i) => (i + step + slides.length) % slides.length);
  const slide = slides[index];

  return (
    <div className="cb-slider">
      <div className="cb-slider-frame">
        <img src={slide.src} alt={slide.alt} className="cb-slider-image" />
      </div>
      <div className="cb-slider-bar">
        <button type="button" className="cb-slider-nav" aria-label="이전 페이지" onClick={() => move(-1)}>
          <Chevron dir="left" />
        </button>
        <span className="cb-slider-count" aria-live="polite">
          <strong>{index + 1}</strong> / {slides.length}
        </span>
        <button type="button" className="cb-slider-nav" aria-label="다음 페이지" onClick={() => move(1)}>
          <Chevron dir="right" />
        </button>
      </div>
    </div>
  );
}
