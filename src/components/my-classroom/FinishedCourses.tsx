import Link from "next/link";
import { Badge } from "./ClassroomUI";
import ClassroomHeader from "./ClassroomHeader";
import PopupButton from "./PopupButton";
import { getFinishedCourses } from "./classroomData";

/** U38 나의 강의실 — 종료된 과목 */
export default function FinishedCourses() {
  // TODO: API 종료 과목 조회
  const courses = getFinishedCourses();

  return (
    <main className="wrapper">
      <div className="container cr-page">
        <ClassroomHeader
          title="종료된 과목"
          actions={
            <>
              <PopupButton href="/popup/print/transcript/all">성적증명서 출력</PopupButton>
              <PopupButton href="/popup/payment/p2606001">결제 내역</PopupButton>
            </>
          }
        />

        {courses.length === 0 ? (
          <p className="cr-empty">종료된 과목이 없습니다.</p>
        ) : (
          <div className="cr-table-wrap">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>차수</th>
                  <th>과목명</th>
                  <th>이수 구분</th>
                  <th>학점</th>
                  <th>수강 기간</th>
                  <th>복습 기간</th>
                  <th>성적</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.term}</td>
                    <td className="is-left">
                      <strong>{course.title}</strong> <span className="pp-note">{course.classNo}</span>
                    </td>
                    <td>
                      <Badge tone="brand">{course.category}</Badge>
                    </td>
                    <td>{course.credit}</td>
                    <td>
                      {course.studyStart}
                      <br />~ {course.studyEnd}
                    </td>
                    <td>~ {course.reviewEnd}</td>
                    <td>
                      <span className="cr-grade">{course.grade?.letter ?? "-"}</span>
                    </td>
                    <td>
                      <div className="pp-row pp-row--center">
                        <PopupButton href={`/popup/grade/${course.id}`}>성적 보기</PopupButton>
                        <Link href={`/my-classroom/finished/${course.id}`} className="ds-btn ds-btn--primary ds-btn--sm">
                          복습하기
                        </Link>
                        <PopupButton href={`/popup/print/certificate/${course.id}`}>수료증</PopupButton>
                        <PopupButton href={`/popup/review-write/${course.id}`} className="ds-btn ds-btn--ghost ds-btn--sm">
                          수강후기 쓰기
                        </PopupButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="pp-note ds-mt-12">
              복습 기간에는 강의만 다시 들을 수 있고, 시험·과제에는 참여할 수 없습니다.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
