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
};

/** 왼쪽 퀵메뉴 바로가기 */
const QUICK_LINKS = [
  { label: "수강신청", href: "/course-registration/register" },
  { label: "장바구니", href: "/course-registration/cart" },
  { label: "원격지원", href: "/learning-support/remote-support" },
  { label: "증명서 발급", href: "/my-page/certificates" },
  { label: "공지사항", href: "/learning-support/notice" },
  { label: "학사일정", href: "/learning-support/schedule" },
  { label: "자료실", href: "/learning-support/forms-data-room" },
];

/** 퀵메뉴 아래 SNS — 채널 주소는 추후 전달 예정 */
const QUICK_SNS = [
  { label: "인스타", icon: "/resources/images/main/insta.png" },
  { label: "블로그", icon: "/resources/images/main/naver-blog.png" },
  { label: "카톡상담", icon: "/resources/images/main/kakaotalkFloting.png", kakao: true },
  { label: "유튜브", icon: "/resources/images/main/youtube.png" },
];

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
 * 좌우 사이드 플로팅 (PC 1280 이상, 시안 전용).
 * 왼쪽: QUICK MENU(바로가기 7개 + SNS). 오른쪽: 상담 묶음 — 전화 + 카톡상담 · 학습설계 · 간편상담 · TOP.
 * '간편상담'은 아래 간편상담 바를 열고 닫는다.
 */
export default function SampleSideMenu({ consultOpen, onToggleConsult }: { consultOpen: boolean; onToggleConsult: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stateClass = `${scrolled ? " is-scrolled" : ""}${consultOpen ? " is-consult-open" : ""}`;

  return (
    <>
    <nav className={`sh-quick${stateClass}`} aria-label="퀵메뉴">
      <p className="sh-quick-head">QUICK MENU</p>
      <ul className="sh-quick-list">
        {QUICK_LINKS.map((link) => (
          <li key={link.label}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
      <ul className="sh-quick-sns">
        {QUICK_SNS.map((sns) => (
          <li key={sns.label}>
            <a href={TBD_HREF}>
              <img src={sns.icon} alt="" className={"kakao" in sns ? "sh-quick-kakao" : undefined} />
              {sns.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
    <nav className={`sh-side${stateClass}`} aria-label="빠른 상담">
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
      <button type="button" className="sh-side-top" aria-label="맨 위로" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 4h14M12 20V9M7 13l5-5 5 5" />
        </svg>
      </button>
    </nav>
    </>
  );
}
