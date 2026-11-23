import "server-only";
import { isDbConfigured } from "./db/client";
import {
  addBoardView,
  getBoardPost,
  listBoardPosts,
  listFaqs,
  listMemberInquiries,
  type BoardListFilter,
  type FaqRow,
  type InquiryRow,
  type BoardListRow,
  type BoardPostDetail,
  type PublicBoard,
} from "./db/boardPosts";
import { getCurrentMember } from "./memberAuth";
import type { MemberSession } from "./memberSession";

/**
 * 공개 게시판 화면이 DB 를 읽는 곳 — DB 설정이 없거나 잠깐 안 되면 화면은 「불러올 수 없어요」로 보이고 오류는 서버 로그에만.
 */

export function errorSummary(err: unknown): string {
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
    post.viewCount += 1; // 지금 본 것까지 센 수로 보인다
  } catch (err) {
    console.error("조회수 올리기 실패", errorSummary(err));
  }
  return post;
}

/** 자주 묻는 질문 전부 (질문 = title, 답 = content) */
export async function loadFaqs(): Promise<{ rows: FaqRow[]; failed: boolean }> {
  if (!isDbConfigured()) return { rows: [], failed: true };
  try {
    return { rows: await listFaqs(), failed: false };
  } catch (err) {
    console.error("자주 묻는 질문 읽기 실패", errorSummary(err));
    return { rows: [], failed: true };
  }
}

/** 지금 로그인한 회원 — 로그인 안 했으면 null, 로그인 상태를 DB 에서 못 읽었으면 "failed" */
export async function loadCurrentMember(): Promise<MemberSession | null | "failed"> {
  try {
    return await getCurrentMember();
  } catch (err) {
    console.error("로그인 상태 확인 실패", errorSummary(err));
    return "failed";
  }
}

/** 이 회원의 1:1 문의 (자기 글만) */
export async function loadMemberInquiries(memberId: number): Promise<{ rows: InquiryRow[]; failed: boolean }> {
  try {
    return { rows: await listMemberInquiries(memberId), failed: false };
  } catch (err) {
    console.error("1:1 문의 목록 읽기 실패", errorSummary(err));
    return { rows: [], failed: true };
  }
}

/** 회원 글쓴이 이름 가리기 — 「김지우」 → 「김*우」, 「김지」 → 「김*」 (글자 하나면 그대로) */
export function maskName(name: string): string {
  const chars = Array.from(name.trim());
  if (chars.length <= 1) return chars.join("");
  if (chars.length === 2) return `${chars[0]}*`;
  return `${chars[0]}${"*".repeat(chars.length - 2)}${chars[chars.length - 1]}`;
}

/** 목록 · 상세의 글쓴이 — 회원은 가린 이름, 관리자 · 운영팀 글은 옛 화면처럼 「한*생」(한평생) */
export function writerLabel(authorType: string, authorName: string | null): string {
  if (authorType === "member") return authorName ? maskName(authorName) : "(탈퇴 회원)";
  return "한*생";
}

/** 첨부 받기 주소 (src/app/board/files/[fileId]/route.ts) */
export const boardFileHref = (fileId: number) => `/board/files/${fileId}`;

/** 장학후기 썸네일 주소 (src/app/board/thumbs/[fileId]/route.ts) */
export const boardThumbHref = (fileId: number) => `/board/thumbs/${fileId}`;
