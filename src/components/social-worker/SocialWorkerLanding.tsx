import type { CSSProperties, ReactNode } from "react";
import "@/styles/social-worker-landing.css";

const IMG = "/resources/images/social-worker/info";

/** 차트 위 글자 위치: PC(1080 기준) x·y 와 모바일(480 기준) x·y — Figma 좌표 그대로 */
function at(x: number, y: number, mx: number, my: number): CSSProperties {
  return { "--x": x, "--y": y, "--mx": mx, "--my": my } as CSSProperties;
}

function NumBadge({ n }: { n: number }) {
  return <span className="swl-num">{n}</span>;
}

function Mint({ children }: { children: ReactNode }) {
  return <span className="swl-mint">{children}</span>;
}

const industryValues = [
  { v: "78.1", ...{ x: 0, y: 148, mx: 0, my: 98.48 } },
  { v: "97.2", x: 58.5, y: 140, mx: 36.16, my: 93.54 },
  { v: "97.2", x: 116.5, y: 140, mx: 72.01, my: 93.54 },
  { v: "100.2", x: 169.5, y: 126, mx: 104.77, my: 84.88 },
  { v: "138.1", x: 227.5, y: 116, mx: 140.62, my: 78.7 },
  { v: "164.9", x: 282.5, y: 102, mx: 174.62, my: 70.05 },
  { v: "195.1", x: 341.5, y: 79, mx: 211.09, my: 55.83 },
  { v: "321.5", x: 396.5, y: 42, mx: 245.09, my: 32.96 },
  { v: "345.5", x: 451.5, y: 19, mx: 279.08, my: 18.74 },
  { v: "385.9", x: 508.5, y: 0, mx: 308.32, my: 0, strong: true },
];

const industries = [
  ["전문 과학 및", "기술 서비스업"],
  ["공공행정", "국방 및 사회", "보장 행정"],
  ["전문", "서비스업"],
  ["도매 및", "상품중개업"],
  ["출판업"],
  ["사업 지원", "서비스업"],
  ["육상운송 및", "파이프라인", "운송업"],
  ["보건업"],
  ["음식 및", "주점업"],
  ["사회복지", "서비스업"],
];

const facilities = ["노인복지시설", "아동복지시설", "청소년복지시설", "여성복지시설", "장애인복지시설", "다문화가족지원센터"];

const careers = [
  {
    title: "학교사회복지사",
    desc: "학생의 심리사회적 문제를 해결하기 위해 학교 안팎의 환경과 욕구를 조사하고, 사례 발굴·개입·기록·평가 및 네트워크 운영을 통해 학생과 학교를 종합적으로 지원하는 전문 인력",
    source: ["출처: [네이버 지식백과] 학교사회복지사", "(한국직업사전, 2016.)"],
  },
  {
    title: "의료사회복지사",
    desc: "환자와 그 가족을 둘러싼 심리적 문제와 생활문제(의료비, 생활비)에 대해, 또는 각종 사회자원(복지기관, 시설, 사회복지제도, 사회보장 등)을 활용할 수 있도록 소개하여 이들 문제를 해결하도록 지원하는 역할",
    source: [
      "출처: [네이버 지식백과] 의료사회복지사",
      "[medical social worker, 醫療社會福祉士]",
      "(상담학 사전, 2016. 01. 15., 김춘경, 이수연, 이윤주, 정종진, 최웅용)",
    ],
  },
  {
    title: "사회복지직 공무원",
    desc: "복지 대상자를 조사·선정해 각종 급여와 지원 사업을 운영하고, 자활·자원봉사·지역사회 연계를 통해 주민의 생활 안정을 지원하는 공공복지 전문가",
    source: ["출처: [네이버 지식백과] 사회복지전담공무원", "(한국직업사전, 2016.)"],
  },
  {
    title: "정신건강사회복지사",
    desc: "정신과 병원 및 지역사회에서 정신보건에 관한 양질의 서비스를 제공할 전문인력의 수요가 증가하게 되면서, 정신질환의 예방과 정신질환자의 의료 및 사회복귀 등의 업무를 수행할 전문지식과 기술을 갖춘 인력",
    source: ["출처: 한국정신건강사회복지사협회"],
  },
];

const salarySteps = [
  { step: "1호봉", pay: "2,093,900원", ...{ x: 0, y: 8, mx: 0, my: 5.88 } },
  { step: "3호봉", pay: "2,190,200원", x: 184, y: 8, mx: 91.61, my: 5.88 },
  { step: "5호봉", pay: "2,287,800원", x: 368, y: 8, mx: 184.21, my: 5.88 },
  { step: "7호봉", pay: "2,445,000원", x: 540, y: 0, mx: 267.98, my: 0, strong: true },
];

