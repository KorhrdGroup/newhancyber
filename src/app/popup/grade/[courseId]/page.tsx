import type { Metadata } from "next";
import Link from "next/link";
import PopupShell from "@/components/my-classroom/PopupShell";
import { TodoButton } from "@/components/my-classroom/PopupActions";
import { getAssessments, getCourse, getSyllabus, type Course } from "@/components/my-classroom/classroomData";
import { getMyGrade } from "@/lib/classroom";

export const metadata: Metadata = { title: "성적 보기" };

type Grade = NonNullable<Course["grade"]>;

function GradeStats({ grade }: { grade: Grade }) {
  return (
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
        <div className="ds-stat-value ds-text-brand">{grade.letter}</div>
      </div>
      <div className="ds-stat">
        <div className="ds-stat-label">이수</div>
        <div className={`ds-stat-value ${grade.passed ? "ds-text-success" : "ds-text-danger"}`}>{grade.passed ? "이수" : "미이수"}</div>
      </div>
    </div>
  );
}

/**
 * 성적 보기. DB: 최종 성적은 LMS 성적 확정(수료 · 미수료) 뒤 수강의 점수 칸 · 성적 기준(class_grading) 비율로,
 * 그 전에는 채점이 끝난 평가만. 강의 평가(과목 만족도)를 지금 할 수 있는데 안 했으면 성적 대신 평가로 안내한다.
 * 샘플: classroomData.
 */
export default async function GradePopup({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const db = await getMyGrade(courseId);

  if (db) {
    const { course, needSurvey, attend, items, scored } = db;
    const grade = course.grade;
    if (needSurvey) {
      return (
        <PopupShell title="성적 보기" sub={course.title} footer={null}>
          <div className="pp-box">
            <p className="pp-text">강의 평가를 마쳐야 성적을 볼 수 있어요. 강의 평가는 이름 없이 모아서 강의를 고치는 데만 씁니다.</p>
            <div className="pp-actions">
              <Link href={`/popup/survey/${course.id}`} className="ds-btn ds-btn--primary">
                강의 평가 하기
              </Link>
            </div>
          </div>
        </PopupShell>
      );
    }
    return (
      <PopupShell
        title="성적 보기"
        sub={course.title}
        footer={
          grade ? (
            <>
              <TodoButton className="ds-btn ds-btn--secondary" label="성적 이의신청" message="성적 이의신청은" />
              <a href={`/popup/print/transcript/${course.id}`} className="ds-btn ds-btn--primary">
                성적증명서 출력
              </a>
            </>
          ) : null
        }
      >
        {grade ? (
          <>
            <GradeStats grade={grade} />
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
                  {items.map((item) => (
                    <tr key={item.label}>
                      <td>{item.label}</td>
                      <td>{item.weight === null ? "-" : `${item.weight}%`}</td>
                      <td>{item.weight === null ? item.score : `${item.score} / ${item.weight}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="pp-note ds-mt-12">
                받은 점수는 반영 비율로 환산한 점수예요 (출석은 진도율 기준 · 출석 {attend.attend}회, 결석 {attend.absent}회). 상대평가가 적용되면 총점이 항목 합과 다를 수 있어요.
              </p>
            </div>
          </>
        ) : (
          <div className="pp-box">
            <p className="pp-text">최종 성적은 수강 기간이 끝나고 성적이 확정되면 공개돼요. 지금까지 채점이 끝난 점수만 보여 드려요.</p>
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
                    <td colSpan={2}>아직 채점이 끝난 평가가 없어요.</td>
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
