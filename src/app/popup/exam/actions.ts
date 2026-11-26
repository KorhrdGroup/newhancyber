"use server";

import { submitExam, startExam, submitWriting } from "@/lib/db/assessments";
import { isDbConfigured } from "@/lib/db/client";
import { getCurrentMember } from "@/lib/memberAuth";

/**
 * 시험 · 과제 참여 서버 액션 (src/lib/db/assessments.ts). 회원 번호는 로그인 쿠키에서만,
 * 그 회원의 「수강 중」 수강 · 기간 안 · 그 차수의 평가인지는 SQL 이 잠근 뒤 다시 본다.
 */

export interface ParticipationResult {
  ok: boolean;
  message: string;
  needLogin?: boolean;
}

const WRITING_MAX = 20000;

const ids = (classId: unknown, assessmentId: unknown) => {
  const c = Number(classId);
  const a = Number(assessmentId);
  return Number.isSafeInteger(c) && c > 0 && Number.isSafeInteger(a) && a > 0 ? { c, a } : null;
};

function errorSummary(err: unknown): string {
  const e = err as { name?: string; code?: string; number?: number };
  return [e?.name, e?.code, e?.number].filter((v) => v !== undefined && v !== "").join(" ") || "알 수 없는 오류";
}

const NOT_ALLOWED = "지금은 참여할 수 없어요. 수강 중인 과목인지, 참여 기간인지 확인해 주세요.";

/** 시험 시작 — 「응시 중」을 만든다. 시작하면 시험지 화면으로 넘어간다 */
export async function startExamAction(classId: number, assessmentId: number): Promise<ParticipationResult> {
  if (!isDbConfigured()) return { ok: false, message: "지금은 시험을 볼 수 없어요." };
  const k = ids(classId, assessmentId);
  if (!k) return { ok: false, message: "시험을 찾을 수 없어요." };
  try {
    const member = await getCurrentMember();
    if (!member) return { ok: false, needLogin: true, message: "로그인한 뒤 시험을 볼 수 있어요." };
    const r = await startExam(member.memberId, k.c, k.a);
    if (r === "ok") return { ok: true, message: "" };
    return { ok: false, message: r === "done" ? "이미 답안을 제출한 시험이에요." : NOT_ALLOWED };
  } catch (err) {
    console.error("시험 시작 실패", errorSummary(err));
    return { ok: false, message: "시험을 시작하지 못했어요. 잠시 뒤 다시 시도해 주세요." };
  }
}

/** 답안 제출 — answers: { question_id: 답 } (객관식은 보기 번호 1부터) */
export async function submitExamAction(classId: number, assessmentId: number, answers: Record<string, string>): Promise<ParticipationResult> {
  if (!isDbConfigured()) return { ok: false, message: "지금은 답안을 낼 수 없어요." };
  const k = ids(classId, assessmentId);
  if (!k) return { ok: false, message: "시험을 찾을 수 없어요." };
  const clean: Record<string, string> = {};
  if (answers && typeof answers === "object") {
    for (const [q, v] of Object.entries(answers).slice(0, 500)) if (/^\d{1,9}$/.test(q) && typeof v === "string") clean[q] = v.slice(0, 4000);
  }
  try {
    const member = await getCurrentMember();
    if (!member) return { ok: false, needLogin: true, message: "로그인한 뒤 답안을 낼 수 있어요." };
    const r = await submitExam(member.memberId, k.c, k.a, clean);
    if (!r.ok) {
      return { ok: false, message: r.reason === "notStarted" ? "시험을 시작하지 않았거나 이미 제출했어요. 창을 닫고 다시 열어 주세요." : NOT_ALLOWED };
    }
    return {
      ok: true,
      message: r.graded
        ? `답안을 제출했어요. 점수는 ${r.score ?? 0}점 / ${r.maxScore}점이에요.`
        : "답안을 제출했어요. 서술형 문항이 있어 교강사가 채점한 뒤 점수가 나와요.",
    };
  } catch (err) {
    console.error("답안 제출 실패", errorSummary(err));
    return { ok: false, message: "답안을 내지 못했어요. 잠시 뒤 다시 시도해 주세요." };
  }
}

/** 과제 · 토론 · 학습심화활동 글 제출 (채점 전 · 기간 안이면 고쳐 낸다) */
export async function submitWritingAction(classId: number, assessmentId: number, content: string): Promise<ParticipationResult> {
  if (!isDbConfigured()) return { ok: false, message: "지금은 제출할 수 없어요." };
  const k = ids(classId, assessmentId);
  if (!k) return { ok: false, message: "과제를 찾을 수 없어요." };
  const body = typeof content === "string" ? content.replace(/\r\n?/g, "\n").trim() : "";
  if (!body) return { ok: false, message: "내용을 적어 주세요." };
  if (body.length > WRITING_MAX) return { ok: false, message: `내용은 ${WRITING_MAX.toLocaleString("ko-KR")}자까지 적을 수 있어요.` };
  try {
    const member = await getCurrentMember();
    if (!member) return { ok: false, needLogin: true, message: "로그인한 뒤 제출할 수 있어요." };
    const r = await submitWriting(member.memberId, k.c, k.a, body);
    if (r === "ok") return { ok: true, message: "제출했어요. 기간 안에는 고쳐서 다시 낼 수 있어요." };
    return { ok: false, message: r === "graded" ? "이미 채점이 끝나 고칠 수 없어요." : NOT_ALLOWED };
  } catch (err) {
    console.error("과제 제출 실패", errorSummary(err));
    return { ok: false, message: "제출하지 못했어요. 잠시 뒤 다시 시도해 주세요." };
  }
}
