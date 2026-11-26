import "server-only";
import { getPool, sql } from "./client";

/**
 * 학습 게시판 (마이페이지) — 학습 공지사항(study_notice) · 학습 자료실(study_data). 글은 LMS 「학습 게시판 관리」와
 * 교강사 사이트가 쓰고(dbo.board_posts · board_post_files, LMS src/lib/db/boards.ts), 홈페이지는 읽기 · 조회수만.
 * 학습자에게 보이는 글: 지우지 않았고, 대상(target)이 비었거나 「모두」 · 「학습자」이며,
 *   - 차수(class_id)가 있으면 그 회원이 수강(수강 취소 빼고)하는 차수,
 *   - 차수가 없으면 과목(course_id)이 비었거나 그 회원이 수강하는 과목.
 * 첨부는 kind 「첨부」만, 같은 조건을 거친 글의 것만 내려준다.
 */

export const STUDY_BOARDS = { notice: "study_notice", materials: "study_data" } as const;
export type StudyBoardKind = keyof typeof STUDY_BOARDS;
export const STUDY_PAGE_SIZE = 10;

const DOT = (col: string) => `REPLACE(CONVERT(CHAR(10), DATEADD(HOUR, 9, ${col}), 23), '-', '.')`;

/** 이 회원에게 보이는 글 (p = board_posts) */
const VISIBLE = `
  p.is_deleted = 0
  AND (p.target IS NULL OR p.target IN (N'모두', N'학습자'))
  AND (
    (p.class_id IS NOT NULL AND EXISTS (SELECT 1 FROM dbo.enrollments e WHERE e.member_id = @m AND e.class_id = p.class_id AND e.status <> N'수강 취소'))
    OR (p.class_id IS NULL AND (p.course_id IS NULL OR EXISTS (
      SELECT 1 FROM dbo.enrollments e JOIN dbo.classes c ON c.class_id = e.class_id
      WHERE e.member_id = @m AND e.status <> N'수강 취소' AND c.course_id = p.course_id))))`;

const JOINS = `
  LEFT JOIN dbo.classes cl ON cl.class_id = p.class_id
  LEFT JOIN dbo.semesters se ON se.semester_id = cl.semester_id
  LEFT JOIN dbo.courses co ON co.course_id = COALESCE(cl.course_id, p.course_id)`;

export interface StudyClassOption {
  classId: number;
  semesterId: number;
  semester: string;
  label: string;
}

/** 거르기 칸 — 그 회원이 수강하는 차수 (최근 학기부터) */
export async function listMyStudyClasses(memberId: number): Promise<StudyClassOption[]> {
  const pool = await getPool();
  const r = await pool.request().input("m", sql.Int, memberId).query<StudyClassOption>(`
    SELECT cl.class_id AS classId, se.semester_id AS semesterId, se.name AS semester,
      co.name + N' ' + CAST(cl.class_no AS NVARCHAR(5)) + N'반' AS label
    FROM dbo.enrollments e
    JOIN dbo.classes cl ON cl.class_id = e.class_id
    JOIN dbo.semesters se ON se.semester_id = cl.semester_id
    JOIN dbo.courses co ON co.course_id = cl.course_id
    WHERE e.member_id = @m AND e.status <> N'수강 취소'
    ORDER BY se.study_start DESC, co.name, cl.class_no`);
  return r.recordset;
}

export interface StudyListFilter {
  memberId: number;
  kind: StudyBoardKind;
  semesterId: number | null;
  classId: number | null;
  q: string;
  scope: "title" | "content";
  page: number;
}

export interface StudyListRow {
  postId: number;
  title: string;
  isPinned: boolean;
  semester: string | null;
  course: string | null;
  createdAt: string;
  fileCount: number;
}

export async function listStudyPosts(f: StudyListFilter): Promise<{ rows: StudyListRow[]; total: number }> {
  const pool = await getPool();
  const like = f.q ? `%${f.q.replace(/[\\%_[]/g, (c) => `[${c}]`)}%` : null;
  const req = () =>
    pool
      .request()
      .input("m", sql.Int, f.memberId)
      .input("code", sql.NVarChar(20), STUDY_BOARDS[f.kind])
      .input("sem", sql.Int, f.semesterId)
      .input("cls", sql.Int, f.classId)
      .input("like", sql.NVarChar(210), like)
      .input("content", sql.Bit, f.scope === "content")
      .input("offset", sql.Int, (f.page - 1) * STUDY_PAGE_SIZE)
      .input("size", sql.Int, STUDY_PAGE_SIZE);
  const WHERE = `
    FROM dbo.board_posts p ${JOINS}
    WHERE p.board_code = @code AND ${VISIBLE}
      AND (@sem IS NULL OR cl.semester_id = @sem)
      AND (@cls IS NULL OR p.class_id = @cls)
      AND (@like IS NULL OR (@content = 0 AND p.title LIKE @like) OR (@content = 1 AND p.content LIKE @like))`;
  const [rows, count] = await Promise.all([
    req().query<StudyListRow>(`
      SELECT p.post_id AS postId, p.title, CAST(ISNULL(p.is_pinned, 0) AS BIT) AS isPinned, se.name AS semester,
        CASE WHEN cl.class_id IS NULL THEN co.name ELSE co.name + N' ' + CAST(cl.class_no AS NVARCHAR(5)) + N'반' END AS course,
        ${DOT("p.created_at")} AS createdAt,
        (SELECT COUNT(*) FROM dbo.board_post_files f WHERE f.post_id = p.post_id AND f.is_deleted = 0 AND f.kind = N'첨부') AS fileCount
      ${WHERE}
      ORDER BY ISNULL(p.is_pinned, 0) DESC, p.post_id DESC
      OFFSET @offset ROWS FETCH NEXT @size ROWS ONLY`),
    req().query<{ total: number }>(`SELECT COUNT(*) AS total ${WHERE}`),
  ]);
  return { rows: rows.recordset, total: count.recordset[0]?.total ?? 0 };
}

