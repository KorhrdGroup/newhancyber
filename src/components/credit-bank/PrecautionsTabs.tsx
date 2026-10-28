"use client";

import { Fragment, useState } from "react";

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
      <div className="precautions-tabs">
        <div className="precautions-tabs-container">
          <nav className="precautions-tabs-nav">
            {panels.map((panel, i) => (
              <Fragment key={panel.key}>
                {i > 0 && " "}
                <button
                  type="button"
                  className={`precautions-tab-btn${panel.key === activeKey ? " active" : ""}`}
                  onClick={() => setActiveKey(panel.key)}
                >
                  {panel.label}
                </button>
              </Fragment>
            ))}
          </nav>
        </div>
      </div>

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
