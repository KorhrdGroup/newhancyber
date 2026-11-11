import type { Metadata } from "next";
import PopupShell from "@/components/my-classroom/PopupShell";
import { getAttendance, getCourse, getLessons } from "@/components/my-classroom/classroomData";

export const metadata: Metadata = { title: "출석 현황" };

export default async function AttendancePopup({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  // TODO: API 주차별 출석 조회
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
