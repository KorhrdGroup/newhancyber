import "server-only";
import { getPool, sql } from "./client";

/**
 * 강의 학습창 (읽기 · 학습 기록) — 흐름: CDMS → LMS → 홈페이지.
 *   CDMS : content_lessons(차시) · content_pages(영상 쪽: 서명 없는 주소 · 재생 시간) · cdms_lessons(목차 time_json · 자막 smi_json)
 *   LMS  : 과목(courses.content_id)에 콘텐츠를 연결, 수강(enrollments)
 *   홈페이지: 영상 재생 · dbo.lesson_progress (docs/db/lesson_progress.sql) 에 기록 → enrollments.progress · attend_count 다시 셈
 * 규칙 (사용자 결정 2026-11-26 「기본값」):
 *   - 영상 쪽 완료 = 실제로 본 시간이 재생 시간의 80% 이상 (빨리 감기 · 건너뛰기는 세지 않는다 — 화면이 재생된 만큼만 보낸다)
 *   - 차시 완료 = 그 차시의 영상 쪽이 모두 완료
 *   - 진도율 = 완료 차시 ÷ 영상 쪽이 있는 전체 차시 × 100, 출석 횟수(attend_count) = 완료 차시 수
 *   - 볼 수 있는 때: 「수강 중」이고 차시가 열렸을 때(수강 시작일 + (주차 − 1) × 7일) — 기록도 이때만
 *     · 수료 · 미수료는 복습 기간(classes.review_end)까지 보기만 (기록하지 않음)
 * 모든 조회는 member_id 로 거른다. 시각은 UTC(SYSDATETIME), 한국 날짜는 +9시간.
 */

const KST_TODAY = "CAST(DATEADD(HOUR, 9, SYSUTCDATETIME()) AS DATE)";
/** 차시 l 이 열렸는가 (s = semesters) */
const LESSON_OPEN = `DATEADD(DAY, (l.week_no - 1) * 7, CAST(s.study_start AS DATE)) <= ${KST_TODAY}`;
export const COMPLETE_RATIO = 0.8;

export interface PlayerPage {
  pageId: number;
  title: string;
  playSeconds: number;
  pcUrl: string;
  watchedSeconds: number;
  lastPosition: number;
  completed: boolean;
}

export interface PlayerLesson {
  lessonId: number;
  weekNo: number;
  lessonNo: number;
  title: string;
  opensOn: string;
  isOpen: boolean;
  /** 영상 쪽 재생 시간 합 · 본 시간 합 (초) */
  totalSeconds: number;
  watchedSeconds: number;
  pageCount: number;
  completedPages: number;
}

export interface LessonPlayerData {
  enrollmentId: number;
  enrollmentStatus: string;
  courseName: string;
  /** 기록할 수 있는가 (수강 중 · 열린 차시) */
  canRecord: boolean;
  /** 볼 수 있는가 — 수강 중 · 열린 차시, 또는 복습 기간 안 */
  canPlay: boolean;
  lesson: PlayerLesson;
  pages: PlayerPage[];
  /** CDMS 목차 · 자막 (JSON 글자 그대로) */
  timeJson: string | null;
  smiJson: string | null;
  /** 같은 콘텐츠의 차시 목록 (이동 · 상태) */
  lessons: PlayerLesson[];
}

/** 그 회원 · 그 차수 과목 콘텐츠의 차시별 학습 요약 (enrollmentId 로) — 강의실 목록 · 학습창 차시 목록이 같이 쓴다 */
export async function readLessonSummaries(enrollmentId: number): Promise<PlayerLesson[]> {
  const pool = await getPool();
  const r = await pool.request().input("e", sql.Int, enrollmentId).query<PlayerLesson>(`
    SELECT l.lesson_id AS lessonId, CAST(l.week_no AS INT) AS weekNo, CAST(l.lesson_no AS INT) AS lessonNo, l.title,
      REPLACE(CONVERT(CHAR(10), DATEADD(DAY, (l.week_no - 1) * 7, CAST(s.study_start AS DATE)), 23), '-', '.') AS opensOn,
      CAST(CASE WHEN ${LESSON_OPEN} THEN 1 ELSE 0 END AS BIT) AS isOpen,
      ISNULL(pp.totalSeconds, 0) AS totalSeconds, ISNULL(pp.watchedSeconds, 0) AS watchedSeconds,
      ISNULL(pp.pageCount, 0) AS pageCount, ISNULL(pp.completedPages, 0) AS completedPages
    FROM dbo.enrollments e
    JOIN dbo.classes cl ON cl.class_id = e.class_id
    JOIN dbo.semesters s ON s.semester_id = cl.semester_id
    JOIN dbo.courses co ON co.course_id = cl.course_id
    JOIN dbo.content_lessons l ON l.content_id = co.content_id
    OUTER APPLY (
      SELECT COUNT(*) AS pageCount, SUM(p.play_seconds) AS totalSeconds, SUM(ISNULL(lp.watched_seconds, 0)) AS watchedSeconds,
        SUM(CASE WHEN lp.completed_at IS NOT NULL THEN 1 ELSE 0 END) AS completedPages
      FROM dbo.content_pages p
      LEFT JOIN dbo.lesson_progress lp ON lp.page_id = p.page_id AND lp.enrollment_id = e.enrollment_id
      WHERE p.lesson_id = l.lesson_id) pp
    WHERE e.enrollment_id = @e
    ORDER BY l.week_no, l.sort_order, l.lesson_no, l.lesson_id`);
  return r.recordset;
}

