import type { Metadata } from "next";
import Link from "next/link";
import { Badge, ProgressBar } from "@/components/my-classroom/ClassroomUI";
import PopupShell from "@/components/my-classroom/PopupShell";
import { getCourse, getLesson, getLessons } from "@/components/my-classroom/classroomData";

export const metadata: Metadata = { title: "차시 학습" };

export default async function LessonPopup({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  // TODO: API 차시 정보·영상 주소·학습 위치 조회, 학습 시간 저장
  const course = getCourse(courseId);
  const lessons = getLessons(course.id);
  const lesson = getLesson(course.id, lessonId);
  const index = lessons.findIndex((l) => l.id === lesson.id);
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const href = (id: string) => `/popup/lesson/${course.id}/${id}`;

  return (
    <PopupShell
      title={`${lesson.week}주차 ${lesson.order}차시`}
      sub={course.title}
      footer={
        <>
          {prev && (
            <Link href={href(prev.id)} className="ds-btn ds-btn--secondary">
              ← 이전 차시
            </Link>
          )}
          {next && next.status !== "예정" && (
            <Link href={href(next.id)} className="ds-btn ds-btn--primary">
              다음 차시 →
            </Link>
          )}
        </>
      }
    >
      <div className="pp-player">
        <div>
          <div className="pp-video">
            <div>
              <strong>{lesson.title}</strong>
              강의 영상 자리 (영상 서버 연동 전)
            </div>
          </div>
          <div className="pp-box ds-mt-16">
            <div className="pp-row pp-row--between">
              <span className="ds-body-14-semibold">이 차시 학습 시간</span>
              <Badge>{lesson.status}</Badge>
            </div>
            <div className="ds-mt-8">
              <ProgressBar value={Math.round((lesson.studied / lesson.minutes) * 100)} />
            </div>
            <p className="pp-note ds-mt-8">
              {lesson.studied}분 / {lesson.minutes}분 · 강의 시간만큼 들어야 출석으로 인정됩니다. 빨리 감기는 학습 시간에 들어가지 않습니다.
            </p>
          </div>
        </div>
        <nav className="pp-lessons" aria-label="차시 목록">
          {lessons.map((l) =>
            l.status === "예정" ? (
              <span key={l.id} className="pp-lesson ds-text-disabled">
                {l.week}주 {l.order}차시 · {l.title}
                <small>열리기 전</small>
              </span>
            ) : (
              <Link key={l.id} href={href(l.id)} className={`pp-lesson${l.id === lesson.id ? " is-current" : ""}`}>
                {l.week}주 {l.order}차시 · {l.title}
                <small>
                  {l.status} · {l.minutes}분
                </small>
              </Link>
            ),
          )}
        </nav>
      </div>
    </PopupShell>
  );
}
