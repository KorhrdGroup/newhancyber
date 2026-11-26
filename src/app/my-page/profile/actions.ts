"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isDbConfigured } from "@/lib/db/client";
import { getMemberStatus, updateMemberProfile } from "@/lib/db/members";
import { clearFailures, lockedMinutes, recordFailure } from "@/lib/loginThrottle";
import { createMemberSession, getCurrentMember } from "@/lib/memberAuth";
import { hashPassword, passwordVersion, verifyPassword } from "@/lib/password";
import { grantProfileAccess, hasProfileAccess } from "@/lib/profileAccess";
import { EDUCATION_LEVELS, PHONE_PREFIXES, passwordProblem } from "@/lib/signupOptions";

/**
 * 내 정보 수정 (src/lib/db/members.ts). 회원은 로그인 쿠키에서만 정한다.
 * 1단계 비밀번호 확인은 로그인과 같은 잠금(5번 틀리면 10분)을 쓰고, 맞으면 10분짜리 통과증(src/lib/profileAccess.ts)을 준다.
 * 저장은 통과증이 있어야 하고, 비밀번호를 바꾸면 로그인 세션을 새 지문으로 다시 만든다 (다른 기기의 로그인은 끊긴다).
 */

const SERVER_PROBLEM = "지금은 처리할 수 없어요. 잠시 뒤 다시 시도해 주세요.";

function errorSummary(err: unknown): string {
  const e = err as { name?: string; code?: string; number?: number };
  return [e?.name, e?.code, e?.number].filter((v) => v !== undefined && v !== "").join(" ") || "알 수 없는 오류";
}

async function clientIp(): Promise<string> {
  return (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export interface ConfirmState {
  error?: string;
}

/** 1단계 — 비밀번호가 맞으면 수정 화면으로 */
export async function confirmProfilePassword(_prev: ConfirmState, formData: FormData): Promise<ConfirmState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "비밀번호를 입력해 주세요." };
  if (!isDbConfigured()) return { error: SERVER_PROBLEM };
  const member = await getCurrentMember();
  if (!member) redirect(`/member/login?next=${encodeURIComponent("/my-page/profile")}`);

  const ip = await clientIp();
  try {
    const locked = await lockedMinutes(ip, member.loginId);
    if (locked > 0) return { error: `비밀번호를 여러 번 틀려 잠시 막혔어요. ${locked}분 뒤 다시 시도해 주세요.` };
    const status = await getMemberStatus(member.memberId);
    const ok = password.length <= 200 && (await verifyPassword(password, status?.passwordHash));
    if (!ok) {
      await recordFailure(ip, member.loginId);
      return { error: "비밀번호가 맞지 않아요." };
    }
    await clearFailures(ip, member.loginId);
    await grantProfileAccess(member);
  } catch (err) {
    console.error("[profile] confirm failed", errorSummary(err));
    return { error: SERVER_PROBLEM };
  }
  redirect("/my-page/profile/edit");
}

export interface ProfileInput {
  phonePrefix: string;
  phoneMiddle: string;
  phoneLast: string;
  emailLocal: string;
  emailDomain: string;
  postalCode: string;
  address: string;
  addressDetail: string;
  education: string;
  schoolName: string;
  major: string;
  newPassword: string;
  newPasswordConfirm: string;
  smsAgree: boolean;
  emailAgree: boolean;
}

export interface SaveResult {
  ok: boolean;
  message: string;
  /** 문제가 있는 칸의 id */
  field?: string;
  /** 통과증이 없거나 끝남 — 1단계로 */
  expired?: boolean;
}

const s = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

