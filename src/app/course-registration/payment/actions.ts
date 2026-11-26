"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isDbConfigured } from "@/lib/db/client";
import { createPaidPayment, PAYMENT_METHOD_NAMES, type PaymentBlockReason, type PaymentMethodKey } from "@/lib/db/payments";
import { getCurrentMember } from "@/lib/memberAuth";

/**
 * 결제하기 「결제하기」 — PG(나이스페이) 연결 전이라 누르면 바로 결제 완료로 남긴다 (src/lib/db/payments.ts).
 * 회원 번호는 로그인 쿠키에서만, 금액은 DB 의 차수 값으로만 정한다 (브라우저가 보낸 것은 차수 번호 · 결제 수단뿐).
 * 성공하면 결제 완료 화면으로 보낸다.
 */

export interface PaymentResult {
  ok: false;
  message: string;
  needLogin?: boolean;
}

const REASON_TEXT: Record<PaymentBlockReason, string> = {
  notFound: "없어진 과목",
  notOpen: "수강신청 기간이 아닌 과목",
  closed: "마감된 과목",
  applied: "이미 신청한 과목",
};

function errorSummary(err: unknown): string {
  const e = err as { name?: string; code?: string; number?: number };
  return [e?.name, e?.code, e?.number].filter((v) => v !== undefined && v !== "").join(" ") || "알 수 없는 오류";
}

/** couponId — 결제하기에서 고른 쿠폰 (없으면 null). 쓸 수 있는지 · 할인액은 결제 트랜잭션이 다시 본다 */
export async function submitPayment(classIds: number[], method: string, couponId: number | null = null): Promise<PaymentResult> {
  if (!isDbConfigured()) return { ok: false, message: "지금은 결제할 수 없어요. 잠시 뒤 다시 시도해 주세요." };
  const ids = Array.isArray(classIds)
    ? [...new Set(classIds.filter((n): n is number => typeof n === "number" && Number.isSafeInteger(n) && n > 0))].slice(0, 30)
    : [];
  if (ids.length === 0) return { ok: false, message: "결제할 과목이 없어요." };
  if (!(method in PAYMENT_METHOD_NAMES)) return { ok: false, message: "결제 수단을 골라 주세요." };

  let paymentId: number;
  try {
    const member = await getCurrentMember();
    if (!member) return { ok: false, needLogin: true, message: "로그인한 뒤 결제할 수 있어요." };
    const ua = (await headers()).get("user-agent") ?? "";
    const result = await createPaidPayment({
      memberId: member.memberId,
      classIds: ids,
      method: method as PaymentMethodKey,
      isMobile: /Mobi|Android|iPhone|iPad/i.test(ua),
      couponId: typeof couponId === "number" && Number.isSafeInteger(couponId) && couponId > 0 ? couponId : null,
    });
    if (!result.ok && "coupon" in result) {
      return { ok: false, message: "고른 쿠폰을 쓸 수 없어요 (이미 썼거나 기간이 지났어요). 쿠폰을 다시 골라 주세요." };
    }
    if (!result.ok) {
      const reasons = [...new Set(result.blocked.map((b) => REASON_TEXT[b.reason]))];
      return {
        ok: false,
        message: reasons.length
          ? `${reasons.join(" · ")}이 있어 결제하지 않았어요. 장바구니에서 확인해 주세요.`
          : "결제하지 못했어요. 장바구니에서 다시 시도해 주세요.",
      };
    }
    paymentId = result.paymentId;
  } catch (err) {
    console.error("결제 신청 실패", errorSummary(err));
    return { ok: false, message: "결제하지 못했어요. 잠시 뒤 다시 시도해 주세요." };
  }
  // redirect 는 try 밖에서 (Next 가 redirect 를 오류로 던져 처리한다)
  redirect(`/course-registration/payment/complete?p=${paymentId}`);
}
