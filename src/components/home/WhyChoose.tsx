"use client";

import { useState } from "react";

const SUPPORT_IMG = "/resources/images/main/support";

type TabKey = "support" | "management" | "guide";

type WhyCard = { title: string; icon: string; lines: string[] };

/** 세 탭이 같은 카드 틀(아이콘 · 제목 · 설명 줄)을 쓴다 */
const tabs: {
  key: TabKey;
  label: string;
  subtitle: string;
  cards: WhyCard[];
  summary: React.ReactNode;
}[] = [
  {
    key: "support",
    label: "한 단계 진화한 학습지원",
    subtitle: "더 깊고, 더 완벽한 학습 관리의 시작",
    cards: [
      { title: "학습설계 담당자", icon: "support-tab-001.png", lines: ["개인별 맞춤 커리큘럼 설계", "자격증, 학위취득 상담"] },
      { title: "기술지원 전문가", icon: "support-tab-002.png", lines: ["학습 중 불편사항 원격 해결", "한평생원격교육원 전반 기술지원"] },
      { title: "학습관리 담당자", icon: "support-tab-003.png", lines: ["수강, 학사 관련 문의 응대", "학습 진행 상황 지속 관리", "학사일정 알림 서비스"] },
    ],
    summary: (
      <>
        <strong>1:3 체계적 관리,</strong> 학습의 모든 과정을 <strong>세 명의 전문가가 함께 지원</strong>합니다
      </>
    ),
  },
  {
    key: "management",
    label: "과락 없는 밀착 관리",
    subtitle: "자격증/학위취득 처음부터 마지막까지!",
    cards: [
      { title: "알리미 서비스", icon: "support-tab2-001.png", lines: ["일정 놓칠 걱정 없는 알리미 서비스"] },
      { title: "개별 밀착 관리", icon: "support-tab2-002.png", lines: ["학습자 개별 밀착 관리시스템"] },
    ],
    summary: (
      <>
        <strong>자동 일정 케어</strong>와 <strong>개인화 관리</strong>로 <strong>과락 없는 학습 흐름</strong>을
        완성합니다
      </>
    ),
  },
  {
    key: "guide",
    label: "학습자 만족을 위한 완벽 가이드",
    subtitle: "더 나은 학습 여정을 위한 만족 프로젝트",
    // 설명 줄은 원본에 없어 다른 탭과 모양을 맞추려고 채운 문구
    cards: [
      { title: "한평생원격교육원 OT 가이드", icon: "support-tab3-001.png", lines: ["처음 수강하는 분을 위한 시작 안내"] },
      { title: "진행 과정별 가이드", icon: "support-tab3-002.png", lines: ["수강신청부터 취득까지 단계별 안내"] },
      { title: "실습 가이드", icon: "support-tab3-003.png", lines: ["실습 기관 선정부터 서류 제출까지"] },
      { title: "학습자등록 가이드", icon: "support-tab3-004.png", lines: ["학점은행제 학습자 등록 방법과 기간"] },
      { title: "학점인정 신청 가이드", icon: "support-tab3-005.png", lines: ["이수한 학점을 인정받는 신청 절차"] },
      { title: "학위신청 가이드", icon: "support-tab3-006.png", lines: ["학위 신청 자격과 제출 서류 안내"] },
    ],
    summary: (
      <>
        전체 절차를 <strong>한눈에 정리한 안내</strong>로 학습 여정을 <strong>더욱 쉽고 명확하게</strong> 만듭니다.
      </>
    ),
  },
];

/** 왜 한평생원격교육원을 선택할까요? (탭 3개) */
export default function WhyChoose() {
  const [activeTab, setActiveTab] = useState<TabKey>("support");

  return (
    <section className="why-choose-section">
      <div className="why-choose-container">
        <h3 className="why-choose-title">왜 한평생원격교육원을 선택할까요?</h3>

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

        {tabs.map((tab) => (
          <div
            key={tab.key}
            className="why-choose-content"
            style={tab.key === activeTab ? undefined : { display: "none" }}
          >
            <h4 className="why-choose-subtitle">{tab.subtitle}</h4>
            <div className="why-cards">
              {tab.cards.map((card) => (
                <div key={card.title} className="why-card">
                  <img src={`${SUPPORT_IMG}/${card.icon}`} alt="" className="why-card-icon" />
                  <h5 className="why-card-title">{card.title}</h5>
                  {card.lines.map((line) => (
                    <p key={line} className="why-card-desc">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
            <p className="why-choose-summary">{tab.summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
