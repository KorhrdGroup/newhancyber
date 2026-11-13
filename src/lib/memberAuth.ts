import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { isDbConfigured } from "./db/client";
import { getMemberStatus } from "./db/members";
import { MEMBER_COOKIE, MEMBER_SESSION_HOURS, readMemberSession, signMemberSession, type MemberSession } from "./memberSession";
import { passwordVersion } from "./password";

export async function createMemberSession(session: MemberSession): Promise<void> {
  (await cookies()).set(MEMBER_COOKIE, await signMemberSession(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MEMBER_SESSION_HOURS * 60 * 60,
  });
}

export async function deleteMemberSession(): Promise<void> {
  (await cookies()).delete(MEMBER_COOKIE);
}

/**
 * 지금 로그인한 회원 — 없으면 null. 홈페이지는 로그인 없이도 보이므로 로그인 화면으로 보내지 않는다.
 * 쿠키 서명만 믿지 않고 DB 의 계정 상태까지 본다: 관리자가 미사용으로 바꿨거나 비밀번호가 바뀌었으면 null.
 */
export const getCurrentMember = cache(async (): Promise<MemberSession | null> => {
  if (!isDbConfigured()) return null;
  const session = await readMemberSession((await cookies()).get(MEMBER_COOKIE)?.value);
  if (!session) return null;
  const status = await getMemberStatus(session.memberId);
  if (!status || !status.isActive || passwordVersion(status.passwordHash) !== session.passwordVersion) return null;
  return session;
});
