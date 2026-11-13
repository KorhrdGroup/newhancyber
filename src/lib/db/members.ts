import "server-only";
import { getPool, sql } from "./client";

/**
 * 홈페이지 회원 — 가입 · 로그인 · 상태 확인. 표는 dbo.members (LMS 관리자 「회원 관리」와 같은 표).
 * 모든 값은 파라미터로 넘겨 SQL 에 직접 붙이지 않는다.
 */

export interface MemberLogin {
  memberId: number;
  loginId: string;
  name: string;
  passwordHash: string | null;
  isActive: boolean;
}

export async function findMemberForLogin(loginId: string): Promise<MemberLogin | null> {
  const pool = await getPool();
  const r = await pool.request().input("loginId", sql.NVarChar(50), loginId).query<MemberLogin>(`
    SELECT member_id AS memberId, login_id AS loginId, name, password_hash AS passwordHash, is_active AS isActive
    FROM dbo.members WHERE login_id = @loginId`);
  return r.recordset[0] ?? null;
}

export async function getMemberStatus(memberId: number): Promise<{ isActive: boolean; passwordHash: string | null } | null> {
  const pool = await getPool();
  const r = await pool
    .request()
    .input("memberId", sql.Int, memberId)
    .query<{ isActive: boolean; passwordHash: string | null }>(
      `SELECT is_active AS isActive, password_hash AS passwordHash FROM dbo.members WHERE member_id = @memberId`,
    );
  return r.recordset[0] ?? null;
}

/** 아이디 중복 확인 (대소문자 구분 없음 — DB 정렬 규칙이 CI) */
export async function isLoginIdTaken(loginId: string): Promise<boolean> {
  const pool = await getPool();
  const r = await pool
    .request()
    .input("loginId", sql.NVarChar(50), loginId)
    .query<{ n: number }>(`SELECT COUNT(*) AS n FROM dbo.members WHERE login_id = @loginId`);
  return (r.recordset[0]?.n ?? 0) > 0;
}

/** 마지막 로그인 시각과 접속 기록 */
export async function recordMemberLogin(memberId: number, ip: string, userAgent: string): Promise<void> {
  const pool = await getPool();
  await pool
    .request()
    .input("memberId", sql.Int, memberId)
    .input("ip", sql.NVarChar(45), ip.slice(0, 45))
    .input("ua", sql.NVarChar(300), userAgent.slice(0, 300)).query(`
      UPDATE dbo.members SET last_login_at = SYSDATETIME() WHERE member_id = @memberId;
      INSERT INTO dbo.login_logs (user_type, user_id, ip, user_agent) VALUES (N'member', @memberId, @ip, @ua);`);
}

export interface NewMember {
  loginId: string;
  passwordHash: string;
  name: string;
  /** YYYY-MM-DD */
  birthDate: string;
  phone: string;
  email: string;
  postalCode: string;
  address: string;
  addressDetail: string;
  smsAgree: boolean;
  emailAgree: boolean;
  educationLevel: string;
  schoolName: string;
  major: string | null;
  interestArea: string | null;
  joinPaths: string | null;
  refundBank: string | null;
  refundAccount: string | null;
  signupCoupon: string | null;
  privacyOptionalAgree: boolean;
  marketingAgree: boolean;
}

/** 가입 — 같은 아이디가 동시에 들어오면 UNIQUE 제약이 막는다 (호출하는 쪽에서 isDuplicateKey 로 구분) */
export async function createMember(m: NewMember): Promise<number> {
  const pool = await getPool();
  const r = await pool
    .request()
    .input("loginId", sql.NVarChar(50), m.loginId)
    .input("passwordHash", sql.NVarChar(200), m.passwordHash)
    .input("name", sql.NVarChar(50), m.name)
    .input("birthDate", sql.NVarChar(10), m.birthDate)
    .input("phone", sql.NVarChar(20), m.phone)
    .input("email", sql.NVarChar(100), m.email)
    .input("postalCode", sql.NVarChar(10), m.postalCode)
    .input("address", sql.NVarChar(200), m.address)
    .input("addressDetail", sql.NVarChar(200), m.addressDetail)
    .input("smsAgree", sql.Bit, m.smsAgree)
    .input("emailAgree", sql.Bit, m.emailAgree)
    .input("educationLevel", sql.NVarChar(30), m.educationLevel)
    .input("schoolName", sql.NVarChar(100), m.schoolName)
    .input("major", sql.NVarChar(100), m.major)
    .input("interestArea", sql.NVarChar(30), m.interestArea)
    .input("joinPaths", sql.NVarChar(200), m.joinPaths)
    .input("refundBank", sql.NVarChar(30), m.refundBank)
    .input("refundAccount", sql.NVarChar(50), m.refundAccount)
    .input("signupCoupon", sql.NVarChar(50), m.signupCoupon)
    .input("privacyOptionalAgree", sql.Bit, m.privacyOptionalAgree)
    .input("marketingAgree", sql.Bit, m.marketingAgree).query<{ memberId: number }>(`
      INSERT INTO dbo.members (
        login_id, password_hash, name, birth_date, phone, email, postal_code, address, address_detail,
        sms_agree, email_agree, education_level, school_name, major, interest_area, join_paths,
        refund_bank, refund_account, signup_coupon, privacy_optional_agree, marketing_agree, terms_agreed_at)
      OUTPUT INSERTED.member_id AS memberId
      VALUES (
        @loginId, @passwordHash, @name, CONVERT(DATE, @birthDate, 23), @phone, @email, @postalCode, @address, @addressDetail,
        @smsAgree, @emailAgree, @educationLevel, @schoolName, @major, @interestArea, @joinPaths,
        @refundBank, @refundAccount, @signupCoupon, @privacyOptionalAgree, @marketingAgree, SYSDATETIME())`);
  return r.recordset[0].memberId;
}

/** UNIQUE 제약 위반(2627 · 2601) — 같은 아이디로 동시에 가입한 경우 */
export function isDuplicateKey(err: unknown): boolean {
  const n = (err as { number?: number; originalError?: { info?: { number?: number } } })?.number
    ?? (err as { originalError?: { info?: { number?: number } } })?.originalError?.info?.number;
  return n === 2627 || n === 2601;
}
