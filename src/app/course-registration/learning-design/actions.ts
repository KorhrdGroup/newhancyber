"use server";

import { isDbConfigured } from "@/lib/db/client";
import { createStudyPlan, STUDY_PLAN_REPEAT_MINUTES } from "@/lib/db/studyPlans";
import { getCurrentMember } from "@/lib/memberAuth";

export interface StudyPlanResult {
  ok: boolean;
  message: string;
  /** 문제가 있는 칸의 id — 화면이 그 칸으로 커서를 옮긴다 */
  field?: string;
}

const CONSULT_TYPES: Record<string, string> = { phone: "전화상담", kakao: "카톡상담" };
const TIME_MAX = 100;
const INQUIRY_MAX = 1500;
const DONE = "학습설계 신청이 접수되었어요. 담당자가 곧 연락드릴게요.";

// 브라우저는 textarea 줄바꿈을 \r\n(2글자)으로 보내지만 maxLength 는 1글자로 센다 — 길이를 재기 전에 \n 으로 맞춘다
const text = (formData: FormData, key: string, max: number) =>
  String(formData.get(key) ?? "").replace(/\r\n?/g, "\n").trim().slice(0, max);
const fail = (message: string, field?: string): StudyPlanResult => ({ ok: false, message, field });

/** 휴대폰 번호를 010-1234-5678 모양으로. 01 로 시작하는 10~11자리가 아니면 null. */
function formatMobile(raw: string): string | null {
  const d = raw.replace(/[\s-]/g, "");
  if (!/^01[016789]\d{7,8}$/.test(d)) return null;
  return d.length === 10 ? `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}` : `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

function errorSummary(err: unknown): string {
  const e = err as { name?: string; code?: string; number?: number };
  return [e?.name, e?.code, e?.number].filter((v) => v !== undefined && v !== "").join(" ") || "알 수 없는 오류";
}

/** 무료 학습설계 신청 (학습설계 신청 화면의 「신청하기」) — 비회원도 신청할 수 있다 */
export async function applyStudyPlan(formData: FormData): Promise<StudyPlanResult> {
  // 사람 눈에 안 보이는 칸(ld-extra)이 채워져 있으면 자동 등록 프로그램으로 보고, 저장하지 않은 채 성공처럼 답한다.
  // 이름을 자동 완성 사전에 없는 말로 지어 브라우저가 채우지 않게 했다.
  if (String(formData.get("ld-extra") ?? "") !== "") return { ok: true, message: DONE };

  if (formData.get("privacy-consent") !== "on") return fail("개인정보 수집 및 이용에 동의해 주세요.", "privacy-consent");

  const name = text(formData, "name", 60);
  if (!name) return fail("이름을 입력해 주세요.", "name");
  if (name.length > 50) return fail("이름은 50자 이하로 입력해 주세요.", "name");

  const phone = formatMobile(text(formData, "phone", 30));
  if (!phone) return fail("휴대폰 번호를 확인해 주세요. 예) 010-1234-5678", "phone");

  const consultType = CONSULT_TYPES[String(formData.get("consultation-type") ?? "")] ?? CONSULT_TYPES.phone;
  // 길면 잘라 넣지 않고 돌려보낸다 (말없이 잘리면 신청자도 관리자도 모른다). 화면 칸에도 같은 maxLength 가 있다.
  const time = text(formData, "consultation-time", TIME_MAX + 1);
  if (time.length > TIME_MAX) return fail(`희망상담 시간은 ${TIME_MAX}자 이하로 입력해 주세요.`, "consultation-time");
  const inquiry = text(formData, "inquiry", INQUIRY_MAX + 1);
  if (inquiry.length > INQUIRY_MAX) return fail(`문의내용은 ${INQUIRY_MAX}자 이하로 입력해 주세요.`, "inquiry");

  // 관리자 목록은 content 를 따로 보여 주지 않고 상세에서 통째로 보여 준다 — 한 줄에 한 항목
  const content = [`상담 유형: ${consultType}`, time && `희망 시간: ${time}`, inquiry && `문의 내용:\n${inquiry}`]
    .filter(Boolean)
    .join("\n");

  if (!isDbConfigured()) return fail("지금은 신청을 받을 수 없어요. 잠시 뒤 다시 시도해 주세요.");

  // 로그인한 회원이면 회원과 이어 둔다. 로그인 상태를 못 읽어도 비회원 신청으로 받는다.
  let memberId: number | null = null;
  try {
    memberId = (await getCurrentMember())?.memberId ?? null;
  } catch (err) {
    console.error("학습설계 신청 — 로그인 상태 확인 실패", errorSummary(err));
  }

  try {
    const created = await createStudyPlan({ name, phone, memberId, content });
    if (!created) {
      return fail(`이 번호로 방금 신청한 내역이 있어요. 담당자가 확인 중이니 ${STUDY_PLAN_REPEAT_MINUTES}분 뒤에 다시 신청해 주세요.`);
    }
  } catch (err) {
    console.error("학습설계 신청 저장 실패", errorSummary(err));
    return fail("지금은 신청을 받을 수 없어요. 잠시 뒤 다시 시도해 주세요.");
  }
  return { ok: true, message: DONE };
}
