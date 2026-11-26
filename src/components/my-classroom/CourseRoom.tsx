import Link from "next/link";
import { getMyCourseRoom } from "@/lib/classroom";
import { Badge, ProgressBar } from "./ClassroomUI";
import { TodoButton } from "./PopupActions";
import PopupButton from "./PopupButton";
import { assessmentLabels, type Assessment } from "./classroomData";

/** 바로가기 3D 그림 (학점은행제 · 사회복지사 안내에서 쓰는 그림 묶음) */
const CB_ICON = "/resources/images/credit-bank";
const SW_ICON = "/resources/images/social-worker/steps";

function ShortcutIcon({ src }: { src: string }) {
  return <img className="cr-shortcut-icon" src={src} alt="" aria-hidden />;
}

/** 시험 · 과제 팝업 주소 — DB 는 평가 번호(?a=)를 붙이고 퀴즈도 시험(유의사항 → 시험지)으로 */
function assessmentHref(courseId: string, a: Assessment, isDb: boolean) {
  if (isDb) {
    if (a.type === "midterm" || a.type === "final" || a.type === "quiz") return `/popup/exam/${courseId}/${a.type}/notice?a=${a.id}`;
    return `/popup/assessments/${courseId}/${a.type}?a=${a.id}`;
  }
  if (a.type === "midterm" || a.type === "final") return `/popup/exam/${courseId}/${a.type}/notice`;
  return `/popup/assessments/${courseId}/${a.type}`;
}

/**
 * 과목 강의실. mode="review" 는 종료된 과목 복습 (강의만, 평가 없음).
 * 데이터는 src/lib/classroom.ts (로그인한 회원 자신의 수강 — DB 가 없으면 샘플).
 * DB 화면: 출석은 합계, 차시는 열린 날 기준(학습 가능 / 예정) — 차시별 학습 · 주차별 출석 기록 표가 아직 없다.
 */
export default async function CourseRoom({ courseId, mode }: { courseId: string; mode: "study" | "review" }) {
  const { course, lessons, attendance, attendSummary, assessments } = await getMyCourseRoom(courseId, mode);
  const isReview = mode === "review";
  const weeks = Array.from(new Set(lessons.map((l) => l.week)));
  const isDbRoom = attendSummary !== null;

  const shortcuts = [
    { label: "출석 현황", icon: `${CB_ICON}/cb-icon-receipt-check.png`, href: `/popup/attendance/${course.id}` },
    { label: "강의계획서", icon: `${SW_ICON}/course-book.png`, href: `/popup/syllabus/${course.id}` },
    { label: "성적 보기", icon: `${CB_ICON}/cb-icon-aplus.png`, href: `/popup/grade/${course.id}` },
    { label: "강의 평가", icon: `${SW_ICON}/apply-form.png`, href: `/popup/survey/${course.id}` },
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
            {course.status && <Badge>{course.status}</Badge>}
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
                <ShortcutIcon src={s.icon} />
                {s.label}
              </PopupButton>
            ))}
            <TodoButton className="cr-shortcut" label="학습 게시판" message="학습 게시판은">
              <ShortcutIcon src={`${CB_ICON}/cb-icon-chat-person.png`} />
            </TodoButton>
            <TodoButton className="cr-shortcut" label="참고자료" message="참고자료실은">
              <ShortcutIcon src={`${CB_ICON}/cb-icon-books.png`} />
            </TodoButton>
          </div>
        </section>

        {!isReview && (
          <section className="cr-section">
            <h3 className="cr-section-title">
              시험 · 과제
              <small>기간 안에만 참여할 수 있어요</small>
            </h3>
            {assessments.length === 0 && <p className="cr-empty">아직 열린 시험 · 과제가 없어요.</p>}
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
                    <PopupButton href={assessmentHref(course.id, a, isDbRoom)} className="ds-btn ds-btn--primary ds-btn--sm">
                      참여하기
                    </PopupButton>
                  ) : a.status === "참여 완료" ? (
                    <PopupButton href={assessmentHref(course.id, a, isDbRoom)}>
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
          {attendSummary ? (
            <>
              {/* DB — 주차별 출석 기록이 없어 합계만 (enrollments.attend_count · absent_count, 교강사 · LMS 가 채운다) */}
              <h3 className="cr-section-title">출석</h3>
              <div className="ds-stats">
                <div className="ds-stat">
                  <div className="ds-stat-label">출석</div>
                  <div className="ds-stat-value">
                    {attendSummary.attend}
                    <small>회</small>
                  </div>
                </div>
                <div className="ds-stat">
                  <div className="ds-stat-label">결석</div>
                  <div className="ds-stat-value">
                    {attendSummary.absent}
                    <small>회</small>
                  </div>
                </div>
                <div className="ds-stat">
                  <div className="ds-stat-label">전체 차시</div>
                  <div className="ds-stat-value">
                    {attendSummary.total}
                    <small>차시</small>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="cr-section-title">
                주차별 출석
                <PopupButton href={`/popup/attendance/${course.id}`} className="ds-btn ds-btn--ghost ds-btn--sm">
                  자세히 보기
                </PopupButton>
              </h3>
              <div className="cr-attend">
                {(attendance ?? []).map((mark, i) => (
                  <div key={i} className="cr-attend-cell">
                    {i + 1}주
                    <span className={`cr-mark cr-mark--${mark}`}>{mark === "미진행" ? "-" : mark}</span>
                  </div>
                ))}
              </div>
            </>
          )}
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
              {lessons.length === 0 && (
                <tr>
                  <td colSpan={6} className="cr-empty">
                    아직 등록된 강의가 없어요.
                  </td>
                </tr>
              )}
              {weeks.map((week) => {
                const inWeek = lessons.filter((l) => l.week === week);
                return inWeek.map((lesson, i) => (
                    <tr key={lesson.id} className={lesson.status === "학습 중" ? "is-current" : undefined}>
                      {i === 0 && <td rowSpan={inWeek.length}>{week}주차</td>}
                      <td>{lesson.order}차시</td>
                      <td className="is-left">{lesson.title}</td>
                      <td>
                        {isDbRoom && lesson.status === "예정" ? `${lesson.openDate} 열림` : `${lesson.studied}분 / ${lesson.minutes}분`}
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
                  ));
              })}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