const salaryCards = [
  [
    ["사회복지시설직원", "2,500~3,000 만원"],
    ["다문화가족 지원센터 직원", "2,200~3,000만원"],
    ["학교 및 청소년 상담센터", "2,400~3,000만원"],
    ["건강가정지원센터 직원", "2,200~2,500만원"],
    ["사회복지직 공무원", "2,700만원"],
    ["노인복지시설 직원", "2,200~3,400만원"],
  ],
  [
    ["장애인복지시설 직원", "2,500~3,000만원"],
    ["사회복지기관 상담원", "2,400~3,000만원"],
    ["지역사회복지관 직원", "2,400~3,200만원"],
    ["정신건강복지센터 직원", "2,800~3,200만원"],
    ["의료사회복지사", "2,800~3,300만원"],
    ["통합사례관리사", "2,700~3,200만원"],
  ],
];

const staff = [
  { role: "학습설계", rest: "담당자", lines: ["개인별 맞춤 커리큘럼 설계 및", "자격증/학위취득 상담"] },
  { role: "기술지원", rest: "전문가", lines: ["학습 중 불편사항 원격 해결 및", "한평생 교육원 전반 기술지원"] },
  { role: "학습관리", rest: "담당자", lines: ["수강/학사 관련 문의 응대 및 학습 진행 상황", "지속 관리, 학사일정 알림 서비스"] },
];

const benefits = [
  ["SMS 서비스", "학사일정 SMS 안내 서비스"],
  ["1:1 멘토링 시스템", "개인별 맞춤 학습설계 및 일정관리"],
  ["편리한 모바일", "쉽고 빠른 모바일 수강"],
  ["무료 교안파일", "교안파일 무료 제공"],
  ["우수 성적 장학생", "총 장학금 30만원"],
  ["교육원 장학지원제도", "자격 요건에 따른 장학금 지원"],
];

/**
 * 사회복지사란? 상세페이지 (Figma '배너 팝업' 파일 — PC 143:486 · 모바일 143:848).
 * 예전 통이미지 한 장을 글자·그림으로 나눠 코드로 옮겼다.
 * 크기는 1080(PC)·480(모바일) 디자인 기준 단위(--u)로 적어, 화면 폭에 맞춰 통이미지처럼 비율 그대로 줄어든다.
 */
