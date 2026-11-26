import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import type { MemberSession } from "./memberSession";

/**
 * 내 정보 수정 2단계 통과증 — 1단계에서 비밀번호를 다시 확인하면 10분 동안 수정 화면 · 저장을 허락한다.
 * 서명된 쿠키(로그인 세션과 같은 SESSION_SECRET, 다른 용도 표시)에 회원 번호와 비밀번호 지문을 담는다:
 * 다른 회원으로 로그인했거나 비밀번호가 바뀌면 통과증이 맞지 않는다. 쿠키는 /my-page/profile 아래에서만 보낸다.
 */
const COOKIE = "hc_profile_ok";
const PATH = "/my-page/profile";
const MINUTES = 10;
const PURPOSE = "profile-edit";

function key(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET 설정이 없습니다.");
  return new TextEncoder().encode(secret);
}

export async function grantProfileAccess(m: MemberSession): Promise<void> {
  const token = await new SignJWT({ purpose: PURPOSE, memberId: m.memberId, pv: m.passwordVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MINUTES}m`)
    .sign(key());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: PATH,
    maxAge: MINUTES * 60,
  });
}

/** 지금 로그인한 회원의 통과증이 살아 있는지 */
export async function hasProfileAccess(m: MemberSession): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return payload.purpose === PURPOSE && payload.memberId === m.memberId && payload.pv === m.passwordVersion;
  } catch {
    return false;
  }
}

export async function clearProfileAccess(): Promise<void> {
  (await cookies()).set(COOKIE, "", { path: PATH, maxAge: 0 });
}
