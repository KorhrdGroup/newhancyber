import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import SectionTabs, { programTabs } from "@/components/learning-support/extra/SectionTabs";
import StepDivider from "@/components/learning-support/extra/StepDivider";
import { SUPPORT_PHONE } from "@/lib/contact";
import DraftNote from "@/components/common/DraftNote";

export const metadata: Metadata = { title: "학습자 OT" };

/*
 * 원본(/stdSup/stuOT.asp)은 "준비 중" 그림만 있다.
 * 아래 내용은 이 사이트 FAQ(수료 기준·강의 구성·IP 등록·시험 재접속)와 공동인증서 안내 화면을 바탕으로 새로 썼다.
 * TODO: 교육원에서 OT 영상·자료가 나오면 바꾼다.
 */
const sections: { title: string; items: string[]; links?: { label: string; href: string }[] }[] = [
  {
    title: "학습 전 준비",
    items: [
      "아직 수강신청 전이라면 수강신청 절차를 먼저 확인해 주세요. 결제까지 마치면 개강일부터 나의 강의실에서 학습할 수 있습니다.",
      "대리출석·대리시험을 막기 위해 학습할 PC를 학습자 PC(IP)로 등록해야 합니다. 등록된 PC에서만 출석·시험이 인정됩니다.",
      "출석·과제·시험은 공동인증서로 로그인해야 합니다. 시험은 PC에서만 볼 수 있습니다.",
      "강의 자료를 열려면 한글·PDF 뷰어 등 수강지원프로그램을 미리 설치해 주세요.",
    ],
    links: [
      { label: "수강신청 절차", href: "/course-registration/process" },
      { label: "학습자 PC 등록", href: "/my-page/pc" },
      { label: "공동인증서 안내", href: "/learning-support/mobile-guide/certificate" },
      { label: "수강지원프로그램", href: "/learning-support/program" },
    ],
  },
  {
    title: "강의 듣기",
    items: [
      "강좌는 총 15주 과정으로, 중간고사·기말고사 기간을 뺀 13주 강의로 이루어져 있습니다.",
      "주차별로 정해진 학습 기간 안에 그 주의 강의를 모두 들어야 출석으로 인정됩니다.",
      "강의를 보다가 컴퓨터가 꺼지면 이어보기로 다시 들을 수 있습니다.",
    ],
  },
  {
    title: "시험·과제",
    items: [
      "중간고사·기말고사는 학사일정에 정해진 기간에만 볼 수 있습니다.",
      "시험 중 컴퓨터가 꺼져도 시험 기준시간(중간·기말 1시간, 쪽지시험 30분) 안에는 다시 접속할 수 있습니다.",
      "과제는 제출 기간 안에 나의 강의실에서 제출합니다.",
    ],
    links: [{ label: "연간 학사일정", href: "/learning-support/schedule/annual" }],
  },
  {
    title: "수료와 학점인정",
    items: [
      "성적 60점 이상, 출석 80% 이상을 모두 채워야 수료할 수 있습니다.",
      "과목마다 평가 기준이 다를 수 있으니 수강신청 화면의 강좌 강의 평가서를 확인해 주세요.",
      "수료한 과목은 정해진 학점인정 신청 기간에 국가평생교육진흥원 학점은행에 직접 신청해야 학점으로 인정됩니다.",
    ],
  },
];

export default function LearningOtPage() {
  return (
    <main className="wrapper">
      <SectionTabs items={programTabs} underHeader />
      <div className="container lx-page lx-page--plain">
        <h1 className="page-title">학습자 OT</h1>
        <p className="lx-desc">처음 수강하는 학습자를 위한 학습 안내입니다. 개강 전에 꼭 읽어 주세요.</p>
        <DraftNote>
          원본은 &quot;준비 중&quot; 그림뿐이라 이 사이트의 FAQ와 공동인증서 안내를 바탕으로 임시로
          작성했습니다. 교육원의 OT 영상·자료가 나오면 바꿔야 합니다.
        </DraftNote>

        {sections.map((section, i) => (
          <Fragment key={section.title}>
            {i > 0 && <StepDivider />}
            <section className="lx-panel">
              <h2 className="lx-section-title">
                <span className="lx-step-label">STEP {i + 1}</span> {section.title}
              </h2>
              <ul className="lx-notes">
                {section.items.map((item) => (
                  <li key={item} className="page-list-item">
                    {item}
                  </li>
                ))}
              </ul>
              {section.links && (
                <div className="lx-ot-links">
                  {section.links.map((link) => (
                    <Link key={link.href} href={link.href} className="ds-btn ds-btn--secondary ds-btn--sm">
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </Fragment>
        ))}

        <p className="lx-callout">
          학습 중 궁금한 점은 1:1 문의 또는 학습지원센터({SUPPORT_PHONE})로 문의해 주세요.
        </p>
      </div>
    </main>
  );
}
