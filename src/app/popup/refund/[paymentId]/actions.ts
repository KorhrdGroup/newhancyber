"use server";

import { isDbConfigured } from "@/lib/db/client";
import { createRefundRequest, readRefundForm } from "@/lib/db/refunds";
import { getCurrentMember } from "@/lib/memberAuth";
import { REFUND_REASONS, refundNeedsAccount } from "@/lib/refundReasons";

/**
 * 환불 신청 팝업 「환불 신청」 — 로그인한 회원 자신의 결제만. 환불 단계 · 금액은 서버가 오늘 기준으로 센다 (src/lib/db/refunds.ts).
 * 계좌가 필요한지는 브라우저 말이 아니라 그 결제의 결제 수단으로 정한다.
 * 접수되면 LMS 「환불 관리」에 「환불 접수」로 뜨고, 담당자가 처리한다.
 */

export interface RefundRequestInput {
  paymentId: number;
  itemIds: number[];
  reason: string;
  reasonEtc: string;
  /** 카드 결제가 아니면 돌려받을 계좌 */
  bank: string;
  account: string;
  holder: string;
}

export interface RefundRequestResult {
  ok: boolean;
  message: string;
  needLogin?: boolean;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\r\n?/g, "\n").trim().slice(0, max) : "");

function errorSummary(err: unknown): string {
  const e = err as { name?: string; code?: string; number?: number };
  return [e?.name, e?.code, e?.number].filter((v) => v !== undefined && v !== "").join(" ") || "알 수 없는 오류";
}

export async function requestRefund(input: RefundRequestInput): Promise<RefundRequestResult> {
  if (!isDbConfigured()) return { ok: false, message: "지금은 환불을 신청할 수 없어요. 잠시 뒤 다시 시도해 주세요." };
  const paymentId = Number(input?.paymentId);
  const itemIds = Array.isArray(input?.itemIds)
    ? input.itemIds.filter((n): n is number => typeof n === "number" && Number.isSafeInteger(n) && n > 0).slice(0, 50)
    : [];
  if (!Number.isSafeInteger(paymentId) || paymentId <= 0) return { ok: false, message: "결제를 찾을 수 없어요." };
  if (itemIds.length === 0) return { ok: false, message: "환불할 과목을 골라 주세요." };

  const reason = clean(input.reason, 50);
  if (!(REFUND_REASONS as readonly string[]).includes(reason)) return { ok: false, message: "환불 사유를 골라 주세요." };
  const reasonEtc = clean(input.reasonEtc, 500);
  if (reason === "기타" && !reasonEtc) return { ok: false, message: "기타 사유를 적어 주세요." };

  const bank = clean(input.bank, 30);
  const account = clean(input.account, 50).replace(/\s/g, "");
  const holder = clean(input.holder, 50);

  try {
    const member = await getCurrentMember();
    if (!member) return { ok: false, needLogin: true, message: "로그인한 뒤 환불을 신청할 수 있어요." };
    const form = await readRefundForm(member.memberId, paymentId);
    if (!form) return { ok: false, message: "결제를 찾을 수 없어요." };
    const needAccount = refundNeedsAccount(form.method);
    if (needAccount) {
      if (!bank || !account || !holder) return { ok: false, message: "돌려받을 계좌의 은행 · 계좌번호 · 예금주를 모두 적어 주세요." };
      if (!/^[0-9-]{6,50}$/.test(account)) return { ok: false, message: "계좌번호는 숫자와 - 만 적어 주세요." };
    }
    const result = await createRefundRequest({
      memberId: member.memberId,
      paymentId,
      itemIds,
      reason,
      reasonEtc: reason === "기타" ? reasonEtc : null,
      bank: needAccount ? bank : null,
      account: needAccount ? account : null,
      holder: needAccount ? holder : null,
    });
    if (!result.ok) {
      return {
        ok: false,
        message:
          result.reason === "notFound"
            ? "결제를 찾을 수 없어요."
            : "이미 환불을 신청했거나 환불할 수 없는 과목이 있어요. 창을 닫고 다시 열어 확인해 주세요.",
      };
    }
    return { ok: true, message: "환불 신청이 접수되었어요. 담당자가 확인한 뒤 문자로 알려 드릴게요." };
  } catch (err) {
    console.error("환불 신청 실패", errorSummary(err));
    return { ok: false, message: "환불을 신청하지 못했어요. 잠시 뒤 다시 시도해 주세요." };
  }
}
