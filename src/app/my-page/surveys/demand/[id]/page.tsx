import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTabs from "@/components/common/PageTabs";
import MyPageShell from "@/components/my-page/MyPageShell";
import DemandSurveyForm from "@/components/my-page/a/DemandSurveyForm";
import { getDemandSurvey, surveyTabs } from "@/components/my-page/myPageDataA";

export const metadata: Metadata = { title: "수요 조사 응답 - 설문조사 - 마이페이지" };

/** U30 설문조사 — 수요 조사 응답 (원본 /stdMng/survRs.asp) */
export default async function DemandSurveyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // TODO: API 수요 조사 문항 조회
  const survey = getDemandSurvey(id);
  if (!survey) notFound();

  return (
    <MyPageShell title="설문조사" desc="여러분의 의견은 이름 없이 모아 강의와 학습 환경을 고치는 데 씁니다.">
      <PageTabs items={surveyTabs} />
      <div className="pp-box">
        <h3 className="pp-box-title">{survey.title}</h3>
        <p className="pp-text">{survey.intro}</p>
        <p className="pp-note ds-mt-8">
          조사 기간 {survey.start} ~ {survey.end}
        </p>
      </div>
      <DemandSurveyForm questions={survey.questions} />
    </MyPageShell>
  );
}
