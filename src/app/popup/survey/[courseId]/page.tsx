import type { Metadata } from "next";
import Link from "next/link";
import PopupShell from "@/components/my-classroom/PopupShell";
import CourseSurveyForm from "@/components/my-classroom/popups/CourseSurveyForm";
import SurveyForm from "@/components/my-classroom/popups/SurveyForm";
import { getCourse, surveyQuestions, surveyScale } from "@/components/my-classroom/classroomData";
import { getMyCourseSurvey } from "@/lib/classroom";
import { surveyBlockedReason } from "@/lib/db/surveys";

export const metadata: Metadata = { title: "강의 평가" };

/**
 * 강의 평가 팝업. DB: 과목에 연결된 과목 만족도 설문(LMS 설문 관리) — 답은 LMS 설문 결과에 바로 보인다 (src/lib/db/surveys.ts).
 * 샘플: 5점 척도 문항.
 */
export default async function SurveyPopup({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const s = await getMyCourseSurvey(courseId, `/popup/survey/${courseId}`);

  if (s) {
    const blocked = surveyBlockedReason(s);
    return (
      <PopupShell title="강의 평가" sub={s.courseName} footer={null}>
        {blocked ? (
          <div className="pp-box">
            <p className="pp-text">{blocked}</p>
            {(s.respondedAt || s.surveyId === null || !s.isActive) && (
              <div className="pp-actions">
                <Link href={`/popup/grade/${s.classId}`} className="ds-btn ds-btn--primary">
                  성적 보기
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="pp-box">
              {s.title && <h2 className="pp-box-title">{s.title}</h2>}
              <p className="pp-text" style={{ whiteSpace: "pre-line" }}>
                {s.intro?.trim() || "강의 평가는 이름 없이 모아서 강의를 고치는 데만 씁니다."}
              </p>
              <p className="pp-note ds-mt-8">
                평가를 마쳐야 성적을 볼 수 있어요.{s.endDate ? ` 참여 기간: ${s.startDate ?? ""} ~ ${s.endDate}` : ""}
              </p>
            </div>
            <CourseSurveyForm classId={s.classId} questions={s.questions} />
          </>
        )}
      </PopupShell>
    );
  }

  const course = getCourse(courseId);
  return (
    <PopupShell title="강의 평가" sub={course.title} footer={null}>
      <p className="pp-text ds-mb-16">
        강의 평가는 이름 없이 모아서 강의를 고치는 데만 씁니다. 평가를 마쳐야 성적을 볼 수 있습니다.
      </p>
      <SurveyForm questions={surveyQuestions} scale={surveyScale} />
    </PopupShell>
  );
}
