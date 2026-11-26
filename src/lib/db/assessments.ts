import "server-only";
import { getPool, sql } from "./client";

/**
 * 시험 · 과제 참여 (학습자) — dbo.assessments · assessment_questions · submissions · submission_answers.
 * 평가 · 문항은 교강사 사이트 · LMS 가 만들고, 채점 · 성적 반영은 교강사 · LMS 가 한다 (newhancyber-lms src/lib/db/studyGrading.ts).
 * 홈페이지가 하는 일:
 *   - 시험(중간 · 기말 · 퀴즈) 응시 시작 → 「응시 중」, 답안 제출 → submission_answers + 자동 채점
 *       객관식: 답(1부터 세는 보기 번호)이 문항 answer 와 같으면 그 문항 점수 · 아니면 0
 *       단답형: 앞뒤 공백 · 가운데 공백 · 대소문자를 무시하고 같으면 점수 · 아니면 0
 *       서술형: 점수 비움 (교강사 채점) — 서술형이 하나라도 있으면 「제출 완료」, 없으면 「채점 완료」 + 점수 합
 *       (LMS 주석 「홈페이지가 자동 채점한 퀴즈」 — 수강 점수 칸 반영은 LMS · 교강사 채점 때 refreshScores 가 한다)
 *   - 과제 · 토론 · 학습심화활동 글 제출 → 「제출 완료」 + content (채점 전 · 기간 안이면 고쳐 낼 수 있다)
 * 참여할 수 있는 수강: 그 회원의 「수강 중」 (LMS 수강 관리는 수강 대기 · 수강 취소를 다루지 않는다). 기간(open_at ~ close_at, UTC) 안.
 * 본 응시만 다룬다 (is_retest = 0). 정답(answer)은 화면에 내보내지 않는다.
 */

export const EXAM_KINDS = ["중간고사", "기말고사", "퀴즈"] as const;
export const WRITING_KINDS = ["과제", "토론", "학습심화활동"] as const;

const DOT_TIME = (col: string) => `REPLACE(CONVERT(VARCHAR(16), DATEADD(HOUR, 9, ${col}), 120), '-', '.')`;

export interface LearnerAssessment {
  assessmentId: number;
  classId: number;
  enrollmentId: number;
  enrollmentStatus: string;
  courseName: string;
  kind: string;
  roundNo: number;
  title: string;
  description: string | null;
  maxScore: number;
  openAt: string | null;
  closeAt: string | null;
  phase: "before" | "open" | "closed";
  questionCount: number;
  questionScoreSum: number;
  /** 본 응시 제출 (없으면 null) */
  submissionId: number | null;
  submissionStatus: string | null;
  submittedAt: string | null;
  score: number | null;
  content: string | null;
  feedback: string | null;
}

/** 그 회원 · 그 차수의 평가 하나 — 회원이 그 차수를 수강하지 않거나 평가가 그 차수 것이 아니면 null */
export async function readLearnerAssessment(memberId: number, classId: number, assessmentId: number): Promise<LearnerAssessment | null> {
  const pool = await getPool();
  const r = await pool
    .request()
    .input("m", sql.Int, memberId)
    .input("c", sql.Int, classId)
    .input("a", sql.Int, assessmentId)
    .query<LearnerAssessment>(`
      SELECT a.assessment_id AS assessmentId, a.class_id AS classId, e.enrollment_id AS enrollmentId, e.status AS enrollmentStatus,
        co.name AS courseName, a.kind, CAST(a.round_no AS INT) AS roundNo, a.title, a.description, CAST(a.max_score AS FLOAT) AS maxScore,
        ${DOT_TIME("a.open_at")} AS openAt, ${DOT_TIME("a.close_at")} AS closeAt,
        CASE WHEN a.open_at IS NOT NULL AND SYSDATETIME() < a.open_at THEN 'before'
             WHEN a.close_at IS NOT NULL AND SYSDATETIME() > a.close_at THEN 'closed' ELSE 'open' END AS phase,
        (SELECT COUNT(*) FROM dbo.assessment_questions q WHERE q.assessment_id = a.assessment_id) AS questionCount,
        (SELECT CAST(ISNULL(SUM(q.score), 0) AS FLOAT) FROM dbo.assessment_questions q WHERE q.assessment_id = a.assessment_id) AS questionScoreSum,
        sb.submission_id AS submissionId, sb.status AS submissionStatus, ${DOT_TIME("sb.submitted_at")} AS submittedAt,
        CAST(CASE WHEN sb.status = N'채점 완료' THEN sb.score END AS FLOAT) AS score, sb.content,
        CASE WHEN sb.status = N'채점 완료' THEN sb.feedback END AS feedback
      FROM dbo.assessments a
      JOIN dbo.enrollments e ON e.class_id = a.class_id AND e.member_id = @m AND e.status <> N'수강 취소'
      JOIN dbo.classes cl ON cl.class_id = a.class_id
      JOIN dbo.courses co ON co.course_id = cl.course_id
      LEFT JOIN dbo.submissions sb ON sb.assessment_id = a.assessment_id AND sb.enrollment_id = e.enrollment_id AND sb.is_retest = 0
      WHERE a.assessment_id = @a AND a.class_id = @c`);
  return r.recordset[0] ?? null;
}

