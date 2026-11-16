"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
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

/* ---------- 1. 띄운 배너 (번호 · 이전/다음 · 재생/멈춤) ---------- */

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

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === "prev" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} />
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
        autoplay={{ delay: 5000, disableOnInteraction: false }}
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
      <button type="button" className="sh-hero-arrow sh-hero-arrow--prev" aria-label="이전 배너" onClick={() => swiper?.slidePrev()}>
        <Chevron dir="prev" />
      </button>
      <button type="button" className="sh-hero-arrow sh-hero-arrow--next" aria-label="다음 배너" onClick={() => swiper?.slideNext()}>
        <Chevron dir="next" />
      </button>
      <div className="sh-hero-ctrl">
        <span className="sh-hero-count">
          <b>{index + 1}</b> / {heroSlides.length}
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
const applyEnd = currentTerm.applyPeriod.split("~")[1].trim();

const noopSubscribe = () => () => {};
function ddayLabel() {
  const days = Math.ceil((DEADLINE - Date.now()) / 86400000);
  return days < 0 ? "마감" : days === 0 ? "D-day" : `D-${days}`;
}

function TermStrip() {
  // 서버 시각과 어긋나지 않게 화면에서만 계산 (서버 그림에는 빈칸)
  const dday = useSyncExternalStore(noopSubscribe, ddayLabel, () => null);

  return (
    <section className="sh-term">
      <span className="sh-term-badge">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 2M5 3 2 6M22 6l-3-3" />
        </svg>
        개강일정 안내
      </span>
      <dl className="sh-term-list">
        <div>
          <dt>모집</dt>
          <dd>{currentTerm.name}</dd>
        </div>
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
      <Link href="/course-registration/register" className="sh-term-go">
        수강신청 <Chevron dir="next" />
      </Link>
    </section>
  );
}

/* ---------- 3. 특별한 혜택 (배너 넘김) + 모바일 학습가이드 ---------- */

const benefits = [
  {
    tone: "purple",
    label: "추천한 나도, 추천받은 친구도",
    title: "친구추천 이벤트",
    art: `${IMG}/main/event-friend-gift.webp`,
    href: "/event",
  },
  {
    tone: "blue",
    label: "실습반 모집",
    title: "사회복지사 실습 수강 신청",
    art: `${IMG}/main/banner-practice-illust.png`,
    href: "/course-registration/register",
  },
  {
    tone: "green",
    label: "장바구니에 담은 과목",
    title: "수강료 결제하기",
    art: `${IMG}/main/banner-pay-illust.png`,
    href: "/course-registration/cart",
  },
];

