"use server";

import { isDbConfigured } from "@/lib/db/client";
import { createMemberInquiry } from "@/lib/db/boardPosts";
import { getCurrentMember } from "@/lib/memberAuth";
import { errorSummary } from "@/lib/publicBoards";
import { INQUIRY_CONTENT_MAX, INQUIRY_TITLE_MAX } from "./limits";

export interface InquiryResult {
  ok: boolean;
  message: string;
  /** 문제가 있는 칸의 id — 화면이 그 칸으로 커서를 옮긴다 */
  field?: string;
  /** 로그인이 풀렸을 때 — 화면이 로그인으로 안내한다 */
  needLogin?: boolean;
}

const UNAVAILABLE = "지금은 문의를 등록할 수 없어요. 잠시 뒤 다시 시도해 주세요.";

// 브라우저는 textarea 줄바꿈을 \r\n(2글자)으로 보내지만 maxLength 는 1글자로 센다 — 길이를 재기 전에 \n 으로 맞춘다
const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").replace(/\r\n?/g, "\n").trim();
const fail = (message: string, field?: string): InquiryResult => ({ ok: false, message, field });

/**
 * 1:1 문의 쓰기 — board_posts 에 board_code qna · author_type member · author_id 회원 번호로 넣는다.
 * 로그인한 회원만. 길면 잘라 넣지 않고 돌려보낸다(화면 칸에도 같은 maxLength). 첨부는 받지 않는다(관리자 1:1 문의는 첨부 없음).
 */
export async function createInquiry(formData: FormData): Promise<InquiryResult> {
  const title = text(formData, "title");
  if (!title) return fail("제목을 입력해 주세요.", "inquiry-title");
  if (title.length > INQUIRY_TITLE_MAX) return fail(`제목은 ${INQUIRY_TITLE_MAX}자 이하로 입력해 주세요.`, "inquiry-title");
  const content = text(formData, "content");
  if (!content) return fail("내용을 입력해 주세요.", "inquiry-body");
  if (content.length > INQUIRY_CONTENT_MAX) return fail(`내용은 ${INQUIRY_CONTENT_MAX}자 이하로 입력해 주세요.`, "inquiry-body");

  if (!isDbConfigured()) return fail(UNAVAILABLE);

  let memberId: number;
  try {
    const member = await getCurrentMember();
    if (!member) return { ok: false, needLogin: true, message: "로그인이 풀렸어요. 다시 로그인한 뒤 문의를 남겨 주세요." };
    memberId = member.memberId;
  } catch (err) {
    console.error("1:1 문의 — 로그인 상태 확인 실패", errorSummary(err));
    return fail(UNAVAILABLE);
  }

  try {
    await createMemberInquiry(memberId, title, content);
  } catch (err) {
    console.error("1:1 문의 저장 실패", errorSummary(err));
    return fail(UNAVAILABLE);
  }
  return { ok: true, message: "문의가 등록되었어요. 답변이 등록되면 1:1 문의 목록에서 볼 수 있습니다." };
}
