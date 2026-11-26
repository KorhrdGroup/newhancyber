"use server";

import { isDbConfigured } from "@/lib/db/client";
import { recordLessonProgress } from "@/lib/db/lessons";
import { getCurrentMember } from "@/lib/memberAuth";

/**
 * 학습창이 15초마다 · 멈출 때 보내는 학습 기록 (src/lib/db/lessons.ts recordLessonProgress).
 * deltaSeconds 는 화면이 「실제로 재생된」 시간 — 서버가 한 번에 90초까지만 받고, 재생 시간을 넘기지 않는다.
 * 회원 번호는 로그인 쿠키에서만. 그 회원의 수강 중 차수 · 그 과목 콘텐츠의 열린 차시 쪽인지는 SQL 이 잠근 뒤 본다.
 */
export interface ProgressResult {
  ok: boolean;
  watchedSeconds?: number;
  completed?: boolean;
  progress?: number;
}

export async function recordProgressAction(classId: number, pageId: number, deltaSeconds: number, position: number): Promise<ProgressResult> {
  if (!isDbConfigured()) return { ok: false };
  const c = Number(classId);
  const p = Number(pageId);
  if (!Number.isSafeInteger(c) || c <= 0 || !Number.isSafeInteger(p) || p <= 0) return { ok: false };
  const delta = Number(deltaSeconds);
  const pos = Number(position);
  if (!Number.isFinite(delta) || !Number.isFinite(pos)) return { ok: false };
  try {
    const member = await getCurrentMember();
    if (!member) return { ok: false };
    const r = await recordLessonProgress(member.memberId, c, p, delta, pos);
    return r.ok ? { ok: true, watchedSeconds: r.watchedSeconds, completed: r.completed, progress: r.progress } : { ok: false };
  } catch (err) {
    const e = err as { name?: string; number?: number };
    console.error("학습 기록 실패", [e?.name, e?.number].filter(Boolean).join(" "));
    return { ok: false };
  }
}