function Benefits() {
  return (
    <section className="sh-sec" aria-label="한평생의 특별한 혜택">
      <div className="sh-benefit">
        <Swiper
          className="sh-benefit-swiper"
          modules={[Autoplay, Pagination]}
          loop
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
        >
          {benefits.map((b) => (
            <SwiperSlide key={b.title}>
              <Link href={b.href} className={`sh-benefit-card sh-tone--${b.tone}`}>
                <span className="sh-benefit-text">
                  <span className="sh-benefit-label">{b.label}</span>
                  <span className="sh-benefit-title">{b.title}</span>
                  <span className="sh-benefit-more">자세히 보기 →</span>
                </span>
                <img src={b.art} alt="" className="sh-benefit-art" />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
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
      </div>
    </section>
  );
}

/* ---------- 4. 띠 배너 ---------- */

function DesignStrip() {
  return (
    <Link href="/course-registration/learning-design" className="sh-strip">
      <img src={`${IMG}/credit-bank/cb-icon-chat-person.png`} alt="" className="sh-strip-icon" />
      <span className="sh-strip-text">
        학점은행제, 어디서부터 시작할지 막막하다면?
        <br />
        <b>전문가가 무료로 나에게 맞는 학습 계획을 세워 드려요</b>
      </span>
      <span className="sh-strip-btn">
        무료 학습설계 신청 <Chevron dir="next" />
      </span>
    </Link>
  );
}

/* ---------- 5. 고객센터 · 혜택 · 학점은행 카드 ---------- */

function InfoCards() {
  return (
    <section className="sh-info">
      <div className="sh-info-card sh-info-card--call">
        <h3 className="sh-info-title">고객센터 대표번호</h3>
        <dl className="sh-call">
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
          <b>평일 09:00 ~ 18:00</b>
          <span>점심 12:00 ~ 13:00 · 주말/공휴일 휴무</span>
        </p>
      </div>
      <Link href="/footer/about#tab-scholarship" className="sh-info-card">
        <h3 className="sh-info-title">수강 혜택</h3>
        <ul className="sh-info-list">
          <li>교육원 장학제도</li>
          <li>친구추천 이벤트</li>
          <li>카드사 무이자 할부</li>
        </ul>
        <img src={`${IMG}/credit-bank/cb-icon-coin-cycle.png`} alt="" className="sh-info-art" />
      </Link>
      <Link href="/credit-bank/info" className="sh-info-card">
        <h3 className="sh-info-title">학점은행제 안내</h3>
        <ul className="sh-info-list">
          <li>학점은행제란?</li>
          <li>학위 · 자격증 취득 과정</li>
          <li>교육부 평가인정 기관</li>
        </ul>
        <img src={`${IMG}/credit-bank/cb-icon-school.png`} alt="" className="sh-info-art" />
      </Link>
    </section>
  );
}

/* ---------- 6. 공지 탭 + 알려드립니다 ---------- */

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
            + 더보기
          </Link>
        </div>
        <ul className="sh-notice-list">
          {tab.posts.slice(0, 5).map((post) => (
            <li key={post.id}>
              <Link href={`${tab.basePath}/${post.id}`}>
                <span className={`sh-notice-badge${post.isNew ? " is-new" : ""}`}>{post.isNew ? "NEW" : tab.label.slice(0, 2)}</span>
                <span className="sh-notice-text">{post.title}</span>
                <span className="sh-notice-date">{post.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="sh-promo">
        <h3 className="sh-sec-title">한평생에서 알려드립니다</h3>
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
            <img src={`${IMG}/pratice-support/pratice-support-02.png`} alt="" className="sh-promo-art" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- 6-1. 왜 한평생일까요 (기존 메인 탭 3개 → 탭 없이 세 칸에 모두 펼침) ---------- */

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

/* ---------- 8. 아래 고정 간편상담 줄 (PC) ---------- */

function ConsultBar() {
  const [open, setOpen] = useState(true);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 상담 신청 API 연동 (new FormData(e.currentTarget))
    alert("상담 신청 API 연동 전입니다.");
  };

  if (!open) return null;

  return (
    <div className="sh-consult">
      <form className="sh-consult-inner" onSubmit={handleSubmit}>
        <div className="sh-consult-head">
          <strong>
            가입 없는 <em>간편상담</em> 신청
          </strong>
          <label className="sh-consult-agree">
            <input type="checkbox" name="privacy" required />
            개인정보 수집·이용 동의
            <button type="button" onClick={() => setPrivacyOpen(true)}>
              내용보기
            </button>
          </label>
        </div>
        <input type="text" name="name" placeholder="이름" aria-label="이름" required />
        <input type="tel" name="phone" placeholder="연락처 ('-' 없이)" aria-label="연락처" required />
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
        <button type="submit" className="sh-consult-submit">
          상담 신청하기
        </button>
        <button type="button" className="sh-consult-close" aria-label="간편상담 닫기" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </form>
      <PrivacyConsentPopup isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}

/** /sample — 메인 시안 B (띄운 배너 · 개강 줄 · 혜택 넘김 · 카드형 정보 · 아래 고정 상담) */
export default function SampleHome() {
  return (
    <>
      <main className="sh-main">
        <div className="sh-wrap">
          <SampleHero />
          <TermStrip />
          <Benefits />
          <DesignStrip />
          <InfoCards />
          <Notices />
          <WhyHanpyeong />
        </div>
        <Essentials />
      </main>
      <ConsultBar />
    </>
  );
}
