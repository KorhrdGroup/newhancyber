"use client";

import { useState } from "react";

const IMG = "/resources/images/pratice-support";

type StepKey = "step1" | "step2" | "step3";

interface PracticeTabsProps {
  /** 페이지 제목 (예: 사회복지현장실습) */
  title: string;
  desc: string;
  /** STEP 1 버튼 두 번째 줄 (과정마다 다름) */
  step1Label: string;
  step1: React.ReactNode;
  step2: React.ReactNode;
  step3: React.ReactNode;
}

/**
 * 실습 안내 4개 화면(사회복지사·보육교사·한국어교원·평생교육사)의 공통 틀.
 * 학습지원 화면과 같은 흰 바탕(lx-page--plain) + 제목 + STEP 1~3 그림 탭. 탭을 누르면 아래 내용만 바뀐다.
 */
export default function PracticeTabs({ title, desc, step1Label, step1, step2, step3 }: PracticeTabsProps) {
  const [activeTab, setActiveTab] = useState<StepKey>("step1");

  const tabs: { key: StepKey; icon: string; label: string; panel: React.ReactNode }[] = [
    { key: "step1", icon: "pratice-support-01.png", label: step1Label, panel: step1 },
    { key: "step2", icon: "pratice-support-02.png", label: "실습과목 접수 / 실습기관 섭외", panel: step2 },
    { key: "step3", icon: "pratice-support-03.png", label: "실습진행", panel: step3 },
  ];

  return (
    <div className="container lx-page lx-page--top lx-page--plain">
      <h1 className="page-title">{title}</h1>
      <p className="lx-desc">{desc}</p>

      <div className="ds-tabs-box ds-tabs-box--step lx-practice-tabs" role="tablist" aria-label="실습 진행 단계">
        {tabs.map((tab, i) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`practice-tab-${tab.key}`}
              aria-selected={isActive}
              aria-controls={`practice-panel-${tab.key}`}
              className={`ds-tab-box${isActive ? " is-active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <img src={`${IMG}/${tab.icon}`} alt="" className="ds-tab-icon" />
              <span className="ds-tab-text">
                <span className="ds-tab-step">STEP {i + 1}</span>
                <span className="ds-tab-title">{tab.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.key}
          role="tabpanel"
          id={`practice-panel-${tab.key}`}
          aria-labelledby={`practice-tab-${tab.key}`}
          hidden={tab.key !== activeTab}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
