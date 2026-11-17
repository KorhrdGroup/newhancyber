"use client";

import { useState, type FormEvent } from "react";
import { CbIconFlow } from "@/components/credit-bank/CbFlow";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";
import "@/styles/credit-bank.css";

/** 무료학습설계 신청 (원본 learning-design.html) — 진행 순서 그림 + 디자인 시스템 신청서 */
export default function LearningDesignContent() {
  const [isConsentOpen, setIsConsentOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 학습설계 신청 API 연동 (new FormData(e.currentTarget))
    alert("학습설계 신청 API 연동 전입니다.");
  };

  return (
    <main className="wrapper">
      <div className="ex-page">
        <section className="cr-step-panel" aria-label="무료학습설계 진행 순서">
          <CbIconFlow
            size="lg"
            items={[
              { icon: "scroll-pen", label: "무료학습설계 신청" },
              { icon: "magnifier", label: "검토" },
              { icon: "chat-person", label: "전문가 연결" },
            ]}
            joins={["arrow", "arrow"]}
          />
        </section>

        <form className="ex-box ex-design-form" onSubmit={handleSubmit}>
          <h2 className="ex-section-title">학습설계 신청서</h2>

          <div className="ex-field-grid">
            <div>
              <label htmlFor="name" className="ds-label">
                성명
              </label>
              <input type="text" id="name" name="name" className="ds-input" placeholder="이름을 입력해주세요" />
            </div>
            <div>
              <label htmlFor="phone" className="ds-label">
                휴대폰 번호
              </label>
              <input type="tel" id="phone" name="phone" className="ds-input" placeholder="010-1234-5678" />
            </div>
          </div>

          <div className="ex-field">
            <span className="ds-label">희망 상담 유형</span>
            <div className="ex-choices">
              <label className="ds-check">
                <input type="radio" name="consultation-type" value="phone" className="ds-radio" defaultChecked />
                전화상담
              </label>
              <label className="ds-check">
                <input type="radio" name="consultation-type" value="kakao" className="ds-radio" />
                카톡상담
              </label>
            </div>
          </div>

          <div className="ex-field">
            <label htmlFor="consultation-time" className="ds-label">
              희망상담 시간
            </label>
            <input type="text" id="consultation-time" name="consultation-time" className="ds-input" placeholder="예: 평일 오후 2시 이후" />
          </div>

          <div className="ex-field">
            <label htmlFor="inquiry" className="ds-label">
              문의내용
            </label>
            <textarea id="inquiry" name="inquiry" className="ds-textarea ds-textarea--sm" placeholder="문의내용" />
          </div>

          <div className="ex-field ex-consent">
            <label className="ds-check">
              <input type="checkbox" id="privacy-consent" name="privacy-consent" required />
              <span>
                <strong className="ex-consent-req">(필수)</strong> 개인정보 수집 및 이용에 동의합니다.
              </span>
            </label>
            <button
              type="button"
              className="ds-btn ds-btn--ghost ds-btn--sm"
              aria-expanded={isConsentOpen}
              aria-controls="consent-details"
              onClick={() => setIsConsentOpen((open) => !open)}
            >
              {isConsentOpen ? "접기" : "더보기"}
            </button>
          </div>
          <div className="ex-consent-details" id="consent-details" hidden={!isConsentOpen}>
            <h3>개인정보 수집 및 이용 동의 안내</h3>
            <p>
              <strong>1. 개인정보 수집 및 이용 목적</strong>
            </p>
            <p>1) 상담 진행, 교육과정 설계, 문의사항 응대, 민원해결</p>
            <p>
              2) 광고성 정보 수신에 대하여 별도의 동의를 한 회원에 한하여 &quot;한평생원격교육원&quot;과 각 제휴사의 새로운 서비스, 이벤트, 최신 정보의 안내 등
              회원의 취향에 맞는 최적의 정보 제공
            </p>
            <p>
              <strong>2. 수집 및 이용하는 개인정보 항목</strong>
            </p>
            <p>(필수) 이름, 휴대전화번호, 이메일 주소</p>
            <p>(선택) 제출된 상담 문의 내용 또는 첨부파일에 기재된 개인정보</p>
            <p>
              <strong>3. 보유 및 이용 기간</strong>
            </p>
            <p>법령이 정하는 경우를 제외하고는 수집일로부터 1년 또는 동의 철회 시까지 보유 및 이용합니다.</p>
            <p>
              <strong>4. 신청자는 동의를 거부할 권리가 있습니다. 단, 동의를 거부하는 경우 상담 서비스 이용이 제한됩니다.</strong>
            </p>
          </div>

          <div className="ex-actions">
            <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg ex-design-submit">
              신청하기
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
