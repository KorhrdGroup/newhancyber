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

/* ---------- 1. 배너 (아래 제목 탭 + 진행 막대 — 번호·화살표 대신) ---------- */

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
          <h2 className="hb-title">{slide.title}</h2>
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
      <p className="sh-term-eyebrow">
        <span className="sh-term-dot" aria-hidden="true" />
        지금 모집 중
      </p>
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
        수강신청 <Chevron />
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

/* ---------- 4. 고객센터 · 혜택 · 학점은행 카드 ---------- */

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

/* ---------- 5. 공지 탭 + 알려드립니다 ---------- */

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

/* ---------- 6. 왜 한평생일까요 (기존 메인 탭 3개) ----------
   세 장점의 제목·요약은 늘 보이고, 고른 하나의 상세만 보여 준다 (휴대폰은 아코디언).
   PC에서는 세 상세를 한 칸에 겹쳐 두고 고른 것만 보여서, 탭을 바꿔도 높이가 그대로다 */
function WhyHanpyeong() {
  const [active, setActive] = useState(0);
  return (
    <section className="sh-why">
      <div className="sh-why-head">
        <p className="sh-why-eyebrow">WHY 한평생원격교육원</p>
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
                className={`sh-whyc-panel${tab.compact ? " sh-whyc-panel--guide" : ""}${open ? " is-open" : ""}`}
              >
                <p className="sh-whyc-sub">{tab.subtitle}</p>
                {/* PC: 항목 수만큼 칸을 나눠 판을 꽉 채운다 (3개 → 3칸, 2개 → 2칸, 6개 → 3칸 두 줄) */}
                <ul
                  className="sh-why-items"
                  style={{ "--why-cols": Math.min(tab.cards.length, 3) } as React.CSSProperties}
                >
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
              </div>
            </div>
          );
        })}
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

/* ---------- 9. 맨 아래 신뢰 띠 (월계수 + 기관 이름) ---------- */

/** 월계수 한쪽 가지 — 호를 따라 잎 두 장씩. flip 이면 좌우를 뒤집어 오른쪽 가지 */
function Laurel({ flip = false }: { flip?: boolean }) {
  const cx = 76;
  const cy = 66;
  const r = 58;
  const at = (deg: number) => {
    const t = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(t), cy + r * Math.sin(t)] as const;
  };
  const leaves = [];
  for (let i = 0; i < 11; i++) {
    const deg = 106 + i * 14.6;
    const [x, y] = at(deg);
    // 가지를 따라 아래에서 위로 올라가는 방향(접선) 기준으로 바깥 · 안쪽에 한 장씩, 위로 갈수록 조금 크게
    for (const side of [-34, 30]) {
      leaves.push(
        <path
          key={`${i}${side}`}
          d="M0 0C5.5-5 5.5-14 0-20C-5.5-14-5.5-5 0 0Z"
          transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(deg + 180 + side).toFixed(1)}) scale(${(0.72 + i * 0.03).toFixed(2)})`}
        />,
      );
    }
  }
  const [sx, sy] = at(102);
  const [ex, ey] = at(254);
  const id = `sh-laurel-${flip ? "r" : "l"}`;
  return (
    <svg className={`sh-trust-laurel${flip ? " is-right" : ""}`} viewBox="0 0 72 136" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#8db4ff" />
          <stop offset="0.55" stopColor="#dce8ff" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <path
        d={`M${sx.toFixed(1)} ${sy.toFixed(1)}A${r} ${r} 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <g fill={`url(#${id})`}>{leaves}</g>
      <path className="sh-trust-spark" d="M50 4l2.2 5.3 5.3 2.2-5.3 2.2-2.2 5.3-2.2-5.3-5.3-2.2 5.3-2.2z" />
    </svg>
  );
}

function TrustBand() {
  return (
    <section className="sh-trust" aria-label="한평생원격교육원">
      <div className="sh-trust-inner">
        <Laurel />
        <div className="sh-trust-text">
          <p className="sh-trust-sub">한평생만이 가진 교육 노하우, 신뢰할 수 있는 교육기관</p>
          <p className="sh-trust-name">한평생원격교육원</p>
        </div>
        <Laurel flip />
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
        <Benefits />
        <InfoCards />
        <Notices />
        <WhyHanpyeong />
        <Consult />
      </div>
      <Essentials />
      <TrustBand />
    </main>
  );
}
