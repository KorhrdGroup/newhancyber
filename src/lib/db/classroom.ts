import "server-only";
import { getPool, sql } from "./client";

/**
 * 나의 강의실 (읽기) — 그 회원의 수강(dbo.enrollments)과 차수 · 학기 · 과목 · 교강사 · 콘텐츠 차시 · 평가 · 제출 · 성적 기준.
 * 수강 · 평가 · 채점은 LMS 관리자 · 교강사 사이트가 만든다 (수강 대기 → 수강 중 → 수료 / 미수료).
 * 강의실 열쇠는 차수 번호(class_id) — 회원 · 차수당 수강은 한 줄(UQ_enrollments_class_member)이라 그 회원 안에서 하나로 정해진다.
 * 「수강 취소」 수강은 보이지 않는다. 모든 조회는 member_id 로 거른다 (다른 회원 차수 번호를 넣어도 빈 결과).
 * 날짜는 한국 날짜 「2026.12.10」, 시각은 「2026.12.10 09:00」(UTC 로 저장된 칸은 +9시간).
 */

const DOT = (col: string) => `REPLACE(CONVERT(CHAR(10), ${col}, 23), '-', '.')`;
const DOT_TIME = (col: string) => `REPLACE(CONVERT(VARCHAR(16), DATEADD(HOUR, 9, ${col}), 120), '-', '.')`;

export interface EnrollmentRow {
  classId: number;
  enrollmentId: number;
  status: string;
  semester: string;
  courseName: string;
  courseNo: string;
  classNo: number;
  credit: number;
  isPractice: boolean;
  category: string | null;
  teacherName: string | null;
  studyStart: string;
  studyEnd: string;
  /** YYYY-MM-DD (계산용) */
  studyStartYmd: string;
  reviewEnd: string | null;
  creditApplyDate: string | null;
  degreeApplyDate: string | null;
  progress: number;
  attendCount: number;
  absentCount: number;
  totalSessions: number;
  totalScore: number | null;
  grade: string | null;
  midScore: number | null;
  finalScore: number | null;
  homeworkScore: number | null;
  quizScore: number | null;
  discussionScore: number | null;
  activityScore: number | null;
  wAttend: number | null;
  wMid: number | null;
  wFinal: number | null;
  wHomework: number | null;
  wQuiz: number | null;
  wDiscussion: number | null;
  wActivity: number | null;
  contentId: number | null;
}

/** 그 회원의 수강 (classId 를 주면 그 차수 하나) — 최근 학기부터 */
export async function readEnrollments(memberId: number, classId: number | null = null): Promise<EnrollmentRow[]> {
  const pool = await getPool();
  const r = await pool.request().input("m", sql.Int, memberId).input("c", sql.Int, classId).query<EnrollmentRow>(`
    SELECT cl.class_id AS classId, e.enrollment_id AS enrollmentId, e.status, s.name AS semester,
      co.name AS courseName, co.course_no AS courseNo, CAST(cl.class_no AS INT) AS classNo, CAST(co.credit AS INT) AS credit,
      co.is_practice AS isPractice, cc.name AS category, t.name AS teacherName,
      ${DOT("s.study_start")} AS studyStart, ${DOT("s.study_end")} AS studyEnd, CONVERT(CHAR(10), s.study_start, 23) AS studyStartYmd,
      ${DOT("cl.review_end")} AS reviewEnd, ${DOT("s.credit_apply_date")} AS creditApplyDate, ${DOT("s.degree_apply_date")} AS degreeApplyDate,
      CAST(e.progress AS FLOAT) AS progress, CAST(e.attend_count AS INT) AS attendCount, CAST(e.absent_count AS INT) AS absentCount,
      CAST(cl.total_sessions AS INT) AS totalSessions,
      CAST(e.total_score AS FLOAT) AS totalScore, e.grade,
      CAST(e.mid_score AS FLOAT) AS midScore, CAST(e.final_score AS FLOAT) AS finalScore, CAST(e.homework_score AS FLOAT) AS homeworkScore,
      CAST(e.quiz_score AS FLOAT) AS quizScore, CAST(e.discussion_score AS FLOAT) AS discussionScore, CAST(e.activity_score AS FLOAT) AS activityScore,
      CAST(g.w_attend AS INT) AS wAttend, CAST(g.w_mid AS INT) AS wMid, CAST(g.w_final AS INT) AS wFinal, CAST(g.w_homework AS INT) AS wHomework,
      CAST(g.w_quiz AS INT) AS wQuiz, CAST(g.w_discussion AS INT) AS wDiscussion, CAST(g.w_activity AS INT) AS wActivity,
      co.content_id AS contentId
    FROM dbo.enrollments e
    JOIN dbo.classes cl ON cl.class_id = e.class_id
    JOIN dbo.semesters s ON s.semester_id = cl.semester_id
    JOIN dbo.courses co ON co.course_id = cl.course_id
    LEFT JOIN dbo.course_categories cc ON cc.category_id = co.category_id
    LEFT JOIN dbo.teachers t ON t.teacher_id = cl.teacher_id
    LEFT JOIN dbo.class_grading g ON g.class_id = cl.class_id
    WHERE e.member_id = @m AND e.status <> N'수강 취소' AND (@c IS NULL OR cl.class_id = @c)
    ORDER BY s.study_start DESC, co.name, cl.class_no`);
  return r.recordset;
}

