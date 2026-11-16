"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import "@/styles/classroom.css";
import "@/styles/mypage.css";

/** 필수 칸 표시 */
const Req = () => <span className="mp-req">*</span>;

/** 불편사항 접수 폼 — 마이페이지 신청서와 같은 틀 */
export default function ContactForm() {
  const [isConsentOpen, setIsConsentOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!String(data.get("name") ?? "").trim()) {
      alert("이름을 입력해 주세요.");
      return;
    }
    if (!String(data.get("contact") ?? "").trim()) {
      alert("연락처를 입력해 주세요.");
      return;
    }
    if (!String(data.get("content") ?? "").trim()) {
      alert("내용을 입력해 주세요.");
      return;
    }
    if (!data.get("consent")) {
      alert("개인정보 활용에 동의해 주세요.");
      return;
    }
    // TODO: 불편사항 접수 API 연동 (data)
    alert("불편사항 접수 API 연동 전입니다.");
  };

  return (
    <form className="pp-box mp-form" onSubmit={handleSubmit}>
      <div className="mp-form-head">
        <h1 className="pp-box-title">불편사항 접수</h1>
        <p className="pp-note">
          <Req /> 표시는 필수 입력 사항입니다.
        </p>
      </div>
      <div className="pp-field">
        <label htmlFor="contact-name" className="ds-label">
          이름
          <Req />
        </label>
        <input type="text" id="contact-name" name="name" className="ds-input" placeholder="이름을 입력해 주세요." />
      </div>
      <div className="pp-field">
        <label htmlFor="contact-phone" className="ds-label">
          연락처
          <Req />
        </label>
        <input
          type="tel"
          id="contact-phone"
          name="contact"
          className="ds-input"
          inputMode="numeric"
          placeholder="- 없이 숫자만 입력해 주세요."
        />
      </div>
      <div className="pp-field">
        <label htmlFor="contact-content" className="ds-label">
          내용
          <Req />
        </label>
        <textarea id="contact-content" name="content" className="ds-textarea" placeholder="불편사항을 입력해 주세요." />
      </div>
      <div className="pp-field">
        <div className="contact-consent">
          <label className="ds-check">
            <input type="checkbox" name="consent" />
            개인정보 활용 동의
            <Req />
          </label>
          <button
            type="button"
            className="ds-btn ds-btn--ghost ds-btn--sm"
            aria-expanded={isConsentOpen}
            aria-controls="contact-consent-details"
            onClick={() => setIsConsentOpen((open) => !open)}
          >
            {isConsentOpen ? "내용 닫기" : "내용 보기"}
          </button>
        </div>
        {isConsentOpen && (
          <div className="contact-consent-details" id="contact-consent-details">
            <h4>개인정보 수집 및 이용 동의 안내</h4>
            <p>
              <strong>1. 개인정보 수집 및 이용 목적</strong>
            </p>
            <p>1) 상담 진행, 교육과정 설계, 문의사항 응대, 민원해결</p>
            <p>
              2) 광고성 정보 수신에 대하여 별도의 동의를 한 회원에 한하여 &quot;한평생원격교육원&quot;과 각 제휴사의
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
        )}
      </div>
      <div className="pp-actions">
        <Link href="/" className="ds-btn ds-btn--secondary">
          취소
        </Link>
        <button type="submit" className="ds-btn ds-btn--primary">
          접수하기
        </button>
      </div>
    </form>
  );
}
