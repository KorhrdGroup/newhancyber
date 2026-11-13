"use client";

import { useState } from "react";
import ButtonTabs from "@/components/common/ButtonTabs";
import GuideSlider, { type GuideSlide } from "./GuideSlider";

type InfoTabKey = "procedure" | "registration" | "credit" | "degree";
type TabKey = InfoTabKey | "download";

const tabs: { key: TabKey; label: string }[] = [
  { key: "procedure", label: "신청절차 안내" },
  { key: "registration", label: "학습자등록" },
  { key: "credit", label: "학점인정신청" },
  { key: "degree", label: "학위신청" },
  { key: "download", label: "가이드 다운로드" },
];

const infoTabKeys: InfoTabKey[] = ["procedure", "registration", "credit", "degree"];

const GUIDE_IMG = "/resources/images/credit-bank";

const pages = (count: number, src: (n: string) => string, alt: string): GuideSlide[] =>
  Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return { src: `${GUIDE_IMG}/${src(n)}`, alt: `${alt} 페이지 ${i + 1}` };
  });

/** 가이드 다운로드 탭의 서브 탭 (원본 이미지·PDF 이름 그대로) */
const guides: { key: string; label: string; pdf: string; slides: GuideSlide[] }[] = [
  {
    key: "registration-guide",
    label: "학습자 등록 가이드",
    pdf: "learnerreg/학습자등록가이드_한평생원격.pdf",
    slides: pages(16, (n) => `learnerreg/learnerreg-img${n}.png`, "학습자 등록 가이드"),
  },
  {
    key: "credit-guide",
    label: "학습인정 신청 가이드",
    pdf: "learningrec/학점인정신청 가이드_한평생원격.pdf",
    slides: pages(10, (n) => `learningrec/learningrec${n}.png`, "학점인정 신청 가이드"),
  },
  {
    key: "degree-guide",
    label: "학위신청 가이드",
    pdf: "degree/학위신청가이드_한평생원격.pdf",
    slides: pages(8, (n) => `degree/degree-${n}.png`, "학위신청 가이드"),
  },
  {
    key: "degree-link-guide",
    label: "학위연계 신청 가이드",
    pdf: "degreecon/학위연계신청 가이드_한평생원격.pdf",
    slides: pages(9, (n) => `degreecon/degreecon-${n}.png`, "학위연계 신청 가이드"),
  },
];

/** 행정절차 가이드 — 탭 5개, "가이드 다운로드" 탭에서만 서브 탭이 보인다 */
export default function GuideTabs({ panels }: { panels: Record<InfoTabKey, React.ReactNode> }) {
  const [activeTab, setActiveTab] = useState<TabKey>("procedure");
  const [activeGuide, setActiveGuide] = useState(guides[0].key);

  const panelClass = (key: TabKey) => `guide-tab-panel${key === activeTab ? " active" : ""}`;

  return (
    <>
      <ButtonTabs variant="line" items={tabs} active={activeTab} onSelect={(key) => setActiveTab(key as TabKey)} ariaLabel="행정절차 가이드" />

      <section className="page-header">
        <div className="guide-tab-content">
          {infoTabKeys.map((key) => (
            <div key={key} className={panelClass(key)} id={`tab-${key}`}>
              {panels[key]}
            </div>
          ))}

          <div className="guide-sub-tabs" style={activeTab === "download" ? undefined : { display: "none" }}>
            <ButtonTabs items={guides} active={activeGuide} onSelect={setActiveGuide} ariaLabel="가이드 종류" />
          </div>

          <div className={panelClass("download")} id="tab-download">
            <div className="container">
              <div className="guide-sub-tab-content">
                {guides.map((guide) => {
                  const fileName = guide.pdf.split("/").pop();
                  return (
                    <div
                      key={guide.key}
                      className={`guide-sub-tab-panel${guide.key === activeGuide ? " active" : ""}`}
                      id={`sub-tab-${guide.key}`}
                    >
                      <a
                        href={`${GUIDE_IMG}/${guide.pdf}`}
                        target="_blank"
                        download={fileName}
                        className="guide-download-btn"
                      >
                        PDF 다운로드
                      </a>
                      <GuideSlider slides={guide.slides} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