export interface LessonRow {
  lessonId: number;
  weekNo: number;
  lessonNo: number;
  title: string;
}

/** 과목 콘텐츠의 차시 (주차 · 차시 순) */
export async function readLessons(contentId: number): Promise<LessonRow[]> {
  const pool = await getPool();
  const r = await pool.request().input("ct", sql.Int, contentId).query<LessonRow>(`
    SELECT lesson_id AS lessonId, CAST(week_no AS INT) AS weekNo, CAST(lesson_no AS INT) AS lessonNo, title
    FROM dbo.content_lessons WHERE content_id = @ct
    ORDER BY week_no, sort_order, lesson_no, lesson_id`);
  return r.recordset;
}

export interface AssessmentRow {
  assessmentId: number;
  kind: string;
  roundNo: number;
  title: string;
  maxScore: number;
  openAt: string | null;
  closeAt: string | null;
  /** 지금 기준 — before · open · closed (기간이 비면 open) */
  phase: "before" | "open" | "closed";
  /** 본 응시 제출 상태 (없으면 null = 미응시) */
  submissionStatus: string | null;
  score: number | null;
}

/** 그 차수의 평가와 이 수강의 제출 (재응시가 아닌 본 응시) */
export async function readAssessments(classId: number, enrollmentId: number): Promise<AssessmentRow[]> {
  const pool = await getPool();
  const r = await pool.request().input("c", sql.Int, classId).input("e", sql.Int, enrollmentId).query<AssessmentRow>(`
    SELECT a.assessment_id AS assessmentId, a.kind, CAST(a.round_no AS INT) AS roundNo, a.title, CAST(a.max_score AS FLOAT) AS maxScore,
      ${DOT_TIME("a.open_at")} AS openAt, ${DOT_TIME("a.close_at")} AS closeAt,
      CASE WHEN a.open_at IS NOT NULL AND SYSDATETIME() < a.open_at THEN 'before'
           WHEN a.close_at IS NOT NULL AND SYSDATETIME() > a.close_at THEN 'closed' ELSE 'open' END AS phase,
      sb.status AS submissionStatus, CAST(CASE WHEN sb.status = N'채점 완료' THEN sb.score END AS FLOAT) AS score
    FROM dbo.assessments a
    LEFT JOIN dbo.submissions sb ON sb.assessment_id = a.assessment_id AND sb.enrollment_id = @e AND sb.is_retest = 0
    WHERE a.class_id = @c
    ORDER BY CASE a.kind WHEN N'중간고사' THEN 1 WHEN N'기말고사' THEN 2 WHEN N'과제' THEN 3 WHEN N'퀴즈' THEN 4
                         WHEN N'토론' THEN 5 ELSE 6 END, a.round_no`);
  return r.recordset;
}
