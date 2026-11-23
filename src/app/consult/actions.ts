"use server";

import { consultTimeOptions, interestOptions } from "@/components/home/homeData";
import { isDbConfigured } from "@/lib/db/client";
import { CONSULT_REPEAT_MINUTES, createConsultation } from "@/lib/db/consultations";
import { getCurrentMember } from "@/lib/memberAuth";

/**
 * 메인 「회원가입 없이 간편상담」 → dbo.consultations (관리자 「간편 상담 관리」).
 * 관심분야는 관심 과정(course_interest)과 상담 구분(category)으로, 상담 희망 시간은 칸이 없어 첫 메모로 넣는다.
 */
export interface ConsultResult {
  ok: boolean;
  message: string;
  /** 문제가 있는 칸의 name — 화면이 그 칸으로 커서를 옮긴다 */
  field?: string;
}

const DONE = "상담 신청이 접수되었어요. 고른 시간에 담당자가 연락드릴게요.";
const NOT_NOW = "지금은 상담 신청을 받을 수 없어요. 잠시 뒤 다시 시도해 주세요.";

/** 관심분야 → 상담 구분 (관리자 화면의 구분: 학위과정 · 자격증과정 · 기타 · 학습상담 · 수강신청) */
const CATEGORY_OF: Record<string, string> = { "social-welfare": "자격증과정", etc: "기타" };

const fail = (message: string, field?: string): ConsultResult => ({ ok: false, message, field });

function formatMobile(raw: string): string | null {
  const d = raw.replace(/[\s-]/g, "");
  if (!/^01[016789]\d{7,8}$/.test(d)) return null;
  return d.length === 10 ? `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}` : `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

function errorSummary(err: unknown): string {
  const e = err as { name?: string; code?: string; number?: number };
  return [e?.name, e?.code, e?.number].filter((v) => v !== undefined && v !== "").join(" ") || "알 수 없는 오류";
}

export async function applyConsultation(formData: FormData): Promise<ConsultResult> {
  // 사람 눈에 안 보이는 칸이 채워져 오면 자동 등록 프로그램 — 저장하지 않고 성공처럼 답한다
  if (String(formData.get("sh-extra") ?? "") !== "") {
    // 자동 완성이 채운 진짜 신청일 수도 있어 기록은 남긴다(개인정보 없이)
    console.warn("간편 상담 — 숨은 칸이 채워진 신청을 받지 않음");
    return { ok: true, message: DONE };
  }
  if (formData.get("privacy") !== "on") return fail("개인정보 수집·이용에 동의해 주세요.", "privacy");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return fail("이름을 입력해 주세요.", "name");
  if (name.length > 50) return fail("이름은 50자 이하로 입력해 주세요.", "name");

  const phone = formatMobile(String(formData.get("phone") ?? "").slice(0, 30));
  if (!phone) return fail("연락처를 확인해 주세요. 예) 010-1234-5678", "phone");

  const interest = interestOptions.find((o) => o.value === formData.get("interest"));
  if (!interest) return fail("관심분야를 골라 주세요.", "interest");
  const time = consultTimeOptions.find((o) => o.value === formData.get("time"));
  if (!time) return fail("상담 시간을 골라 주세요.", "time");

  if (!isDbConfigured()) return fail(NOT_NOW);

  // 로그인한 회원이면 이어 둔다(관리자 화면에 회원 · 수강 여부가 보인다). 못 읽어도 비회원 신청으로 받는다.
  let memberId: number | null = null;
  try {
    memberId = (await getCurrentMember())?.memberId ?? null;
  } catch (err) {
    console.error("간편 상담 — 로그인 상태 확인 실패", errorSummary(err));
  }

  try {
    const created = await createConsultation({
      source: "간편 무료 학습상담",
      category: CATEGORY_OF[interest.value] ?? "기타",
      courseInterest: interest.label,
      name,
      phone,
      memberId,
      memo: `상담 희망 시간: ${time.label}`,
    });
    if (!created) return fail(`이 번호로 방금 신청한 내역이 있어요. 담당자가 확인 중이니 ${CONSULT_REPEAT_MINUTES}분 뒤에 다시 신청해 주세요.`);
  } catch (err) {
    console.error("간편 상담 저장 실패", errorSummary(err));
    return fail(NOT_NOW);
  }
  return { ok: true, message: DONE };
}
