import type { Metadata } from "next";
import Link from "next/link";
import { SUPPORT_PHONE } from "@/lib/contact";

export const metadata: Metadata = { title: "원격지원" };

// TODO: 원본처럼 두 버튼 모두 무료학습설계로 연결된다. 실제 원격지원 프로그램 주소가 정해지면 바꾼다.
const remoteButtons = ["수강신청 및 학습문의 바로가기", "출석 및 시험 관련문의 바로가기"];

/** STEP 사이 연결선 — 점선 가운데 파란 동그라미 아래 화살표 (원본 wrapper_divider.png 를 코드로) */
function StepDivider() {
  return (
    <div className="lx-step-divider" aria-hidden="true">
      <span className="lx-step-divider-icon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4.5 6.25 8 9.75l3.5-3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

/** 원격지원 — 공지사항·FAQ 와 같은 흰 바탕 틀, 단계는 STEP 소제목 + 내용, 단계 사이는 연결선 (디자인 시스템 카드·버튼) */
export default function LearningRemoteSupportPage() {
  return (
    <main className="wrapper">
      <div className="container lx-page lx-page--top lx-page--plain">
        <h1 className="page-title">원격지원 서비스</h1>
        <p className="lx-desc">
          한평생원격교육원 서비스 이용 중 궁금한 점이 생기면, 담당자가 회원님의 동의 하에 PC 화면을 함께 보면서
          신속하고 정확하게 도와드립니다.
        </p>

        <section className="lx-panel">
          <h2 className="lx-section-title">
            <span className="lx-step-label">STEP 1</span> 회원님의 상황에 맞게 전화합니다.
          </h2>
          <div className="ds-stats lx-remote-contacts">
            <div className="ds-stat">
              <p className="ds-stat-label">수강상담 및 학습문의</p>
              <p className="ds-stat-value">각 학습담당자 직통번호</p>
            </div>
            <div className="ds-stat">
              <p className="ds-stat-label">출석 및 시험 관련문의</p>
              <p className="ds-stat-value">{SUPPORT_PHONE}</p>
            </div>
          </div>
        </section>

        <StepDivider />

        <section className="lx-panel">
          <h2 className="lx-section-title">
            <span className="lx-step-label">STEP 2</span> 원격지원 서비스 바로가기 버튼을 누릅니다.
          </h2>
          <div className="lx-remote-buttons">
            {remoteButtons.map((label) => (
              <Link key={label} href="/course-registration/learning-design" className="ds-btn ds-btn--primary ds-btn--lg">
                {label}
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6.25 4.5 9.75 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
          </div>
        </section>

        <StepDivider />

        <section className="lx-panel">
          <h2 className="lx-section-title">
            <span className="lx-step-label">STEP 3</span> 기술지원 담당자의 안내에 따라 주세요.
          </h2>
          <ul className="lx-notes">
            <li className="page-list-item">원격지원 서비스 이용 가능 시간: 평일 09:00 ~ 18:00 (점심시간 12:00 ~ 13:00 제외)</li>
            <li className="page-list-item">토요일 · 공휴일은 쉽니다.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
