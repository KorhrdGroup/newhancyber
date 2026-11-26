import type { Metadata } from "next";
import PopupShell from "@/components/my-classroom/PopupShell";
import ExamNoticeStart from "@/components/my-classroom/popups/ExamNoticeStart";
import { examRules, getAssessments, getCourse } from "@/components/my-classroom/classroomData";
import { blockedReason, getMyAssessment } from "@/lib/classroom";

export const metadata: Metadata = { title: "시험 유의사항" };

/** DB 시험 유의사항 — 시험 시간 칸이 없어 기간으로만 막는다 */
const DB_NOTICES = [
  "시험은 한 번만 응시할 수 있어요. 시작한 뒤에는 답안을 내기 전까지 같은 시험지로 이어서 볼 수 있어요.",
  "참여 기간이 끝나면 답안을 낼 수 없어요. 기간 안에 꼭 제출해 주세요.",
  "객관식 · 단답형은 내는 즉시 채점되고, 서술형이 있으면 교강사가 채점한 뒤 점수가 나와요.",
  "다른 창을 열거나 자료를 찾아보는 행위는 부정행위로 처리될 수 있어요.",
  "인터넷 연결이 불안정하면 응시 전에 1:1 원격지원(1661-7768)을 요청하세요.",
];

/**
 * 시험 유의사항 → 응시 시작. DB: ?a=평가 번호 (중간 · 기말 · 퀴즈), 로그인한 회원 자신의 수강만. 샘플: 주소의 종류로.
 */
export default async function ExamNoticePopup({
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
    const blocked = blockedReason(la);
    const done = la.submissionStatus === "제출 완료" || la.submissionStatus === "채점 완료";
    return (
      <PopupShell title={`${la.title} 유의사항`} sub={la.courseName} footer={null}>
        <div className="pp-box">
          <table className="ds-table ds-table--info">
            <tbody>
              <tr>
                <th>시험 기간</th>
                <td>
                  {la.openAt ?? "-"} ~ {la.closeAt ?? "-"}
                </td>
              </tr>
              <tr>
                <th>문항 수</th>
                <td>{la.questionCount}문항</td>
              </tr>
              <tr>
                <th>배점</th>
                <td>{la.maxScore}점</td>
              </tr>
            </tbody>
          </table>
        </div>
        {done ? (
          <div className="pp-box">
            <p>
              이미 답안을 냈어요.{" "}
              {la.submissionStatus === "채점 완료" ? `점수는 ${la.score ?? 0}점 / ${la.maxScore}점이에요.` : "채점이 끝나면 점수가 나와요."}
            </p>
          </div>
        ) : blocked || la.questionCount === 0 ? (
          <div className="pp-box">
            <p>{blocked ?? "아직 시험 문항이 없어요. 교강사에게 문의해 주세요."}</p>
          </div>
        ) : (
          <>
            <div className="pp-box">
              <h2 className="pp-box-title">꼭 읽어 주세요</h2>
              <ol className="pp-list pp-list--num">
                {DB_NOTICES.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ol>
            </div>
            {la.submissionStatus === "응시 중" && <p className="pp-note ds-mt-8">응시 중인 시험이에요. 시작을 누르면 이어서 볼 수 있어요.</p>}
            <ExamNoticeStart
              startHref={`/popup/exam/${courseId}/${examType}?a=${la.assessmentId}`}
              db={{ classId: la.classId, assessmentId: la.assessmentId }}
            />
          </>
        )}
      </PopupShell>
    );
  }

  // 샘플
  const course = getCourse(courseId);
  const type = examType === "final" ? "final" : "midterm";
  const exam = getAssessments(course.id).find((x) => x.type === type)!;
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
