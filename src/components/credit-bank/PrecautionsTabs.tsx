"use client";

import { useState } from "react";
import ButtonTabs from "@/components/common/ButtonTabs";

export interface PrecautionsPanel {
  key: string;
  label: string;
  content: React.ReactNode;
}

/** 주의사항 탭 (학점제한 / 중복과목·대학생 학점인정) */
export default function PrecautionsTabs({ panels }: { panels: PrecautionsPanel[] }) {
  const [activeKey, setActiveKey] = useState(panels[0]?.key);

  return (
    <>
      <ButtonTabs
        variant="line"
        items={panels}
        active={activeKey}
        onSelect={setActiveKey}
        ariaLabel="주의사항 구분"
      />

      <section className="precautions-content">
        <div className="container">
          {panels.map((panel) => (
            <div
              key={panel.key}
              className={`precautions-tab-panel${panel.key === activeKey ? " active" : ""}`}
              id={`tab-${panel.key}`}
            >
              {panel.content}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
