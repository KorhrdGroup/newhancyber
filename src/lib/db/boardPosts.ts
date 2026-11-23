import "server-only";
import { getPool, sql } from "./client";

/**
 * 홈페이지 게시판 — dbo.board_posts (DB 002 · 013 · 025 · 026). 관리자 「게시판 관리」가 쓰고 홈페이지는 읽기만 한다
 * (조회수 view_count 만 홈페이지가 올린다). 1:1 문의(qna)만 회원이 홈페이지에서 쓴다 — 아래 「1:1 문의」.
 * 규칙(안내판 9장 11/23 요청): is_deleted = 0 만 · 상단 고정 먼저(is_pinned DESC, post_id DESC) ·
 * 본문은 글자 그대로(HTML 아님) · 첨부는 board_post_files 의 kind 「첨부」, is_deleted = 0 ·
 * 장학후기 썸네일은 kind 「썸네일」(jpg · png).
 */
/** 누구나 보는 게시판. 1:1 문의(qna)는 자기 글만 보여서 여기 없다 */
export const PUBLIC_BOARDS = ["notice", "academic_schedule", "practice_notice", "faq", "data_room", "review", "scholarship_review"] as const;
export type PublicBoard = (typeof PUBLIC_BOARDS)[number];
export const isPublicBoard = (v: unknown): v is PublicBoard => (PUBLIC_BOARDS as readonly unknown[]).includes(v);

/** 첨부를 받을 수 있는 게시판 — 관리자 boards.ts 에서 files: true 인 공개 게시판 (FAQ · 수강 후기 · 1:1 문의는 첨부 없음) */
const FILE_BOARDS = ["notice", "academic_schedule", "practice_notice", "data_room", "scholarship_review"] as const;
const FILE_BOARDS_SQL = FILE_BOARDS.map((b) => `N'${b}'`).join(", ");

/** 글쓴이 — 회원 이름(가리기 전) · 과목 이름(수강 후기) 을 붙이는 JOIN */
const AUTHOR_JOIN = `
    LEFT JOIN dbo.members m ON p.author_type = N'member' AND m.member_id = p.author_id
    LEFT JOIN dbo.courses co ON co.course_id = p.course_id`;

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
  /** 한 쪽 글 수 (기본 BOARD_PAGE_SIZE) — 수강후기 위 BEST(장학후기) 몇 개처럼 따로 읽을 때 */
  pageSize?: number;
}

export interface BoardListRow {
  postId: number;
  title: string;
  category: string | null;
  isPinned: boolean;
  createdAt: Date;
  fileCount: number;
  /** member · admin · teacher */
  authorType: string;
  /** 회원이 쓴 글이면 회원 이름(화면에서 가려 보인다), 아니면 null */
  authorName: string | null;
  /** 수강 후기 과목 (course_id → courses.name) */
  courseName: string | null;
}

