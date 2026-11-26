"use server";

import { isDbConfigured } from "@/lib/db/client";
import { registerCouponCode } from "@/lib/db/coupons";
import { getCurrentMember } from "@/lib/memberAuth";

/**
 * 마이페이지 「쿠폰 등록」 — 쿠폰 번호로 LMS 「쿠폰 관리」의 주문 쿠폰을 한 장 받는다 (src/lib/db/coupons.ts).
 * 번호는 LMS 와 같이 영문 · 숫자 · 하이픈, 대문자로 맞춰 찾는다.
 */

export interface CouponRegisterResult {
  ok: boolean;
  message: string;
  needLogin?: boolean;
}

function errorSummary(err: unknown): string {
  const e = err as { name?: string; code?: string; number?: number };
  return [e?.name, e?.code, e?.number].filter((v) => v !== undefined && v !== "").join(" ") || "알 수 없는 오류";
}

export async function registerCoupon(rawCode: string): Promise<CouponRegisterResult> {
  if (!isDbConfigured()) return { ok: false, message: "지금은 쿠폰을 등록할 수 없어요. 잠시 뒤 다시 시도해 주세요." };
  const code = typeof rawCode === "string" ? rawCode.trim().toUpperCase() : "";
  if (!code) return { ok: false, message: "쿠폰 번호를 적어 주세요." };
  if (!/^[A-Z0-9-]{1,30}$/.test(code)) return { ok: false, message: "쿠폰 번호는 영문 · 숫자 · - 로만 적어 주세요." };
  try {
    const member = await getCurrentMember();
    if (!member) return { ok: false, needLogin: true, message: "로그인한 뒤 쿠폰을 등록할 수 있어요." };
    const result = await registerCouponCode(member.memberId, code);
    if (result.ok) return { ok: true, message: `「${result.name}」 쿠폰을 받았어요. ${result.expiresOn}까지 쓸 수 있어요.` };
    return {
      ok: false,
      message:
        result.reason === "duplicate"
          ? "이미 받은 쿠폰이에요."
          : result.reason === "expired"
            ? "기간이 지난 쿠폰이에요."
            : "쿠폰 번호를 찾을 수 없어요. 번호를 다시 확인해 주세요.",
    };
  } catch (err) {
    console.error("쿠폰 등록 실패", errorSummary(err));
    return { ok: false, message: "쿠폰을 등록하지 못했어요. 잠시 뒤 다시 시도해 주세요." };
  }
}
