import Link from "next/link";
import { Badge, ProgressBar } from "./ClassroomUI";
import ClassroomHeader from "./ClassroomHeader";
import PopupButton from "./PopupButton";
import { getLessons, getOngoingCourses } from "./classroomData";

/** U37 나의 강의실 — 진행 중인 과목 */
export default function OngoingCourses() {
  // TODO: API 수강 중 과목 조회
  const courses = getOngoingCourses();
  const avgProgress = courses.length ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length) : 0;
  const todo = courses.reduce((sum, c) => sum + getLessons(c.id).filter((l) => l.status === "학습 중" || l.status === "미학습").length, 0);
  const credits = courses.reduce((sum, c) => sum + c.credit, 0);

  return (
    <main className="wrapper">
      <div className="container cr-page">
        <ClassroomHeader
          title="진행 중인 과목"
          actions={
            <>
              <PopupButton href="/popup/payment/p2611001">결제 내역</PopupButton>
              <PopupButton href="/popup/print/enrollment/p2611001">수강확인서 출력</PopupButton>
            </>
          }
        />

        <div className="ds-stats">
          <div className="ds-stat">
            <div className="ds-stat-label">수강 중인 과목</div>
            <div className="ds-stat-value">
              {courses.length}
              <small>과목</small>
            </div>
          </div>
          <div className="ds-stat">
            <div className="ds-stat-label">신청 학점</div>
            <div className="ds-stat-value">
              {credits}
              <small>학점</small>
            </div>
          </div>
          <div className="ds-stat">
            <div className="ds-stat-label">평균 진도율</div>
            <div className="ds-stat-value">
              {avgProgress}
              <small>%</small>
            </div>
          </div>
          <div className="ds-stat">
            <div className="ds-stat-label">지금 들을 수 있는 차시</div>
            <div className="ds-stat-value">
              {todo}
              <small>개</small>
            </div>
          </div>
        </div>

        {courses.length === 0 ? (
          <p className="cr-empty">수강 중인 과목이 없습니다.</p>
        ) : (
          <div className="cr-list">
            {courses.map((course) => (
              <article key={course.id} className="cr-card">
                <div className="cr-card-main">
                  <div className="cr-card-meta">
                    <span>{course.term}</span>
                    <Badge tone={course.isPractice ? "warning" : "brand"}>{course.category}</Badge>
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
                      <dt>학점 인정</dt>
                      <dd>{course.creditRecognition}</dd>
                    </div>
                    <div>
                      <dt>학위 취득</dt>
                      <dd>{course.degreeTiming}</dd>
                    </div>
                  </dl>
                  <div className="cr-card-progress">
                    <ProgressBar value={course.progress} />
                  </div>
                  {course.isPractice && !course.practiceDocsDone && (
                    <p className="cr-alert">실습 과목은 사전 서류를 모두 내야 실습기관이 배정됩니다.</p>
                  )}
                </div>
                <div className="cr-card-side">
                  <Link href={`/my-classroom/${course.id}`} className="ds-btn ds-btn--primary">
                    강의실 입장
                  </Link>
                  {course.isPractice ? (
                    <PopupButton href={`/popup/practice-documents/${course.id}`} className="ds-btn ds-btn--secondary">
                      실습 서류 제출
                    </PopupButton>
                  ) : (
                    <PopupButton href={`/popup/syllabus/${course.id}`} className="ds-btn ds-btn--secondary">
                      강의계획서
                    </PopupButton>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