/** LIKE 안에서 글자 그대로 찾게 [ % _ 를 감싼다 */
const likeText = (s: string) => s.replace(/[[%_]/g, (c) => `[${c}]`);

/** 목록 한 쪽과 조건에 맞는 전체 글 수 */
export async function listBoardPosts(f: BoardListFilter): Promise<{ rows: BoardListRow[]; total: number }> {
  const pool = await getPool();
  const q = f.q?.trim() ? `%${likeText(f.q.trim())}%` : null;
  const size = f.pageSize ?? BOARD_PAGE_SIZE;
  const req = () =>
    pool
      .request()
      .input("board", sql.NVarChar(20), f.board)
      .input("category", sql.NVarChar(20), f.category ?? null)
      .input("prefix", sql.NVarChar(60), f.titlePrefix ? `${likeText(f.titlePrefix)}%` : null)
      // 검색어는 100자까지인데 [ % _ 가 한 글자당 3글자로 늘어서 앞뒤 % 까지 302자 — 넉넉히
      .input("q", sql.NVarChar(320), q)
      .input("scope", sql.NVarChar(10), f.scope ?? "title")
      .input("offset", sql.Int, (f.page - 1) * size)
      .input("size", sql.Int, size);
  const WHERE = `
    WHERE p.board_code = @board AND p.is_deleted = 0
      AND (@category IS NULL OR p.category = @category)
      AND (@prefix IS NULL OR p.title LIKE @prefix)
      AND (@q IS NULL
           OR (@scope IN (N'title', N'all') AND p.title LIKE @q)
           OR (@scope IN (N'content', N'all') AND p.content LIKE @q))`;
  const [rows, count] = await Promise.all([
    req().query<BoardListRow>(`
      SELECT p.post_id AS postId, p.title, p.category, p.is_pinned AS isPinned, p.created_at AS createdAt,
        (SELECT COUNT(*) FROM dbo.board_post_files f WHERE f.post_id = p.post_id AND f.is_deleted = 0 AND f.kind = N'첨부') AS fileCount,
        p.author_type AS authorType, m.name AS authorName, co.name AS courseName
      FROM dbo.board_posts p ${AUTHOR_JOIN}
      ${WHERE}
      ORDER BY p.is_pinned DESC, p.post_id DESC
      OFFSET @offset ROWS FETCH NEXT @size ROWS ONLY`),
    req().query<{ total: number }>(`SELECT COUNT(*) AS total FROM dbo.board_posts p ${WHERE}`),
  ]);
  return { rows: rows.recordset, total: count.recordset[0].total };
}

/** 메인 화면 공지 탭 — 게시판마다 최근 글 몇 개 (고정 글 먼저) */
export async function latestBoardPosts(board: PublicBoard, count: number): Promise<BoardListRow[]> {
  const pool = await getPool();
  const r = await pool.request().input("board", sql.NVarChar(20), board).input("count", sql.Int, count).query<BoardListRow>(`
    SELECT TOP (@count) p.post_id AS postId, p.title, p.category, p.is_pinned AS isPinned, p.created_at AS createdAt, 0 AS fileCount,
      p.author_type AS authorType, CAST(NULL AS NVARCHAR(50)) AS authorName, CAST(NULL AS NVARCHAR(100)) AS courseName
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
  viewCount: number;
  authorType: string;
  /** 회원이 쓴 글이면 회원 이름(화면에서 가려 보인다) */
  authorName: string | null;
  /** 수강 후기 과목 */
  courseName: string | null;
  /** 장학후기 썸네일(kind 「썸네일」, 가장 최근 것) — 없으면 null */
  thumbFileId: number | null;
  files: { fileId: number; fileName: string; fileSize: number }[];
  /** 이전글 = 더 오래된 글, 다음글 = 더 새 글 */
  prev: { postId: number; title: string } | null;
  next: { postId: number; title: string } | null;
}

/** 글 하나 — 다른 게시판 글 번호나 지운 글이면 null */
export async function getBoardPost(board: PublicBoard, postId: number): Promise<BoardPostDetail | null> {
  const pool = await getPool();
  const r = await pool.request().input("board", sql.NVarChar(20), board).input("id", sql.Int, postId).query(`
    SELECT p.post_id AS postId, p.title, p.category, p.content, p.created_at AS createdAt, p.view_count AS viewCount,
      p.author_type AS authorType, m.name AS authorName, co.name AS courseName,
      (SELECT TOP 1 t.file_id FROM dbo.board_post_files t
       WHERE t.post_id = p.post_id AND t.is_deleted = 0 AND t.kind = N'썸네일'
         -- jpg · png 로 시작하는 것만 (썸네일 주소가 내보내지 않는 파일이면 깨진 그림이 되니 아예 고르지 않는다 — imageTypeOf 와 같은 검사)
         AND (SUBSTRING(t.data, 1, 3) = 0xFFD8FF OR SUBSTRING(t.data, 1, 8) = 0x89504E470D0A1A0A)
       ORDER BY t.file_id DESC) AS thumbFileId
    FROM dbo.board_posts p ${AUTHOR_JOIN}
    WHERE p.post_id = @id AND p.board_code = @board AND p.is_deleted = 0;

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

/** 첨부 받기 — 첨부가 있는 공개 게시판(FILE_BOARDS)의 지우지 않은 글 · 첨부만. 썸네일은 getScholarshipThumb */
export async function getPublicBoardFile(fileId: number): Promise<BoardFile | null> {
  const pool = await getPool();
  const r = await pool.request().input("id", sql.Int, fileId).query<BoardFile>(`
    SELECT f.file_name AS fileName, f.file_size AS fileSize, f.data
    FROM dbo.board_post_files f
    JOIN dbo.board_posts p ON p.post_id = f.post_id
    WHERE f.file_id = @id AND f.is_deleted = 0 AND f.kind = N'첨부'
      AND p.is_deleted = 0 AND p.board_code IN (${FILE_BOARDS_SQL})`);
  return r.recordset[0] ?? null;
}

/** 첫 몇 바이트로 본 그림 형식 — jpg · png 만 (관리자가 jpg · png 만 받지만 한 번 더 본다) */
export function imageTypeOf(data: Buffer): "image/jpeg" | "image/png" | null {
  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return "image/jpeg";
  if (data.length >= 8 && data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  return null;
}

/** 장학후기 썸네일 — 지우지 않은 장학후기 글의 지우지 않은 썸네일만 */
export async function getScholarshipThumb(fileId: number): Promise<{ data: Buffer } | null> {
  const pool = await getPool();
  const r = await pool.request().input("id", sql.Int, fileId).query<{ data: Buffer }>(`
    SELECT f.data
    FROM dbo.board_post_files f
    JOIN dbo.board_posts p ON p.post_id = f.post_id
    WHERE f.file_id = @id AND f.is_deleted = 0 AND f.kind = N'썸네일'
      AND p.is_deleted = 0 AND p.board_code = N'scholarship_review'`);
  return r.recordset[0] ?? null;
}

// ── 자주 묻는 질문 ─────────────────────────────────────────

export interface FaqRow {
  postId: number;
  /** 질문 */
  title: string;
  /** 답 */
  content: string | null;
  /** 분류 탭 (예전 FAQ 를 옮길 때 넣은 수강신청/결제 · 학점은행제 · 회원정보 · 학습방법 · 오류) — 관리자 화면엔 아직 칸이 없어 새 글은 비어 있다 */
  category: string | null;
}

/** FAQ 는 한 화면에 펼쳐 보이므로 한 번에 읽는다 (많아도 이만큼까지) */
export const FAQ_MAX = 500;

export async function listFaqs(): Promise<FaqRow[]> {
  const pool = await getPool();
  const r = await pool.request().input("max", sql.Int, FAQ_MAX).query<FaqRow>(`
    SELECT TOP (@max) p.post_id AS postId, p.title, p.content, p.category
    FROM dbo.board_posts p
    WHERE p.board_code = N'faq' AND p.is_deleted = 0
    ORDER BY p.is_pinned DESC, p.post_id DESC`);
  return r.recordset;
}

// ── 1:1 문의 (회원이 쓰고 자기 글만 본다) ───────────────────

export interface InquiryRow {
  postId: number;
  title: string;
  content: string | null;
  createdAt: Date;
  answerContent: string | null;
  answeredAt: Date | null;
}

/** 한 회원의 문의를 한 번에 이만큼까지 (최근 글부터) */
export const INQUIRY_LIST_MAX = 100;

/** 이 회원이 쓴 1:1 문의만 — author_type member · author_id = 회원 번호 */
export async function listMemberInquiries(memberId: number): Promise<InquiryRow[]> {
  const pool = await getPool();
  const r = await pool.request().input("member", sql.Int, memberId).input("max", sql.Int, INQUIRY_LIST_MAX).query<InquiryRow>(`
    SELECT TOP (@max) p.post_id AS postId, p.title, p.content, p.created_at AS createdAt,
      p.answer_content AS answerContent, p.answered_at AS answeredAt
    FROM dbo.board_posts p
    WHERE p.board_code = N'qna' AND p.author_type = N'member' AND p.author_id = @member AND p.is_deleted = 0
    ORDER BY p.is_pinned DESC, p.post_id DESC`);
  return r.recordset;
}

/** 같은 회원이 같은 제목 · 내용을 이 시간(초) 안에 또 보내면 한 번만 넣는다 (두 번 누름 · 새로 고침) */
export const INQUIRY_REPEAT_SECONDS = 60;

/** 1:1 문의 쓰기 — 글 번호. 방금 같은 글을 넣었으면 새로 넣지 않고 그 글 번호 */
export async function createMemberInquiry(memberId: number, title: string, content: string): Promise<number> {
  const pool = await getPool();
  const r = await pool
    .request()
    .input("member", sql.Int, memberId)
    .input("title", sql.NVarChar(200), title)
    .input("content", sql.NVarChar(sql.MAX), content)
    .input("repeat", sql.Int, INQUIRY_REPEAT_SECONDS).query<{ postId: number }>(`
      SET XACT_ABORT ON;
      BEGIN TRAN;
      DECLARE @id INT = (
        SELECT TOP 1 post_id FROM dbo.board_posts WITH (UPDLOCK, HOLDLOCK)
        WHERE board_code = N'qna' AND author_type = N'member' AND author_id = @member AND is_deleted = 0
          AND title = @title AND content = @content AND created_at >= DATEADD(SECOND, -@repeat, SYSDATETIME())
        ORDER BY post_id DESC);
      IF @id IS NULL
      BEGIN
        INSERT INTO dbo.board_posts (board_code, author_type, author_id, title, content)
        VALUES (N'qna', N'member', @member, @title, @content);
        SET @id = SCOPE_IDENTITY();
      END
      COMMIT;
      SELECT @id AS postId;`);
  return r.recordset[0].postId;
}