export interface StudyPostDetail {
  postId: number;
  kind: StudyBoardKind;
  title: string;
  content: string | null;
  semester: string | null;
  course: string | null;
  author: string;
  createdAt: string;
  viewCount: number;
  files: { fileId: number; fileName: string }[];
  /** 같은 게시판 · 이 회원에게 보이는 글 가운데 이전(더 오래된) · 다음(더 새) 글 */
  prev: { postId: number; title: string } | null;
  next: { postId: number; title: string } | null;
}

/** 글 하나 — 이 회원에게 보이지 않거나 학습 게시판 글이 아니면 null. 보이면 조회수를 올린다 */
export async function readStudyPost(memberId: number, postId: number): Promise<StudyPostDetail | null> {
  const pool = await getPool();
  const r = await pool.request().input("m", sql.Int, memberId).input("id", sql.Int, postId).query(`
    DECLARE @code NVARCHAR(20) = (SELECT p.board_code FROM dbo.board_posts p
      WHERE p.post_id = @id AND p.board_code IN (N'study_notice', N'study_data') AND ${VISIBLE});
    IF @code IS NOT NULL UPDATE dbo.board_posts SET view_count = view_count + 1 WHERE post_id = @id;

    SELECT p.post_id AS postId, p.board_code AS code, p.title, p.content, se.name AS semester,
      CASE WHEN cl.class_id IS NULL THEN co.name ELSE co.name + N' ' + CAST(cl.class_no AS NVARCHAR(5)) + N'반' END AS course,
      CASE p.author_type WHEN N'teacher' THEN ISNULL(t.name + N' 교강사', N'교강사') ELSE N'운영팀' END AS author,
      ${DOT("p.created_at")} AS createdAt, p.view_count AS viewCount
    FROM dbo.board_posts p ${JOINS}
    LEFT JOIN dbo.teachers t ON p.author_type = N'teacher' AND t.teacher_id = p.author_id
    WHERE p.post_id = @id AND p.board_code = @code;

    SELECT f.file_id AS fileId, f.file_name AS fileName FROM dbo.board_post_files f
    WHERE f.post_id = @id AND @code IS NOT NULL AND f.is_deleted = 0 AND f.kind = N'첨부' ORDER BY f.file_id;

    SELECT TOP 1 p.post_id AS postId, p.title FROM dbo.board_posts p
    WHERE p.board_code = @code AND p.post_id < @id AND ${VISIBLE} ORDER BY p.post_id DESC;

    SELECT TOP 1 p.post_id AS postId, p.title FROM dbo.board_posts p
    WHERE p.board_code = @code AND p.post_id > @id AND ${VISIBLE} ORDER BY p.post_id ASC;`);
  const sets = r.recordsets as unknown as Record<string, unknown>[][];
  const head = sets[0]?.[0] as (Omit<StudyPostDetail, "kind" | "files" | "prev" | "next"> & { code: string }) | undefined;
  if (!head) return null;
  const { code, ...post } = head;
  return {
    ...post,
    kind: code === "study_data" ? "materials" : "notice",
    files: (sets[1] ?? []) as StudyPostDetail["files"],
    prev: (sets[2]?.[0] as StudyPostDetail["prev"]) ?? null,
    next: (sets[3]?.[0] as StudyPostDetail["next"]) ?? null,
  };
}

/** 첨부 받기 — 이 회원에게 보이는 학습 게시판 글의 지우지 않은 첨부만 */
export async function readStudyFile(memberId: number, fileId: number): Promise<{ fileName: string; data: Buffer } | null> {
  const pool = await getPool();
  const r = await pool.request().input("m", sql.Int, memberId).input("fid", sql.Int, fileId).query<{ fileName: string; data: Buffer }>(`
    SELECT f.file_name AS fileName, f.data
    FROM dbo.board_post_files f JOIN dbo.board_posts p ON p.post_id = f.post_id
    WHERE f.file_id = @fid AND f.is_deleted = 0 AND f.kind = N'첨부'
      AND p.board_code IN (N'study_notice', N'study_data') AND ${VISIBLE}`);
  return r.recordset[0] ?? null;
}
