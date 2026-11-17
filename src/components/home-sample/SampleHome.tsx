"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, type FormEvent } from "react";
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
  type NoticeTabKey,
} from "@/components/home/homeData";
import PrivacyConsentPopup from "@/components/home/PrivacyConsentPopup";
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

function HeroSlideBody({ slide }: { slide: HeroSlide }) {
  return (
    <div className={`hb-slide hb-slide--${slide.theme}`}>
      <div className="hb-inner">
        <div className="hb-text">
          <p className="hb-eyebrow">{slide.eyebrow}</p>
          <h2 className="hb-title">
            {/* 흰 제목 + 노란 형광펜 밑줄 */}
            <span className="sh-hero-mark">{slide.title}</span>
          </h2>
          <p className="hb-desc">{slide.desc}</p>
          {slide.href && <span className="hb-more">자세히보기</span>}
        </div>
        <img src={SAMPLE_HERO_ART[slide.theme]} alt="" className="hb-art" />
      </div>
    </div>
  );
}

function SampleHero() {
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
        loop
        autoplay={{ delay: HERO_DELAY, disableOnInteraction: false }}
        onSwiper={setSwiper}
        onSlideChange={(s) => setIndex(s.realIndex)}
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.title}>
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
      {/* 아래 캐러셀 표시: ‹ 01 / 03 › · 자동 넘김 막대 · 멈춤 */}
      <div className={`sh-hero-ctrl${playing ? "" : " is-paused"}`}>
        <button type="button" className="sh-hero-arrow" aria-label="이전 배너" onClick={() => swiper?.slidePrev()}>
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 3 5 8l5 5" />
          </svg>
        </button>
        <span className="sh-hero-count" aria-live="polite">
          <b>{String(index + 1).padStart(2, "0")}</b> / {String(heroSlides.length).padStart(2, "0")}
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
        <img src={`${IMG}/main/event-friend-gift.webp`} alt="" className="sh-benefit-art" />
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
            모바일로{" "}
            <br />
            수강하는 법
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
    href: "/footer/about#tab-scholarship",
    icon: `${IMG}/credit-bank/cb-icon-coin-cycle.png`,
    items: ["교육원 장학제도", "카드사 무이자 할부"],
  },
  {
    title: "학점은행제 안내",
    href: "/credit-bank/info",
    icon: `${IMG}/credit-bank/cb-icon-school.png`,
    items: ["학점은행제란?", "학위 · 자격증 취득 과정", "교육부 평가인정 기관"],
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

function Notices() {
  const [active, setActive] = useState<NoticeTabKey>("notice");
  const tab = noticeTabs.find((t) => t.key === active) ?? noticeTabs[0];

  return (
    <section className="sh-notice-row">
      <div className="sh-notice">
        <div className="sh-notice-head" role="tablist">
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
          <Link href={tab.basePath} className="sh-notice-more">
            전체보기 <Chevron />
          </Link>
        </div>
        <ul className="sh-notice-list">
          {tab.posts.slice(0, 5).map((post) => (
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

function Consult() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 상담 신청 API 연동 (new FormData(e.currentTarget))
    alert("상담 신청 API 연동 전입니다.");
  };

  return (
    <section className="sh-consult">
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
        <input type="text" name="name" placeholder="이름" aria-label="이름" required />
        <input type="tel" name="phone" placeholder="연락처" aria-label="연락처 (숫자만)" required />
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
        <button type="submit" className="sh-btn sh-btn--primary sh-consult-submit">
          상담 신청하기
        </button>
      </form>
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

/** /sample — 메인 시안 B (첫 시안 배치 + 제목 탭 배너 · 모집 중 표시 · 페이지 안 무료 상담) */
export default function SampleHome() {
  return (
    <main className="sh-main">
      <div className="sh-wrap">
        <SampleHero />
        <TermStrip />
        {/* 실습 신청 · 결제는 자주 찾는 길이라 넘김 없이 개강 줄 바로 아래 */}
        <QuickActions />
        <Bento />
        <InfoBar />
        <Notices />
        <Consult />
      </div>
      <Essentials />
      <WhyHanpyeong />
    </main>
  );
}
