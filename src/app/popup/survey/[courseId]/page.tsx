import type { Metadata } from "next";
import PopupShell from "@/components/my-classroom/PopupShell";
import SurveyForm from "@/components/my-classroom/popups/SurveyForm";
import { getCourse, surveyQuestions, surveyScale } from "@/components/my-classroom/classroomData";

export const metadata: Metadata = { title: "강의 평가" };

export default async function SurveyPopup({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
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
