/**
 * 홈페이지 회원 로그인 세션 — 서명된 쿠키(JWT, HS256). LMS 관리자 · 교강사 사이트와 같은 방식이다.
 * 쿠키를 만들고 지우는 일은 src/lib/memberAuth.ts 가 한다.
 */
import { jwtVerify, SignJWT } from "jose";

export const MEMBER_COOKIE = "hc_member";
export const MEMBER_SESSION_HOURS = 8;

export interface MemberSession {
  /** members.member_id */
  memberId: number;
  loginId: string;
  name: string;
  /** 로그인할 때의 비밀번호 해시 지문 — 비밀번호를 바꾸면 달라져서 예전 세션이 끊긴다 */
  passwordVersion: string;
}

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET 이 없습니다. .env.local(서버는 환경 변수)에 32자 이상으로 넣어 주세요.");
  if (secret.length < 32) throw new Error("SESSION_SECRET 이 32자보다 짧습니다.");
  return new TextEncoder().encode(secret);
}

export async function signMemberSession(session: MemberSession): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MEMBER_SESSION_HOURS}h`)
    .sign(secretKey());
}

/** 서명·만료를 확인한다. 틀리거나 비밀키가 없으면 null. */
export async function readMemberSession(token: string | undefined): Promise<MemberSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    const { memberId, loginId, name, passwordVersion } = payload;
    if (typeof memberId !== "number" || typeof loginId !== "string" || typeof name !== "string") return null;
    return { memberId, loginId, name, passwordVersion: typeof passwordVersion === "string" ? passwordVersion : "" };
  } catch {
    return null;
  }
}
