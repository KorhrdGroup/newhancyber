import "server-only";
import { getPool, sql } from "./client";

/**
 * 강의 평가 (과목 만족도) — LMS 설문 관리가 만든 설문(dbo.surveys · survey_questions)에 학습자가 답한다
 * (survey_responses · survey_answers). 답은 LMS 설문 관리 › 결과에 바로 보인다 (newhancyber-lms src/lib/db/surveys.ts getSurveyResults).
 * 과목(courses.survey_id)에 연결된 「과목만족도」 설문만 다룬다. 응답 한 줄 = 수강 하나 (UX_survey_responses_enrollment):
 *   member_id = 회원, enrollment_id = 수강, class_id 는 비운다 (LMS 결과가 수강의 차수로 거른다).
 * 답: 하나 · 여럿 → choices_json (1부터 세는 보기 번호 배열, 예 "[2]"), 글 → text_answer. 답하지 않은 선택 문항은 줄을 만들지 않는다.
 * 참여할 수 있을 때: 설문이 켜져 있고(is_active) 기간(start_date ~ end_date, 한국 날짜) 안이며, 수강이 수강 중 · 수료 · 미수료.
 *   (끝난 수강도 받는다 — 「평가를 마쳐야 성적 보기」라 성적을 보려면 참여할 수 있어야 한다)
 * 응답이 생긴 설문은 LMS 가 문항을 바꾸지 않는다. 화면을 연 뒤 문항이 바뀌었으면(문항 번호가 바뀐다) 저장하지 않는다.
 */

export const SURVEY_STATUSES = ["수강 중", "수료", "미수료"] as const;
/** survey_answers.text_answer NVARCHAR(2000) */
export const SURVEY_TEXT_MAX = 2000;

const KST_TODAY = "CONVERT(DATE, DATEADD(HOUR, 9, SYSUTCDATETIME()))";
const DOT = (col: string) => `REPLACE(CONVERT(CHAR(10), ${col}, 23), '-', '.')`;

export type SurveyQuestionType = "하나" | "여럿" | "글";

export interface CourseSurveyQuestion {
  questionId: number;
  questionType: SurveyQuestionType;
  title: string;
  options: string[];
  isRequired: boolean;
}

export interface CourseSurvey {
  classId: number;
  enrollmentId: number;
  enrollmentStatus: string;
  courseName: string;
  /** 과목에 연결된 과목 만족도 설문 (없으면 null) */
  surveyId: number | null;
  title: string | null;
  intro: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  /** 지금 기간 — before · open · closed (날짜가 비면 open) */
  phase: "before" | "open" | "closed";
  /** 이 수강의 응답 시각 (안 했으면 null) */
  respondedAt: string | null;
  questions: CourseSurveyQuestion[];
}

