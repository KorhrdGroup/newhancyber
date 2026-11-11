import type { Metadata } from "next";
import PopupShell from "@/components/my-classroom/PopupShell";
import ExamNoticeStart from "@/components/my-classroom/popups/ExamNoticeStart";
import { examRules, getAssessments, getCourse } from "@/components/my-classroom/classroomData";

export const metadata: Metadata = { title: "시험 유의사항" };

export default async function ExamNoticePopup({ params }: { params: Promise<{ courseId: string; examType: string }> }) {
  const { courseId, examType } = await params;
  const course = getCourse(courseId);
  const type = examType === "final" ? "final" : "midterm";
  const exam = getAssessments(course.id).find((a) => a.type === type)!;

  return (
    <PopupShell title={`${exam.title} 유의사항`} sub={course.title} footer={null}>
      <div className="pp-box">
        <table className="ds-table ds-table--info">
          <tbody>
            <tr>
              <th>시험 기간</th>
              <td>
                {exam.start} ~ {exam.end}
              </td>
            </tr>
            <tr>
              <th>시험 시간</th>
              <td>{examRules.minutes}분</td>
            </tr>
            <tr>
              <th>문항 수</th>
              <td>객관식 {examRules.questions}문항</td>
            </tr>
            <tr>
              <th>배점</th>
              <td>총점의 {exam.maxScore}%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="pp-box">
        <h2 className="pp-box-title">꼭 읽어 주세요</h2>
        <ol className="pp-list pp-list--num">
          {examRules.notices.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ol>
      </div>
      <ExamNoticeStart startHref={`/popup/exam/${course.id}/${type}`} />
    </PopupShell>
  );
}
