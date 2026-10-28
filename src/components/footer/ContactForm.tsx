"use client";

import { useState, type FormEvent } from "react";

/** 불편사항 접수 폼 */
export default function ContactForm() {
  const [isConsentOpen, setIsConsentOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 불편사항 접수 API 연동 (new FormData(e.currentTarget))
    alert("불편사항 접수 API 연동 전입니다.");
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form-group">
        <label htmlFor="name" className="contact-form-label">
          이름
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="contact-form-input"
          placeholder="이름을 입력해주세요"
          required
        />
      </div>
      <div className="contact-form-group">
        <label htmlFor="contact" className="contact-form-label">
          연락처
        </label>
        <input
          type="tel"
          id="contact"
          name="contact"
          className="contact-form-input"
          placeholder="-를 제외하고 입력하세요"
          required
        />
      </div>
      <div className="contact-form-group">
        <label htmlFor="content" className="contact-form-label">
          내용
        </label>
        <textarea
          id="content"
          name="content"
          className="contact-form-textarea"
          placeholder="불편사항을 작성해주세요"
          rows={8}
          required
        ></textarea>
      </div>
      <div className="contact-form-consent-section">
        <label className="contact-form-checkbox-label">
          <span>
            개인정보 활용 동의{" "}
            <span
              className="contact-form-consent-more-btn"
              id="consent-more-btn"
              role="button"
              aria-expanded={isConsentOpen}
              onClick={(e) => {
                // 라벨 안이라 기본 동작(체크박스 토글)을 막는다
                e.preventDefault();
                e.stopPropagation();
                setIsConsentOpen((open) => !open);
              }}
            >
              [내용보기]
            </span>
          </span>
          <input type="checkbox" id="consent" name="consent" required />
        </label>
        <div
          className="contact-form-consent-details"
          id="consent-details"
          style={isConsentOpen ? undefined : { display: "none" }}
        >
          <h4>개인정보 수집 및 이용 동의 안내</h4>
          <p>
            <strong>1. 개인정보 수집 및 이용 목적</strong>
          </p>
          <p>1) 상담 진행, 교육과정 설계, 문의사항 응대, 민원해결</p>
          <p>
            2) 광고성 정보 수신에 대하여 별도의 동의를 한 회원에 한하여 &quot;덧셈원격평생교육원&quot;과 각 제휴사의
            새로운 서비스, 이벤트, 최신 정보의 안내 등 회원의 취향에 맞는 최적의 정보 제공
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
            <strong>
              4. 신청자는 동의를 거부할 권리가 있습니다. 단, 동의를 거부하는 경우 상담 서비스 이용이 제한됩니다.
            </strong>
          </p>
        </div>
      </div>
      <button type="submit" className="contact-form-submit">
        접수하기
      </button>
    </form>
  );
}
