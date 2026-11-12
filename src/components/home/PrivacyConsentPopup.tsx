"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

const noopSubscribe = () => () => {};

interface PrivacyConsentPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 간편상담 폼의 개인정보 수집·이용 동의 안내 팝업.
 * 원본처럼 body 바로 아래에 그려서 폼 영역의 레이아웃 영향을 받지 않게 한다.
 */
export default function PrivacyConsentPopup({ isOpen, onClose }: PrivacyConsentPopupProps) {
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  useBodyScrollLock(isOpen);

  if (!isClient) return null;

  return createPortal(
    <div className={`privacy-consent-popup${isOpen ? " active" : ""}`}>
      <div className="privacy-consent-popup-overlay" onClick={onClose}></div>
      <div className="privacy-consent-popup-content">
        <div className="privacy-consent-popup-header">
          <h3 className="privacy-consent-popup-title">개인정보 수집 및 이용 동의 안내</h3>
          <button type="button" className="privacy-consent-popup-close" onClick={onClose}>
            <img
              src="/resources/images/mobile/mobile-close-btn.png"
              alt="닫기"
              className="privacy-consent-popup-close-img"
            />
          </button>
        </div>
        <div className="privacy-consent-popup-body">
          <p>
            <strong>1. 개인정보 수집 및 이용 목적</strong>
          </p>
          <p>1) 상담 진행, 교육과정 설계, 문의사항 응대, 민원해결</p>
          <p>
            2) 광고성 정보 수신에 대하여 별도의 동의를 한 회원에 한하여
            &quot;한평생원격교육원&quot;과 각 제휴사의 새로운 서비스, 이벤트, 최신 정보의 안내 등
            회원의 취향에 맞는 최적의 정보 제공
          </p>
          <p>
            <strong>2. 수집 및 이용하는 개인정보 항목</strong>
          </p>
          <p>(필수) 이름, 휴대전화번호, 관심분야 이메일 주소</p>
          <p>(선택) 제출된 상담 문의 내용 또는 첨부파일에 기재된 개인정보</p>
          <p>
            <strong>3. 보유 및 이용 기간</strong>
          </p>
          <p>
            법령이 정하는 경우를 제외하고는 수집일로부터 1년 또는 동의 철회 시까지 보유 및
            이용합니다.
          </p>
          <p>
            <strong>
              4. 신청자는 동의를 거부할 권리가 있습니다. 단, 동의를 거부하는 경우 상담 서비스
              이용이 제한됩니다.
            </strong>
          </p>
        </div>
        <div className="privacy-consent-popup-footer">
          <button type="button" className="privacy-consent-popup-confirm" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
