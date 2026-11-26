import type { Metadata } from "next";
import PopupShell from "@/components/my-classroom/PopupShell";
import { getAttendance, getCourse, getLessons } from "@/components/my-classroom/classroomData";
import { getMyAttendance } from "@/lib/classroom";

export const metadata: Metadata = { title: "출석 현황" };

/**
 * 출석 현황. DB: 합계는 수강의 출석 · 결석 횟수(LMS 수강 관리와 같은 값), 주차별은 학습 기록(lesson_progress — 80% 들으면 완료).
 * 샘플: classroomData 의 주차별 출석.
 */
export default async function AttendancePopup({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const db = await getMyAttendance(courseId);

  if (db) {
    const { course, summary, weeks } = db;
    return (
      <PopupShell title="출석 현황" sub={course.title}>
        <div className="ds-stats">
          <div className="ds-stat">
            <div className="ds-stat-label">출석</div>
            <div className="ds-stat-value">
              {summary.attend}
              <small>회</small>
            </div>
          </div>
          <div className="ds-stat">
            <div className="ds-stat-label">결석</div>
            <div className="ds-stat-value">
              {summary.absent}
              <small>회</small>
            </div>
          </div>
          <div className="ds-stat">
            <div className="ds-stat-label">진도율</div>
            <div className="ds-stat-value">
              {course.progress}
              <small>%</small>
            </div>
          </div>
        </div>
        <div className="pp-box ds-mt-16">
          {weeks.length === 0 ? (
            <p className="pp-text">강의 차시가 아직 준비 중이에요.</p>
          ) : (
            <table className="ds-table">
              <thead>
                <tr>
                  <th>주차</th>
                  <th>들은 차시</th>
                  <th>학습 시간</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {weeks.map((w) => (
                  <tr key={w.week}>
                    <td>{w.week}주차</td>
                    <td>
                      {w.completed} / {w.lessons}
                    </td>
                    <td>
                      {w.studied}분 / {w.minutes}분
                    </td>
                    <td>
                      <span className={`cr-mark cr-mark--${w.mark === "미완료" ? "지각" : w.mark}`}>
                        {w.mark === "미진행" && w.opensOn ? `${w.opensOn} 열림` : w.mark}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="pp-note ds-mt-12">
            차시마다 강의 시간의 80% 이상 들으면 학습 완료(출석)로 인정돼요. 출석 횟수는 학습을 완료한 차시 수예요 (총 {summary.total}회).
          </p>
        </div>
      </PopupShell>
    );
  }

  const course = getCourse(courseId);
  const lessons = getLessons(course.id);
  const marks = getAttendance(course.id);
  const count = (m: string) => marks.filter((x) => x === m).length;

  return (
    <PopupShell title="출석 현황" sub={course.title}>
      <div className="ds-stats">
        {["출석", "지각", "결석", "미진행"].map((m) => (
          <div key={m} className="ds-stat">
            <div className="ds-stat-label">{m}</div>
            <div className="ds-stat-value">
              {count(m)}
              <small>주</small>
            </div>
          </div>
        ))}
      </div>
      <div className="pp-box ds-mt-16">
        <table className="ds-table">
          <thead>
            <tr>
              <th>주차</th>
              <th>들은 차시</th>
              <th>학습 시간</th>
              <th>출석</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((mark, i) => {
              const week = lessons.filter((l) => l.week === i + 1);
              return (
                <tr key={i}>
                  <td>{i + 1}주차</td>
                  <td>
                    {week.filter((l) => l.status === "완료").length} / {week.length}
                  </td>
                  <td>
                    {week.reduce((s, l) => s + l.studied, 0)}분 / {week.reduce((s, l) => s + l.minutes, 0)}분
                  </td>
                  <td>
                    <span className={`cr-mark cr-mark--${mark}`}>{mark}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="pp-note ds-mt-12">
          주차마다 열린 기간 안에 모든 차시를 끝까지 들어야 출석입니다. 출석 점수는 총점의 20%입니다.
        </p>
      </div>
    </PopupShell>
  );
}
