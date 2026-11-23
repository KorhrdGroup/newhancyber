"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, useTransition, type FormEvent } from "react";
import { applyConsultation } from "@/app/consult/actions";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  currentTerm,
  consultTimeOptions,
  essentialCards,
  heroSlides,
  interestOptions,
  noticeTabs,
  phones,
  type HeroSlide,
  type NoticePost,
  type NoticeTabKey,
} from "@/components/home/homeData";
import PrivacyConsentPopup from "@/components/home/PrivacyConsentPopup";
import type { SiteBanner, SitePopup } from "@/lib/site";
import MainPopups from "./MainPopups";
import SampleSideMenu from "./SampleSideMenu";
import { NOTICE_ICONS } from "@/components/home/StatusBanners";
import { tabs as whyTabs } from "@/components/home/WhyChoose";
import "@/styles/hero.css";
import "@/styles/home-sample.css";

const IMG = "/resources/images";
const HERO_DELAY = 5000;

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

function PlayPause({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
      {playing ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4.5v15l12-7.5z" />}
    </svg>
  );
}

/* ---------- 1. 배너 (아래 ‹ 01 / 03 › · 진행 막대 · 멈춤) ---------- */

/** 시안 배너 그림: 소매·책 색을 배너 바탕색 계열로 바꾼 본 (원본은 운영 메인이 그대로 씀) */
const SAMPLE_HERO_ART: Record<HeroSlide["theme"], string> = {
  blue: `${IMG}/main/hero-art-01-sample.png`,
  green: `${IMG}/main/hero-art-02-sample.png`,
  purple: `${IMG}/main/hero-art-03-sample.png`,
};

/** 코드 배너(관리자 배너가 없을 때) — 그림은 시안 본으로 */
const CODE_SLIDES: HeroSlide[] = heroSlides.map((slide) => ({ ...slide, art: SAMPLE_HERO_ART[slide.theme] }));
const THEMES: HeroSlide["theme"][] = ["blue", "green", "purple"];

/**
 * 관리자 「메인 배너 관리」(site_banners) → 지금 배너 모양 (사용자 결정 11/23: 지금 모양 유지).
 * 제목 · 설명은 글자로, 설명 첫 줄은 윗줄 작은 문구, 올린 그림은 오른쪽 그림 자리, 바탕색은 순서대로 파랑 · 초록 · 보라.
 */
function bannerSlides(banners: SiteBanner[] | null): HeroSlide[] {
  if (!banners) return CODE_SLIDES;
  return banners.map((b, i) => ({
    theme: THEMES[i % THEMES.length],
    eyebrow: b.eyebrow ?? "",
    title: b.title,
    desc: b.desc,
    art: b.image,
    href: b.href ?? undefined,
  }));
}

function HeroSlideBody({ slide }: { slide: HeroSlide }) {
  return (
    <div className={`hb-slide hb-slide--${slide.theme}`}>
      <div className="hb-inner">
        <div className="hb-text">
          {slide.eyebrow && <p className="hb-eyebrow">{slide.eyebrow}</p>}
          <h2 className="hb-title">{slide.title}</h2>
          <p className="hb-desc">{slide.desc}</p>
          {slide.href && <span className="hb-more">자세히보기</span>}
        </div>
        <img src={slide.art} alt="" className="hb-art" />
      </div>
    </div>
  );
}

function SampleHero({ slides }: { slides: HeroSlide[] }) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const toggle = () => {
    if (!swiper) return;
    // pause/resume: 남은 시간을 기억해 막대가 멈춘 자리에서 이어 찬다
    if (playing) swiper.autoplay.pause();
    else swiper.autoplay.resume();
    setPlaying(!playing);
  };

  return (
    <section className="sh-hero">
      <Swiper
        className="sh-hero-swiper"
        modules={[Autoplay]}
        // 배너가 한 장이면(관리자 배너 1개) 넘김 · 반복 없이 그대로 — Swiper 반복은 2장 이상에서만 된다
        loop={slides.length > 1}
        autoplay={slides.length > 1 ? { delay: HERO_DELAY, disableOnInteraction: false } : false}
        onSwiper={setSwiper}
        onSlideChange={(s) => setIndex(s.realIndex)}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={`${i}-${slide.title}`}>
            {slide.href ? (
              <Link href={slide.href} className="sh-hero-link">
                <HeroSlideBody slide={slide} />
              </Link>
            ) : (
              <HeroSlideBody slide={slide} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {/* 아래 캐러셀 표시: ‹ 01 / 03 › · 자동 넘김 막대 · 멈춤 (한 장이면 숨김) */}
      <div className={`sh-hero-ctrl${playing ? "" : " is-paused"}`} hidden={slides.length < 2}>
        <button type="button" className="sh-hero-arrow" aria-label="이전 배너" onClick={() => swiper?.slidePrev()}>
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 3 5 8l5 5" />
          </svg>
        </button>
        <span className="sh-hero-count" aria-live="polite">
          <b>{String(index + 1).padStart(2, "0")}</b> / {String(slides.length).padStart(2, "0")}
        </span>
        <button type="button" className="sh-hero-arrow" aria-label="다음 배너" onClick={() => swiper?.slideNext()}>
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 3 5 5-5 5" />
          </svg>
        </button>
        {/* key 를 바꿔 넘어갈 때마다 막대가 처음부터 다시 찬다 */}
        <span className="sh-hero-bar">
          <i key={index} style={{ animationDuration: `${HERO_DELAY}ms` }} />
        </span>
        <button type="button" className="sh-hero-play" aria-label={playing ? "자동 넘김 멈춤" : "자동 넘김 시작"} onClick={toggle}>
          <PlayPause playing={playing} />
        </button>
      </div>
    </section>
  );
}

/* ---------- 2. 개강 일정 한 줄 ---------- */

const DEADLINE = new Date(currentTerm.applyDeadline).getTime();

const noopSubscribe = () => () => {};
/* 개강 줄 라인 아이콘 — 기존 메인 학사알림 줄과 같은 그림 · 굵기 */
function TermIcon({ name }: { name: keyof typeof NOTICE_ICONS }) {
  return (
    <svg className="sh-term-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {NOTICE_ICONS[name]}
    </svg>
  );
}

function ddayLabel() {
  const days = Math.ceil((DEADLINE - Date.now()) / 86400000);
  return days < 0 ? "마감" : days === 0 ? "D-day" : `D-${days}`;
}

function TermStrip() {
  // 서버 시각과 어긋나지 않게 화면에서만 계산 (서버 그림에는 빈칸)
  const dday = useSyncExternalStore(noopSubscribe, ddayLabel, () => null);
  // 마감이 지나면 '지금 모집 중' 대신 '모집 마감' (TODO: 다음 차수 정보가 오면 그 차수로 바꾼다)
  const closed = dday === "마감";

  return (
    <section className={`sh-term${closed ? " is-closed" : ""}`}>
      <p className="sh-term-eyebrow">
        <span className="sh-term-dot" aria-hidden="true" />
        {closed ? "모집 마감" : "지금 모집 중"}
      </p>
      <dl className="sh-term-list">
        <div>
          <dt>
            <TermIcon name="alarm" />
            모집
          </dt>
          <dd>{currentTerm.name}</dd>
        </div>
        <div>
          <dt>
            <TermIcon name="clipboard" />
            수강신청
          </dt>
          <dd>
            {currentTerm.applyPeriod}
            {/* 마감 뒤에는 앞의 '모집 마감'과 겹치므로 남은 날만 보인다 */}
            {dday && !closed && <em>{dday}</em>}
          </dd>
        </div>
        <div>
          <dt>
            <TermIcon name="pencil" />
            학습기간
          </dt>
          <dd>{currentTerm.studyPeriod}</dd>
        </div>
      </dl>
      <Link href="/course-registration/register" className="sh-term-go">
        {closed ? "다음 개강 보기" : "수강신청"} <Chevron />
      </Link>
    </section>
  );
}

/* ---------- 2-1. 바로가기 — 실습 신청 · 수강료 결제 (기존 메인처럼 늘 보이게) ---------- */

const actions = [
  {
    key: "practice",
    label: "실습반 모집",
    title: "사회복지사 실습 수강 신청",
    art: `${IMG}/main/banner-practice-illust.png`,
    href: "/course-registration/register",
  },
  {
    key: "pay",
    label: "장바구니에 담은 과목",
    title: "수강료 결제하기",
    art: `${IMG}/main/banner-pay-illust.png`,
    href: "/course-registration/cart",
  },
];

function QuickActions() {
  return (
    <section className="sh-action" aria-label="바로가기">
      {actions.map((a) => (
        <Link key={a.key} href={a.href} className={`sh-action-card sh-action-card--${a.key}`}>
          <span className="sh-action-text">
            <span className="sh-action-label">{a.label}</span>
            <span className="sh-action-title">
              {a.title}
              <Chevron />
            </span>
          </span>
          <img src={a.art} alt="" className="sh-action-art" />
        </Link>
      ))}
    </section>
  );
}

/* ---------- 3. 벤토 — 친구추천 넓게, 고객센터 번호 2칸, 모바일 가이드 세로 기둥 ---------- */

/* 두 번호 모두 같은 운영시간 — 나눠 쓰면 번호마다 시간이 다른 것처럼 읽혀 두 카드에 똑같이 넣는다 */
function CallHours() {
  return (
    <span className="sh-callcard-note">
      <span>평일 09:00 ~ 18:00</span>
      <span>
        <i>점심 12:00 ~ 13:00 ·</i> <i>주말/공휴일 휴무</i>
      </span>
    </span>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function Bento() {
  return (
    <section className="sh-bento" aria-label="한평생의 특별한 혜택">
      <Link href="/event" className="sh-benefit-card sh-tone--purple">
        <span className="sh-benefit-text">
          <span className="sh-benefit-label">추천한 나도, 추천받은 친구도</span>
          <span className="sh-benefit-title">친구추천 이벤트</span>
          <span className="sh-benefit-more">자세히 보기 →</span>
        </span>
        <img src={`${IMG}/main/event-friend-gift-soft.webp`} alt="" className="sh-benefit-art" />
      </Link>
      <a href={`tel:${phones.registration}`} className="sh-callcard">
        <span className="sh-callcard-head">
          <PhoneIcon />
          수강신청 · 학습상담
        </span>
        <b className="sh-callcard-num">{phones.registration}</b>
        <CallHours />
      </a>
      <a href={`tel:${phones.support}`} className="sh-callcard">
        <span className="sh-callcard-head">
          <PhoneIcon />
          학습지원 <small>시험오류 · 학습장애</small>
        </span>
        <b className="sh-callcard-num">{phones.support}</b>
        <CallHours />
      </a>
      {/* 폰: 카드가 좁아 시간을 카드마다 쓰면 빽빽해 두 번호 아래에 한 번만 */}
      <p className="sh-callhours">평일 09:00 ~ 18:00 · 점심 12:00 ~ 13:00 · 주말/공휴일 휴무</p>
      <Link href="/learning-support/mobile-guide" className="sh-guide">
        <span className="sh-guide-text">
          <span className="sh-guide-label">언제 어디서나</span>
          <span className="sh-guide-title">
            모바일{" "}
            <br />
            수강가이드
          </span>
        </span>
        <img src={`${IMG}/main/sample-guide-phone.png`} alt="" className="sh-guide-art" />
      </Link>
    </section>
  );
}

/* ---------- 4. 수강 혜택 · 학점은행제 안내 — 얇은 띠 ---------- */

const infoLinks = [
  {
    title: "수강 혜택",
    // 해시(#tab-)로 가면 탭 위치로 내려가 버려서, 맨 위부터 보이게 ?tab= 으로 장학제도 탭만 연다
    href: "/footer/about?tab=scholarship",
    icon: `${IMG}/credit-bank/cb-icon-coin-cycle.png`,
    // 이동하는 곳(교육원 소개 · 장학제도 탭)에 있는 내용만
    items: ["성적장학금", "국가유공자 전액면제", "기초생활수급자 50% 감면"],
  },
  {
    title: "학점은행제 안내",
    href: "/credit-bank/info",
    icon: `${IMG}/credit-bank/cb-icon-school.png`,
    // 이동하는 곳(학점은행제란)의 소제목
    items: ["학점은행제란?", "이용대상", "학점은행제 장점"],
  },
];

function InfoBar() {
  return (
    <section className="sh-infobar" aria-label="수강 혜택 · 학점은행제 안내">
      {infoLinks.map((info) => (
        <Link key={info.title} href={info.href} className="sh-infobar-item">
          <img src={info.icon} alt="" />
          <span className="sh-infobar-text">
            <span className="sh-infobar-title">{info.title}</span>
            <ul className="sh-infobar-list">
              {info.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </span>
          <Chevron />
        </Link>
      ))}
    </section>
  );
}

/* ---------- 5. 공지 탭 + 놓치기 쉬운 안내 ---------- */

/** 메인 공지 탭에 보일 글 — 메인(page.tsx)이 DB 에서 읽어 넘긴다. null 이면 DB 를 읽지 못한 것 */
export type MainBoardPosts = Record<NoticeTabKey, NoticePost[]> | null;

function Notices({ boardPosts }: { boardPosts: MainBoardPosts }) {
  const [active, setActive] = useState<NoticeTabKey>("notice");
  const tab = noticeTabs.find((t) => t.key === active) ?? noticeTabs[0];
  const posts = boardPosts?.[tab.key] ?? [];

  return (
    <section className="sh-notice-row">
      <div className="sh-notice">
        <div className="sh-notice-head">
          {/* 게시판 목록 위 세그먼트와 같은 모양: 회색 판 위 고른 칸만 흰 칸 */}
          <div className="sh-notice-seg" role="tablist" aria-label="게시판">
            {noticeTabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={t.key === active}
                className={`sh-notice-tab${t.key === active ? " is-active" : ""}`}
                onClick={() => setActive(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <Link href={tab.basePath} className="sh-notice-more">
            전체보기 <Chevron />
          </Link>
        </div>
        <ul className="sh-notice-list">
          {posts.length === 0 && (
            <li className="sh-notice-empty">{boardPosts ? "등록된 글이 없습니다." : "지금은 글을 불러올 수 없어요."}</li>
          )}
          {posts.slice(0, 5).map((post) => (
            <li key={post.id}>
              <Link href={`${tab.basePath}/${post.id}`}>
                {post.isNew && <span className="sh-notice-new">N</span>}
                <span className="sh-notice-text">{post.title}</span>
                <span className="sh-notice-date">{post.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="sh-promo">
        <h3 className="sh-sec-title">놓치기 쉬운 안내</h3>
        <div className="sh-promo-cards">
          <Link href="/learning-support/forms-data-room" className="sh-promo-card sh-tone--green">
            <span className="sh-promo-label">자격증 신청 전 꼭 확인!</span>
            <span className="sh-promo-title">
              사회복지사 자격증
              <br />
              신청 가이드
            </span>
            <img src={`${IMG}/credit-bank/cb-icon-license.png`} alt="" className="sh-promo-art" />
          </Link>
          <Link href="/practice-support/notice" className="sh-promo-card sh-tone--blue">
            <span className="sh-promo-label">실습 접수부터 진행까지</span>
            <span className="sh-promo-title">
              실습지원센터
              <br />
              바로가기
            </span>
            <img src={`${IMG}/pratice-support/pratice-support-02.png`} alt="" className="sh-promo-art sh-promo-art--wide" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- 7. 1:1 무료 학습상담 (학습설계 안내 + 간편상담 폼) ---------- */

/** PC(1280 이상)에서는 화면 아래에 떠 있는 바 — 닫고 여는 건 오른쪽 사이드 메뉴의 '간편상담' 버튼으로도 한다 */
function Consult({ closed, onClose }: { closed: boolean; onClose: () => void }) {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  // 관리자 「간편 상담 관리」(dbo.consultations)로 들어간다 — src/app/consult/actions.ts
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    startTransition(async () => {
      try {
        const result = await applyConsultation(data);
        alert(result.message);
        if (result.ok) form.reset();
        else if (result.field) (form.elements.namedItem(result.field) as HTMLElement | null)?.focus?.();
      } catch {
        alert("지금은 상담 신청을 받을 수 없어요. 잠시 뒤 다시 시도해 주세요.");
      }
    });
  };

  return (
    <section className={`sh-consult${closed ? " is-closed" : ""}`} aria-label="간편상담 신청">
      {/* 한 줄 띠 (유비온 참고): 왼쪽은 제목 + 동의 두 줄 — 두 줄 높이를 입력칸 높이(48)에 맞춰 위아래 선을 맞춘다 */}
      <div className="sh-consult-intro">
        <div>
          <div className="sh-consult-head">
            <h3 className="sh-consult-title">회원가입 없이 간편상담</h3>
            <Link href="/course-registration/learning-design" className="sh-consult-link">
              무료 학습설계 신청
            </Link>
          </div>
          {/* 폼 밖이라 form 속성으로 폼에 연결 */}
          <label className="sh-consult-agree">
            <input type="checkbox" name="privacy" form="sh-consult-form" required />
            개인정보 수집·이용 동의
            <button type="button" onClick={() => setPrivacyOpen(true)}>
              내용보기
            </button>
          </label>
        </div>
      </div>
      <form id="sh-consult-form" className="sh-consult-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="이름" aria-label="이름" required maxLength={50} />
        <input type="tel" name="phone" placeholder="연락처" aria-label="연락처 (숫자만)" required maxLength={13} />
        <select name="interest" aria-label="관심분야" required defaultValue="">
          <option value="" disabled>
            관심분야
          </option>
          {interestOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select name="time" aria-label="상담 희망 시간" required defaultValue="">
          <option value="" disabled>
            상담 시간
          </option>
          {consultTimeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {/* 자동 등록 프로그램 거르기 — 사람에게는 안 보이고 탭 이동에서도 빠진다 */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
          <label htmlFor="sh-extra">이 칸은 비워 두세요</label>
          <input type="text" id="sh-extra" name="sh-extra" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
        <button type="submit" className="sh-btn sh-btn--primary sh-consult-submit" disabled={pending}>
          {pending ? "신청 중…" : "상담 신청하기"}
        </button>
      </form>
      <button type="button" className="sh-consult-close" aria-label="간편상담 닫기" onClick={onClose}>
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="m3.5 3.5 9 9M12.5 3.5l-9 9" />
        </svg>
      </button>
      <PrivacyConsentPopup isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </section>
  );
}

/* ---------- 8. 꼭 확인하세요 ---------- */

function Essentials() {
  return (
    <section className="sh-essential">
      <div className="sh-essential-inner">
        <h3 className="sh-sec-title">수강 전 꼭 확인하세요!</h3>
        <ul className="sh-essential-grid">
          {essentialCards.map((card) => (
            <li key={card.alt}>
              <Link href={card.href} {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                <img src={`${IMG}/main/check/${card.icon}`} alt="" />
                <span>{card.label.replace("\n", " ")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 9. 맨 아래 띠 — 왜 한평생일까요 (기존 메인 탭 3개) ----------
   세 장점의 제목·요약은 늘 보이고, 고른 하나의 상세만 보여 준다 (휴대폰은 아코디언).
   PC에서는 세 상세를 한 칸에 겹쳐 두고 고른 것만 보여서, 탭을 바꿔도 높이가 그대로다 */
function WhyHanpyeong() {
  const [active, setActive] = useState(0);
  return (
    <section className="sh-why">
      <div className="sh-why-head">
        <h3 className="sh-why-title">왜 한평생원격교육원을 선택할까요?</h3>
      </div>
      <div className="sh-whyc">
        {whyTabs.map((tab, i) => {
          const open = i === active;
          return (
            <div key={tab.key} className={`sh-whyc-item${open ? " is-open" : ""}`}>
              <button
                type="button"
                className="sh-whyc-tab"
                aria-expanded={open}
                aria-controls={`sh-whyc-${tab.key}`}
                onClick={() => setActive(i)}
              >
                <span className="sh-whyc-label">{tab.label}</span>
                <span className="sh-whyc-summary">{tab.summary}</span>
              </button>
              <div
                id={`sh-whyc-${tab.key}`}
                className={`sh-whyc-panel${tab.compact ? " sh-whyc-panel--guide" : ""}${tab.cards.length === 2 ? " sh-whyc-panel--pair" : ""}${open ? " is-open" : ""}`}
              >
                <p className="sh-whyc-sub">{tab.subtitle}</p>
                {/* PC: 탭마다 배치를 달리한다 — 3개는 세로 카드 3칸, 2개는 큰 아이콘 가로 카드 2칸, 가이드 6개는 테두리만 있는 가로 칸 3칸 × 2줄 */}
                <ul
                  className="sh-why-items"
                  style={{ "--why-cols": Math.min(tab.cards.length, 3) } as React.CSSProperties}
                >
                  {tab.cards.map((card) => (
                    <li key={card.title}>
                      <img src={`${IMG}/main/support/${card.icon}`} alt="" />
                      <span>
                        <b>{card.short ?? card.title}</b>
                        {card.lines.map((line) => (
                          <small key={line}>{line}</small>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** 메인(/) — 메인 시안 B (첫 시안 배치 + 제목 탭 배너 · 모집 중 표시 · 페이지 안 무료 상담) */
export default function SampleHome({
  boardPosts,
  banners,
  popups,
}: {
  boardPosts: MainBoardPosts;
  /** 관리자 메인 배너 — null 이면 코드 배너 */
  banners: SiteBanner[] | null;
  /** 지금 띄울 팝업 (관리자 「팝업 관리」) */
  popups: SitePopup[];
}) {
  const [consultClosed, setConsultClosed] = useState(false);
  return (
    <main className="sh-main">
      <div className="sh-wrap">
        <SampleHero slides={bannerSlides(banners)} />
        <TermStrip />
        {/* 실습 신청 · 결제는 자주 찾는 길이라 넘김 없이 개강 줄 바로 아래 */}
        <QuickActions />
        <Bento />
        <Notices boardPosts={boardPosts} />
        {/* 수강 혜택 · 학점은행제는 공지 아래 줄로 */}
        <InfoBar />
        <Consult closed={consultClosed} onClose={() => setConsultClosed(true)} />
      </div>
      <Essentials />
      <WhyHanpyeong />
      <MainPopups popups={popups} />
      <SampleSideMenu consultOpen={!consultClosed} onToggleConsult={() => setConsultClosed((c) => !c)} />
    </main>
  );
}
