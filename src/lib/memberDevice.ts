import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";

/**
 * 학습자 기기 표시 — PC 등록(dbo.pc_registrations.access_url)에 쓰는 값.
 * 브라우저는 MAC 주소를 읽을 수 없어서, 처음 로그인할 때 무작위 값을 쿠키로 심어 그 브라우저를 한 기기로 본다.
 * 로그아웃해도 지우지 않는다(같은 기기로 다시 들어오면 같은 값). 쿠키를 지우거나 다른 브라우저로 오면 새 기기가 된다.
 */
export const DEVICE_COOKIE = "hc_device";
/** 브라우저가 쿠키를 붙잡아 두는 최대 기간(400일) — 로그인할 때마다 다시 늘린다 */
const DEVICE_MAX_AGE = 400 * 24 * 60 * 60;
const DEVICE_PATTERN = /^[0-9a-f]{32}$/;

/** 이 브라우저의 기기 값을 읽고, 없거나 모양이 틀리면 새로 만든다. 서버 액션 안에서만 부른다(쿠키를 쓴다). */
export async function ensureDeviceId(): Promise<string> {
  const jar = await cookies();
  const current = jar.get(DEVICE_COOKIE)?.value;
  const id = current && DEVICE_PATTERN.test(current) ? current : randomBytes(16).toString("hex");
  jar.set(DEVICE_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DEVICE_MAX_AGE,
  });
  return id;
}
