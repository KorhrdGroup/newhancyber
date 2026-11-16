import "server-only";
import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual, type ScryptOptions } from "node:crypto";

/**
 * 비밀번호 해시 — Node 기본 scrypt.
 * 저장 형식: scrypt$N$r$p$소금(base64)$해시(base64)
 * 같은 형식을 newhancyber-db 의 테스트 계정 비밀번호와 scripts/hash-password.mjs 가 쓴다.
 *
 * 옛 사이트(hancyber.co.kr ASP · JSP TLMS)에서 옮겨 올 계정은 KISA SHA-256(소금 없음, 16진수 64자)이다.
 * 그 값도 알아보고(verifyPassword), 맞으면 로그인 때 scrypt 로 바꿔 저장한다(needsRehash → 각 사이트 로그인).
 *   - 옮길 때 저장값: wrapLegacySha256 으로 감싼 "scrypt-sha256$…"(권장). 옛 해시 그대로("a1b2…") · "sha256$a1b2…"도 받는다.
 * 세 사이트(홈페이지 · LMS 관리자 · 교강사)의 이 파일은 같은 내용이다. 고치면 셋 다 고친다.
 */
const N = 16384;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;

function scrypt(password: string, salt: Buffer, keylen: number, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCb(password, salt, keylen, options, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, KEY_LENGTH, { N, r: R, p: P });
  return ["scrypt", N, R, P, salt.toString("base64"), key.toString("base64")].join("$");
}

interface ParsedHash {
  /** scrypt = 새 방식, scrypt-sha256 = 옛 SHA-256 값을 옮길 때 scrypt 로 한 번 감싼 것 */
  kind: "scrypt" | "scrypt-sha256";
  N: number;
  r: number;
  p: number;
  salt: Buffer;
  expected: Buffer;
}

const isPowerOfTwo = (n: number) => (n & (n - 1)) === 0;

/** 저장값을 엄격하게 읽는다. 형식·길이·파라미터가 하나라도 이상하면 null (빈 해시 조각으로 아무 비밀번호나 통과하는 일을 막는다). */
function parseHash(stored: string): ParsedHash | null {
  const parts = stored.split("$");
  if (parts.length !== 6 || (parts[0] !== "scrypt" && parts[0] !== "scrypt-sha256")) return null;
  const [kind, n, r, p, saltB64, hashB64] = parts;
  const N = Number(n);
  const rr = Number(r);
  const pp = Number(p);
  // 받는 세기의 범위 — 아래 verifyPassword 의 maxmem 과 함께 맞춘다 (N·r 이 크면 메모리 한도에 걸려 항상 실패한다).
  if (!Number.isInteger(N) || N < 2 ** 14 || N > 2 ** 15 || !isPowerOfTwo(N)) return null;
  if (!Number.isInteger(rr) || rr < 1 || rr > 8) return null;
  if (!Number.isInteger(pp) || pp < 1 || pp > 4) return null;
  const salt = Buffer.from(saltB64, "base64");
  const expected = Buffer.from(hashB64, "base64");
  if (salt.length !== 16 || expected.length !== KEY_LENGTH) return null;
  return { kind: kind as ParsedHash["kind"], N, r: rr, p: pp, salt, expected };
}

// 없는 아이디·비밀번호 없는 계정·깨진 저장값일 때도 같은 시간만큼 계산해서, 응답 시간으로 계정 상태를 알 수 없게 한다.
const DUMMY: ParsedHash = { kind: "scrypt", N, r: R, p: P, salt: Buffer.alloc(16), expected: Buffer.alloc(KEY_LENGTH) };

const derive = (input: string, t: ParsedHash) =>
  scrypt(input, t.salt, KEY_LENGTH, {
    N: t.N,
    r: t.r,
    p: t.p,
    // scrypt 가 쓰는 메모리 ≈ 128·N·r 바이트. 넉넉히 두 배 (최대 N=2^15, r=8 → 64MB).
    maxmem: 256 * t.N * t.r,
  });

// ── 옛 사이트 SHA-256 ─────────────────────────────────────
//
// 옛 계정을 옮겨 올 때는 소금 없는 SHA-256 을 그대로 두지 말고 wrapLegacySha256 으로 감싸서 넣는다
// ("scrypt-sha256$…" — DB 가 새도 사전 공격이 scrypt 만큼 느리다). 64자 16진수 그대로("a1b2…", "sha256$a1b2…")도 받지만
// 그런 값은 로그인하기 전까지 약한 상태로 남는다.

