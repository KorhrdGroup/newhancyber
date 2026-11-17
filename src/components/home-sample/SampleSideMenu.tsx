"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TBD_HREF } from "@/lib/navigation";
import { phones } from "@/components/home/homeData";

/** 이 높이(px) 넘게 내리면 '스크롤됨' — 좁은 PC에서 배너를 가리지 않게 그 전엔 숨긴다 */
const SCROLL_THRESHOLD = 300;

/** 라인 아이콘 (24 그리드, currentColor) */
const ICONS = {
  chat: (
    <>
      <path d="M21 12a8 8 0 0 1-11.8 7L4 20.5l1.5-4.8A8 8 0 1 1 21 12Z" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
    </>
  ),
  remote: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
};

function SideIcon({ name }: { name: keyof typeof ICONS }) {
  return (
    <span className="sh-side-icon">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {ICONS[name]}
      </svg>
    </span>
  );
}

/**
 * 오른쪽 사이드 플로팅 (PC 1280 이상, 시안 전용) — 둥근 알약 버튼을 세로로 쌓은 모양.
 * 큰 칸 2개(전화 상담 + 카톡상담 · 학습설계) + 알약 3개 + TOP. '간편상담'은 아래 간편상담 바를 열고 닫는다.
 */
export default function SampleSideMenu({ consultOpen, onToggleConsult }: { consultOpen: boolean; onToggleConsult: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`sh-side${scrolled ? " is-scrolled" : ""}${consultOpen ? " is-consult-open" : ""}`} aria-label="빠른 메뉴">
      {/* 기존 메인 '빠른 상담'처럼 번호 바로 밑에 노란 카톡상담 버튼 */}
      <div className="sh-side-brand">
        <a href={`tel:${phones.registration}`} className="sh-side-call">
          <span className="sh-side-sub">처음 오셨나요? 빠른 상담</span>
          <span className="sh-side-big">{phones.registration}</span>
        </a>
        <a href={TBD_HREF} className="sh-side-kakao">
          <img src="/resources/images/main/kakaotalkFloting.png" alt="" />
          카톡상담
        </a>
      </div>
      <Link href="/course-registration/learning-design" className="sh-side-item sh-side-item--tall">
        <span className="sh-side-sub">1:1 무료</span>
        <span className="sh-side-big">학습설계 신청</span>
      </Link>
      <button type="button" className={`sh-side-item${consultOpen ? " is-active" : ""}`} aria-pressed={consultOpen} onClick={onToggleConsult}>
        <SideIcon name="chat" />
        간편상담
      </button>
      <Link href="/learning-support/remote-support" className="sh-side-item">
        <SideIcon name="remote" />
        원격지원
      </Link>
      <Link href="/my-page/certificates" className="sh-side-item">
        <SideIcon name="doc" />
        증명서 발급
      </Link>
      <button type="button" className="sh-side-top" aria-label="맨 위로" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 4h14M12 20V9M7 13l5-5 5 5" />
        </svg>
      </button>
    </nav>
  );
}