export interface LearnerQuestion {
  questionId: number;
  no: number;
  type: string;
  content: string;
  /** 객관식 보기 (줄마다 하나) — 단답형 · 서술형은 빈 배열 */
  choices: string[];
  score: number;
}

/** 시험지 — 정답은 빼고 */
export async function readQuestions(assessmentId: number): Promise<LearnerQuestion[]> {
  const pool = await getPool();
  const r = await pool.request().input("a", sql.Int, assessmentId).query<Omit<LearnerQuestion, "choices"> & { choices: string | null }>(`
    SELECT question_id AS questionId, CAST(question_no AS INT) AS no, question_type AS type, content, choices, CAST(score AS FLOAT) AS score
    FROM dbo.assessment_questions WHERE assessment_id = @a ORDER BY question_no, question_id`);
  return r.recordset.map((q) => ({
    ...q,
    choices: q.type === "객관식" ? (q.choices ?? "").replace(/\r\n?/g, "\n").split("\n").map((c) => c.trim()).filter(Boolean) : [],
  }));
}

/** 시험 · 글 제출 공통 — 그 회원의 수강 중 수강 · 기간 안 · 종류가 맞는지 (잠근 상태에서) */
const GUARD_SQL = (kinds: readonly string[]) => `
  DECLARE @eid INT, @kind NVARCHAR(10);
  SELECT @eid = e.enrollment_id, @kind = a.kind
    FROM dbo.assessments a
    JOIN dbo.enrollments e WITH (UPDLOCK, HOLDLOCK) ON e.class_id = a.class_id AND e.member_id = @m AND e.status = N'수강 중'
    WHERE a.assessment_id = @a AND a.class_id = @c
      AND (a.open_at IS NULL OR SYSDATETIME() >= a.open_at) AND (a.close_at IS NULL OR SYSDATETIME() <= a.close_at)
      AND a.kind IN (${kinds.map((k) => `N'${k}'`).join(", ")});
  IF @eid IS NULL
  BEGIN ROLLBACK TRANSACTION; SELECT N'notAllowed' AS result, CAST(NULL AS FLOAT) AS score; RETURN; END`;

export type StartExamResult = "ok" | "notAllowed" | "done";

/** 시험 시작 — 「응시 중」 본 응시를 만든다 (이미 응시 중이면 그대로, 제출했으면 done) */
export async function startExam(memberId: number, classId: number, assessmentId: number): Promise<StartExamResult> {
  const pool = await getPool();
  const r = await pool.request().input("m", sql.Int, memberId).input("c", sql.Int, classId).input("a", sql.Int, assessmentId)
    .query<{ result: string }>(`
      SET XACT_ABORT ON;
      BEGIN TRANSACTION;
      ${GUARD_SQL(EXAM_KINDS)}
      DECLARE @status NVARCHAR(10);
      SELECT @status = status FROM dbo.submissions WITH (UPDLOCK, HOLDLOCK) WHERE assessment_id = @a AND enrollment_id = @eid AND is_retest = 0;
      IF @status IS NOT NULL AND @status <> N'응시 중' AND @status <> N'미응시'
      BEGIN ROLLBACK TRANSACTION; SELECT N'done' AS result; RETURN; END
      IF @status IS NULL
        INSERT INTO dbo.submissions (assessment_id, enrollment_id, is_retest, status, started_at, is_abnormal_end)
          VALUES (@a, @eid, 0, N'응시 중', SYSDATETIME(), 0);
      ELSE IF @status = N'미응시'
        UPDATE dbo.submissions SET status = N'응시 중', started_at = SYSDATETIME()
          WHERE assessment_id = @a AND enrollment_id = @eid AND is_retest = 0;
      COMMIT TRANSACTION;
      SELECT N'ok' AS result;`);
  const res = r.recordset[0]?.result;
  return res === "ok" || res === "done" ? res : "notAllowed";
}

