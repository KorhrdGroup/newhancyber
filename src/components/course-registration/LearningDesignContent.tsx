"use client";

import { useState, type FormEvent } from "react";
import { importantStyle } from "@/lib/importantStyle";

/** 무료학습설계 신청 (원본 learning-design.html) */
export default function LearningDesignContent() {
  const [isConsentOpen, setIsConsentOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 학습설계 신청 API 연동 (new FormData(e.currentTarget))
    // 원본처럼 개인정보 동의 체크박스는 폼 밖에 있어 제출 값·필수 검사에 들어가지 않는다.
    alert("학습설계 신청 API 연동 전입니다.");
  };

  return (
    <main className="wrapper">
      <div className="container">
        <img src="/resources/images/course-registration/learning-design-01.png" alt="무료학습설계" className="learning-design-image" />
      </div>
      <div className="container" ref={importantStyle("background-color", "#fff")}>
        <form className="consultation-form" id="consultation-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="name" className="form-label">
              성명
            </label>
            {" "}
            <input type="text" id="name" name="name" className="form-input" placeholder="이름을 입력해주세요" />
          </div>
          <div className="form-row">
            <label htmlFor="phone" className="form-label">
              휴대폰 번호
            </label>
            {" "}
            <input type="text" id="phone" name="phone" className="form-input" placeholder="010-1234-5678" />
          </div>
          <div className="form-row">
            <label className="form-label">
              희망 상담 유형
            </label>
            <div className="form-radio-group">
              <label className="form-radio-label">
                <input type="radio" name="consultation-type" value="phone" defaultChecked />
                {" "}
                <span>
                  전화상담
                </span>
              </label>
              {" "}
              <label className="form-radio-label">
                <input type="radio" name="consultation-type" value="kakao" />
                {" "}
                <span>
                  카톡상담
                </span>
              </label>
            </div>
          </div>
          <div className="form-row">
            <label htmlFor="consultation-time" className="form-label">
              희망상담 시간
            </label>
            {" "}
            <input type="text" id="consultation-time" name="consultation-time" className="form-input" placeholder="문의내용" />
          </div>
          <div className="form-row">
            <label htmlFor="inquiry" className="form-label">
              문의내용
            </label>
            {" "}
            <textarea id="inquiry" name="inquiry" className="form-textarea" rows={5}></textarea>
          </div>
        </form>
        <div className="form-consent-section">
          <label className="form-checkbox-label">
            <input type="checkbox" id="privacy-consent" name="privacy-consent" required />
            {" "}
            <span>
              <strong>
                (필수)
              </strong>
              {" "}개인정보 수집 및 이용에 동의합니다.{" "}
              <span
                className="consent-more-btn"
                id="consent-more-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsConsentOpen((open) => !open);
                }}
              >
                더보기
              </span>
            </span>
          </label>
          <div
            className="form-consent-details"
            id="consent-details"
            style={isConsentOpen ? undefined : { display: "none" }}
          >
            <h4>
              개인정보 수집 및 이용 동의 안내
            </h4>
            <p>
              <strong>
                1. 개인정보 수집 및 이용 목적
              </strong>
            </p>
            <p>
              1) 상담 진행, 교육과정 설계, 문의사항 응대, 민원해결
            </p>
            <p>
              2) 광고성 정보 수신에 대하여 별도의 동의를 한 회원에 한하여 &quot;덧셈원격평생교육원&quot;과 각 제휴사의 새로운 서비스, 이벤트, 최신 정보의 안내 등 회원의 취향에 맞는 최적의 정보 제공
            </p>
            <p>
              <strong>
                2. 수집 및 이용하는 개인정보 항목
              </strong>
            </p>
            <p>
              (필수) 이름, 휴대전화번호, 이메일 주소
            </p>
            <p>
              (선택) 제출된 상담 문의 내용 또는 첨부파일에 기재된 개인정보
            </p>
            <p>
              <strong>
                3. 보유 및 이용 기간
              </strong>
            </p>
            <p>
              법령이 정하는 경우를 제외하고는 수집일로부터 1년 또는 동의 철회 시까지 보유 및 이용합니다.
            </p>
            <p>
              <strong>
                4. 신청자는 동의를 거부할 권리가 있습니다. 단, 동의를 거부하는 경우 상담 서비스 이용이 제한됩니다.
              </strong>
            </p>
          </div>
        </div>
        <div className="form-submit-section">
          <button type="submit" className="consultation-submit-btn" form="consultation-form">
            신청하기
          </button>
        </div>
      </div>
    </main>
  );
}
