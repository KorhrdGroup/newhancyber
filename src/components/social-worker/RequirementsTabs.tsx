"use client";

import { useState } from "react";
import ButtonTabs from "@/components/common/ButtonTabs";

export interface TabPanel {
  key: string;
  label: string;
  content: React.ReactNode;
}

/**
 * 급수별 자격요건 탭 (사회복지사 자격 / 2급 / 1급).
 * 탭 줄은 본문 위(2단계 밑줄 탭), 아래는 학습지원·실습 안내와 같은 흰 바탕 틀(제목 + 한 줄 설명 + 내용).
 */
export default function RequirementsTabs({ title, desc, panels }: { title: string; desc: string; panels: TabPanel[] }) {
  const [activeKey, setActiveKey] = useState(panels[0].key);

  return (
    <>
      <ButtonTabs
        variant="line"
        className="lx-tabs--under-header"
        items={panels}
        active={activeKey}
        onSelect={setActiveKey}
        ariaLabel="자격 구분"
      />
      <div className="container lx-page lx-page--plain">
        <h1 className="page-title">{title}</h1>
        <p className="lx-desc">{desc}</p>
        {panels.map((panel) => (
          <div key={panel.key} role="tabpanel" aria-label={panel.label} hidden={panel.key !== activeKey}>
            {panel.content}
          </div>
        ))}
      </div>
    </>
  );
}

/** 1급 탭 안의 서브 탭 (응시자격 / 시험과목·제출서류) — 3단계 세그먼트 */
export function RequirementsSubTabs({ panels }: { panels: TabPanel[] }) {
  const [activeKey, setActiveKey] = useState(panels[0].key);

  return (
    <>
      <ButtonTabs className="sw-sub-tabs" items={panels} active={activeKey} onSelect={setActiveKey} ariaLabel="1급 안내 구분" />
      {panels.map((panel) => (
        <div key={panel.key} role="tabpanel" aria-label={panel.label} hidden={panel.key !== activeKey}>
          {panel.content}
        </div>
      ))}
    </>
  );
}
