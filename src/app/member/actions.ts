"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isDbConfigured } from "@/lib/db/client";
import { createMember, findMemberForLogin, isDuplicateKey, isLoginIdTaken, recordMemberLogin } from "@/lib/db/members";
import { clearFailures, lockedMinutes, recordFailure } from "@/lib/loginThrottle";
import { createMemberSession, deleteMemberSession, getCurrentMember } from "@/lib/memberAuth";
import { hashPassword, passwordVersion, verifyPassword } from "@/lib/password";
import {
  EDUCATION_LEVELS,
  INTEREST_AREAS,
  JOIN_PATHS,
  LOGIN_ID_PATTERN,
  LOGIN_ID_RULE,
  isAtLeastAge,
  MIN_SIGNUP_AGE,
  PHONE_PREFIXES,
  parseBirthDate,
  passwordProblem,
  type SignupDone,
} from "@/lib/signupOptions";

const NOT_READY = "지금은 회원 서비스를 준비 중이에요. 잠시 뒤 다시 시도해 주세요.";
const SERVER_PROBLEM = "지금은 처리할 수 없어요. 잠시 뒤 다시 시도해 주세요.";
// 아이디가 없는지, 비밀번호가 틀렸는지, 사용 중지 계정인지 구분하지 않는다 (계정이 있는지 알려 주지 않기 위해).
const LOGIN_FAILED = "아이디 또는 비밀번호가 맞지 않아요.";

const text = (formData: FormData, key: string, max: number) => String(formData.get(key) ?? "").trim().slice(0, max);
const checked = (formData: FormData, key: string) => formData.get(key) === "on" || formData.get(key) === "1";

/**
 * 접속한 사람의 주소 — Vercel 이 x-forwarded-for 를 덮어써 준다.
 * cf-connecting-ip 는 Cloudflare 뒤에 있을 때만 믿을 수 있어서(지금은 아니다 — 아무나 붙여 보낼 수 있다) 읽지 않는다.
 * 직접 노출된 서버에서는 x-forwarded-for 도 꾸밀 수 있어서, 잠금은 아이디만 기준으로 한 제한(loginThrottle)을 함께 둔다.
 */
async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

/** 오류를 기록할 때 SQL 오류 문구(입력값이 들어갈 수 있다)는 빼고 번호만 남긴다 */
function errorSummary(err: unknown): string {
  const e = err as { name?: string; code?: string; number?: number };
  return [e?.name, e?.code, e?.number].filter((v) => v !== undefined && v !== "").join(" ") || "알 수 없는 오류";
}

async function noteFailure(ip: string, id: string): Promise<void> {
  try {
    await recordFailure(ip, id);
  } catch (err) {
    console.error("로그인 실패 기록 실패", errorSummary(err));
  }
}

/**
 * 로그인 뒤 돌아갈 곳 — 이 사이트 안의 주소만 받는다 (다른 사이트로 보내는 데 쓰이지 않게).
 * 브라우저는 주소 속 탭 · 줄바꿈을 지우고 읽으므로("/\t/evil.com" → "//evil.com") 공백 · 역슬래시가 있으면 버린다.
 */
function safeNext(value: FormDataEntryValue | null): string {
  const v = typeof value === "string" ? value : "";
  if (!v.startsWith("/") || /[\s\\]/.test(v)) return "/";
  try {
    const url = new URL(v, "http://same.invalid");
    return url.origin === "http://same.invalid" ? url.pathname + url.search : "/";
  } catch {
    return "/";
  }
}

// ── 로그인 · 로그아웃 ─────────────────────────────────────

export interface LoginState {
  error?: string;
  /** 오류가 나도 입력한 아이디를 다시 채워 주기 위해 돌려준다 */
  id?: string;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const id = text(formData, "userId", 50);
  const password = String(formData.get("userPassword") ?? "");
  if (!id) return { error: "아이디를 입력해 주세요." };
  if (!password) return { error: "비밀번호를 입력해 주세요.", id };
  if (!isDbConfigured()) return { error: NOT_READY, id };

  const ip = await clientIp();
  let locked;
  try {
    locked = await lockedMinutes(ip, id);
  } catch (err) {
    console.error("로그인 잠금 확인 실패", errorSummary(err));
    return { error: SERVER_PROBLEM, id };
  }
  if (locked > 0) return { error: `비밀번호를 여러 번 틀려 잠시 막혔어요. ${locked}분 뒤 다시 시도해 주세요.`, id };

