import Link from "next/link";
import { CONSULTATION_ANCHOR } from "./EventConsultation";
import { currentTerm, phones } from "./homeData";

/** 페이지 마무리 — 상담·수강신청으로 이어 준다 (데스크톱만, 모바일은 하단 고정 메뉴가 있음) */
export default function ClosingCta() {
  return (
    <section className="closing-cta-section">
      <div className="closing-cta-container">
        <div className="closing-cta-card">
          {/* 그림을 맨 앞 원 안에 — 상담 신청 배너라 말풍선 그림 (연필 그림은 바로 위 섹션 카드와 겹쳐서 피함) */}
          <div className="closing-cta-graphic">
            <img src="/resources/images/main/support/support-tab2-001.png" alt="" />
          </div>
          <div className="closing-cta-text">
            <p className="closing-cta-label">{currentTerm.name} · {currentTerm.openingDate} 개강</p>
            <h3 className="closing-cta-title">
              지금 상담 신청하고
              <br />
              <em>1:1 학습설계</em>를 무료로 받아보세요
            </h3>
            <p className="closing-cta-desc">
              수강신청 · 학습상담 <a href={`tel:${phones.registration}`}>{phones.registration}</a> · 평일 09:00 ~ 18:00
            </p>
          </div>
          <div className="closing-cta-actions">
            <a href={`#${CONSULTATION_ANCHOR}`} className="closing-cta-btn closing-cta-btn--primary">
              무료 상담 신청
            </a>
            <Link href="/course-registration/register" className="closing-cta-btn">
              수강신청 바로가기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
