import type { Metadata } from "next";
import Link from "next/link";
import { PracticeSection, RefNotes } from "@/components/practice-support/PracticeParts";
import { Figure } from "@/components/social-worker/SwParts";

export const metadata: Metadata = { title: "대상별 학습설계" };

/** 원본 social-worker/learning-design.html — 흰 바탕 틀 + 학력별 학습설계 그림 */
export default function SocialWorkerLearningDesignPage() {
  return (
    <main className="wrapper">
      <div className="container lx-page lx-page--top lx-page--plain">
        <h1 className="page-title">대상별 학습설계</h1>
        <p className="lx-desc">최종 학력에 따라 사회복지사 2급을 받기까지 필요한 학점과 과목을 안내합니다.</p>
        <p className="lx-callout">
          * 본 예시는 최소한의 설계를 기준으로 한 학습설계이므로 개개인의 보유학점과 상황이 다르므로 정확한 학습설계를 위해서는 담당자와
          상담 후 진행해주시기 바랍니다.
        </p>

        <div className="consultation-banner sw-banner">
          <div className="consultation-banner-content">
            <p className="consultation-banner-title">
              잠깐! 학점은행제 도움을 받고싶다면
              <br />
              지금 바로 <span className="text-consultations">상담신청</span>하세요!
            </p>
            <Link href="/course-registration/learning-design" className="ds-btn ds-btn--secondary ds-btn--lg sw-banner-btn">
              상담신청 하러가기
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6.25 4.5 9.75 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        <PracticeSection title="고등학교 졸업자">
          <Figure src="social-woorker04.png" alt="고등학교 졸업자 학습설계" />
        </PracticeSection>

        <PracticeSection title="전문대/4년제 졸업자">
          <Figure src="social-woorker05.png" alt="전문대/4년제 졸업자 학습설계" />
        </PracticeSection>

        <PracticeSection title="사회복지 2년제 학위취득 과정">
          <Figure src="social-woorker07.png" alt="사회복지 2년제 학위취득 과정" />
        </PracticeSection>

        <PracticeSection title="사회복지 학사 학위취득 과정">
          <Figure src="social-woorker06.png" alt="사회복지 학사 학위취득 과정" />
          <RefNotes
            items={[
              "전적대 성적증명서를 확인하여 이수한 학점을 전공, 교양, 일반으로 분류하여 부족한 학점만 추가적으로 이수하면 됩니다. 따라서 학습자에 따라 취득기간에 다소 차이가 있으므로 성적증명서를 토대로 학습설계를 받으셔야 합니다.",
              "대학 중퇴자의 전적대 학점인정의 기준은 다음과 같습니다.",
            ]}
          />
          <ul className="lx-notes sw-steps">
            <li className="page-list-plain">(1) 전문대의 경우 최대 80학점 (수업연한이 3년인 경우 최대 120학점)까지 인정</li>
            <li className="page-list-plain">(2) 대학의 경우 최대 140학점까지 인정 (단, 중퇴한 학점에 한함)</li>
            <li className="page-list-plain">(3) 성적이 60점 또는 D- 이상인 학습과목 인정</li>
          </ul>
        </PracticeSection>
      </div>
    </main>
  );
}
