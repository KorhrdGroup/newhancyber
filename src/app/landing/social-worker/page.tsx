import type { Metadata } from "next";
import Link from "next/link";
import { supportContacts } from "@/components/course-registration/extra/extraData";
import LandingConsultForm from "@/components/landing/LandingConsultForm";
import ConsultationFloatingBar from "@/components/social-worker/ConsultationFloatingBar";
import { DESKTOP_SECTION_ID, MOBILE_SECTION_ID } from "@/components/social-worker/ConsultationOptions";
import { TBD_HREF } from "@/lib/navigation";

export const metadata: Metadata = { title: "사회복지사 2급 신학기반 모집" };

/* 내용은 원본 랜딩(/landing/hpsedu_landing.asp, 한 장짜리 이미지)을 글자로 옮긴 것 */

const institutions = [
  { name: "노인복지시설", desc: "요양원 · 노인복지관 · 주간보호센터" },
  { name: "아동복지시설", desc: "지역아동센터 · 아동보호전문기관" },
  { name: "청소년복지시설", desc: "청소년수련관 · 청소년쉼터" },
  { name: "여성복지시설", desc: "여성인력개발센터 · 상담소" },
  { name: "장애인복지시설", desc: "장애인복지관 · 보호작업장" },
  { name: "다문화가족지원센터", desc: "가족센터 · 이주민 지원기관" },
];

const careers = [
  {
    name: "학교사회복지사",
    desc: "학생의 심리사회적 문제를 해결하기 위해 학교 안팎의 환경과 욕구를 조사하고, 사례 발굴·개입·평가와 네트워크 운영으로 학생과 학교를 돕는 전문 인력이에요.",
  },
  {
    name: "의료사회복지사",
    desc: "환자와 가족을 둘러싼 심리적 문제와 생활 문제(의료비 · 생활비)를 상담하고, 사회복지 자원을 연결해 치료와 회복을 돕는 역할을 해요.",
  },
  {
    name: "사회복지직 공무원",
    desc: "복지 대상자를 조사·선정해 각종 급여와 지원 사업을 운영하고, 지역사회와 연계해 주민의 생활 안정을 지원하는 공공복지 전문가예요.",
  },
  {
    name: "정신건강사회복지사",
    desc: "정신과 병원과 지역사회에서 정신보건 서비스를 제공하고, 정신질환의 예방과 재활을 돕는 전문 지식과 기술을 갖춘 인력이에요.",
  },
];

/** 월 기본급 (보건복지부 2024 사회복지시설 종사자 인건비 가이드라인) */
const salarySteps = [
  { step: "1호봉", pay: 2093900 },
  { step: "3호봉", pay: 2190200 },
  { step: "5호봉", pay: 2287800 },
  { step: "7호봉", pay: 2445000 },
];

const managers = [
  { role: "학습설계 담당자", desc: "개인별 맞춤 커리큘럼 설계와 자격증 · 학위 취득 상담" },
  { role: "기술지원 전문가", desc: "학습 중 불편한 점을 원격으로 해결하고 수강 환경을 안내" },
  { role: "학습관리 담당자", desc: "수강 · 학사 문의 응대, 학습 진행 관리, 학사일정 알림" },
];

const benefits = [
  { name: "SMS 서비스", desc: "학사일정을 문자로 안내해 드려요" },
  { name: "1:1 멘토링 시스템", desc: "개인별 맞춤 학습설계와 일정 관리" },
  { name: "편리한 모바일", desc: "쉽고 빠른 모바일 수강" },
  { name: "무료 교안파일", desc: "강의 교안파일을 무료로 드려요" },
  { name: "우수 성적 장학생", desc: "총 장학금 30만 원" },
  { name: "교육원 장학지원제도", desc: "자격 요건에 따른 장학금 지원" },
];

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
const pays = salarySteps.map((s) => s.pay);
const minPay = Math.min(...pays);
const maxPay = Math.max(...pays);
/** 오르는 폭이 보이게 가장 낮은 호봉을 40% 높이로 두고 나머지를 비율로 */
const barHeight = (pay: number) => 40 + Math.round(((pay - minPay) / (maxPay - minPay)) * 60);

