import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PopupShell from "@/components/my-classroom/PopupShell";
import ExamSheet from "@/components/my-classroom/popups/ExamSheet";
import { examRules, getCourse, getExamQuestions } from "@/components/my-classroom/classroomData";
import { blockedReason, getMyAssessment } from "@/lib/classroom";
import { readQuestions } from "@/lib/db/assessments";

export const metadata: Metadata = { title: "시험 응시" };

/**
 * 시험지. DB: ?a=평가 번호 — 「응시 중」인 본 응시가 있을 때만 (아니면 유의사항으로 돌려보낸다). 정답은 내보내지 않는다.
 * 샘플: 샘플 문항 · 60분 타이머.
 */
export default async function ExamPopup({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string; examType: string }>;
  searchParams: Promise<{ a?: string | string[] }>;
}) {
  const { courseId, examType } = await params;
  const { a } = await searchParams;
  const la = await getMyAssessment(courseId, a, `/popup/exam/${courseId}/${examType}/notice?a=${a ?? ""}`);

  if (la) {
    const notice = `/popup/exam/${courseId}/${examType}/notice?a=${la.assessmentId}`;
    if (la.submissionStatus !== "응시 중" || blockedReason(la)) redirect(notice);
    const questions = await readQuestions(la.assessmentId);
    return (
      <PopupShell title={la.title} sub={la.courseName} footer={null}>
        <ExamSheet
          questions={questions.map((q) => ({ no: q.no, text: q.content, options: q.choices, id: q.questionId, type: q.type, score: q.score }))}
          submitLabel="답안 제출"
          db={{ classId: la.classId, assessmentId: la.assessmentId }}
        />
      </PopupShell>
    );
  }

  // 샘플
  const course = getCourse(courseId);
  const title = examType === "final" ? "기말고사" : "중간고사";
  return (
    <PopupShell title={title} sub={course.title} footer={null}>
      <ExamSheet questions={getExamQuestions()} minutes={examRules.minutes} submitLabel="답안 제출" />
    </PopupShell>
  );
}
