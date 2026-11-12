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
  /** 카드가 많아 두 줄이 되는 탭: 아이콘·제목만 담은 낮은 카드로 두 줄 높이를 줄인다 */
  compact?: boolean;
  summary: React.ReactNode;
}[] = [
  {
    key: "support",
    label: "한 단계 진화한 학습지원",
    subtitle: "더 깊고, 더 완벽한 학습 관리의 시작",
    cards: [
      { title: "학습설계 담당자", icon: "support-tab-001.png", lines: ["맞춤 커리큘럼 설계와 취득 상담"] },
      { title: "기술지원 전문가", icon: "support-tab-002.png", lines: ["학습 중 불편사항 원격 해결"] },
      { title: "학습관리 담당자", icon: "support-tab-003.png", lines: ["학사 문의 응대와 일정 알림"] },
    ],
    summary: (
      <>
        <strong>1:3 체계적 관리</strong>로 세 명의 전문가가 함께합니다
      </>
    ),
  },
  {
    key: "management",
    label: "과락 없는 밀착 관리",
    subtitle: "자격증/학위취득 처음부터 마지막까지!",
    cards: [
      { title: "알리미 서비스", icon: "support-tab2-001.png", lines: ["놓치기 쉬운 학사일정을 미리 알림"] },
      { title: "개별 밀착 관리", icon: "support-tab2-002.png", lines: ["학습자 한 명 한 명 밀착 관리"] },
    ],
    summary: (
      <>
        <strong>자동 일정 케어</strong>로 과락 없는 학습을 완성합니다
      </>
    ),
  },
  {
    key: "guide",
    label: "학습자 만족을 위한 완벽 가이드",
    subtitle: "더 나은 학습 여정을 위한 만족 프로젝트",
    compact: true,
    cards: [
      { title: "한평생원격교육원 OT 가이드", icon: "support-tab3-001.png", lines: [] },
      { title: "진행 과정별 가이드", icon: "support-tab3-002.png", lines: [] },
      { title: "실습 가이드", icon: "support-tab3-003.png", lines: [] },
      { title: "학습자등록 가이드", icon: "support-tab3-004.png", lines: [] },
      { title: "학점인정 신청 가이드", icon: "support-tab3-005.png", lines: [] },
      { title: "학위신청 가이드", icon: "support-tab3-006.png", lines: [] },
    ],
    summary: (
      <>
        전체 절차를 <strong>한눈에</strong> 정리했습니다
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

        {/* 세 탭을 같은 칸에 겹쳐 두고 안 보이는 탭은 visibility 로 숨긴다
            → 영역 높이가 가장 긴 탭에 맞춰져, 탭을 바꿔도 아래 내용이 들썩이지 않는다 */}
        <div className="why-choose-panels">
          {tabs.map((tab) => {
            const hidden = tab.key !== activeTab;
            return (
              <div
                key={tab.key}
                className={`why-choose-content${hidden ? " is-hidden" : ""}`}
                aria-hidden={hidden}
                inert={hidden}
              >
                <h4 className="why-choose-subtitle">{tab.subtitle}</h4>
                <div className={`why-cards${tab.compact ? " why-cards--compact" : ""}`}>
                  {tab.cards.map((card) => (
                    <div key={card.title} className="why-card">
                      <img src={`${SUPPORT_IMG}/${card.icon}`} alt="" className="why-card-icon" />
                      <div className="why-card-text">
                        <h5 className="why-card-title">{card.title}</h5>
                        {card.lines.map((line) => (
                          <p key={line} className="why-card-desc">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="why-choose-summary">{tab.summary}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
