"use client";

import { Fragment, useState } from "react";

export interface TabPanel {
  key: string;
  label: string;
  content: React.ReactNode;
}

function TabButtons({
  panels,
  activeKey,
  onSelect,
  buttonClass,
}: {
  panels: TabPanel[];
  activeKey: string;
  onSelect: (key: string) => void;
  buttonClass: string;
}) {
  return panels.map((panel, i) => (
    <Fragment key={panel.key}>
      {i > 0 && " "}
      <button
        type="button"
        className={`${buttonClass}${panel.key === activeKey ? " active" : ""}`}
        onClick={() => onSelect(panel.key)}
      >
        {panel.label}
      </button>
    </Fragment>
  ));
}

/** 급수별 자격요건 탭 (사회복지사 자격 / 2급 / 1급) */
export default function RequirementsTabs({ panels }: { panels: TabPanel[] }) {
  const [activeKey, setActiveKey] = useState(panels[0].key);

  return (
    <>
      <div className="requirements-tabs">
        <div className="requirements-tabs-container">
          <div className="requirements-tabs-nav">
            <TabButtons panels={panels} activeKey={activeKey} onSelect={setActiveKey} buttonClass="requirements-tab-btn" />
          </div>
        </div>
      </div>
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
        <div className="requirements-sub-tabs-nav">
          <TabButtons
            panels={panels}
            activeKey={activeKey}
            onSelect={setActiveKey}
            buttonClass="requirements-sub-tab-btn"
          />
        </div>
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
