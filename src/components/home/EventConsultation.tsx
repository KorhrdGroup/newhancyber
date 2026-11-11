import Link from "next/link";
import { TBD_HREF } from "@/lib/navigation";
import ConsultationForm from "./ConsultationForm";

const MAIN_IMG = "/resources/images/main";

/** 마무리 띠의 "무료 상담 신청" 버튼이 내려올 자리 */
export const CONSULTATION_ANCHOR = "home-consultation";

/** 이벤트 배너 + 원격지원/카톡 상담 + 간편상담 폼 */
export default function EventConsultation() {
  return (
    <section className="event-consultation-section" id={CONSULTATION_ANCHOR}>
      <div className="event-consultation-container">
        <div className="event-support-area">
          <Link href="/event" className="event-banner-link">
            <div className="event-banner">
              <div className="event-banner-content">
                <div className="event-banner-image">
                  <img src={`${MAIN_IMG}/event-friend.png`} alt="이벤트 이미지" className="event-img" />
                </div>
              </div>
            </div>
          </Link>
          <div className="support-boxes">
            {/* 원본은 초록 그림(phone.png) — 화면 색을 파랑 계열로 맞추려고 글자 + 3D 아이콘으로 다시 그림 */}
            <Link href="/learning-support/remote-support" className="support-box-link">
              <div className="support-box support-box-remote">
                <div className="support-box-text">
                  <p className="support-subtitle">도움이 필요하신가요?</p>
                  <h4 className="support-title">원격지원</h4>
                </div>
                <img src={`${MAIN_IMG}/support/support-tab-002.png`} alt="" className="support-remote-icon" />
              </div>
            </Link>
            {/* 카카오톡 채널 주소는 추후 전달 예정 */}
            <a href={TBD_HREF} className="support-box-link">
              <div className="support-box support-box-yellow">
                <div className="support-box-content">
                  <div className="support-box-text">
                    <p className="support-subtitle">간편 채팅상담</p>
                    <h4 className="support-title">카카오톡 상담</h4>
                  </div>
                  <div className="support-box-image">
                    <img src={`${MAIN_IMG}/kakaotalk.png`} alt="카카오톡 아이콘" className="support-icon" />
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
        <ConsultationForm />
      </div>
    </section>
  );
}
