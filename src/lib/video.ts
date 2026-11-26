import "server-only";
import { createHmac } from "node:crypto";

/**
 * 강의 영상 서명 주소 — cdms-main src/lib/video.ts 와 같은 규칙 (Cloudflare R2 lms-video 를 videokorhrd.com 의 video-gate Worker 가 지킨다).
 * Worker 규칙: 디코드 · NFC 정규화한 경로(앞 / 포함)와 만료 시각(초)을 「경로:만료」로 이어 SIGNING_SECRET 으로 HMAC-SHA256 → ?ex=…&sig=…
 * content_pages.pc_url 에는 CDMS 가 서명 없는 주소(https://videokorhrd.com/<경로>.mp4)를 넣는다 — 재생할 때 여기서 서명한다.
 * 키: .env.local 의 VIDEO_SIGNING_SECRET (CDMS · Worker 와 같은 값), 주소 VIDEO_BASE_URL(기본 https://videokorhrd.com).
 */
const BASE = (process.env.VIDEO_BASE_URL || "https://videokorhrd.com").replace(/\/+$/, "");
const HOURS = 4;

export const videoSigningConfigured = () => !!process.env.VIDEO_SIGNING_SECRET;

/** 쪽 주소가 영상 서버의 mp4 인가 — 그렇다면 버킷 안 경로(앞 / 없음), 아니면 null */
export function videoKeyOf(pcUrl: string): string | null {
  try {
    const u = new URL(pcUrl);
    if (u.origin !== new URL(BASE).origin) return null;
    const key = decodeURIComponent(u.pathname).replace(/^\/+/, "").normalize("NFC");
    if (!/\.mp4$/i.test(key) || key.split("/").some((s) => s === "" || s === "." || s === "..")) return null;
    return key;
  } catch {
    return null;
  }
}

/** 몇 시간짜리 서명 주소 (키가 없으면 null) — 정시로 올려 같은 시간대에는 주소가 같다(브라우저가 다시 받지 않게) */
export function signedVideoUrl(key: string, hours = HOURS): string | null {
  const secret = process.env.VIDEO_SIGNING_SECRET;
  if (!secret || !key) return null;
  const path = "/" + key.normalize("NFC");
  const ex = Math.ceil((Date.now() / 1000 + hours * 3600) / 3600) * 3600;
  const sig = createHmac("sha256", secret).update(`${path}:${ex}`).digest("hex");
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${BASE}${encoded}?ex=${ex}&sig=${sig}`;
}
