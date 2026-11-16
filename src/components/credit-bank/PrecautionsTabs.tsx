"use client";

import { useState } from "react";
import ButtonTabs from "@/components/common/ButtonTabs";

export interface PrecautionsPanel {
  key: string;
  label: string;
  /** 제목 아래 한 줄 설명 */
  desc: string;
  content: React.ReactNode;
}

/** 주의사항 — 탭 2개(밑줄 탭) + 흰 바탕 틀. 제목은 고른 탭 이름 */
export default function PrecautionsTabs({ panels }: { panels: PrecautionsPanel[] }) {
  const [activeKey, setActiveKey] = useState(panels[0]?.key);
  const active = panels.find((panel) => panel.key === activeKey) ?? panels[0];

  return (
    <>
      <ButtonTabs
        variant="line"
        className="lx-tabs--under-header"
        items={panels}
        active={activeKey}
        onSelect={setActiveKey}
        ariaLabel="주의사항 구분"
      />

      <div className="container lx-page lx-page--plain cb-page">
        <h1 className="page-title">{active.label}</h1>
        <p className="lx-desc">{active.desc}</p>
        {panels.map((panel) => (
          <div key={panel.key} role="tabpanel" hidden={panel.key !== activeKey}>
            {panel.content}
          </div>
        ))}
      </div>
    </>
  );
}