export default function SocialWorkerLanding() {
  return (
    <div className="swl">
      <div className="swl-inner">
        {/* 1. 신학기반 모집 */}
        <section className="swl-hero">
          <img className="swl-hero-texture" src={`${IMG}/hero-texture.jpg`} alt="" />
          <span className="swl-ribbon swl-ribbon--top">2026 new semester class</span>
          <img className="swl-spark swl-spark--a" src={`${IMG}/spark-lg.svg`} alt="" />
          <img className="swl-spark swl-spark--b" src={`${IMG}/spark-sm.svg`} alt="" />
          <img className="swl-spark swl-spark--c" src={`${IMG}/spark-lg.svg`} alt="" />
          <div className="swl-hero-head">
            <img className="swl-hero-arc" src={`${IMG}/hero-arc-text.svg`} alt="담당자의 1:1 밀착관리로 함께 하는" />
            <h1 className="swl-hero-title">
              <span className="swl-hero-title-1">사회복지사 2급</span>
              <span className="swl-hero-title-2">신학기반 모집</span>
            </h1>
          </div>
          <div className="swl-hero-gift">
            <img className="swl-hero-shadow" src={`${IMG}/hero-shadow.svg`} alt="" />
            <img className="swl-hero-gift-img" src={`${IMG}/hero-gift.png`} alt="" />
          </div>
          <span className="swl-ribbon swl-ribbon--mint">Social Welfare Worker</span>
          <span className="swl-ribbon swl-ribbon--black">Education for Beginner LEarner Class</span>
        </section>

        {/* 2. 사회복지사란? */}
        <section className="swl-define">
          <h2 className="swl-define-title">사회복지사란?</h2>
          <span className="swl-define-divider" aria-hidden />
          <p className="swl-define-text">
            사회복지에 관한 전문지식과 기술을 가진 사람으로서, 보건복지부장관이 발급하는 사회복지사 자격증을 받은 사람을
            말한다. <br className="swl-mo-br" />
            (출처: 네이버지식백과, 사회복지사)
          </p>
        </section>

        {/* 3. WHY? */}
        <section className="swl-why">
          <img className="swl-why-bg" src={`${IMG}/why-burst.webp`} alt="" />
          <p className="swl-why-script">WHY?</p>
          <h2 className="swl-why-title">사회복지사 2급 자격증을 취득해야할까?</h2>
        </section>

        {/* 4. 일자리 확대 */}
        <section className="swl-jobs">
          <NumBadge n={1} />
          <h3 className="swl-heading">
            <span className="swl-light">사회복지사</span>
            <span className="swl-heading-row">
              <Mint>일자리 확대</Mint>
              <span className="swl-light">및</span>
              <Mint>고용인원 증가</Mint>
            </span>
          </h3>
          <div className="swl-charts">
            <figure className="swl-chart swl-chart--industry">
              <img className="swl-chart-img" src={`${IMG}/chart-industry.jpg`} alt="" />
              <figcaption className="swl-chart-title" style={at(157, 29, 78.05, 18.26)}>
                취업자 수 증가 규모 상위 10대 산업
              </figcaption>
              <div className="swl-ind-values" style={at(38, 56, 23.49, 27.95)}>
                {industryValues.map(({ v, x, y, mx, my, strong }) => (
                  <span key={x} className={strong ? "is-strong" : undefined} style={at(x, y, mx, my)}>
                    {v}
                  </span>
                ))}
              </div>
              <ul className="swl-ind-labels" style={at(22, 274, 13.6, 169.7)}>
                {industries.map((lines, i) => (
                  <li key={lines.join()} className={i === industries.length - 1 ? "is-strong" : undefined}>
                    {lines.map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </li>
                ))}
              </ul>
              <p className="swl-chart-caption" style={at(140, 337, 35.54, 208.64)}>
                <strong>사회복지 서비스업</strong> 취업자 수 <strong>증가</strong>
              </p>
              <p className="swl-chart-source" style={at(331.5, 388, 158.91, 253.17)}>
                출처: 한국 고용정보원 중장기 인력수급 전망 2014 ~2024
              </p>
            </figure>
            <figure className="swl-chart swl-chart--growth">
              <img className="swl-chart-img" src={`${IMG}/chart-growth.jpg`} alt="" />
              <img className="swl-growth-dash" src={`${IMG}/dash-v.svg`} alt="" style={at(156, 149, 159.35, 152.19)} />
              <span className="swl-pill swl-growth-pill" style={at(71.5, 116, 73.03, 118.48)}>
                136.6% 증가!
              </span>
              <span className="swl-growth-v is-strong" style={at(261, 54, 266.58, 55.15)}>
                2,145천명
              </span>
              <span className="swl-growth-v" style={at(61, 187, 62.3, 191)}>
                907천명
              </span>
              <span className="swl-growth-v is-year" style={at(62, 298, 63.33, 304.37)}>
                2016년
              </span>
              <span className="swl-growth-v is-strong" style={at(271.5, 298, 277.31, 304.37)}>
                2031년
              </span>
              <figcaption className="swl-chart-title swl-chart-title--sm" style={at(51, 19, 52.09, 19.41)}>
                사회복지 시설 및 사회복지사 채용 증가 전망
              </figcaption>
              <p className="swl-chart-caption swl-chart-caption--rev" style={at(31, 339, 35.66, 346.25)}>
                사회복지 관련 <strong>일자리 지속적 증가</strong>
              </p>
              <p className="swl-chart-source" style={at(90, 388, 94, 392.41)}>
                출처: 한국 고용정보원 중장기 인력수급 전망 2021 ~2031
              </p>
            </figure>
          </div>
        </section>

        {/* 5. 다양한 기관으로 취업 */}
        <section className="swl-places">
          <img className="swl-places-bg" src={`${IMG}/wave-texture.jpg`} alt="" />
          <NumBadge n={2} />
          <h3 className="swl-heading">
            <span className="swl-light">성별/연령 제한 없는</span>
            <span className="swl-heading-row">
              <Mint>다양한 기관으로 취업</Mint>
              <span className="swl-light">가능</span>
            </span>
          </h3>
          <ul className="swl-places-grid">
            {facilities.map((name, i) => (
              <li key={name} className="swl-place">
                <img src={`${IMG}/facility-${i + 1}.png`} alt="" />
                <span>{name}</span>
              </li>
            ))}
          </ul>
          <p className="swl-places-note">
            그 외에도 가정폭력보호시설, 정신건강 증진시설, 성폭력피해보호시설, 사회복지관, 한부모가족복지시설, 노숙인시설,{" "}
            <br className="swl-pc-br" />
            결핵 · 한센시설, 건강가정지원센터, 다함께돌봄센터, 지역자활센터 등 다양한 기관이 있습니다.
          </p>
          <p className="swl-places-note">출처: 2024년 사회복지시설 종사자 인건비 가이드라인 (보건복지부, 2024)</p>
        </section>

        {/* 6. 공신력 있는 전문가로 진출 */}
        <section className="swl-careers">
          <img className="swl-careers-bg" src={`${IMG}/glow-texture.jpg`} alt="" />
          <span className="swl-careers-blur" aria-hidden />
          <NumBadge n={3} />
          <h3 className="swl-heading">
            <span className="swl-light">단순 취업을 넘어</span>
            <span className="swl-heading-row swl-heading-row--tight">
              <Mint>공신력 있는 전문가</Mint>
              <span className="swl-light">로 진출</span>
            </span>
          </h3>
          {careers.map((c, i) => (
            <article key={c.title} className="swl-career">
              <img src={`${IMG}/job-${i + 1}.jpg`} alt="" />
              <div className="swl-career-text">
                <h4>
                  <span className="swl-career-num">{i + 1}</span>
                  {c.title}
                </h4>
                <p className="swl-career-desc">{c.desc}</p>
                <p className="swl-career-source">
                  {c.source.map((line, j) => (
                    <span key={line}>
                      {j > 0 && " "}
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </article>
          ))}
        </section>

        {/* 7. 급여 */}
        <section className="swl-salary">
          <h3 className="swl-salary-title">
            <span>사회복지사, </span>
            <span className="swl-salary-row">
              <span className="swl-wavy">급여는 어느정도</span>
              <span>일까?</span>
            </span>
          </h3>
          <figure className="swl-chart swl-chart--salary">
            <img className="swl-chart-img" src={`${IMG}/chart-salary.jpg`} alt="" />
            <div className="swl-salary-callout" style={at(26.99, 26.84, 13.69, 13.62)}>
              <p>장기간 근무할 수록 호봉이 쌓여요</p>
              <p>
                1년마다 <em>1호봉</em>씩 연봉상승!
              </p>
            </div>
            <ul className="swl-salary-steps" style={at(51.49, 428.84, 29.12, 215.49)}>
              {salarySteps.map(({ step, pay, x, y, mx, my, strong }) => (
                <li key={step} className={strong ? "is-strong" : undefined} style={at(x, y, mx, my)}>
                  <span>{step}</span>
                  <span>{pay}</span>
                </li>
              ))}
            </ul>
            <p className="swl-chart-source swl-chart-source--salary" style={at(359.5, 516, 91.4, 257.81)}>
              출처: 보건복지부 2024년 사회복지시설 종사자 인건비 가이드라인 사무직 기준
            </p>
          </figure>
        </section>

        {/* 8. 공무원 경쟁률 · 합격선 */}
        <section className="swl-civil">
          <h3 className="swl-civil-title">
            <span>타 직렬대비 낮은 경쟁률과 합격선!</span>
            <strong>사회복지직 공무원 필수 자격증</strong>
          </h3>
          <figure className="swl-chart swl-chart--compete">
            <img className="swl-chart-img" src={`${IMG}/chart-compete.jpg`} alt="" />
            <span className="swl-pill swl-compete-pill" style={at(103, 38, 51.77, 19.1)}>
              낮은 경쟁률
            </span>
            <span className="swl-pill swl-compete-pill" style={at(465, 38, 233.74, 19.1)}>
              낮은 합격선
            </span>
            <span className="swl-compete-axis" style={at(114, 356, 53.3, 178.95)}>
              일반행정직
            </span>
            <span className="swl-compete-axis is-strong" style={at(209, 356, 96.06, 178.95)}>
              사회복지직
            </span>
            <span className="swl-compete-axis" style={at(479, 356, 236.77, 178.95)}>
              일반행정직
            </span>
            <span className="swl-compete-axis is-strong" style={at(574, 356, 279.53, 178.95)}>
              사회복지직
            </span>
            <span className="swl-compete-gap" style={at(613, 166, 309, 79.92)}>
              평균
              <br />
              <em>13점 차이</em>
            </span>
            <p className="swl-chart-source swl-chart-source--compete" style={at(142, 392, 29.38, 197.04)}>
              출처: 서울시 인터넷 원서접수 2022 서울시 9급 일반 행정직 공무원, 9급 사회복지직 공무원 경쟁률 및 합격선
            </p>
          </figure>
          <div className="swl-pay-strip">
            {salaryCards.map((row, r) => (
              <ul key={r} className={`swl-pay-row swl-pay-row--${r + 1}`}>
                {/* 같은 카드를 세 벌 이어 붙여, 한 벌(1/3)만큼 밀면 처음과 똑같아져 끊김 없이 계속 흐른다 */}
                {[0, 1, 2].flatMap((copy) =>
                  row.map(([title, pay]) => (
                    <li key={`${copy}${title}`} aria-hidden={copy > 0 || undefined}>
                      <strong>{title}</strong>
                      <span>{pay}</span>
                    </li>
                  )),
                )}
              </ul>
            ))}
            <span className="swl-pay-dim" aria-hidden />
          </div>
          <p className="swl-civil-source">
            출처: 잡코리아, 사람인, 서울특별시사회복지사협의회, 부산일자리정보망, 공기업 단기 공기업 채용 통합정보, 「2024
            정신건강복지센터 및 중독관리통합지원 센터 종사자 기본급 지급기준」,「2024년 사회복지시설 종사자 인건비
            가이드라인」
          </p>
          <p className="swl-civil-source swl-civil-source--note">
            * 정규직 기준, 서울시 사회복지시설 외에 다른 지역•시설 종사자들의 급여 조건은 이와 상이할 수 있습니다.
          </p>
        </section>

        {/* 9. 한평생 선택의 이유 */}
        <section className="swl-reason">
          <img className="swl-reason-bg" src={`${IMG}/confetti.webp`} alt="" />
          <div className="swl-reason-head">
            <div className="swl-reason-glow">
              <img className="swl-reason-why" src={`${IMG}/why-script.svg`} alt="WHY?" />
              <h2 className="swl-reason-title">한평생 선택의 이유!</h2>
            </div>
            <p className="swl-reason-sub">한평생만이 가진 교육 노하우, 신뢰할 수 있는 교육기관</p>
          </div>
          <div className="swl-reason-block">
            <h3 className="swl-reason-heading">
              <span>
                <Mint>1:3 멀티담당자</Mint> 관리시스템,
              </span>{" "}
              <span>
                더욱 <Mint>꼼꼼한 밀착관리</Mint>
              </span>
            </h3>
            <ul className="swl-staff">
              {staff.map((s, i) => (
                <li key={s.role}>
                  <p className="swl-staff-role">
                    <span>{s.role}</span> {s.rest}
                  </p>
                  <p className="swl-staff-desc">
                    {s.lines[0]}
                    <br />
                    {s.lines[1]}
                  </p>
                  <img src={`${IMG}/staff-${i + 1}.png`} alt="" />
                </li>
              ))}
            </ul>
          </div>
          <div className="swl-reason-block">
            <h3 className="swl-reason-heading">
              <span>
                <Mint>다양한 환경</Mint>에서 수업 수강 가능!
              </span>
            </h3>
            <figure className="swl-devices">
              <img src={`${IMG}/devices.png`} alt="노트북 · 태블릿 · 휴대폰" />
              <figcaption>웨일 · 크롬 · 엣지 · 안드로이드 · iOS 수업 수강 가능!</figcaption>
            </figure>
          </div>
        </section>

        {/* 10. 추가 혜택 */}
        <section className="swl-benefits">
          <picture>
            <source media="(max-width: 480px)" srcSet={`${IMG}/shopping-bg-mo.webp`} />
            <img className="swl-benefits-bg" src={`${IMG}/shopping-bg.webp`} alt="" />
          </picture>
          <h3 className="swl-benefits-title">
            오직 <em>한평생</em>에서만,
            <br />
            한평생 학습자들이 받는 <em>추가 혜택</em>!
          </h3>
          <ul className="swl-benefit-grid">
            {benefits.map(([title, desc], i) => (
              <li key={title}>
                <strong>{title}</strong>
                <img src={`${IMG}/benefit-${i + 1}.png`} alt="" />
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        </section>
        {/* 혜택 칸과 아래 상담 상자 경계에 반쯤 걸치는 + 표시 — 칸 밖에 두어 잘리거나 가려지지 않게 */}
        <img className="swl-plus-mark" src={`${IMG}/plus-mark.svg`} alt="" />
      </div>
    </div>
  );
}
