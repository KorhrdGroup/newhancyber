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
          {/* 친구추천 배너 — 글자 + 1+1 티켓 · 친구추가 그림(GPT 이미지로 만든 소프트 클레이, 시안 W2) */}
          <Link href="/event" className="event-banner-link">
            <div className="event-banner event-friend">
              <div className="event-friend-text">
                <p className="event-friend-title">
                  친구추천 <em>이벤트</em>
                </p>
                <p className="event-friend-sub">추천한 나도, 추천받은 친구도 함께 혜택</p>
                <span className="event-friend-cta">자세히 보기 →</span>
              </div>
              <img src={`${MAIN_IMG}/event-friend-gift.webp`} alt="" className="event-friend-art" />
            </div>
          </Link>
          <div className="support-boxes">
            {/* Figma(483:5735) — 초록 카드 + 3D 전화 아이콘 */}
            <Link href="/learning-support/remote-support" className="support-box-link">
              <div className="support-box support-box-remote">
                <div className="support-box-text">
                  <p className="support-subtitle">도움이 필요하신가요?</p>
                  <h4 className="support-title">원격지원</h4>
                </div>
                <img src={`${MAIN_IMG}/support/support-remote-phone.png`} alt="" className="support-remote-icon" />
              </div>
            </Link>
            {/* 카카오톡 채널 주소는 추후 전달 예정
                원본은 글자까지 박힌 그림(kakaotalk.png) — 오른쪽 상담 폼 높이에 맞춰 늘어나야 해서
                원격지원 카드처럼 글자 + 3D 말풍선 아이콘으로 다시 그림 — Figma(483:5742) */}
            <a href={TBD_HREF} className="support-box-link">
              <div className="support-box support-box-kakao">
                <div className="support-box-text">
                  <p className="support-subtitle">간편 채팅상담</p>
                  <h4 className="support-title">카카오톡 상담</h4>
                </div>
                <img src={`${MAIN_IMG}/support/support-kakao-bubble.png`} alt="" className="support-remote-icon" />
              </div>
            </a>
          </div>
        </div>
        <ConsultationForm />
      </div>
    </section>
  );
}
