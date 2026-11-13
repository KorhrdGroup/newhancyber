"use client";

import { useState } from "react";
import ButtonTabs from "@/components/common/ButtonTabs";

export interface TabPanel {
  key: string;
  label: string;
  content: React.ReactNode;
}

/** 급수별 자격요건 탭 (사회복지사 자격 / 2급 / 1급) */
export default function RequirementsTabs({ panels }: { panels: TabPanel[] }) {
  const [activeKey, setActiveKey] = useState(panels[0].key);

  return (
    <>
      <ButtonTabs variant="line" items={panels} active={activeKey} onSelect={setActiveKey} ariaLabel="자격 구분" />
      <div className="requirements-content">
        {panels.map((panel) => (
          <div
            key={panel.key}
            className={`requirements-tab-panel${panel.key === activeKey ? " active" : ""}`}
            id={`tab-${panel.key}`}
          >
            {panel.content}
          </div>
        ))}
      </div>
    </>
  );
}

/** 1급 탭 안의 서브 탭 (응시자격 / 시험과목·제출서류) */
export function RequirementsSubTabs({ panels }: { panels: TabPanel[] }) {
  const [activeKey, setActiveKey] = useState(panels[0].key);

  return (
    <>
      <div className="requirements-sub-tabs">
        <ButtonTabs items={panels} active={activeKey} onSelect={setActiveKey} ariaLabel="1급 안내 구분" />
      </div>
      {panels.map((panel) => (
        <div
          key={panel.key}
          className={`requirements-sub-tab-panel${panel.key === activeKey ? " active" : ""}`}
          id={`sub-tab-${panel.key}`}
        >
          {panel.content}
        </div>
      ))}
    </>
  );
}
