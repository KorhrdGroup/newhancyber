"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { DESKTOP_SECTION_ID, MOBILE_SECTION_ID } from "./ConsultationOptions";

const SW_IMG = "/resources/images/social-worker";

/** 이 폭(px) 이하는 모바일 (퍼블리싱 CSS 와 같은 기준) */
const MOBILE_MAX_WIDTH = 480;

const isMobileWidth = () => document.documentElement.clientWidth <= MOBILE_MAX_WIDTH;
const pageTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

/**
 * 하단 "상담신청" 플로팅 바.
 * 모바일은 상담 카드 영역에, 데스크톱은 푸터에 닿으면 숨긴다 (원본 checkFooterPosition).
 */
export default function ConsultationFloatingBar() {
  const barRef = useRef<HTMLDivElement>(null);
  // null: 아직 위치 계산 전 (CSS 기본값 그대로)
  const [visible, setVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      const bar = barRef.current;
      if (!bar) return;
      const windowBottom = window.scrollY + window.innerHeight;
      const barHeight = bar.offsetHeight;

      if (isMobileWidth()) {
        const section =
          document.getElementById(MOBILE_SECTION_ID) ?? document.getElementById(DESKTOP_SECTION_ID);
        const top = section ? pageTop(section) : 0;
        setVisible(!(top && windowBottom >= top - barHeight - 50));
        return;
      }

      const footer = document.querySelector("footer.footer");
      const top = footer ? pageTop(footer) : 0;
      setVisible(!(top && windowBottom >= top - barHeight));
    };

    // 원본처럼 DOM 이 자리 잡은 뒤 한 번 계산
    const timer = window.setTimeout(check, 100);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  const scrollToOptions = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(isMobileWidth() ? MOBILE_SECTION_ID : DESKTOP_SECTION_ID);
    if (target) window.scrollTo({ top: pageTop(target) - 100, behavior: "smooth" });
  };

  const style =
    visible === null
      ? undefined
      : { display: "flex", opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" } as const;

  return (
    <div ref={barRef} className="consultation-floating-bar" style={style}>
      <div className="consultation-floating-content">
        <p className="consultation-floating-text desktop-only">
          잠깐! 도움을 받고싶다면 지금 바로 <span className="consultation-floating-bold">상담신청</span>하세요!
        </p>
        <p className="consultation-floating-text mobile-only">잠깐! 도움을 받고싶다면 지금 바로</p>
        <a href={`#${MOBILE_SECTION_ID}`} className="consultation-floating-btn" onClick={scrollToOptions}>
          <img
            src={`${SW_IMG}/button_desktop.png`}
            alt="상담 신청"
            className="consultation-floating-btn-img desktop-only"
          />
          <img
            src={`${SW_IMG}/button_mobile.png`}
            alt="상담 신청"
            className="consultation-floating-btn-img mobile-only"
          />
        </a>
      </div>
    </div>
  );
}
