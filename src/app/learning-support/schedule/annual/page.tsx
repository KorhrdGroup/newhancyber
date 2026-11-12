import type { Metadata } from "next";
import Link from "next/link";
import SectionTabs, { scheduleTabs } from "@/components/learning-support/extra/SectionTabs";
import { annualSchedule } from "@/components/learning-support/extra/annualScheduleData";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import { SUPPORT_PHONE } from "@/lib/contact";

export const metadata: Metadata = { title: "연간 학사일정" };

export default function LearningAnnualSchedulePage() {
  return (
    <>
      <MobilePageBanner name="schedule" text="연간 학사일정" />
      <main className="wrapper">
        <SectionTabs items={scheduleTabs} />
        <div className="container lx-page">
          <h1 className="page-title">연간 학사일정</h1>
          <ul className="lx-notes">
            <li className="page-list-item">아래의 연간 학사일정은 교육원 사정에 의해 변경될 수 있습니다.</li>
            {/* 원본은 상담실 번호가 비어 있다 ("상담실(-)") — 원격지원 화면과 같은 대표번호를 넣었다 */}
            <li className="page-list-item">
              차수별 개설 예정 과목 등 자세한 학사일정은 학습지원센터({SUPPORT_PHONE})로 연락하시면 확인할 수 있습니다.
            </li>
          </ul>

          {annualSchedule.map((group) => (
            <section key={group.year} className="lx-year">
              <h2 className="lx-section-title">{group.year}</h2>
              <div className="lx-term-grid">
                {group.terms.map((term) => (
                  <div key={term.term} className={`lx-term${term.open ? " is-open" : ""}`}>
                    <div className="lx-term-head">
                      <h3 className="lx-term-title">{term.term}</h3>
                      {term.open ? (
                        <Link href="/course-registration/register" className="ds-btn ds-btn--primary ds-btn--sm">
                          수강신청
                        </Link>
                      ) : (
                        <span className="ds-badge ds-badge--neutral">수강불가</span>
                      )}
                    </div>
                    <dl className="lx-term-list">
                      {term.rows.map((row) => (
                        <div key={row.label} className="lx-term-row">
                          <dt>{row.label}</dt>
                          <dd>{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
