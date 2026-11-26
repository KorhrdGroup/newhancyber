import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge, ProgressBar } from "@/components/my-classroom/ClassroomUI";
import PopupShell from "@/components/my-classroom/PopupShell";
import LessonPlayer, { type Chapter, type Cue } from "@/components/my-classroom/popups/LessonPlayer";
import { getCourse, getLesson, getLessons } from "@/components/my-classroom/classroomData";
import { isDbConfigured } from "@/lib/db/client";
import { readLessonPlayer, type PlayerLesson } from "@/lib/db/lessons";
import { getCurrentMember } from "@/lib/memberAuth";
import { signedVideoUrl, videoKeyOf } from "@/lib/video";

export const metadata: Metadata = { title: "차시 학습" };

/** CDMS 목차(time_json: [{min, sec, title, level}]) → 목차 */
function parseChapters(json: string | null): Chapter[] {
  try {
    const rows = JSON.parse(json ?? "[]") as { min?: number; sec?: number; title?: string; level?: number }[];
    return Array.isArray(rows)
      ? rows.filter((r) => r && typeof r.title === "string").map((r) => ({ at: (r.min ?? 0) * 60 + (r.sec ?? 0), title: r.title!, level: r.level ?? 0 }))
      : [];
  } catch {
    return [];
  }
}

/** CDMS 자막(smi_json: {rows: [{min, sec, text}]}) → 자막 */
function parseCues(json: string | null): Cue[] {
  try {
    const v = JSON.parse(json ?? "null") as { rows?: { min?: number; sec?: number; text?: string }[] } | null;
    return Array.isArray(v?.rows)
      ? v!.rows.filter((r) => r && typeof r.text === "string").map((r) => ({ at: (r.min ?? 0) * 60 + (r.sec ?? 0), text: r.text! }))
      : [];
  } catch {
    return [];
  }
}

const lessonStatus = (l: PlayerLesson) =>
  !l.isOpen ? "예정" : l.pageCount === 0 ? "준비 중" : l.completedPages === l.pageCount ? "완료" : l.watchedSeconds > 0 ? "학습 중" : "미학습";

/**
 * 차시 학습창. DB: 흐름 CDMS → LMS → 홈페이지 — 그 과목에 연결된 콘텐츠(CDMS)의 차시 영상 쪽을 서명 주소로 재생하고 학습 시간을 남긴다
 * (src/lib/db/lessons.ts). 로그인한 회원 자신의 수강만 (아니면 404). ?page= 로 한 차시의 여러 쪽 가운데 하나. 샘플: 영상 자리.
 */
export default async function LessonPopup({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { courseId, lessonId } = await params;

  if (isDbConfigured()) {
    const classId = Number(courseId);
    const lid = Number(lessonId);
    if (!Number.isSafeInteger(classId) || classId <= 0 || !Number.isSafeInteger(lid) || lid <= 0) notFound();
    const member = await getCurrentMember();
    if (!member) redirect(`/member/login?next=${encodeURIComponent(`/popup/lesson/${classId}/${lid}`)}`);
    const data = await readLessonPlayer(member.memberId, classId, lid);
    if (!data) notFound();
    const { page } = await searchParams;
    const pageNo = Number(Array.isArray(page) ? page[0] : page);
    const current = data.pages.find((p) => p.pageId === pageNo) ?? data.pages[0];
    const key = current ? videoKeyOf(current.pcUrl) : null;
    const src = current && data.canPlay && key ? signedVideoUrl(key) : null;
    const idx = data.lessons.findIndex((l) => l.lessonId === lid);
    const prev = data.lessons[idx - 1];
    const next = data.lessons[idx + 1];
    const href = (id: number) => `/popup/lesson/${classId}/${id}`;

    return (
      <PopupShell
        title={`${data.lesson.weekNo}주차 ${data.lesson.lessonNo}차시 · ${data.lesson.title}`}
        sub={data.courseName}
        footer={
          <>
            {prev && (
              <Link href={href(prev.lessonId)} className="ds-btn ds-btn--secondary">
                ← 이전 차시
              </Link>
            )}
            {next && next.isOpen && (
              <Link href={href(next.lessonId)} className="ds-btn ds-btn--primary">
                다음 차시 →
              </Link>
            )}
          </>
        }
      >
        {!data.canPlay ? (
          <div className="pp-box">
            <p>
              {data.enrollmentStatus === "수강 대기"
                ? "개강한 뒤(수강 중)에 들을 수 있어요."
                : !data.lesson.isOpen
                  ? `이 차시는 ${data.lesson.opensOn}에 열려요.`
                  : "복습 기간이 끝나 들을 수 없어요."}
            </p>
          </div>
        ) : !current ? (
          <div className="pp-box">
            <p>이 차시 영상은 준비 중이에요.</p>
          </div>
        ) : (
          <>
            {data.pages.length > 1 && (
              <div className="pp-row ds-mb-12">
                {data.pages.map((p, i) => (
                  <Link
                    key={p.pageId}
                    href={`${href(lid)}?page=${p.pageId}`}
                    className={`ds-btn ds-btn--sm ${p.pageId === current.pageId ? "ds-btn--primary" : "ds-btn--secondary"}`}
                  >
                    {i + 1}. {p.title}
                    {p.completed ? " ✓" : ""}
                  </Link>
                ))}
              </div>
            )}
            {/* 쪽이 바뀌면 학습창을 새로 그린다 (기록 · 위치가 쪽마다 따로) */}
            <LessonPlayer
              key={current.pageId}
              src={src}
              classId={classId}
              pageId={current.pageId}
              playSeconds={current.playSeconds}
              startAt={current.lastPosition}
              initialWatched={current.watchedSeconds}
              initialCompleted={current.completed}
              canRecord={data.canRecord}
              chapters={parseChapters(data.timeJson)}
              cues={parseCues(data.smiJson)}
            />
            {key && !src && <p className="pp-note ds-mt-8">영상 재생 설정(서명 키)이 아직 없어요. 관리자에게 문의해 주세요.</p>}
          </>
        )}
        <nav className="pp-lessons ds-mt-16" aria-label="차시 목록">
          {data.lessons.map((l) =>
            !l.isOpen ? (
              <span key={l.lessonId} className="pp-lesson ds-text-disabled">
                {l.weekNo}주 {l.lessonNo}차시 · {l.title}
                <small>{l.opensOn} 열림</small>
              </span>
            ) : (
              <Link key={l.lessonId} href={href(l.lessonId)} className={`pp-lesson${l.lessonId === lid ? " is-current" : ""}`}>
                {l.weekNo}주 {l.lessonNo}차시 · {l.title}
                <small>
                  {lessonStatus(l)} · {Math.round(l.totalSeconds / 60)}분
                </small>
              </Link>
            ),
          )}
        </nav>
      </PopupShell>
    );
  }

  // 샘플
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
