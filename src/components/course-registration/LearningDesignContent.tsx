"use client";

import { useState, useTransition, type FormEvent } from "react";
import { applyStudyPlan } from "@/app/course-registration/learning-design/actions";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";
import "@/styles/credit-bank.css";
import StepTiles from "@/components/common/StepTiles";

/** 진행 순서 — 바우처 「이용 방법」과 같은 판 (그림 · 한 줄 설명, 번호 없음) */
const designSteps = [
  { title: "무료학습설계 신청", desc: "아래 신청서를 작성해 보내요.", icon: "/resources/images/credit-bank/cb-icon-scroll-pen.png" },
  { title: "검토", desc: "담당자가 신청 내용을 살펴봐요.", icon: "/resources/images/credit-bank/cb-icon-magnifier.png" },
  { title: "전문가 연결", desc: "학습설계 전문가가 연락드려요.", icon: "/resources/images/credit-bank/cb-icon-chat-person.png" },
];

/** 무료학습설계 신청 (원본 learning-design.html) — 진행 순서 그림 + 디자인 시스템 신청서, 관리자 「학습설계 관리」로 들어간다 */
export default function LearningDesignContent() {
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    startTransition(async () => {
      try {
        const result = await applyStudyPlan(data);
        alert(result.message);
        if (result.ok) {
          form.reset();
        } else if (result.field) {
          document.getElementById(result.field)?.focus();
        }
      } catch {
        alert("지금은 신청을 받을 수 없어요. 잠시 뒤 다시 시도해 주세요.");
      }
    });
  };

  return (
    <main className="wrapper">
      <div className="ex-page">
        <section className="cr-step-panel" aria-labelledby="design-steps-title">
          <h2 className="ex-section-title" id="design-steps-title">
            진행 순서
          </h2>
          <StepTiles items={designSteps.map((step) => ({ icon: step.icon, title: step.title, desc: step.desc }))} />
        </section>

        <form className="ex-box ex-design-form" id="consultation-form" onSubmit={handleSubmit}>
          <h2 className="ex-section-title">학습설계 신청서</h2>

          <div className="ex-field-grid">
            <div>
              <label htmlFor="name" className="ds-label">
                성명
              </label>
              <input type="text" id="name" name="name" className="ds-input" placeholder="이름을 입력해주세요" maxLength={50} />
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
            <input type="text" id="consultation-time" name="consultation-time" className="ds-input" placeholder="예: 평일 오후 2시 이후" maxLength={100} />
          </div>

          <div className="ex-field">
            <label htmlFor="inquiry" className="ds-label">
              문의내용
            </label>
            <textarea id="inquiry" name="inquiry" className="ds-textarea ds-textarea--sm" placeholder="문의내용" maxLength={1500} />
          </div>
          {/* 자동 등록 프로그램 거르기 — 사람에게는 보이지 않고 화면 읽기 프로그램 · 탭 이동에서도 빠진다. 채워져 오면 서버가 저장하지 않는다 */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
            <label htmlFor="ld-extra">이 칸은 비워 두세요</label>
            <input type="text" id="ld-extra" name="ld-extra" tabIndex={-1} autoComplete="off" defaultValue="" />
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
            <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg ex-design-submit" disabled={pending}>
              {pending ? "신청 중…" : "신청하기"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