/** 2단계 — 저장 (회원가입과 같은 규칙으로 다시 검사한다) */
export async function saveProfile(raw: ProfileInput): Promise<SaveResult> {
  if (!isDbConfigured()) return { ok: false, message: SERVER_PROBLEM };
  const member = await getCurrentMember();
  if (!member) return { ok: false, expired: true, message: "로그인이 끝났어요. 다시 로그인해 주세요." };
  if (!(await hasProfileAccess(member))) return { ok: false, expired: true, message: "확인한 지 10분이 지났어요. 비밀번호를 다시 확인해 주세요." };

  const prefix = s(raw?.phonePrefix, 3);
  const middle = s(raw?.phoneMiddle, 4);
  const last = s(raw?.phoneLast, 4);
  if (!(PHONE_PREFIXES as readonly string[]).includes(prefix) || !/^\d{3,4}$/.test(middle) || !/^\d{4}$/.test(last)) {
    return { ok: false, message: "휴대폰 번호를 확인해 주세요.", field: "edit-phone" };
  }

  const emailLocal = s(raw?.emailLocal, 64);
  const emailDomain = s(raw?.emailDomain, 100);
  const email = `${emailLocal}@${emailDomain}`;
  if (!/^[A-Za-z0-9._%+-]+$/.test(emailLocal) || !/^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(emailDomain) || email.length > 100) {
    return { ok: false, message: "이메일 주소를 확인해 주세요.", field: "edit-email" };
  }

  const postalCode = s(raw?.postalCode, 10);
  const address = s(raw?.address, 200);
  const addressDetail = s(raw?.addressDetail, 200);
  if (!/^\d{5}$/.test(postalCode) || !address) return { ok: false, message: "「우편번호 찾기」로 주소를 골라 주세요.", field: "edit-postal" };
  if (!addressDetail) return { ok: false, message: "상세주소를 입력해 주세요.", field: "edit-address-detail" };

  const education = EDUCATION_LEVELS.find((e) => e.value === raw?.education);
  if (!education) return { ok: false, message: "최종학력을 골라 주세요.", field: "edit-education" };
  const schoolName = s(raw?.schoolName, 100);
  if (!schoolName) return { ok: false, message: "학교명을 입력해 주세요.", field: "edit-school" };
  const major = s(raw?.major, 100) || null;

  const newPassword = String(raw?.newPassword ?? "");
  let password: { oldHash: string; newHash: string } | null = null;
  try {
    if (newPassword || raw?.newPasswordConfirm) {
      const problem = passwordProblem(newPassword);
      if (problem) return { ok: false, message: problem, field: "edit-new-password" };
      if (newPassword !== String(raw?.newPasswordConfirm ?? "")) {
        return { ok: false, message: "새 비밀번호 확인이 새 비밀번호와 달라요.", field: "edit-new-password-confirm" };
      }
      const status = await getMemberStatus(member.memberId);
      if (!status?.passwordHash) return { ok: false, expired: true, message: "다시 로그인해 주세요." };
      if (await verifyPassword(newPassword, status.passwordHash)) {
        return { ok: false, message: "지금 쓰는 비밀번호와 다른 비밀번호를 입력해 주세요.", field: "edit-new-password" };
      }
      password = { oldHash: status.passwordHash, newHash: await hashPassword(newPassword) };
    }

    const result = await updateMemberProfile(
      member.memberId,
      {
        phone: `${prefix}-${middle}-${last}`,
        email,
        postalCode,
        address,
        addressDetail,
        educationLevel: education.label,
        schoolName,
        major,
        smsAgree: Boolean(raw?.smsAgree),
        emailAgree: Boolean(raw?.emailAgree),
      },
      password,
    );
    if (result === "missing") return { ok: false, expired: true, message: "계정을 찾을 수 없어요. 다시 로그인해 주세요." };
    if (result === "changed") return { ok: false, expired: true, message: "그사이 비밀번호가 바뀌었어요. 다시 로그인해 주세요." };

    if (password) {
      // 새 비밀번호 지문으로 세션 · 통과증을 다시 만든다 (이 기기는 로그인 유지, 다른 기기는 끊김)
      const session = { ...member, passwordVersion: passwordVersion(password.newHash) };
      await createMemberSession(session);
      await grantProfileAccess(session);
    }
  } catch (err) {
    console.error("[profile] save failed", errorSummary(err));
    return { ok: false, message: SERVER_PROBLEM };
  }
  return { ok: true, message: password ? "내 정보와 비밀번호를 바꿨어요. 다른 기기에서는 다시 로그인해야 해요." : "내 정보를 저장했어요." };
}
