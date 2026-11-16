"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  currentTerm,
  essentialCards,
  heroSlides,
  interestOptions,
  noticeTabs,
  phones,
  type HeroSlide,
  type NoticeTabKey,
} from "@/components/home/homeData";
import PrivacyConsentPopup from "@/components/home/PrivacyConsentPopup";
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

/* ---------- 1. 배너 (아래 제목 탭 + 진행 막대) ---------- */

function HeroSlideBody({ slide }: { slide: HeroSlide }) {
  return (
    <div className={`hb-slide hb-slide--${slide.theme}`}>
      <div className="hb-inner">
        <div className="hb-text">
          <p className="hb-eyebrow">{slide.eyebrow}</p>
          <h2 className="hb-title">{slide.title}</h2>
          <p className="hb-desc">{slide.desc}</p>
          {slide.href && <span className="hb-more">자세히보기</span>}
        </div>
        <img src={slide.art} alt="" className="hb-art" />
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
    if (playing) swiper.autoplay.stop();
    else swiper.autoplay.start();
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
      <div className={`sh-hero-tabs${playing ? "" : " is-paused"}`} role="tablist" aria-label="배너 고르기">
        {heroSlides.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={`sh-hero-tab${i === index ? " is-active" : ""}`}
            onClick={() => swiper?.slideToLoop(i)}
          >
            <span className="sh-hero-tab-name">{slide.title}</span>
            {/* key 를 바꿔 넘어갈 때마다 막대가 처음부터 다시 찬다 */}
            <span className="sh-hero-bar">{i === index && <i key={`${index}-${playing}`} style={{ animationDuration: `${HERO_DELAY}ms` }} />}</span>
          </button>
        ))}
        <button type="button" className="sh-hero-play" aria-label={playing ? "자동 넘김 멈춤" : "자동 넘김 시작"} onClick={toggle}>
          <PlayPause playing={playing} />
        </button>
      </div>
    </section>
  );
}

/* ---------- 2. 개강 카드 (배너 오른쪽에 세로로) ---------- */

const DEADLINE = new Date(currentTerm.applyDeadline).getTime();
const applyEnd = currentTerm.applyPeriod.split("~")[1].trim();
const noopSubscribe = () => () => {};
function ddayLabel() {
  const days = Math.ceil((DEADLINE - Date.now()) / 86400000);
  return days < 0 ? "마감" : days === 0 ? "D-day" : `D-${days}`;
}

function TermCard() {
  // 서버 시각과 어긋나지 않게 화면에서만 계산 (서버 그림에는 빈칸)
  const dday = useSyncExternalStore(noopSubscribe, ddayLabel, () => null);

  return (
    <aside className="sh-term">
      <p className="sh-term-eyebrow">
        <span className="sh-term-dot" aria-hidden="true" />
        지금 모집 중
      </p>
      <h3 className="sh-term-name">{currentTerm.name}</h3>
      <dl className="sh-term-list">
        <div>
          <dt>수강신청 마감</dt>
          <dd>
            {applyEnd}
            {dday && <em className={dday === "마감" ? "is-closed" : undefined}>{dday}</em>}
          </dd>
        </div>
        <div>
          <dt>개강일</dt>
          <dd>{currentTerm.openingDate}</dd>
        </div>
        <div>
          <dt>학습기간</dt>
          <dd>{currentTerm.studyPeriod}</dd>
        </div>
      </dl>
      <div className="sh-term-actions">
        <Link href="/course-registration/register" className="sh-btn sh-btn--primary">
          수강신청 <Chevron />
        </Link>
        <Link href="/learning-support/schedule" className="sh-btn">
          학사일정
        </Link>
      </div>
    </aside>
  );
}

/* ---------- 3. 바로가기 카드 4장 (연한 바탕) ---------- */

const quickCards = [
  { tone: "purple", label: "추천한 나도, 받은 친구도", title: "친구추천 이벤트", art: `${IMG}/main/event-friend-gift.webp`, href: "/event" },
  { tone: "blue", label: "실습반 모집", title: "사회복지사 실습 신청", art: `${IMG}/main/banner-practice-illust.png`, href: "/course-registration/register" },
  { tone: "green", label: "장바구니에 담은 과목", title: "수강료 결제하기", art: `${IMG}/main/banner-pay-illust.png`, href: "/course-registration/cart" },
  { tone: "navy", label: "언제 어디서나", title: "모바일 수강 가이드", art: `${IMG}/main/sample-guide-phone.png`, href: "/learning-support/mobile-guide" },
];

function QuickCards() {
  return (
    <section className="sh-quick" aria-label="바로가기">
      {quickCards.map((c) => (
        <Link key={c.title} href={c.href} className={`sh-quick-card sh-quick--${c.tone}`}>
          <span className="sh-quick-label">{c.label}</span>
          <span className="sh-quick-title">
            {c.title} <Chevron />
          </span>
          <img src={c.art} alt="" className="sh-quick-art" />
        </Link>
      ))}
    </section>
  );
}