/** 학습창 — 그 회원의 그 차수 수강 · 그 과목 콘텐츠의 차시가 아니면 null */
export async function readLessonPlayer(memberId: number, classId: number, lessonId: number): Promise<LessonPlayerData | null> {
  const pool = await getPool();
  const head = await pool.request().input("m", sql.Int, memberId).input("c", sql.Int, classId).input("l", sql.Int, lessonId).query<{
    enrollmentId: number;
    enrollmentStatus: string;
    courseName: string;
    inReview: boolean;
    timeJson: string | null;
    smiJson: string | null;
  }>(`
    SELECT e.enrollment_id AS enrollmentId, e.status AS enrollmentStatus, co.name AS courseName,
      CAST(CASE WHEN cl.review_end IS NOT NULL AND CAST(cl.review_end AS DATE) >= ${KST_TODAY} THEN 1 ELSE 0 END AS BIT) AS inReview,
      cd.time_json AS timeJson, cd.smi_json AS smiJson
    FROM dbo.enrollments e
    JOIN dbo.classes cl ON cl.class_id = e.class_id
    JOIN dbo.courses co ON co.course_id = cl.course_id
    JOIN dbo.content_lessons l ON l.content_id = co.content_id AND l.lesson_id = @l
    LEFT JOIN dbo.cdms_lessons cd ON cd.lesson_id = l.lesson_id
    WHERE e.member_id = @m AND e.class_id = @c AND e.status <> N'수강 취소'`);
  const h = head.recordset[0];
  if (!h) return null;
  const [lessons, pages] = await Promise.all([
    readLessonSummaries(h.enrollmentId),
    pool.request().input("e", sql.Int, h.enrollmentId).input("l", sql.Int, lessonId).query<PlayerPage>(`
      SELECT p.page_id AS pageId, p.title, p.play_seconds AS playSeconds, p.pc_url AS pcUrl,
        ISNULL(lp.watched_seconds, 0) AS watchedSeconds, ISNULL(lp.last_position, 0) AS lastPosition,
        CAST(CASE WHEN lp.completed_at IS NOT NULL THEN 1 ELSE 0 END AS BIT) AS completed
      FROM dbo.content_pages p
      LEFT JOIN dbo.lesson_progress lp ON lp.page_id = p.page_id AND lp.enrollment_id = @e
      WHERE p.lesson_id = @l ORDER BY p.page_no, p.page_id`),
  ]);
  const lesson = lessons.find((x) => x.lessonId === lessonId);
  if (!lesson) return null;
  const studying = h.enrollmentStatus === "수강 중";
  const finished = h.enrollmentStatus === "수료" || h.enrollmentStatus === "미수료";
  return {
    enrollmentId: h.enrollmentId,
    enrollmentStatus: h.enrollmentStatus,
    courseName: h.courseName,
    canRecord: studying && lesson.isOpen,
    canPlay: (studying && lesson.isOpen) || (finished && h.inReview),
    lesson,
    pages: pages.recordset,
    timeJson: h.timeJson,
    smiJson: h.smiJson,
    lessons,
  };
}

export type RecordResult =
  | { ok: true; watchedSeconds: number; completed: boolean; progress: number }
  | { ok: false; reason: "notAllowed" };

/**
 * 학습 기록 — 영상 쪽 하나에 본 시간(delta, 많아야 90초)과 위치를 더한다. 본 시간은 재생 시간을 넘지 않는다.
 * 80% 를 넘으면 완료 시각을 남기고, 수강의 진도율 · 출석 횟수를 다시 센다. 「수강 중」 · 열린 차시 · 그 과목 콘텐츠의 쪽만.
 */
