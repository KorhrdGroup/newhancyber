import Link from "next/link";
import { getMyOngoingCourses } from "@/lib/classroom";
import { isDbConfigured } from "@/lib/db/client";
import { Badge, ProgressBar } from "./ClassroomUI";
import ClassroomHeader from "./ClassroomHeader";
import PopupButton from "./PopupButton";
import { getLessons } from "./classroomData";

/** U37 나의 강의실 — 진행 중인 과목 (로그인한 회원의 수강 대기 · 수강 중, DB 가 없으면 샘플) */
export default async function OngoingCourses() {
  const isDb = isDbConfigured();
  const courses = await getMyOngoingCourses();
  const avgProgress = courses.length ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length) : 0;
  // DB 는 차시별 학습 기록이 없어 이 칸 대신 「개강 전」 과목 수를 보인다
  const todo = isDb
    ? courses.filter((c) => c.status === "수강 대기").length
    : courses.reduce((sum, c) => sum + getLessons(c.id).filter((l) => l.status === "학습 중" || l.status === "미학습").length, 0);
  const credits = courses.reduce((sum, c) => sum + c.credit, 0);

  return (
    <main className="wrapper">
      <div className="container cr-page">
        <ClassroomHeader
          title="진행 중인 과목"
          desc="수강 중인 과목의 강의를 듣고, 시험·과제에 참여하세요."
          actions={
            isDb ? (
              // 결제 내역은 마이페이지 목록으로 (DB 결제), 수강확인서는 아직 샘플이라 DB 화면에서는 뺀다
              <Link href="/my-page/payments" className="ds-btn ds-btn--secondary">
                결제 내역
              </Link>
            ) : (
              <>
                <PopupButton href="/popup/payment/p2611001">결제 내역</PopupButton>
                <PopupButton href="/popup/print/enrollment/p2611001">수강확인서 출력</PopupButton>
              </>
            )
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
            <div className="ds-stat-label">{isDb ? "개강 전 과목" : "지금 들을 수 있는 차시"}</div>
            <div className="ds-stat-value">
              {todo}
              <small>{isDb ? "과목" : "개"}</small>
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
                    {course.status && <Badge>{course.status}</Badge>}
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