function parseOptions(json: string | null): string[] {
  if (!json) return [];
  try {
    const v: unknown = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** 그 회원 · 그 차수 수강의 강의 평가 — 수강이 없으면(수강 취소 포함) null */
export async function readCourseSurvey(memberId: number, classId: number): Promise<CourseSurvey | null> {
  const pool = await getPool();
  const r = await pool.request().input("m", sql.Int, memberId).input("c", sql.Int, classId).query<Omit<CourseSurvey, "questions">>(`
    SELECT cl.class_id AS classId, e.enrollment_id AS enrollmentId, e.status AS enrollmentStatus, co.name AS courseName,
      s.survey_id AS surveyId, s.title, s.intro, ${DOT("s.start_date")} AS startDate, ${DOT("s.end_date")} AS endDate,
      CAST(ISNULL(s.is_active, 0) AS BIT) AS isActive,
      CASE WHEN s.start_date IS NOT NULL AND ${KST_TODAY} < s.start_date THEN 'before'
           WHEN s.end_date IS NOT NULL AND ${KST_TODAY} > s.end_date THEN 'closed' ELSE 'open' END AS phase,
      REPLACE(CONVERT(VARCHAR(16), DATEADD(HOUR, 9, rs.created_at), 120), '-', '.') AS respondedAt
    FROM dbo.enrollments e
    JOIN dbo.classes cl ON cl.class_id = e.class_id
    JOIN dbo.courses co ON co.course_id = cl.course_id
    LEFT JOIN dbo.surveys s ON s.survey_id = co.survey_id AND s.survey_type = N'과목만족도'
    LEFT JOIN dbo.survey_responses rs ON rs.survey_id = s.survey_id AND rs.enrollment_id = e.enrollment_id
    WHERE e.member_id = @m AND e.class_id = @c AND e.status <> N'수강 취소'`);
  const head = r.recordset[0];
  if (!head) return null;
  if (head.surveyId === null) return { ...head, questions: [] };
  const q = await pool.request().input("s", sql.Int, head.surveyId).query<{
    questionId: number;
    questionType: SurveyQuestionType;
    title: string;
    optionsJson: string | null;
    isRequired: boolean;
  }>(`
    SELECT question_id AS questionId, question_type AS questionType, title, options_json AS optionsJson, is_required AS isRequired
    FROM dbo.survey_questions WHERE survey_id = @s ORDER BY sort_order, question_id`);
  return { ...head, questions: q.recordset.map(({ optionsJson, ...x }) => ({ ...x, options: parseOptions(optionsJson) })) };
}

/** 지금 참여할 수 없는 까닭 (참여할 수 있으면 null) */
export function surveyBlockedReason(s: CourseSurvey): string | null {
  if (s.surveyId === null || !s.isActive) return "이 과목은 강의 평가가 없어요.";
  if (s.respondedAt) return `이미 강의 평가를 마쳤어요 (${s.respondedAt}).`;
  if (!(SURVEY_STATUSES as readonly string[]).includes(s.enrollmentStatus)) return "개강한 뒤(수강 중)에 참여할 수 있어요.";
  if (s.phase === "before") return `강의 평가 기간 전이에요 (${s.startDate}부터).`;
  if (s.phase === "closed") return `강의 평가 기간이 끝났어요 (${s.endDate}까지).`;
  if (s.questions.length === 0) return "강의 평가 문항이 아직 없어요.";
  return null;
}

/**
 * 「평가를 마쳐야 성적 보기」 — 지금 참여할 수 있는 평가가 남아 있으면 true.
 * 평가가 없거나 꺼져 있거나 기간이 끝났으면 성적을 막지 않는다 (참여할 길이 없는데 막으면 영영 못 본다).
 */
export const surveyGatesGrade = (s: CourseSurvey) => s.respondedAt === null && surveyBlockedReason(s) === null;

/** 화면에서 온 답 — 문항 번호 → 고른 보기 번호(1부터) 또는 글 */
export type SurveyAnswerInput = Record<string, number[] | string>;

export type SurveySubmitResult = { ok: true } | { ok: false; error: string };

/**
 * 강의 평가 제출 — 답을 읽은 문항으로 검사한 뒤 한 트랜잭션으로 응답 · 답을 넣는다.
 * 잠금 순서는 LMS 설문 저장과 같다: 설문 줄 → 응답 줄 (응답이 없을 때만 LMS 가 문항을 바꾸므로, 그 사이 바뀌지 않게).
 */
export async function submitCourseSurvey(memberId: number, classId: number, answers: SurveyAnswerInput): Promise<SurveySubmitResult> {
  const s = await readCourseSurvey(memberId, classId);
  if (!s) return { ok: false, error: "수강 중인 과목이 아니에요." };
  const blocked = surveyBlockedReason(s);
  if (blocked) return { ok: false, error: blocked };

  const rows: { questionId: number; choicesJson: string | null; textAnswer: string | null }[] = [];
  for (const [i, q] of s.questions.entries()) {
    const a = answers[String(q.questionId)];
    const label = `${i + 1}번 문항`;
    if (q.questionType === "글") {
      const text = typeof a === "string" ? a.trim() : "";
      if (text.length > SURVEY_TEXT_MAX) return { ok: false, error: `${label}은 ${SURVEY_TEXT_MAX}자까지 쓸 수 있어요.` };
      if (!text) {
        if (q.isRequired) return { ok: false, error: `${label}에 답해 주세요.` };
        continue;
      }
      rows.push({ questionId: q.questionId, choicesJson: null, textAnswer: text });
      continue;
    }
    const picked = Array.isArray(a) ? [...new Set(a)].filter((n) => Number.isInteger(n) && n >= 1 && n <= q.options.length).sort((x, y) => x - y) : [];
    if (Array.isArray(a) && picked.length !== new Set(a).size) return { ok: false, error: `${label}의 보기가 바뀌었어요. 창을 다시 열어 주세요.` };
    if (q.questionType === "하나" && picked.length > 1) return { ok: false, error: `${label}은 하나만 고를 수 있어요.` };
    if (picked.length === 0) {
      if (q.isRequired) return { ok: false, error: `${label}에 답해 주세요.` };
      continue;
    }
    rows.push({ questionId: q.questionId, choicesJson: JSON.stringify(picked), textAnswer: null });
  }

  const pool = await getPool();
  const r = await pool
    .request()
    .input("m", sql.Int, memberId)
    .input("e", sql.Int, s.enrollmentId)
    .input("s", sql.Int, s.surveyId)
    .input("qids", sql.NVarChar(sql.MAX), s.questions.map((q) => q.questionId).join(","))
    .input("rows", sql.NVarChar(sql.MAX), JSON.stringify(rows)).query<{ result: string }>(`
      SET XACT_ABORT ON;
      BEGIN TRANSACTION;
      -- 설문 줄을 먼저 잠근다 (LMS saveSurvey 와 같은 순서)
      IF NOT EXISTS (
        SELECT 1 FROM dbo.surveys WITH (UPDLOCK, HOLDLOCK)
        WHERE survey_id = @s AND survey_type = N'과목만족도' AND is_active = 1
          AND (start_date IS NULL OR start_date <= ${KST_TODAY}) AND (end_date IS NULL OR end_date >= ${KST_TODAY}))
      BEGIN
        ROLLBACK TRANSACTION; SELECT N'closed' AS result; RETURN;
      END
      IF EXISTS (SELECT 1 FROM dbo.survey_responses WITH (UPDLOCK, HOLDLOCK) WHERE survey_id = @s AND enrollment_id = @e)
      BEGIN
        ROLLBACK TRANSACTION; SELECT N'done' AS result; RETURN;
      END
      IF NOT EXISTS (
        SELECT 1 FROM dbo.enrollments e JOIN dbo.classes cl ON cl.class_id = e.class_id JOIN dbo.courses co ON co.course_id = cl.course_id
        WHERE e.enrollment_id = @e AND e.member_id = @m AND e.status IN (N'수강 중', N'수료', N'미수료') AND co.survey_id = @s)
      BEGIN
        ROLLBACK TRANSACTION; SELECT N'enrollment' AS result; RETURN;
      END
      -- 화면을 연 뒤 문항이 바뀌었으면(번호가 바뀐다) 저장하지 않는다
      IF ISNULL((SELECT STRING_AGG(CAST(question_id AS NVARCHAR(12)), ',') WITHIN GROUP (ORDER BY sort_order, question_id)
                 FROM dbo.survey_questions WHERE survey_id = @s), N'') <> @qids
      BEGIN
        ROLLBACK TRANSACTION; SELECT N'changed' AS result; RETURN;
      END
      INSERT INTO dbo.survey_responses (survey_id, member_id, enrollment_id) VALUES (@s, @m, @e);
      DECLARE @rid INT = CAST(SCOPE_IDENTITY() AS INT);
      INSERT INTO dbo.survey_answers (response_id, question_id, choices_json, text_answer)
      SELECT @rid, j.questionId, j.choicesJson, j.textAnswer
      FROM OPENJSON(@rows) WITH (questionId INT, choicesJson NVARCHAR(200), textAnswer NVARCHAR(2000)) j;
      COMMIT TRANSACTION;
      SELECT N'ok' AS result;`);
  const result = r.recordset[0]?.result;
  if (result === "ok") return { ok: true };
  const errors: Record<string, string> = {
    closed: "강의 평가 기간이 아니에요.",
    done: "이미 강의 평가를 마쳤어요.",
    enrollment: "강의 평가에 참여할 수 있는 수강이 아니에요.",
    changed: "강의 평가 문항이 바뀌었어요. 창을 다시 열어 주세요.",
  };
  return { ok: false, error: errors[result ?? ""] ?? "강의 평가를 저장하지 못했어요." };
}
