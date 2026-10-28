"use client";

import { useState } from "react";

const IMG = "/resources/images/pratice-support";

type StepKey = "step1" | "step2" | "step3";

interface PracticeTabsProps {
  /** STEP 1 버튼 두 번째 줄 (과정마다 다름) */
  step1Label: string;
  step1: React.ReactNode;
  step2: React.ReactNode;
  step3: React.ReactNode;
}

/** 실습 안내 페이지의 STEP 1~3 탭 (원본 .practice-tab-btn 스크립트) */
export default function PracticeTabs({ step1Label, step1, step2, step3 }: PracticeTabsProps) {
  const [activeTab, setActiveTab] = useState<StepKey>("step1");

  const tabs: { key: StepKey; icon: string; label: string; panel: React.ReactNode }[] = [
    { key: "step1", icon: "pratice-support-01.png", label: step1Label, panel: step1 },
    { key: "step2", icon: "pratice-support-02.png", label: "실습과목 접수 / 실습기관 섭외", panel: step2 },
    { key: "step3", icon: "pratice-support-03.png", label: "실습진행", panel: step3 },
  ];

  return (
    <div className="content-section">
      <div className="practice-tabs">
        <div className="practice-tabs-container">
          <div className="practice-tabs-nav">
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                type="button"
                className={`practice-tab-btn${tab.key === activeTab ? " active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <img src={`${IMG}/${tab.icon}`} alt={`STEP ${i + 1}`} className="practice-tab-icon" />
                <span className="practice-tab-text">
                  STEP {i + 1}
                  <br />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.key}
          className={`practice-tab-panel${tab.key === activeTab ? " active" : ""}`}
          id={`tab-${tab.key}`}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
