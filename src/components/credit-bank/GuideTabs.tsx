"use client";

import { useState } from "react";
import ButtonTabs from "@/components/common/ButtonTabs";
import DraftNote from "@/components/common/DraftNote";
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

/** 탭마다 제목 아래 한 줄 설명 */
const tabDescs: Record<TabKey, string> = {
  procedure: "학점은행제에서는 학습자등록, 학점인정 신청, 학위신청을 완료하고 학위수여 요건을 충족한 자에게 학위를 수여하고 있습니다.",
  registration: "학점을 인정받아 학위를 취득하려면 먼저 학점은행제 학습자로 등록해야 합니다.",
  credit: "취득한 학점은 학점인정 신청을 해야 학점은행제 학점으로 인정받을 수 있습니다.",
  degree: "학위요건을 모두 채웠다면 정해진 기간에 학위를 신청합니다.",
  download: "학습자 등록부터 학위연계 신청까지, 단계별 가이드를 보거나 PDF로 내려받을 수 있습니다.",
};

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
    label: "학점인정 신청 가이드",
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

/** 행정절차 가이드 — 탭 5개(밑줄 탭) + 흰 바탕 틀. 제목은 고른 탭 이름, "가이드 다운로드" 탭에서만 가이드 종류 세그먼트가 보인다 */
export default function GuideTabs({ panels }: { panels: Record<InfoTabKey, React.ReactNode> }) {
  const [activeTab, setActiveTab] = useState<TabKey>("procedure");
  const [activeGuide, setActiveGuide] = useState(guides[0].key);

  const activeLabel = tabs.find((tab) => tab.key === activeTab)?.label;

  return (
    <>
      <ButtonTabs
        variant="line"
        className="lx-tabs--under-header cb-guide-tabs"
        items={tabs}
        active={activeTab}
        onSelect={(key) => setActiveTab(key as TabKey)}
        ariaLabel="행정절차 가이드"
      />

      <div className="container lx-page lx-page--plain cb-page">
        <h1 className="page-title">{activeLabel}</h1>
        <p className="lx-desc">{tabDescs[activeTab]}</p>

        {infoTabKeys.map((key) => (
          <div key={key} role="tabpanel" hidden={key !== activeTab}>
            {panels[key]}
          </div>
        ))}

        {activeTab === "download" && (
          <div role="tabpanel">
            <DraftNote>
              가이드 그림과 PDF 파일이 예전 덧셈원격평생교육원 자료입니다. 한평생원격교육원 자료로 다시 확인해서 바꿔야
              합니다.
            </DraftNote>
            <ButtonTabs items={guides} active={activeGuide} onSelect={setActiveGuide} ariaLabel="가이드 종류" className="cb-guide-kinds" />
            {guides
              .filter((guide) => guide.key === activeGuide)
              .map((guide) => (
                <section key={guide.key} className="cb-guide">
                  <div className="cb-guide-head">
                    <h2 className="lx-section-title">{guide.label}</h2>
                    <a href={`${GUIDE_IMG}/${guide.pdf}`} target="_blank" download={guide.pdf.split("/").pop()} className="ds-btn ds-btn--secondary ds-btn--sm">
                      PDF 다운로드
                    </a>
                  </div>
                  <GuideSlider key={guide.key} slides={guide.slides} />
                </section>
              ))}
          </div>
        )}
      </div>
    </>
  );
}
