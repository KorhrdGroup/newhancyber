"use server";

import { isDbConfigured } from "@/lib/db/client";
import { submitCourseSurvey, type SurveyAnswerInput } from "@/lib/db/surveys";
import { getCurrentMember } from "@/lib/memberAuth";

/**
 * 강의 평가 제출 서버 액션 (src/lib/db/surveys.ts). 회원 번호는 로그인 쿠키에서만, 수강 · 기간 · 문항은 SQL 이 잠근 뒤 다시 본다.
 */
export async function submitSurveyAction(classId: number, answers: SurveyAnswerInput): Promise<{ ok: boolean; message: string }> {
  if (!isDbConfigured()) return { ok: false, message: "지금은 강의 평가를 할 수 없어요." };
  const c = Number(classId);
  if (!Number.isSafeInteger(c) || c <= 0 || typeof answers !== "object" || answers === null || Array.isArray(answers)) {
    return { ok: false, message: "강의 평가를 찾을 수 없어요." };
  }
  // 모양만 거른다 (문항 · 보기 검사는 submitCourseSurvey)
  const clean: SurveyAnswerInput = {};
  for (const [k, v] of Object.entries(answers).slice(0, 100)) {
    if (!/^\d{1,10}$/.test(k)) continue;
    if (typeof v === "string") clean[k] = v.slice(0, 4000);
    else if (Array.isArray(v)) clean[k] = v.slice(0, 20).map(Number);
  }
  try {
    const member = await getCurrentMember();
    if (!member) return { ok: false, message: "로그인한 뒤 참여할 수 있어요." };
    const r = await submitCourseSurvey(member.memberId, c, clean);
    return r.ok ? { ok: true, message: "강의 평가를 제출했어요. 이제 성적을 볼 수 있어요." } : { ok: false, message: r.error };
  } catch (err) {
    const e = err as { name?: string; code?: string; number?: number };
    console.error("[survey] submit failed", [e?.name, e?.code, e?.number].filter(Boolean).join(" "));
    return { ok: false, message: "강의 평가를 저장하지 못했어요. 잠시 뒤 다시 해 주세요." };
  }
}
