import type { Metadata } from "next";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import OrgBoard from "@/components/practice-support/OrgBoard";
import { ORG_BASE_DATE, ORG_TOTAL } from "@/components/practice-support/orgData";
// 모바일 목록 · 파란 제목 띠 스타일은 학습지원 CSS 에만 있어서 같이 불러온다 (실습공지사항과 같음)
import "@/styles/learning-support.css";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "실습기관 안내" };

/** 원본 /stdSup/practiceOrgList.asp — 보건복지부 사회복지현장실습 선정기관 목록 */
export default function PracticeOrganizationsPage() {
  return (
    <>
      <MobilePageBanner name="notice" text="실습기관 안내" />
      <main className="wrapper">
        <div className="container lx-page lx-page--plain po-page">
          <div className="po-head">
            <div>
              <h1 className="page-title">사회복지현장실습 선정기관 안내</h1>
              <p className="lx-desc">
                보건복지부 사회복지현장실습 선정기관 중 현재 정상 선정된 기관 <strong>{ORG_TOTAL.toLocaleString()}곳</strong>을
                지역별로 안내합니다. (기준일 {ORG_BASE_DATE})
                <br />
                실습 가능 여부·모집 인원·실습비는 기관마다 다르니 신청 전에 해당 기관에 직접 확인해 주세요.
              </p>
            </div>
            <a className="ds-btn ds-btn--secondary po-ext" href="https://www.welfare.net/lic/" target="_blank" rel="noopener noreferrer">
              사회복지사 자격관리센터
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6 3.5h6.5V10M12.5 3.5 4 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <OrgBoard />
        </div>
      </main>
    </>
  );
}
