"use server";

import { filterAddableClassIds } from "@/lib/courses";
import { CART_MAX, deleteCartItems, insertCartItems } from "@/lib/db/cart";
import { isDbConfigured } from "@/lib/db/client";
import { getCurrentMember } from "@/lib/memberAuth";

/**
 * 장바구니 담기 · 빼기 — 로그인한 회원의 dbo.cart_items (Azure DB). 회원 번호는 로그인 쿠키에서만 얻는다.
 * 브라우저가 보낸 차수 번호는 믿지 않는다: 담을 때 DB 에서 수강신청 기간 · 마감 · 사용 여부를 다시 본다.
 */

export interface CartResult {
  ok: boolean;
  message: string;
  /** 로그인이 필요함 — 화면이 로그인 화면으로 보낸다 */
  needLogin?: boolean;
  /** 이번에 새로 담은 수 */
  added?: number;
}

const NEED_LOGIN: CartResult = { ok: false, needLogin: true, message: "로그인한 뒤 장바구니에 담을 수 있어요." };
const UNAVAILABLE: CartResult = { ok: false, message: "지금은 장바구니를 쓸 수 없어요. 잠시 뒤 다시 시도해 주세요." };

function errorSummary(err: unknown): string {
  const e = err as { name?: string; code?: string; number?: number };
  return [e?.name, e?.code, e?.number].filter((v) => v !== undefined && v !== "").join(" ") || "알 수 없는 오류";
}

/** 브라우저가 보낸 번호 목록 — 양의 정수만, 많아야 CART_MAX 개 */
const cleanIds = (raw: unknown): number[] =>
  Array.isArray(raw)
    ? [...new Set(raw.filter((n): n is number => typeof n === "number" && Number.isSafeInteger(n) && n > 0))].slice(0, CART_MAX)
    : [];

/** 수강신청 화면 「장바구니」 — 고른 차수를 담는다 (이미 담긴 것은 그대로) */
export async function addToCart(classIds: number[]): Promise<CartResult> {
  if (!isDbConfigured()) return UNAVAILABLE;
  const ids = cleanIds(classIds);
  if (ids.length === 0) return { ok: false, message: "담을 과목을 골라 주세요." };
  try {
    const member = await getCurrentMember();
    if (!member) return NEED_LOGIN;
    const addable = await filterAddableClassIds(ids);
    if (addable.length === 0) return { ok: false, message: "고른 과목이 마감되었거나 수강신청 기간이 아니에요." };
    const result = await insertCartItems(member.memberId, addable);
    if (result === "full") {
      return { ok: false, message: `장바구니에는 ${CART_MAX}과목까지 담을 수 있어요. 담긴 과목을 정리해 주세요.` };
    }
    const skipped = ids.length - addable.length;
    return {
      ok: true,
      added: result.added,
      message: skipped > 0 ? `마감되었거나 수강신청 기간이 아닌 ${skipped}과목은 빼고 담았어요.` : "장바구니에 담았어요.",
    };
  } catch (err) {
    console.error("장바구니 담기 실패", errorSummary(err));
    return { ok: false, message: "장바구니에 담지 못했어요. 잠시 뒤 다시 시도해 주세요." };
  }
}

/** 장바구니 「선택 삭제」 */
export async function removeFromCart(classIds: number[]): Promise<CartResult> {
  if (!isDbConfigured()) return UNAVAILABLE;
  const ids = cleanIds(classIds);
  if (ids.length === 0) return { ok: false, message: "뺄 과목을 골라 주세요." };
  try {
    const member = await getCurrentMember();
    if (!member) return NEED_LOGIN;
    await deleteCartItems(member.memberId, ids);
    return { ok: true, message: "장바구니에서 뺐어요." };
  } catch (err) {
    console.error("장바구니 빼기 실패", errorSummary(err));
    return { ok: false, message: "장바구니에서 빼지 못했어요. 잠시 뒤 다시 시도해 주세요." };
  }
}