  if (password.length > 200) {
    await noteFailure(ip, id);
    return { error: LOGIN_FAILED, id };
  }

  let member;
  try {
    member = await findMemberForLogin(id);
  } catch (err) {
    console.error("회원 로그인 조회 실패", errorSummary(err));
    return { error: SERVER_PROBLEM, id };
  }
  const passwordOk = await verifyPassword(password, member?.passwordHash);
  if (!member || !member.isActive || !passwordOk) {
    await noteFailure(ip, id);
    return { error: LOGIN_FAILED, id };
  }
  try {
    await clearFailures(ip, id);
  } catch (err) {
    console.error("로그인 실패 기록 지우기 실패", errorSummary(err));
  }

  try {
    await createMemberSession({
      memberId: member.memberId,
      loginId: member.loginId,
      name: member.name,
      passwordVersion: passwordVersion(member.passwordHash),
    });
  } catch (err) {
    // 대개 SESSION_SECRET 설정 문제 — 서버 로그에 원인이 남는다.
    console.error("회원 세션 만들기 실패", errorSummary(err));
    return { error: SERVER_PROBLEM, id };
  }
  try {
    await recordMemberLogin(member.memberId, ip, (await headers()).get("user-agent") ?? "");
  } catch (err) {
    // 마지막 로그인 시각·접속 기록에 실패해도 로그인은 막지 않는다.
    console.error("회원 접속 기록 실패", errorSummary(err));
  }
  redirect(safeNext(formData.get("next")));
}

/**
 * 머리말(로그인 · 회원가입 자리)이 지금 로그인 상태를 묻는 곳. 홈페이지 화면은 미리 만들어 둔 정적 화면이라
 * 화면 안에서 쿠키를 읽지 않고, 브라우저가 따로 묻는다. DB 가 잠깐 안 되면 로그아웃 상태로 보인다.
 */
export async function currentMember(): Promise<{ name: string; loginId: string } | null> {
  try {
    const member = await getCurrentMember();
    return member ? { name: member.name, loginId: member.loginId } : null;
  } catch (err) {
    console.error("로그인 상태 확인 실패", errorSummary(err));
    return null;
  }
}

/** 로그아웃 — 쿠키만 지운다. 머리말(MemberProvider)이 상태를 바로 바꾸고 첫 화면으로 보낸다. */
export async function logout(): Promise<void> {
  await deleteMemberSession();
}

// ── 회원가입 ────────────────────────────────────────────

export interface IdCheckResult {
  ok: boolean;
  message: string;
}

/** 「중복확인」 버튼 */
export async function checkLoginId(rawId: string): Promise<IdCheckResult> {
  const id = String(rawId ?? "").trim();
  if (!LOGIN_ID_PATTERN.test(id)) return { ok: false, message: LOGIN_ID_RULE };
  if (!isDbConfigured()) return { ok: false, message: NOT_READY };
  try {
    return (await isLoginIdTaken(id))
      ? { ok: false, message: "이미 쓰고 있는 아이디예요. 다른 아이디를 입력해 주세요." }
      : { ok: true, message: "쓸 수 있는 아이디예요." };
  } catch (err) {
    console.error("아이디 중복 확인 실패", errorSummary(err));
    return { ok: false, message: SERVER_PROBLEM };
  }
}

export interface SignupState {
  error?: string;
  /** 문제가 있는 칸의 id — 화면이 그 칸으로 커서를 옮긴다 */
  field?: string;
  done?: SignupDone;
}

const fail = (error: string, field?: string): SignupState => ({ error, field });

