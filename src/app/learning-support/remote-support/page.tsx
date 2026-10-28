import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_PHONE } from "@/components/layout/MobileFooter";

export const metadata: Metadata = { title: "원격지원" };

const IMG = "/resources/images/learning-support";
const stepBox = { backgroundColor: "#fff", padding: "30px" };

function Divider() {
  return <img src={`${IMG}/wrapper_divider.png`} alt="원격지원 서비스 이용 방법" className="remote-support-divider" />;
}

// TODO: 원본처럼 두 버튼 모두 무료학습설계로 연결된다. 실제 원격지원 프로그램 주소가 정해지면 바꾼다.
const remoteButtons = ["수강신청 및 학습문의 바로가기", "출석 및 시험 관련문의 바로가기"];

export default function LearningRemoteSupportPage() {
  return (
    <main className="wrapper">
      <div className="remote-support-steps-container">
        <div className="container" style={stepBox}>
          <h1 className="page-title">원격지원 서비스란?</h1>
          <div className="remote-support-content">
            {/* "함꼐" 는 원본 표기 그대로 */}
            <p className="remote-support-content-text">
              덧셈원격평생교육원 서비스 이용 시 발생하는 문의사항을 담당자가 회원님의 동의 하에 PC 화면을 함꼐
              보면서 신속하고 정확하게 도와드리는 원격지원 서비스입니다.
            </p>
          </div>
        </div>

        <div className="container" style={stepBox}>
          <h1 className="page-step1-title">
            <span className="page-step1-title-number">STEP 1</span> 회원님의 상황에 맞게 전화합니다.
          </h1>
          <div className="remote-support-contact-boxes">
            <div className="remote-support-contact-box">
              <div className="remote-support-contact-title">수강상담 및 학습문의</div>
              <div className="remote-support-contact-content">각 학습담당자 직통번호</div>
            </div>
            <div className="remote-support-contact-box">
              <div className="remote-support-contact-title">출석 및 시험 관련문의</div>
              <div className="remote-support-contact-content">{CONTACT_PHONE}</div>
            </div>
          </div>
          <Divider />
        </div>

        <div className="container" style={stepBox}>
          <h1 className="page-step1-title">
            <span className="page-step1-title-number">STEP 2</span> 원격지원 서비스 바로가기 버튼을 누릅니다.
          </h1>
          <div className="remote-support-button-boxes">
            {remoteButtons.map((label) => (
              <Link key={label} href="/course-registration/learning-design" className="remote-support-button">
                <span className="remote-support-button-text">{label}</span>
                <img src={`${IMG}/arrow.png`} alt="화살표" className="remote-support-button-arrow" />
              </Link>
            ))}
          </div>
          <Divider />
        </div>

        <div className="container" style={stepBox}>
          <h1 className="page-step1-title">
            <span className="page-step1-title-number">STEP 3</span> 기술지원 담당자의 안내에 따라주세요.
          </h1>
          <ul style={{ marginTop: "8px", display: "flex", flexDirection: "column" }}>
            <li className="page-list-item">
              원격지원서비스 이용 가능 시간: 평일 09:00 ~ 18:00 (점심시간 제외: 12:00~13:00)
            </li>
            <li className="page-list-plain">* 토요일/공휴일 휴무</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
