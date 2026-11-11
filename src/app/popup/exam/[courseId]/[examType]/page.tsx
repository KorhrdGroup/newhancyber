import type { Metadata } from "next";
import PopupShell from "@/components/my-classroom/PopupShell";
import ExamSheet from "@/components/my-classroom/popups/ExamSheet";
import { examRules, getCourse, getExamQuestions } from "@/components/my-classroom/classroomData";

export const metadata: Metadata = { title: "시험 응시" };

export default async function ExamPopup({ params }: { params: Promise<{ courseId: string; examType: string }> }) {
  const { courseId, examType } = await params;
  // TODO: API 시험지 조회 (응시 시작 시각 기준으로 남은 시간 계산), 답안 임시 저장
  const course = getCourse(courseId);
  const title = examType === "final" ? "기말고사" : "중간고사";

  return (
    <PopupShell title={title} sub={course.title} footer={null}>
      <ExamSheet questions={getExamQuestions()} minutes={examRules.minutes} submitLabel="답안 제출" />
    </PopupShell>
  );
}