export async function signup(_prev: SignupState, formData: FormData): Promise<SignupState> {
  // 1단계 약관 — 필수 3개 동의가 없으면 받지 않는다
  if (formData.get("consentRequired") !== "1") return fail("약관 동의가 필요해요. 처음 단계부터 다시 진행해 주세요.");

  const name = text(formData, "userName", 60);
  if (!name) return fail("이름을 입력해 주세요.", "userName");
  if (name.length > 50) return fail("이름은 50자 이하로 입력해 주세요.", "userName");

  const birthDate = parseBirthDate(text(formData, "birthDate", 20));
  if (!birthDate) return fail("생년월일을 8자리 숫자로 확인해 주세요. 예) 19900101", "birthDate");
  if (!isAtLeastAge(birthDate, MIN_SIGNUP_AGE)) {
    return fail(`만 ${MIN_SIGNUP_AGE}세 이상만 회원가입할 수 있어요.`, "birthDate");
  }

  const loginId = text(formData, "userId", 50);
  if (!LOGIN_ID_PATTERN.test(loginId)) return fail(LOGIN_ID_RULE, "userId");

  const password = String(formData.get("userPassword") ?? "");
  const pwProblem = passwordProblem(password);
  if (pwProblem) return fail(pwProblem, "userPassword");
  if (password !== String(formData.get("userPasswordConfirm") ?? "")) {
    return fail("비밀번호 확인이 비밀번호와 달라요.", "userPasswordConfirm");
  }

  const prefix = text(formData, "phonePrefix", 3);
  const middle = text(formData, "phoneMiddle", 4);
  const last = text(formData, "phoneLast", 4);
  if (!(PHONE_PREFIXES as readonly string[]).includes(prefix) || !/^\d{3,4}$/.test(middle)) {
    return fail("핸드폰 번호를 확인해 주세요.", "phoneMiddle");
  }
  if (!/^\d{4}$/.test(last)) return fail("핸드폰 번호를 확인해 주세요.", "phoneLast");
  const phone = `${prefix}-${middle}-${last}`;

  const postalCode = text(formData, "postalCode", 10);
  const address = text(formData, "userAddress", 200);
  const addressDetail = text(formData, "userAddressDetail", 200);
  if (!/^\d{5}$/.test(postalCode) || !address) return fail("「주소 찾기」로 주소를 골라 주세요.", "postalCode");
  if (!addressDetail) return fail("상세주소를 입력해 주세요.", "userAddressDetail");

  const emailLocal = text(formData, "userEmail", 64);
  const emailDomain = text(formData, "emailDomain", 100) || text(formData, "emailDomainInput", 100);
  const email = `${emailLocal}@${emailDomain}`;
  if (!/^[A-Za-z0-9._%+-]+$/.test(emailLocal)) return fail("이메일 주소를 확인해 주세요.", "userEmail");
  if (!/^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(emailDomain)) return fail("이메일 주소를 확인해 주세요.", "emailDomainInput");
  if (email.length > 100) return fail("이메일 주소가 너무 길어요.", "userEmail");

  const education = EDUCATION_LEVELS.find((e) => e.value === formData.get("educationLevel"));
  if (!education) return fail("최종학력을 골라 주세요.", "schoolName");
  const schoolName = text(formData, "schoolName", 100);
  if (!schoolName) return fail("학교명을 입력해 주세요.", "schoolName");

  const interest = INTEREST_AREAS.find((i) => i.value === formData.get("interestArea"));
  const joinPaths = formData
    .getAll("registrationPath")
    .map((v) => JOIN_PATHS.find((p) => p.value === v)?.label)
    .filter((v): v is (typeof JOIN_PATHS)[number]["label"] => Boolean(v));

  const refundBank = text(formData, "bankName", 30) || null;
  const refundAccount = text(formData, "accountNumber", 50) || null;
  if (refundAccount && !/^[0-9-]{6,50}$/.test(refundAccount)) {
    return fail("환불 계좌번호는 숫자와 - 로만 입력해 주세요.", "accountNumber");
  }

  if (!isDbConfigured()) return fail(NOT_READY);

  try {
    if (await isLoginIdTaken(loginId)) return fail("이미 쓰고 있는 아이디예요. 다른 아이디를 입력해 주세요.", "userId");
    await createMember({
      loginId,
      passwordHash: await hashPassword(password),
      name,
      birthDate,
      phone,
      email,
      postalCode,
      address,
      addressDetail,
      smsAgree: checked(formData, "smsConsent"),
      emailAgree: checked(formData, "emailConsent"),
      educationLevel: education.label,
      schoolName,
      major: text(formData, "major", 100) || null,
      interestArea: interest?.label ?? null,
      // 보기글 「포스터(길거리, 버스, 지하철)」에 쉼표가 있어서 「 / 」로 잇는다
      joinPaths: joinPaths.length ? [...new Set(joinPaths)].join(" / ") : null,
      refundBank,
      refundAccount,
      signupCoupon: text(formData, "couponNumber", 50) || null,
      privacyOptionalAgree: formData.get("consentPrivacyOptional") === "1",
      marketingAgree: formData.get("consentMarketing") === "1",
    });
  } catch (err) {
    if (isDuplicateKey(err)) return fail("이미 쓰고 있는 아이디예요. 다른 아이디를 입력해 주세요.", "userId");
    console.error("회원가입 실패", errorSummary(err));
    return fail(SERVER_PROBLEM);
  }

  return { done: { name, loginId, phone, email } };
}