export type SubmitExamResult =
  | { ok: true; graded: boolean; score: number | null; maxScore: number }
  | { ok: false; reason: "notAllowed" | "notStarted" };

/**
 * 답안 제출 — 응시 중인 본 응시에 문항마다 답을 남기고 자동 채점한다 (머리 주석). 문항에 없는 번호는 버린다.
 * answers: { 문항 번호(question_id): 답 } — 객관식은 보기 번호(1부터), 단답 · 서술은 글.
 */
export async function submitExam(
  memberId: number,
  classId: number,
  assessmentId: number,
  answers: Record<string, string>,
): Promise<SubmitExamResult> {
  const json = JSON.stringify(
    Object.entries(answers)
      .map(([qid, ans]) => ({ q: Number(qid), a: String(ans ?? "").slice(0, 4000) }))
      .filter((x) => Number.isSafeInteger(x.q) && x.q > 0),
  );
  const pool = await getPool();
  const r = await pool
    .request()
    .input("m", sql.Int, memberId)
    .input("c", sql.Int, classId)
    .input("a", sql.Int, assessmentId)
    .input("answers", sql.NVarChar(sql.MAX), json)
    .query<{ result: string; score: number | null; graded: boolean | null; maxScore: number | null }>(`
      SET XACT_ABORT ON;
      BEGIN TRANSACTION;
      ${GUARD_SQL(EXAM_KINDS)}
      DECLARE @sid INT;
      SELECT @sid = submission_id FROM dbo.submissions WITH (UPDLOCK, HOLDLOCK)
        WHERE assessment_id = @a AND enrollment_id = @eid AND is_retest = 0 AND status = N'응시 중';
      IF @sid IS NULL
      BEGIN ROLLBACK TRANSACTION; SELECT N'notStarted' AS result, CAST(NULL AS FLOAT) AS score, CAST(NULL AS BIT) AS graded, CAST(NULL AS FLOAT) AS maxScore; RETURN; END

      -- 문항마다 답 (안 푼 문항은 빈 답) · 자동 채점
      DECLARE @ans TABLE (question_id INT PRIMARY KEY, answer NVARCHAR(MAX));
      INSERT INTO @ans (question_id, answer)
        SELECT q, MAX(a) FROM OPENJSON(@answers) WITH (q INT '$.q', a NVARCHAR(MAX) '$.a') GROUP BY q;

      DELETE FROM dbo.submission_answers WHERE submission_id = @sid;
      INSERT INTO dbo.submission_answers (submission_id, question_id, answer, score, is_correct)
        SELECT @sid, q.question_id, NULLIF(LTRIM(RTRIM(x.answer)), N''),
          CASE WHEN q.question_type = N'서술형' THEN NULL WHEN m.ok = 1 THEN q.score ELSE 0 END,
          CASE WHEN q.question_type = N'서술형' THEN NULL ELSE m.ok END
        FROM dbo.assessment_questions q
        LEFT JOIN @ans x ON x.question_id = q.question_id
        CROSS APPLY (SELECT CAST(CASE
            WHEN q.question_type = N'객관식' AND LTRIM(RTRIM(ISNULL(x.answer, N''))) = LTRIM(RTRIM(ISNULL(q.answer, N'')))
                 AND ISNULL(q.answer, N'') <> N'' THEN 1
            WHEN q.question_type = N'단답형' AND ISNULL(q.answer, N'') <> N''
                 AND LOWER(REPLACE(REPLACE(REPLACE(ISNULL(x.answer, N''), N' ', N''), NCHAR(9), N''), NCHAR(10), N''))
                   = LOWER(REPLACE(REPLACE(REPLACE(q.answer, N' ', N''), NCHAR(9), N''), NCHAR(10), N'')) THEN 1
            ELSE 0 END AS BIT) AS ok) m
        WHERE q.assessment_id = @a;

      DECLARE @essay BIT = CASE WHEN EXISTS (SELECT 1 FROM dbo.assessment_questions WHERE assessment_id = @a AND question_type = N'서술형') THEN 1 ELSE 0 END;
      DECLARE @total DECIMAL(9,2) = (SELECT ISNULL(SUM(score), 0) FROM dbo.submission_answers WHERE submission_id = @sid);
      UPDATE dbo.submissions
        SET status = CASE WHEN @essay = 1 THEN N'제출 완료' ELSE N'채점 완료' END,
            submitted_at = SYSDATETIME(),
            score = CASE WHEN @essay = 1 THEN NULL ELSE @total END,
            graded_at = CASE WHEN @essay = 1 THEN NULL ELSE SYSDATETIME() END
        WHERE submission_id = @sid;
      COMMIT TRANSACTION;
      SELECT N'ok' AS result, CASE WHEN @essay = 1 THEN NULL ELSE CAST(@total AS FLOAT) END AS score,
        CAST(CASE WHEN @essay = 1 THEN 0 ELSE 1 END AS BIT) AS graded,
        (SELECT CAST(max_score AS FLOAT) FROM dbo.assessments WHERE assessment_id = @a) AS maxScore;`);
  const row = r.recordset[0];
  if (row?.result === "ok") return { ok: true, graded: !!row.graded, score: row.score, maxScore: row.maxScore ?? 0 };
  return { ok: false, reason: row?.result === "notStarted" ? "notStarted" : "notAllowed" };
}

