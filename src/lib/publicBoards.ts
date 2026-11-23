import "server-only";
import { isDbConfigured } from "./db/client";
import {
  addBoardView,
  getBoardPost,
  listBoardPosts,
  type BoardListFilter,
  type BoardListRow,
  type BoardPostDetail,
  type PublicBoard,
} from "./db/boardPosts";

/**
 * 공개 게시판 화면이 DB 를 읽는 곳 — DB 설정이 없거나 잠깐 안 되면 화면은 「불러올 수 없어요」로 보이고 오류는 서버 로그에만.
 */

function errorSummary(err: unknown): string {
  const e = err as { name?: string; code?: string; number?: number };
  return [e?.name, e?.code, e?.number].filter((v) => v !== undefined && v !== "").join(" ") || "알 수 없는 오류";
}

export async function loadBoardList(f: BoardListFilter): Promise<{ rows: BoardListRow[]; total: number; failed: boolean }> {
  if (!isDbConfigured()) return { rows: [], total: 0, failed: true };
  try {
    return { ...(await listBoardPosts(f)), failed: false };
  } catch (err) {
    console.error(`게시판 목록 읽기 실패 (${f.board})`, errorSummary(err));
    return { rows: [], total: 0, failed: true };
  }
}

/**
 * 글 하나 + 조회수 +1. 글이 없으면(번호가 틀리거나 지운 글) "missing", DB 가 안 되면 "failed".
 * 조회수를 못 올려도 글은 보여 준다.
 */
export async function loadBoardPost(board: PublicBoard, rawId: string): Promise<BoardPostDetail | "missing" | "failed"> {
  if (!/^\d{1,9}$/.test(rawId)) return "missing";
  if (!isDbConfigured()) return "failed";
  let post: BoardPostDetail | null;
  try {
    post = await getBoardPost(board, Number(rawId));
  } catch (err) {
    console.error(`게시글 읽기 실패 (${board})`, errorSummary(err));
    return "failed";
  }
  if (!post) return "missing";
  try {
    await addBoardView(post.postId);
  } catch (err) {
    console.error("조회수 올리기 실패", errorSummary(err));
  }
  return post;
}

/** 첨부 받기 주소 (src/app/board/files/[fileId]/route.ts) */
export const boardFileHref = (fileId: number) => `/board/files/${fileId}`;
