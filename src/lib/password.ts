import "server-only";
import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual, type ScryptOptions } from "node:crypto";

/**
 * 비밀번호 해시 — Node 기본 scrypt.
 * 저장 형식: scrypt$N$r$p$소금(base64)$해시(base64)
 * 같은 형식을 newhancyber-db 의 테스트 계정 비밀번호와 scripts/hash-password.mjs 가 쓴다.
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
  if (parts.length !== 6 || parts[0] !== "scrypt") return null;
  const [, n, r, p, saltB64, hashB64] = parts;
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
  return { N, r: rr, p: pp, salt, expected };
}

// 없는 아이디·비밀번호 없는 계정·깨진 저장값일 때도 같은 시간만큼 계산해서, 응답 시간으로 계정 상태를 알 수 없게 한다.
const DUMMY: ParsedHash = { N, r: R, p: P, salt: Buffer.alloc(16), expected: Buffer.alloc(KEY_LENGTH) };

export async function verifyPassword(password: string, stored: string | null | undefined): Promise<boolean> {
  const parsed = stored ? parseHash(stored) : null;
  const target = parsed ?? DUMMY;
  try {
    const key = await scrypt(password, target.salt, KEY_LENGTH, {
      N: target.N,
      r: target.r,
      p: target.p,
      // scrypt 가 쓰는 메모리 ≈ 128·N·r 바이트. 넉넉히 두 배 (최대 N=2^15, r=8 → 64MB).
      maxmem: 256 * target.N * target.r,
    });
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
