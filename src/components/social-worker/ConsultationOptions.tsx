import { REGISTRATION_PHONE } from "@/lib/contact";
import { TBD_HREF } from "@/lib/navigation";

const SW_IMG = "/resources/images/social-worker";

export const MOBILE_SECTION_ID = "consultation-options-section-mobile";
export const DESKTOP_SECTION_ID = "consultation-options-section";

/** 버튼 안 › (예전 arrow-right.png 그림 대신 글자색을 따르는 선) */
function ArrowIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 전화 상담 / 카톡 상담 카드.
 * 모바일 배너용과 데스크톱 배너용 마크업이 조금 달라서(버튼 안 문구) variant 로 나눈다.
 */
export default function ConsultationOptions({ variant }: { variant: "mobile" | "desktop" }) {
  const isMobile = variant === "mobile";

  return (
    <div className={`consultation-options-outer-wrapper${isMobile ? " mobile-only" : ""}`}>
      <div className="consultation-options-wrapper">
        <div className="consultation-options-section" id={isMobile ? MOBILE_SECTION_ID : DESKTOP_SECTION_ID}>
          {/* 배경: 예전 background.png 와 같은 파랑→보라 세로 그러데이션을 CSS 로 */}
          <div className="consultation-options-background" />
          <div className="consultation-options-content">
            {/* 전화 상담 */}
            <div className="consultation-option consultation-option-call">
              <div className="consultation-option-header">
                <p className="consultation-option-text">
                  기다릴 필요 없는
                  <br />
                  <span className="consultation-option-bold">빠른 전화 상담</span>
                </p>
              </div>
              <div className="consultation-option-icon">
                <img src={`${SW_IMG}/button_call.png`} alt="전화 상담" className="consultation-option-icon-img" />
              </div>
              <a href={`tel:${REGISTRATION_PHONE}`} className="consultation-option-btn consultation-option-btn-call">
                {isMobile ? (
                  <span className="mobile-only">{REGISTRATION_PHONE}</span>
                ) : (
                  <>
                    <span className="desktop-only">{REGISTRATION_PHONE}</span>
                    <span className="mobile-only">
                      전화 연결하기
                      <ArrowIcon className="consultation-option-arrow-mobile" />
                    </span>
                  </>
                )}
              </a>
            </div>

            {/* 카카오톡 상담 — 채널 주소는 추후 전달 예정 */}
            <div className="consultation-option consultation-option-kakao">
              <div className="consultation-option-header">
                <p className="consultation-option-text">
                  전화가 어렵다면
                  <br />
                  <span className="consultation-option-bold">실시간 카톡 상담</span>
                </p>
              </div>
              <div className="consultation-option-icon">
                <img src={`${SW_IMG}/button_kakao.png`} alt="카카오톡 상담" className="consultation-option-icon-img" />
              </div>
              <a href={TBD_HREF} className="consultation-option-btn consultation-option-btn-kakao">
                {!isMobile && (
                  <span className="desktop-only">
                    카톡 상담하기{" "}
                    <ArrowIcon className="consultation-option-arrow" />
                  </span>
                )}
                <span className="mobile-only">
                  카톡 상담하기
                  <ArrowIcon className="consultation-option-arrow-mobile" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
