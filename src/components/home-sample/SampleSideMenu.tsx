"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TBD_HREF } from "@/lib/navigation";
import { phones } from "@/components/home/homeData";

/** 이 높이(px) 넘게 내리면 '스크롤됨' — 좁은 PC에서 배너를 가리지 않게 그 전엔 숨긴다 */
const SCROLL_THRESHOLD = 300;
/** 플로팅 위 끝: 스크롤하면 붙는 메뉴 줄 아래(100px). 머리글이 보이는 동안엔 머리글 밑에서 24px 띄운다 */
const FLOAT_TOP = 100;
const HEADER_GAP = 24;

/** 라인 아이콘 (24 그리드, currentColor) */
const ICONS = {
  plan: (
    <>
      <path d="M9 4h6v3H9z" />
      <path d="M15 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
      <path d="M9 12h6M9 16h4" />
    </>
  ),
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

/** 상담 묶음 맨 아래 SNS — 인스타 · 블로그는 기존 사이트와 같은 주소, 유튜브는 추후 전달 예정 */
const SNS_LINKS = [
  { label: "인스타", icon: "/resources/images/main/insta.png", href: "https://www.instagram.com/hpsedu_official" },
  { label: "블로그", icon: "/resources/images/main/naver-blog.png", href: "https://blog.naver.com/korhrdgroup" },
  { label: "유튜브", icon: "/resources/images/main/youtube.png", href: null },
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
 * 양쪽 다 '파란 머리 칸 + 흰 카드'를 세로로 쌓는 같은 모양.
 * 왼쪽: QUICK MENU(바로가기 7개). 오른쪽: 상담 묶음 — 전화 + 카톡상담 · 학습설계 · 간편상담 · SNS.
 * TOP 버튼은 따로 화면 오른쪽 아래.
 * '간편상담'은 아래 간편상담 바를 열고 닫는다.
 */
export default function SampleSideMenu({ consultOpen, onToggleConsult }: { consultOpen: boolean; onToggleConsult: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [top, setTop] = useState(FLOAT_TOP);
  /** 퀵메뉴 바로가기 목록: 처음엔 펼쳐 두고, 머리 칸을 누르면 접고 편다 */
  const [quickOpen, setQuickOpen] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      const headerBottom = document.querySelector("header.header")?.getBoundingClientRect().bottom ?? 0;
      setTop(Math.max(FLOAT_TOP, Math.round(headerBottom + HEADER_GAP)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stateClass = scrolled ? " is-scrolled" : "";

  return (
    <>
    <nav className={`sh-quick${stateClass}`} style={{ top }} aria-label="퀵메뉴">
      <button
        type="button"
        className={`sh-quick-head${quickOpen ? " is-open" : ""}`}
        aria-expanded={quickOpen}
        aria-controls="sh-quick-list"
        onClick={() => setQuickOpen((open) => !open)}
      >
        <span className="sh-side-sub">자주 찾는 메뉴</span>
        <span className="sh-quick-title">QUICK MENU</span>
        <span className="sh-quick-handle">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 15 6-6 6 6" />
          </svg>
        </span>
      </button>
      <ul id="sh-quick-list" className="sh-quick-list" hidden={!quickOpen}>
        {QUICK_LINKS.map((link) => (
          <li key={link.label}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
    <nav className={`sh-side${stateClass}`} style={{ top }} aria-label="빠른 상담">
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
      {/* 번호 아래 두 칸은 같은 모양: 아이콘 + 작은 설명 + 이름 */}
      <Link href="/course-registration/learning-design" className="sh-side-item">
        <SideIcon name="plan" />
        <span className="sh-side-text">
          <span className="sh-side-sub">1:1 무료</span>
          <span className="sh-side-name">학습설계 신청</span>
        </span>
      </Link>
      <button type="button" className={`sh-side-item${consultOpen ? " is-active" : ""}`} aria-pressed={consultOpen} onClick={onToggleConsult}>
        <SideIcon name="chat" />
        <span className="sh-side-text">
          <span className="sh-side-sub">회원가입 없이</span>
          <span className="sh-side-name">간편상담</span>
        </span>
      </button>
      <ul className="sh-side-sns">
        {SNS_LINKS.map((sns) => (
          <li key={sns.label}>
            {/* 기존 사이트처럼 새 창으로 */}
            <a href={sns.href ?? TBD_HREF} {...(sns.href ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              <img src={sns.icon} alt="" />
              {sns.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
    {/* 맨 위로: 상담 묶음에서 떼어 화면 오른쪽 아래에 */}
    <button
      type="button"
      className={`sh-top${stateClass}${consultOpen ? " is-consult-open" : ""}`}
      aria-label="맨 위로"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 4h14M12 20V9M7 13l5-5 5 5" />
      </svg>
    </button>
    </>
  );
}
