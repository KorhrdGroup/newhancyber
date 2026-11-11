import type { Metadata } from "next";
import PopupShell from "@/components/my-classroom/PopupShell";
import { TodoButton } from "@/components/my-classroom/PopupActions";
import { getAssessments, getCourse, getSyllabus } from "@/components/my-classroom/classroomData";

export const metadata: Metadata = { title: "성적 보기" };

export default async function GradePopup({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  // TODO: API 성적 조회 (강의 평가를 마친 과목만)
  const course = getCourse(courseId);
  const grade = course.grade;
  const period = getSyllabus(course.id).periods.find((p) => p.label === "성적 이의신청");
  const scored = getAssessments(course.id).filter((a) => a.score !== undefined);

  return (
    <PopupShell
      title="성적 보기"
      sub={course.title}
      footer={
        <>
          {grade && <TodoButton className="ds-btn ds-btn--secondary" label="성적 이의신청" message="성적 이의신청은" />}
          <a href={`/popup/print/transcript/${course.id}`} className="ds-btn ds-btn--primary">
            성적증명서 출력
          </a>
        </>
      }
    >
      {grade ? (
        <>
          <div className="ds-stats">
            <div className="ds-stat">
              <div className="ds-stat-label">총점</div>
              <div className="ds-stat-value">
                {grade.total}
                <small>/ 100</small>
              </div>
            </div>
            <div className="ds-stat">
              <div className="ds-stat-label">등급</div>
              <div className="ds-stat-value ds-text-brand">
                {grade.letter}
              </div>
            </div>
            <div className="ds-stat">
              <div className="ds-stat-label">이수</div>
              <div className={`ds-stat-value ${grade.passed ? "ds-text-success" : "ds-text-danger"}`}>
                {grade.passed ? "이수" : "미이수"}
              </div>
            </div>
          </div>
          <div className="pp-box ds-mt-16">
            <h2 className="pp-box-title">항목별 점수</h2>
            <table className="ds-table">
              <thead>
                <tr>
                  <th>항목</th>
                  <th>반영 비율</th>
                  <th>받은 점수</th>
                </tr>
              </thead>
              <tbody>
                {grade.items.map((item) => (
                  <tr key={item.label}>
                    <td>{item.label}</td>
                    <td>{item.weight}%</td>
                    <td>
                      {item.score} / {item.weight}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {period && <p className="pp-note ds-mt-12">성적 이의신청 기간: {period.value}</p>}
          </div>
        </>
      ) : (
        <div className="pp-box">
          <p className="pp-text">최종 성적은 기말고사가 끝나고 성적 이의신청 기간({period?.value})에 공개됩니다. 지금까지 나온 점수만 보여 드려요.</p>
          <table className="ds-table ds-mt-16">
            <thead>
              <tr>
                <th>항목</th>
                <th>점수</th>
              </tr>
            </thead>
            <tbody>
              {scored.length === 0 ? (
                <tr>
                  <td colSpan={2}>아직 나온 점수가 없습니다.</td>
                </tr>
              ) : (
                scored.map((a) => (
                  <tr key={a.id}>
                    <td>{a.title}</td>
                    <td>
                      {a.score} / {a.maxScore}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </PopupShell>
  );
}
