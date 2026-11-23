import "server-only";
import { getPool, sql } from "./client";

/**
 * 홈페이지 공개 게시판 — dbo.board_posts (DB 002 · 013 · 025 · 026). 관리자 「게시판 관리」가 쓰고 홈페이지는 읽기만 한다
 * (조회수 view_count 만 홈페이지가 올린다).
 * 규칙(안내판 9장 11/23 요청): is_deleted = 0 만 · 상단 고정 먼저(is_pinned DESC, post_id DESC) ·
 * 본문은 글자 그대로(HTML 아님) · 첨부는 board_post_files 의 kind 「첨부」, is_deleted = 0.
 */
export const PUBLIC_BOARDS = ["notice", "academic_schedule", "practice_notice"] as const;
export type PublicBoard = (typeof PUBLIC_BOARDS)[number];
export const isPublicBoard = (v: unknown): v is PublicBoard => (PUBLIC_BOARDS as readonly unknown[]).includes(v);

/** 공지사항 구분 — 관리자 사이트 boards.ts 의 NOTICE_CATEGORIES 와 같다 */
export const NOTICE_CATEGORY_VALUES = ["교육원", "자격증", "학점은행제"] as const;

export const BOARD_PAGE_SIZE = 10;

export type SearchScope = "title" | "content" | "all";
export const isSearchScope = (v: unknown): v is SearchScope => v === "title" || v === "content" || v === "all";

export interface BoardListFilter {
  board: PublicBoard;
  /** 공지사항 구분 (board_posts.category) */
  category?: string | null;
  /** 제목 말머리로 거르기 — 학사일정의 「[사회복지현장실습]」 */
  titlePrefix?: string | null;
  q?: string | null;
  scope?: SearchScope;
  page: number;
}

export interface BoardListRow {
  postId: number;
  title: string;
  category: string | null;
  isPinned: boolean;
  createdAt: Date;
  fileCount: number;
}

