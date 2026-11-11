import Link from "next/link";
import { Badge, ProgressBar } from "./ClassroomUI";
import { TodoButton } from "./PopupActions";
import PopupButton from "./PopupButton";
import { assessmentLabels, getAssessments, getAttendance, getCourse, getLessons, type Assessment } from "./classroomData";

function assessmentHref(courseId: string, a: Assessment) {
  if (a.type === "midterm" || a.type === "final") return `/popup/exam/${courseId}/${a.type}/notice`;
  return `/popup/assessments/${courseId}/${a.type}`;
}

/** 과목 강의실. mode="review" 는 종료된 과목 복습 (강의만, 평가 없음) */
export default function CourseRoom({ courseId, mode }: { courseId: string; mode: "study" | "review" }) {
  // TODO: API 과목·차시·출석·평가 조회
  const course = getCourse(courseId);
  const lessons = getLessons(course.id);
  const attendance = getAttendance(course.id);
  const assessments = getAssessments(course.id);
  const isReview = mode === "review";
  const weeks = Array.from(new Set(lessons.map((l) => l.week)));

  const shortcuts = [
    { label: "출석 현황", icon: "출", href: `/popup/attendance/${course.id}` },
    { label: "강의계획서", icon: "계", href: `/popup/syllabus/${course.id}` },
    { label: "성적 보기", icon: "성", href: `/popup/grade/${course.id}` },
    { label: "강의 평가", icon: "평", href: `/popup/survey/${course.id}` },
  ];

  return (
    <main className="wrapper">
      <div className="container cr-page">
        <Link href={isReview ? "/my-classroom/finished" : "/my-classroom"} className="cr-back">
          ← {isReview ? "종료된 과목" : "진행 중인 과목"} 목록
        </Link>

        <section className="cr-room-head">
          <div className="cr-card-meta">
            <span>{course.term}</span>
            <Badge tone="brand">{course.category}</Badge>
            <span>{course.credit}학점</span>
            {isReview && <Badge tone="neutral">{`복습 중 · ~${course.reviewEnd}`}</Badge>}
          </div>
          <h2 className="cr-card-title cr-room-title">
            {course.title}
            <span>{course.classNo}</span>
          </h2>
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
        </section>

        <section className="cr-section">
          <h3 className="cr-section-title">바로가기</h3>
          <div className="cr-shortcuts">
            {shortcuts.map((s) => (
              <PopupButton key={s.label} href={s.href} className="cr-shortcut">
                <span className="cr-shortcut-icon" aria-hidden>
                  {s.icon}
                </span>
                {s.label}
              </PopupButton>
            ))}
            <TodoButton className="cr-shortcut" label="학습 게시판" message="학습 게시판은">
              <span className="cr-shortcut-icon" aria-hidden>
                글
              </span>
            </TodoButton>
            <TodoButton className="cr-shortcut" label="참고자료" message="참고자료실은">
              <span className="cr-shortcut-icon" aria-hidden>
                자
              </span>
            </TodoButton>
          </div>
        </section>

        {!isReview && (
          <section className="cr-section">
            <h3 className="cr-section-title">
              시험 · 과제
              <small>기간 안에만 참여할 수 있어요</small>
            </h3>
            <div className="cr-evals">
              {assessments.map((a) => (
                <div key={a.id} className="cr-eval">
                  <div className="cr-eval-type">
                    {assessmentLabels[a.type]}
                    {a.round > 1 || a.type === "quiz" ? ` ${a.round}회` : ""}
                    <Badge>{a.status}</Badge>
                  </div>
                  <div className="cr-eval-title">{a.title}</div>
                  <div className="cr-eval-period">
                    {a.start} ~ {a.end}
                  </div>
                  {a.status === "참여 전" ? (
                    <PopupButton href={assessmentHref(course.id, a)} className="ds-btn ds-btn--primary ds-btn--sm">
                      참여하기
                    </PopupButton>
                  ) : a.status === "참여 완료" ? (
                    <PopupButton href={assessmentHref(course.id, a)}>
                      결과 보기{a.score !== undefined ? ` (${a.score}/${a.maxScore})` : ""}
                    </PopupButton>
                  ) : (
                    <button type="button" className="ds-btn ds-btn--sm" disabled>
                      {a.status}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="cr-section">
          <h3 className="cr-section-title">
            주차별 출석
            <PopupButton href={`/popup/attendance/${course.id}`} className="ds-btn ds-btn--ghost ds-btn--sm">
              자세히 보기
            </PopupButton>
          </h3>
          <div className="cr-attend">
            {attendance.map((mark, i) => (
              <div key={i} className="cr-attend-cell">
                {i + 1}주
                <span className={`cr-mark cr-mark--${mark}`}>{mark === "미진행" ? "-" : mark}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="cr-section cr-table-wrap">
          <h3 className="cr-section-title">강의 목록</h3>
          <table className="ds-table">
            <thead>
              <tr>
                <th>주차</th>
                <th>차시</th>
                <th>강의 제목</th>
                <th>학습 시간</th>
                <th>상태</th>
                <th>학습</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((week) =>
                lessons
                  .filter((l) => l.week === week)
                  .map((lesson, i) => (
                    <tr key={lesson.id} className={lesson.status === "학습 중" ? "is-current" : undefined}>
                      {i === 0 && <td rowSpan={2}>{week}주차</td>}
                      <td>{lesson.order}차시</td>
                      <td className="is-left">{lesson.title}</td>
                      <td>
                        {lesson.studied}분 / {lesson.minutes}분
                      </td>
                      <td>
                        <Badge>{lesson.status}</Badge>
                      </td>
                      <td>
                        {lesson.status === "예정" && !isReview ? (
                          <button type="button" className="ds-btn ds-btn--sm" disabled>
                            열리기 전
                          </button>
                        ) : (
                          <PopupButton
                            href={`/popup/lesson/${course.id}/${lesson.id}`}
                            className={`ds-btn ds-btn--sm ${lesson.status === "학습 중" ? "ds-btn--primary" : "ds-btn--secondary"}`}
                          >
                            {isReview || lesson.status === "완료" ? "다시 보기" : lesson.status === "학습 중" ? "이어 보기" : "학습하기"}
                          </PopupButton>
                        )}
                      </td>
                    </tr>
                  )),
              )}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