/* ---------- 4. 공지 탭 + 고객센터 ---------- */

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
      <div className="sh-call">
        <h3 className="sh-call-title">고객센터</h3>
        <dl className="sh-call-list">
          <div>
            <dt>수강신청 · 학습상담</dt>
            <dd>
              <a href={`tel:${phones.registration}`}>{phones.registration}</a>
            </dd>
          </div>
          <div>
            <dt>학습지원 (시험오류 · 학습장애)</dt>
            <dd>
              <a href={`tel:${phones.support}`}>{phones.support}</a>
            </dd>
          </div>
        </dl>
        <p className="sh-call-hours">
          평일 09:00 ~ 18:00 · 점심 12:00 ~ 13:00
          <br />
          주말 · 공휴일 휴무
        </p>
        <Link href="/learning-support/remote-support" className="sh-btn sh-call-remote">
          원격지원 받기 <Chevron />
        </Link>
      </div>
    </section>
  );
}

/* ---------- 5. 왜 한평생일까요 (기존 메인 탭 3개 → 탭 없이 세 칸에 모두 펼침) ---------- */

function WhyHanpyeong() {
  return (
    <section className="sh-why">
      <div className="sh-why-head">
        <p className="sh-why-eyebrow">WHY 한평생원격교육원</p>
        <h3 className="sh-why-title">왜 한평생원격교육원을 선택할까요?</h3>
      </div>
      <div className="sh-why-grid">
        {whyTabs.map((tab, i) => (
          <article key={tab.key} className={`sh-why-card${tab.compact ? " sh-why-card--guide" : ""}`}>
            <span className="sh-why-num">{String(i + 1).padStart(2, "0")}</span>
            <h4 className="sh-why-label">{tab.label}</h4>
            <p className="sh-why-sub">{tab.subtitle}</p>
            <ul className="sh-why-items">
              {tab.cards.map((card) => (
                <li key={card.title}>
                  <img src={`${IMG}/main/support/${card.icon}`} alt="" />
                  <span>
                    <b>{card.title}</b>
                    {card.lines.map((line) => (
                      <small key={line}>{line}</small>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
            <p className="sh-why-summary">{tab.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- 6. 1:1 무료 학습상담 (학습설계 안내 + 간편상담 폼) ---------- */

function Consult() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 상담 신청 API 연동 (new FormData(e.currentTarget))
    alert("상담 신청 API 연동 전입니다.");
  };

  return (
    <section className="sh-consult">
      <div className="sh-consult-intro">
        <p className="sh-consult-eyebrow">1:1 무료 학습상담</p>
        <h3 className="sh-consult-title">
          학점은행제, 어디서부터
          <br />
          시작할지 막막하다면?
        </h3>
        <p className="sh-consult-desc">학습설계 담당자가 내 학력과 목표에 맞는 학습 계획을 무료로 세워 드려요.</p>
        <div className="sh-consult-links">
          <Link href="/course-registration/learning-design" className="sh-btn sh-btn--primary">
            무료 학습설계 신청 <Chevron />
          </Link>
          <a href={`tel:${phones.registration}`} className="sh-consult-phone">
            전화 상담 <b>{phones.registration}</b>
          </a>
        </div>
        <img src={`${IMG}/credit-bank/cb-icon-chat-person.png`} alt="" className="sh-consult-art" />
      </div>
      <form className="sh-consult-form" onSubmit={handleSubmit}>
        <p className="sh-consult-form-title">
          회원가입 없이 <em>간편상담</em> 신청
        </p>
        <input type="text" name="name" placeholder="이름" aria-label="이름" required />
        <input type="tel" name="phone" placeholder="연락처 ('-' 없이)" aria-label="연락처" required />
        <select name="interest" aria-label="관심분야" required defaultValue="">
          <option value="" disabled>
            관심분야 선택
          </option>
          {interestOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <label className="sh-consult-agree">
          <input type="checkbox" name="privacy" required />
          개인정보 수집·이용 동의
          <button type="button" onClick={() => setPrivacyOpen(true)}>
            내용보기
          </button>
        </label>
        <button type="submit" className="sh-btn sh-btn--primary sh-consult-submit">
          상담 신청하기
        </button>
      </form>
      <PrivacyConsentPopup isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </section>
  );
}

/* ---------- 7. 꼭 확인하세요 ---------- */

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

/** /sample — 메인 시안 B (배너 + 개강 카드 · 바로가기 4장 · 공지/고객센터 · 왜 한평생 · 무료 상담 · 꼭 확인) */
export default function SampleHome() {
  return (
    <main className="sh-main">
      <div className="sh-wrap">
        <div className="sh-top">
          <SampleHero />
          <TermCard />
        </div>
        <QuickCards />
        <Notices />
        <WhyHanpyeong />
        <Consult />
      </div>
      <Essentials />
    </main>
  );
}