export async function recordLessonProgress(
  memberId: number,
  classId: number,
  pageId: number,
  deltaSeconds: number,
  position: number,
): Promise<RecordResult> {
  const delta = Math.max(0, Math.min(90, Math.floor(deltaSeconds)));
  const pos = Math.max(0, Math.floor(position));
  const pool = await getPool();
  const r = await pool
    .request()
    .input("m", sql.Int, memberId)
    .input("c", sql.Int, classId)
    .input("p", sql.Int, pageId)
    .input("delta", sql.Int, delta)
    .input("pos", sql.Int, pos)
    .input("ratio", sql.Decimal(4, 2), COMPLETE_RATIO)
    .query<{ result: string; watched: number | null; completed: boolean | null; progress: number | null }>(`
      SET XACT_ABORT ON;
      BEGIN TRANSACTION;
      DECLARE @eid INT, @play INT;
      SELECT @eid = e.enrollment_id, @play = p.play_seconds
        FROM dbo.enrollments e WITH (UPDLOCK, HOLDLOCK)
        JOIN dbo.classes cl ON cl.class_id = e.class_id
        JOIN dbo.semesters s ON s.semester_id = cl.semester_id
        JOIN dbo.courses co ON co.course_id = cl.course_id
        JOIN dbo.content_pages p ON p.page_id = @p
        JOIN dbo.content_lessons l ON l.lesson_id = p.lesson_id AND l.content_id = co.content_id
        WHERE e.member_id = @m AND e.class_id = @c AND e.status = N'수강 중' AND ${LESSON_OPEN};
      IF @eid IS NULL
      BEGIN ROLLBACK TRANSACTION; SELECT N'notAllowed' AS result, CAST(NULL AS INT) AS watched, CAST(NULL AS BIT) AS completed, CAST(NULL AS FLOAT) AS progress; RETURN; END

      DECLARE @need INT = CEILING(@play * @ratio);
      IF EXISTS (SELECT 1 FROM dbo.lesson_progress WITH (UPDLOCK, HOLDLOCK) WHERE enrollment_id = @eid AND page_id = @p)
        UPDATE dbo.lesson_progress
          SET watched_seconds = CASE WHEN watched_seconds + @delta > @play THEN @play ELSE watched_seconds + @delta END,
              last_position = CASE WHEN @pos > @play THEN @play ELSE @pos END,
              completed_at = CASE WHEN completed_at IS NULL AND
                                       (CASE WHEN watched_seconds + @delta > @play THEN @play ELSE watched_seconds + @delta END) >= @need
                                  THEN SYSDATETIME() ELSE completed_at END,
              updated_at = SYSDATETIME()
          WHERE enrollment_id = @eid AND page_id = @p;
      ELSE
        INSERT INTO dbo.lesson_progress (enrollment_id, page_id, watched_seconds, last_position, completed_at)
          VALUES (@eid, @p, CASE WHEN @delta > @play THEN @play ELSE @delta END, CASE WHEN @pos > @play THEN @play ELSE @pos END,
                  CASE WHEN (CASE WHEN @delta > @play THEN @play ELSE @delta END) >= @need THEN SYSDATETIME() END);

      -- 진도율 · 출석 횟수 다시 세기 (영상 쪽이 있는 차시 기준)
      DECLARE @total INT, @done INT;
      SELECT @total = COUNT(*), @done = SUM(CASE WHEN x.pages = x.completedPages THEN 1 ELSE 0 END)
        FROM (
          SELECT l.lesson_id, COUNT(*) AS pages,
            SUM(CASE WHEN lp.completed_at IS NOT NULL THEN 1 ELSE 0 END) AS completedPages
          FROM dbo.enrollments e
          JOIN dbo.classes cl ON cl.class_id = e.class_id
          JOIN dbo.courses co ON co.course_id = cl.course_id
          JOIN dbo.content_lessons l ON l.content_id = co.content_id
          JOIN dbo.content_pages pg ON pg.lesson_id = l.lesson_id
          LEFT JOIN dbo.lesson_progress lp ON lp.page_id = pg.page_id AND lp.enrollment_id = e.enrollment_id
          WHERE e.enrollment_id = @eid
          GROUP BY l.lesson_id) x;
      UPDATE dbo.enrollments
        SET progress = CASE WHEN ISNULL(@total, 0) = 0 THEN 0 ELSE CAST(ISNULL(@done, 0) * 100.0 / @total AS DECIMAL(5,2)) END,
            attend_count = ISNULL(@done, 0)
        WHERE enrollment_id = @eid;
      COMMIT TRANSACTION;
      SELECT N'ok' AS result, lp.watched_seconds AS watched, CAST(CASE WHEN lp.completed_at IS NOT NULL THEN 1 ELSE 0 END AS BIT) AS completed,
        (SELECT CAST(progress AS FLOAT) FROM dbo.enrollments WHERE enrollment_id = @eid) AS progress
      FROM dbo.lesson_progress lp WHERE lp.enrollment_id = @eid AND lp.page_id = @p;`);
  const row = r.recordset[0];
  if (row?.result === "ok") return { ok: true, watchedSeconds: row.watched ?? 0, completed: !!row.completed, progress: row.progress ?? 0 };
  return { ok: false, reason: "notAllowed" };
}