export type SubmitWritingResult = "ok" | "notAllowed" | "graded";

/** 과제 · 토론 · 학습심화활동 — 글 제출 (채점 전이면 고쳐 낸다) */
export async function submitWriting(memberId: number, classId: number, assessmentId: number, content: string): Promise<SubmitWritingResult> {
  const pool = await getPool();
  const r = await pool
    .request()
    .input("m", sql.Int, memberId)
    .input("c", sql.Int, classId)
    .input("a", sql.Int, assessmentId)
    .input("content", sql.NVarChar(sql.MAX), content)
    .query<{ result: string }>(`
      SET XACT_ABORT ON;
      BEGIN TRANSACTION;
      ${GUARD_SQL(WRITING_KINDS)}
      DECLARE @status NVARCHAR(10);
      SELECT @status = status FROM dbo.submissions WITH (UPDLOCK, HOLDLOCK) WHERE assessment_id = @a AND enrollment_id = @eid AND is_retest = 0;
      IF @status = N'채점 완료'
      BEGIN ROLLBACK TRANSACTION; SELECT N'graded' AS result; RETURN; END
      IF @status IS NULL
        INSERT INTO dbo.submissions (assessment_id, enrollment_id, is_retest, status, started_at, submitted_at, content, is_abnormal_end)
          VALUES (@a, @eid, 0, N'제출 완료', SYSDATETIME(), SYSDATETIME(), @content, 0);
      ELSE
        UPDATE dbo.submissions SET status = N'제출 완료', submitted_at = SYSDATETIME(), content = @content
          WHERE assessment_id = @a AND enrollment_id = @eid AND is_retest = 0;
      COMMIT TRANSACTION;
      SELECT N'ok' AS result;`);
  const res = r.recordset[0]?.result;
  return res === "ok" || res === "graded" ? res : "notAllowed";
}

export interface DiscussionPost {
  author: string;
  date: string;
  body: string;
  mine: boolean;
}

/** 토론 — 같은 평가에 올라온 글 (이름은 가운데를 가린다: 김** ) */
export async function readDiscussionPosts(assessmentId: number, myEnrollmentId: number): Promise<DiscussionPost[]> {
  const pool = await getPool();
  const r = await pool.request().input("a", sql.Int, assessmentId).input("e", sql.Int, myEnrollmentId).query<{
    name: string;
    date: string;
    body: string;
    mine: boolean;
  }>(`
    SELECT m.name, REPLACE(CONVERT(CHAR(10), DATEADD(HOUR, 9, sb.submitted_at), 23), '-', '.') AS date, sb.content AS body,
      CAST(CASE WHEN sb.enrollment_id = @e THEN 1 ELSE 0 END AS BIT) AS mine
    FROM dbo.submissions sb
    JOIN dbo.enrollments e ON e.enrollment_id = sb.enrollment_id
    JOIN dbo.members m ON m.member_id = e.member_id
    WHERE sb.assessment_id = @a AND sb.is_retest = 0 AND sb.status IN (N'제출 완료', N'채점 완료') AND ISNULL(sb.content, N'') <> N''
    ORDER BY sb.submitted_at`);
  return r.recordset.map((p) => ({
    author: p.mine ? "나" : `${p.name.slice(0, 1)}${"*".repeat(Math.max(1, p.name.length - 1))}`,
    date: p.date,
    body: p.body,
    mine: p.mine,
  }));
}
