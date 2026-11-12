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
          {/* 친구추천 배너 — 글자 박힌 그림(event-friend.png) 대신 글자 + 티켓 + 3D 친구추가 아이콘 (시안 D1, 그래픽 축소) */}
          <Link href="/event" className="event-banner-link">
            <div className="event-banner event-friend">
              <div className="event-friend-text">
                <span className="event-friend-tag">EVENT</span>
                <p className="event-friend-title">친구추천 이벤트</p>
                <p className="event-friend-sub">추천한 나도, 추천받은 친구도 함께 혜택</p>
                <span className="event-friend-cta">자세히 보기 →</span>
              </div>
              <div className="event-friend-art" aria-hidden="true">
                <span className="event-friend-glow" />
                <div className="event-friend-ticket">
                  <span className="event-friend-ticket-label">FRIEND PASS</span>
                  <strong>
                    함께하면
                    <br />
                    혜택 UP
                  </strong>
                  <span className="event-friend-ticket-plus">+</span>
                </div>
                <img src={`${MAIN_IMG}/support/support-tab3-004.png`} alt="" className="event-friend-add" />
                {/* 하트 · 반짝이 · 꽃가루 (배너 717×217 기준 좌표) */}
                <svg className="event-friend-deco" viewBox="0 0 717 217" preserveAspectRatio="none">
                  <path d="M676 44c-6-9-20-4-18 6 1 8 18 18 18 18s17-10 18-18c2-10-12-15-18-6z" fill="#ff6f9a" />
                  <path d="M466 176c-4-6-14-3-13 4 1 6 13 13 13 13s12-7 13-13c1-7-9-10-13-4z" fill="#ff9cbc" />
                  <path d="M640 160l5 11 11 5-11 5-5 11-5-11-11-5 11-5z" fill="#ffd23a" />
                  <path d="M490 40l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" fill="#ffd23a" />
                  <path d="M700 118l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#fff" />
                  <rect x="440" y="120" width="5" height="11" rx="1.5" fill="#ffe02f" transform="rotate(30 442 125)" />
                  <rect x="560" y="18" width="5" height="12" rx="1.5" fill="#115aed" transform="rotate(-25 562 24)" />
                  <rect x="612" y="198" width="5" height="11" rx="1.5" fill="#fff" transform="rotate(60 614 203)" />
                  <rect x="690" y="80" width="5" height="11" rx="1.5" fill="#ffe02f" transform="rotate(-40 692 85)" />
                  <circle cx="452" cy="70" r="3.5" fill="#fff" />
                  <circle cx="530" cy="200" r="4" fill="#115aed" />
                  <circle cx="660" cy="14" r="3" fill="#ffe02f" />
                  <circle cx="708" cy="190" r="3.5" fill="#ff9cbc" />
                </svg>
              </div>
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
