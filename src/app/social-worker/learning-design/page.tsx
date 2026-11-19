import type { Metadata } from "next";
import Link from "next/link";
import { PracticeSection, RefNotes } from "@/components/practice-support/PracticeParts";
import { CreditFlow } from "@/components/social-worker/SwSteps";

export const metadata: Metadata = { title: "대상별 학습설계" };

/** 원본 social-worker/learning-design.html — 흰 바탕 틀 + 학력별 학습설계 그림 */
export default function SocialWorkerLearningDesignPage() {
  return (
    <main className="wrapper">
      <div className="container lx-page lx-page--top lx-page--plain sw-design">
        <h1 className="page-title">대상별 학습설계</h1>
        <p className="lx-desc">최종 학력에 따라 사회복지사 2급을 받기까지 필요한 학점과 과목을 안내합니다.</p>

        {/* 상담 배너: 설명 바로 아래 밝은 낮은 띠 */}
        <div className="sw-consult">
          <img className="sw-consult-icon" src="/resources/images/credit-bank/cb-icon-hands.png" alt="" />
          <p className="sw-consult-text">
            <span className="sw-consult-sub">잠깐! 학점은행제 도움을 받고싶다면</span>
            <strong className="sw-consult-title">지금 바로 <em>상담신청</em>하세요!</strong>
          </p>
          <Link href="/course-registration/learning-design" className="ds-btn ds-btn--primary ds-btn--lg sw-consult-btn">
            상담신청 하러가기
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6.25 4.5 9.75 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <PracticeSection title="고등학교 졸업자">
          <CreditFlow
            label="고등학교 졸업자 학습설계"
            credits={[
              { label: "전공", value: "45학점" },
              { label: "교양", value: "15학점" },
              { label: "일반", value: "20학점" },
            ]}
            total="총 80학점 이수"
            results={[
              { icon: "degree-cap.png", title: "전문 학사 학위 취득!" },
              { icon: "license.png", title: "사회복지2급 자격증 취득" },
            ]}
          />
        </PracticeSection>

        <PracticeSection title="전문대/4년제 졸업자">
          <CreditFlow
            label="전문대/4년제 졸업자 학습설계"
            credits={[
              { label: "필수", value: "10 과목" },
              { label: "선택", value: "7 과목" },
            ]}
            results={[{ icon: "license.png", title: "사회복지2급 자격증 취득" }]}
          />
        </PracticeSection>

        <PracticeSection title="사회복지 2년제 학위취득 과정">
          <CreditFlow
            label="사회복지 2년제 학위취득 과정"
            credits={[
              { label: "전공", value: "45학점" },
              { label: "교양", value: "15학점" },
              { label: "일반", value: "20학점" },
            ]}
            total="총 80학점 이수"
            results={[
              { icon: "degree-cap.png", title: "전문 학사 학위 취득!" },
              { icon: "license.png", title: "사회복지2급 자격증 취득" },
            ]}
          />
        </PracticeSection>

        <PracticeSection title="사회복지 학사 학위취득 과정">
          <CreditFlow
            label="사회복지 학사 학위취득 과정"
            credits={[
              { label: "전공", value: "60학점" },
              { label: "교양", value: "30학점" },
              { label: "일반", value: "50학점" },
            ]}
            total="총 140학점 이수"
            results={[{ icon: "degree-cap.png", title: "학사 학위 취득!" }]}
          />
        </PracticeSection>

        <p className="lx-callout">
          * 본 예시는 최소한의 설계를 기준으로 한 학습설계이므로 개개인의 보유학점과 상황이 다르므로 정확한 학습설계를 위해서는 담당자와
          상담 후 진행해주시기 바랍니다.
        </p>
        {/* 네 경우 모두에 해당하는 안내 — 마지막 카드에서 떼어 따로 회색 상자로 */}
        <section className="lx-panel sw-design-notes" aria-label="전적대 학점 인정 안내">
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
        </section>
      </div>
    </main>
  );
}