const LEGACY_SHA256 = /^(?:sha256\$)?([0-9a-fA-F]{64})$/;

/** 옛 사이트에서 옮겨 온 SHA-256 해시(감싸지 않은 것)면 32바이트 값, 아니면 null */
function parseLegacy(stored: string): Buffer | null {
  const m = LEGACY_SHA256.exec(stored.trim());
  return m ? Buffer.from(m[1], "hex") : null;
}

/**
 * 옛 사이트가 만들었을 SHA-256 값들.
 * - JSP(TLMS) KISA_SHA256.Encrypt: 비밀번호를 UTF-8 바이트로 바꿔 해시
 * - ASP(hancyber.co.kr) SHA256_Encrypt: 글자마다 AscB(UTF-16 의 아래 1바이트)만 써서 해시
 * 영문 · 숫자 · 기호만 있으면 둘이 같다. 한글 등이 섞이면 다르므로 둘 다 맞춰 본다.
 */
function legacyDigests(password: string): Buffer[] {
  const utf8 = createHash("sha256").update(password, "utf8").digest();
  const lowBytes = Buffer.from(Array.from({ length: password.length }, (_, i) => password.charCodeAt(i) & 0xff));
  const asp = createHash("sha256").update(lowBytes).digest();
  return utf8.equals(asp) ? [utf8] : [utf8, asp];
}

/**
 * 옛 계정을 옮길 때 쓴다 — 옛 SHA-256 값(16진수 64자)을 scrypt 로 감싼 저장값을 만든다.
 * 로그인 때 「입력 → SHA-256 → scrypt」로 확인하고, 맞으면 진짜 scrypt 로 바꿔 저장한다.
 */
export async function wrapLegacySha256(sha256Hex: string): Promise<string> {
  const digest = parseLegacy(sha256Hex);
  if (!digest) throw new Error("옛 SHA-256 값은 16진수 64자여야 합니다.");
  const salt = randomBytes(16);
  const key = await scrypt(digest.toString("hex"), salt, KEY_LENGTH, { N, r: R, p: P });
  return ["scrypt-sha256", N, R, P, salt.toString("base64"), key.toString("base64")].join("$");
}

/** 로그인에 성공했을 때 새 방식(scrypt)으로 바꿔 저장해야 하는 저장값인지 — 옛 SHA-256(감싼 것 포함)이면 true */
export function needsRehash(stored: string | null | undefined): boolean {
  if (!stored) return false;
  return Boolean(parseLegacy(stored)) || parseHash(stored)?.kind === "scrypt-sha256";
}

export async function verifyPassword(password: string, stored: string | null | undefined): Promise<boolean> {
  const legacy = stored ? parseLegacy(stored) : null;
  const parsed = stored && !legacy ? parseHash(stored) : null;
  try {
    if (parsed?.kind === "scrypt-sha256") {
      // 감싼 옛 값: 옛 사이트 방식(1~2가지)의 SHA-256 16진수를 scrypt 해 맞춰 본다
      let ok = false;
      for (const d of legacyDigests(password)) {
        if (timingSafeEqual(await derive(d.toString("hex"), parsed), parsed.expected)) ok = true;
      }
      return ok;
    }
    const target = parsed ?? DUMMY;
    const key = await derive(password, target);
    // 감싸지 않은 옛 해시도 scrypt 한 번(위)을 똑같이 거친다 — 응답 시간으로 옛 계정인지 알 수 없게
    if (legacy) return legacyDigests(password).some((d) => timingSafeEqual(d, legacy));
    return parsed !== null && timingSafeEqual(key, target.expected);
  } catch (err) {
    console.error("비밀번호 확인 중 오류", err);
    return false;
  }
}

/** 세션에 넣는 비밀번호 지문 — 해시 자체는 쿠키에 담지 않고, 바뀌었는지만 알 수 있게 줄인 값 */
export function passwordVersion(stored: string | null | undefined): string {
  return createHash("sha256").update(stored ?? "").digest("base64url").slice(0, 16);
}
