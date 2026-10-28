"use client";

import { useState } from "react";

const SUPPORT_IMG = "/resources/images/main/support";

type TabKey = "support" | "management" | "guide";

const tabs: { key: TabKey; label: string }[] = [
  { key: "support", label: "한 단계 진화한 학습지원" },
  { key: "management", label: "과락 없는 밀착 관리" },
  { key: "guide", label: "학습자 만족을 위한 완벽 가이드" },
];

const experts = [
  { title: "학습설계 담당자", icon: "support-tab-001.png", items: ["개인별 맞춤 커리큘럼 설계", "자격증, 학위취득 상담"] },
  { title: "기술지원 전문가", icon: "support-tab-002.png", items: ["학습 중 불편사항 원격 해결", "덧셈 교육원 전반 기술지원"], highlight: true },
  { title: "학습관리 담당자", icon: "support-tab-003.png", items: ["수강, 학사 관련 문의 응대", "학습 진행 상황 지속 관리", "학사일정 알림 서비스"] },
];

const managements = [
  { title: "알리미 서비스", icon: "support-tab2-001.png", desc: "일정 놓칠 걱정 없는 알리미 서비스" },
  { title: "개별 밀착 관리", icon: "support-tab2-002.png", desc: "학습자 개별 밀착 관리시스템" },
];

const guides = [
  { title: "덧셈 OT 가이드", icon: "support-tab3-001.png" },
  { title: "진행 과정별 가이드", icon: "support-tab3-002.png" },
  { title: "실습 가이드", icon: "support-tab3-003.png" },
  { title: "학습자등록 가이드", icon: "support-tab3-004.png" },
  { title: "학점인정 신청 가이드", icon: "support-tab3-005.png" },
  { title: "학위신청 가이드", icon: "support-tab3-006.png" },
];

/** 왜 덧셈원격평생교육원을 선택할까요? (탭 3개) */
export default function WhyChoose() {
  const [activeTab, setActiveTab] = useState<TabKey>("support");
  const hiddenUnless = (key: TabKey) => (key === activeTab ? undefined : { display: "none" });

  return (
    <section className="why-choose-section">
      <div className="why-choose-container">
        <h3 className="why-choose-title">왜 덧셈원격평생교육원을 선택할까요?</h3>

        <div className="why-choose-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`why-choose-tab${tab.key === activeTab ? " active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="why-choose-content why-choose-content-support" style={hiddenUnless("support")}>
          <h4 className="why-choose-subtitle">더 깊고, 더 완벽한 학습 관리의 시작</h4>
          <div className="expert-cards">
            {experts.map((expert) => (
              <div
                key={expert.title}
                className={`expert-card${expert.highlight ? " expert-card-highlight" : ""}`}
              >
                <div className="expert-card-icon">
                  <img src={`${SUPPORT_IMG}/${expert.icon}`} alt={expert.title} className="expert-icon-img" />
                </div>
                <h5 className="expert-card-title">{expert.title}</h5>
                <ul className="expert-card-list">
                  {expert.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="why-choose-summary">
            <strong>1:3 체계적 관리,</strong> 학습의 모든 과정을 <strong>세 명의 전문가가 함께 지원</strong>
            합니다
          </p>
        </div>

        <div className="why-choose-content why-choose-content-management" style={hiddenUnless("management")}>
          <h4 className="why-choose-subtitle">자격증/학위취득 처음부터 마지막까지!</h4>
          <div className="management-cards">
            {managements.map((item) => (
              <div key={item.title} className="management-card">
                <div className="management-card-icon">
                  <img src={`${SUPPORT_IMG}/${item.icon}`} alt={item.title} className="management-icon-img" />
                </div>
                <h5 className="management-card-title">{item.title}</h5>
                <p className="management-card-desc">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="why-choose-summary">
            <strong>자동 일정 케어</strong>와 <strong>개인화 관리</strong>로 <strong>과락 없는 학습 흐름</strong>
            을 완성합니다
          </p>
        </div>

        <div className="why-choose-content why-choose-content-guide" style={hiddenUnless("guide")}>
          <h4 className="why-choose-subtitle">더 나은 학습 여정을 위한 만족 프로젝트</h4>
          <div className="guide-cards">
            {guides.map((guide) => (
              <div key={guide.title} className="guide-card">
                <div className="guide-card-icon">
                  <img src={`${SUPPORT_IMG}/${guide.icon}`} alt={guide.title} className="guide-icon-img" />
                </div>
                <p className="guide-card-text">{guide.title}</p>
              </div>
            ))}
          </div>
          <p className="why-choose-summary">
            전체 절차를 <strong>한눈에 정리한 안내</strong>로 학습 여정을 <strong>더욱 쉽고 명확하게</strong>{" "}
            만듭니다.
          </p>
        </div>
      </div>
    </section>
  );
}
