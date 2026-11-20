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
          desc="수강을 마친 과목의 성적을 확인하고, 복습 기간 동안 강의를 다시 들을 수 있어요."
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
          <div className="cr-list">
            {courses.map((course) => (
              <article key={course.id} className="cr-card">
                <div className="cr-card-main">
                  <div className="cr-card-meta">
                    <span>{course.term}</span>
                    <Badge tone="neutral">{course.category}</Badge>
                    <span>{course.credit}학점</span>
                  </div>
                  <h3 className="cr-card-title">
                    {course.title}
                    <span>{course.classNo}</span>
                  </h3>
                  <dl className="cr-card-info">
                    <div>
                      <dt>수강 기간</dt>
                      <dd>
                        {course.studyStart} ~ {course.studyEnd}
                      </dd>
                    </div>
                    <div>
                      <dt>교강사</dt>
                      <dd>{course.instructor}</dd>
                    </div>
                    <div>
                      <dt>복습 기간</dt>
                      <dd>~ {course.reviewEnd}</dd>
                    </div>
                    <div>
                      <dt>성적</dt>
                      <dd>
                        {course.grade ? (
                          <>
                            <span className="cr-grade">{course.grade.letter}</span> {course.grade.total}점
                          </>
                        ) : (
                          "-"
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="cr-card-side cr-card-side--stack">
                  <Link href={`/my-classroom/finished/${course.id}`} className="ds-btn ds-btn--primary">
                    복습하기
                  </Link>
                  <div className="cr-card-side-row">
                    <PopupButton href={`/popup/grade/${course.id}`} className="ds-btn ds-btn--secondary">
                      성적 보기
                    </PopupButton>
                    <PopupButton href={`/popup/print/certificate/${course.id}`} className="ds-btn ds-btn--secondary">
                      수료증
                    </PopupButton>
                  </div>
                  <PopupButton href={`/popup/review-write/${course.id}`} className="ds-btn ds-btn--ghost ds-btn--sm">
                    수강후기 쓰기
                  </PopupButton>
                </div>
              </article>
            ))}
            <p className="pp-note">
              복습 기간에는 강의만 다시 들을 수 있고, 시험·과제에는 참여할 수 없습니다.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