function PointHead({ num, children }: { num: number; children: React.ReactNode }) {
  return (
    <div className="ld-point-head">
      <span className="ld-point-num">{num}</span>
      <h3 className="ld-point-title">{children}</h3>
    </div>
  );
}

export default function SocialWorkerLandingPage() {
  return (
    <main className="ld">
      {/* 첫 화면 */}
      <section className="ld-hero">
        <div className="ld-inner">
          <p className="ld-hero-eyebrow">2026 NEW SEMESTER CLASS</p>
          <p className="ld-hero-lead">담당자의 1:1 밀착관리로 함께하는</p>
          <h1 className="ld-hero-title">
            사회복지사 2급
            <br />
            <em>신학기반 모집</em>
          </h1>
          <div className="ld-hero-actions">
            <a href={`#${DESKTOP_SECTION_ID}`} className="ld-btn ld-btn--accent">
              무료 상담 신청
            </a>
            <Link href="/course-registration/register" className="ld-btn ld-btn--line">
              수강신청 바로가기
            </Link>
          </div>
        </div>
      </section>
      <div className="ld-define">
        <div className="ld-inner">
          <strong>사회복지사란?</strong>
          <p>
            사회복지에 관한 전문지식과 기술을 가진 사람으로서, 보건복지부장관이 발급하는 사회복지사 자격증을 받은 사람을
            말해요. <small>(출처: 네이버 지식백과)</small>
          </p>
        </div>
      </div>

      {/* 왜 사회복지사 2급인가 */}
      <section className="ld-section ld-section--why">
        <div className="ld-inner">
          <p className="ld-kicker">WHY?</p>
          <h2 className="ld-heading">
            사회복지사 2급 자격증, <span className="ld-nowrap">왜 취득해야 할까?</span>
          </h2>

          <PointHead num={1}>
            사회복지사 <em>일자리 확대</em>와 <em>고용 인원 증가</em>
          </PointHead>
          <div className="ld-stats">
            <div className="ld-stat">
              <span className="ld-stat-label">취업자 수 증가 규모 상위 10대 산업</span>
              <strong className="ld-stat-value">1위</strong>
              <p>사회복지 서비스업 취업자 수 385.9천 명 증가</p>
              <small>출처: 한국고용정보원 중장기 인력수급 전망 2014~2024</small>
            </div>
            <div className="ld-stat">
              <span className="ld-stat-label">사회복지 시설 · 사회복지사 채용 증가 전망</span>
              <strong className="ld-stat-value">136.6% 증가</strong>
              <p>2016년 907천 명 → 2031년 2,145천 명</p>
              <small>출처: 한국고용정보원 중장기 인력수급 전망 2021~2031</small>
            </div>
          </div>

          <PointHead num={2}>
            성별 · 연령 제한 없이 <em>다양한 기관으로 취업</em>
          </PointHead>
          <ul className="ld-tiles">
            {institutions.map((item) => (
              <li key={item.name} className="ld-tile">
                <strong>{item.name}</strong>
                <span>{item.desc}</span>
              </li>
            ))}
          </ul>
          <p className="ld-source">출처: 2024년 사회복지시설 종사자 인건비 가이드라인 (보건복지부)</p>

          <PointHead num={3}>
            단순 취업을 넘어 <em>공신력 있는 전문가</em>로 진출
          </PointHead>
          <ul className="ld-careers">
            {careers.map((item, i) => (
              <li key={item.name} className="ld-career">
                <span className="ld-career-num">{i + 1}</span>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 급여 */}
      <section className="ld-section ld-section--light">
        <div className="ld-inner">
          <h2 className="ld-heading ld-heading--dark">사회복지사, 급여는 어느 정도일까?</h2>
          <div className="ld-card">
            <p className="ld-card-lead">
              오래 근무할수록 호봉이 쌓여요 · <em>1년마다 1호봉씩</em> 연봉 상승!
            </p>
            <div className="ld-bars">
              {salarySteps.map((s) => (
                <div key={s.step} className="ld-bar">
                  <div className="ld-bar-track">
                    <div className="ld-bar-fill" style={{ height: `${barHeight(s.pay)}%` }} />
                  </div>
                  <strong>{s.step}</strong>
                  <span>{won(s.pay)}</span>
                </div>
              ))}
            </div>
            <p className="ld-source ld-source--dark">
              월 기본급 기준 · 출처: 보건복지부 2024년 사회복지시설 종사자 인건비 가이드라인
            </p>
          </div>

          <h2 className="ld-heading ld-heading--dark ld-mt">
            <small>타 직렬 대비 낮은 경쟁률과 합격선!</small>
            사회복지직 공무원 필수 자격증
          </h2>
          <div className="ld-compare">
            <div className="ld-card">
              <span className="ld-chip">낮은 경쟁률</span>
              <dl className="ld-vs">
                <div>
                  <dt>일반행정직</dt>
                  <dd>11.5 : 1</dd>
                </div>
                <div className="is-highlight">
                  <dt>사회복지직</dt>
                  <dd>7.1 : 1</dd>
                </div>
              </dl>
            </div>
            <div className="ld-card">
              <span className="ld-chip">낮은 합격선</span>
              <dl className="ld-vs">
                <div>
                  <dt>일반행정직</dt>
                  <dd>83점</dd>
                </div>
                <div className="is-highlight">
                  <dt>사회복지직</dt>
                  <dd>70점</dd>
                </div>
              </dl>
              <p className="ld-vs-note">평균 13점 차이</p>
            </div>
          </div>
          <p className="ld-source ld-source--dark">출처: 서울시 인터넷 원서접수 2022 서울시 9급 공채 경쟁률 · 합격선</p>
        </div>
      </section>

      {/* 한평생을 고르는 이유 */}
      <section className="ld-section ld-section--why">
        <div className="ld-inner">
          <p className="ld-kicker">WHY?</p>
          <h2 className="ld-heading">한평생을 선택하는 이유</h2>
          <p className="ld-sub">한평생만이 가진 교육 노하우, 믿을 수 있는 교육기관</p>

          <h3 className="ld-point-title ld-center">
            1:3 멀티 담당자 관리 시스템으로 더 <em>꼼꼼한 밀착관리</em>
          </h3>
          <ul className="ld-managers">
            {managers.map((m) => (
              <li key={m.role} className="ld-tile">
                <strong>{m.role}</strong>
                <span>{m.desc}</span>
              </li>
            ))}
          </ul>

          <h3 className="ld-point-title ld-center">
            <em>다양한 환경</em>에서 수업 수강 가능!
          </h3>
          <ul className="ld-env">
            {["웨일", "크롬", "엣지", "안드로이드", "iOS"].map((env) => (
              <li key={env}>{env}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 추가 혜택 */}
      <section className="ld-section ld-section--benefit">
        <div className="ld-inner">
          <h2 className="ld-heading">
            <small>오직 한평생에서만,</small>
            한평생 학습자가 받는 <em>추가 혜택!</em>
          </h2>
          <ul className="ld-benefits">
            {benefits.map((b) => (
              <li key={b.name} className="ld-tile">
                <strong>{b.name}</strong>
                <span>{b.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 상담 */}
      <section className="ld-section ld-section--consult" id={DESKTOP_SECTION_ID}>
        <div className="ld-inner ld-consult" id={MOBILE_SECTION_ID}>
          <div className="ld-contact">
            <a href={`tel:${supportContacts.registration}`} className="ld-contact-card">
              <span>기다릴 필요 없는 빠른 전화 상담</span>
              <strong>{supportContacts.registration}</strong>
            </a>
            {/* TODO: 카카오톡 채널 주소 (원본도 아직 없음) */}
            <a href={TBD_HREF} className="ld-contact-card ld-contact-card--kakao">
              <span>전화가 어렵다면 실시간 카톡 상담</span>
              <strong>카톡 상담하기 →</strong>
            </a>
          </div>
          <LandingConsultForm />
        </div>
      </section>

      <ConsultationFloatingBar />
    </main>
  );
}