/** LIKE 안에서 글자 그대로 찾게 [ % _ 를 감싼다 */
const likeText = (s: string) => s.replace(/[[%_]/g, (c) => `[${c}]`);

/** 목록 한 쪽과 조건에 맞는 전체 글 수 */
export async function listBoardPosts(f: BoardListFilter): Promise<{ rows: BoardListRow[]; total: number }> {
  const pool = await getPool();
  const q = f.q?.trim() ? `%${likeText(f.q.trim())}%` : null;
  const req = () =>
    pool
      .request()
      .input("board", sql.NVarChar(20), f.board)
      .input("category", sql.NVarChar(20), f.category ?? null)
      .input("prefix", sql.NVarChar(60), f.titlePrefix ? `${likeText(f.titlePrefix)}%` : null)
      // 검색어는 100자까지인데 [ % _ 가 한 글자당 3글자로 늘어서 앞뒤 % 까지 302자 — 넉넉히
      .input("q", sql.NVarChar(320), q)
      .input("scope", sql.NVarChar(10), f.scope ?? "title")
      .input("offset", sql.Int, (f.page - 1) * BOARD_PAGE_SIZE)
      .input("size", sql.Int, BOARD_PAGE_SIZE);
  const FROM = `
    FROM dbo.board_posts p
    WHERE p.board_code = @board AND p.is_deleted = 0
      AND (@category IS NULL OR p.category = @category)
      AND (@prefix IS NULL OR p.title LIKE @prefix)
      AND (@q IS NULL
           OR (@scope IN (N'title', N'all') AND p.title LIKE @q)
           OR (@scope IN (N'content', N'all') AND p.content LIKE @q))`;
  const [rows, count] = await Promise.all([
    req().query<BoardListRow>(`
      SELECT p.post_id AS postId, p.title, p.category, p.is_pinned AS isPinned, p.created_at AS createdAt,
        (SELECT COUNT(*) FROM dbo.board_post_files f WHERE f.post_id = p.post_id AND f.is_deleted = 0 AND f.kind = N'첨부') AS fileCount
      ${FROM}
      ORDER BY p.is_pinned DESC, p.post_id DESC
      OFFSET @offset ROWS FETCH NEXT @size ROWS ONLY`),
    req().query<{ total: number }>(`SELECT COUNT(*) AS total ${FROM}`),
  ]);
  return { rows: rows.recordset, total: count.recordset[0].total };
}

/** 메인 화면 공지 탭 — 게시판마다 최근 글 몇 개 (고정 글 먼저) */
export async function latestBoardPosts(board: PublicBoard, count: number): Promise<BoardListRow[]> {
  const pool = await getPool();
  const r = await pool.request().input("board", sql.NVarChar(20), board).input("count", sql.Int, count).query<BoardListRow>(`
    SELECT TOP (@count) p.post_id AS postId, p.title, p.category, p.is_pinned AS isPinned, p.created_at AS createdAt, 0 AS fileCount
    FROM dbo.board_posts p
    WHERE p.board_code = @board AND p.is_deleted = 0
    ORDER BY p.is_pinned DESC, p.post_id DESC`);
  return r.recordset;
}

export interface BoardPostDetail {
  postId: number;
  title: string;
  category: string | null;
  content: string | null;
  createdAt: Date;
  files: { fileId: number; fileName: string; fileSize: number }[];
  /** 이전글 = 더 오래된 글, 다음글 = 더 새 글 */
  prev: { postId: number; title: string } | null;
  next: { postId: number; title: string } | null;
}

/** 글 하나 — 다른 게시판 글 번호나 지운 글이면 null */
export async function getBoardPost(board: PublicBoard, postId: number): Promise<BoardPostDetail | null> {
  const pool = await getPool();
  const r = await pool.request().input("board", sql.NVarChar(20), board).input("id", sql.Int, postId).query(`
    SELECT p.post_id AS postId, p.title, p.category, p.content, p.created_at AS createdAt
    FROM dbo.board_posts p WHERE p.post_id = @id AND p.board_code = @board AND p.is_deleted = 0;

    SELECT f.file_id AS fileId, f.file_name AS fileName, f.file_size AS fileSize
    FROM dbo.board_post_files f WHERE f.post_id = @id AND f.is_deleted = 0 AND f.kind = N'첨부' ORDER BY f.file_id;

    SELECT TOP 1 post_id AS postId, title FROM dbo.board_posts
    WHERE board_code = @board AND is_deleted = 0 AND post_id < @id ORDER BY post_id DESC;

    SELECT TOP 1 post_id AS postId, title FROM dbo.board_posts
    WHERE board_code = @board AND is_deleted = 0 AND post_id > @id ORDER BY post_id ASC;`);
  const sets = r.recordsets as unknown as Record<string, unknown>[][];
  const post = sets[0][0] as Omit<BoardPostDetail, "files" | "prev" | "next"> | undefined;
  if (!post) return null;
  return {
    ...post,
    files: sets[1] as BoardPostDetail["files"],
    prev: (sets[2][0] as BoardPostDetail["prev"]) ?? null,
    next: (sets[3][0] as BoardPostDetail["next"]) ?? null,
  };
}

/** 조회수 +1 — 조회수는 홈페이지에서만 올린다 */
export async function addBoardView(postId: number): Promise<void> {
  const pool = await getPool();
  await pool.request().input("id", sql.Int, postId).query(`UPDATE dbo.board_posts SET view_count = view_count + 1 WHERE post_id = @id`);
}

export interface BoardFile {
  fileName: string;
  fileSize: number;
  data: Buffer;
}

/** 첨부 받기 — 공개 게시판의 지우지 않은 글 · 첨부만 */
export async function getPublicBoardFile(fileId: number): Promise<BoardFile | null> {
  const pool = await getPool();
  const r = await pool.request().input("id", sql.Int, fileId).query<BoardFile>(`
    SELECT f.file_name AS fileName, f.file_size AS fileSize, f.data
    FROM dbo.board_post_files f
    JOIN dbo.board_posts p ON p.post_id = f.post_id
    WHERE f.file_id = @id AND f.is_deleted = 0 AND f.kind = N'첨부'
      AND p.is_deleted = 0 AND p.board_code IN (N'notice', N'academic_schedule', N'practice_notice')`);
  return r.recordset[0] ?? null;
}
