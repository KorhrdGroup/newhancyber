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

/**
 * 옛 사이트 SHA-256 비밀번호로 로그인에 성공했을 때 새 방식(scrypt)으로 바꿔 저장한다.
 * 그사이 다른 곳에서 비밀번호가 바뀌었으면(저장값이 옛 값과 다르면) 바꾸지 않는다. 바꿨으면 true.
 */
export async function upgradeMemberPasswordHash(memberId: number, oldHash: string, newHash: string): Promise<boolean> {
  const pool = await getPool();
  const r = await pool
    .request()
    .input("id", sql.Int, memberId)
    .input("oldHash", sql.NVarChar(200), oldHash)
    .input("newHash", sql.NVarChar(200), newHash)
    .query(`UPDATE dbo.members SET password_hash = @newHash WHERE member_id = @id AND password_hash = @oldHash`);
  return (r.rowsAffected[0] ?? 0) > 0;
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

// ── 내 정보 수정 (마이페이지) ─────────────────────────────

export interface MemberProfile {
  loginId: string;
  name: string;
  /** YYYY.MM.DD (없으면 null) */
  birthDate: string | null;
  phone: string | null;
  email: string | null;
  postalCode: string | null;
  address: string | null;
  addressDetail: string | null;
  /** 가입할 때 고른 보기 글 그대로 (예: 「고등학교 졸업」) */
  educationLevel: string | null;
  schoolName: string | null;
  major: string | null;
  smsAgree: boolean;
  emailAgree: boolean;
}

export async function readMemberProfile(memberId: number): Promise<MemberProfile | null> {
  const pool = await getPool();
  const r = await pool.request().input("id", sql.Int, memberId).query<MemberProfile>(`
    SELECT login_id AS loginId, name, REPLACE(CONVERT(CHAR(10), birth_date, 23), '-', '.') AS birthDate, phone, email,
      postal_code AS postalCode, address, address_detail AS addressDetail, education_level AS educationLevel,
      school_name AS schoolName, major, sms_agree AS smsAgree, email_agree AS emailAgree
    FROM dbo.members WHERE member_id = @id AND is_active = 1`);
  return r.recordset[0] ?? null;
}

export interface MemberProfileInput {
  phone: string;
  email: string;
  postalCode: string;
  address: string;
  addressDetail: string;
  educationLevel: string;
  schoolName: string;
  major: string | null;
  smsAgree: boolean;
  emailAgree: boolean;
}

/**
 * 회원이 고칠 수 있는 칸만 바꾼다 (아이디 · 이름 · 생년월일 · 주민번호는 관리자 회원 관리에서만).
 * newHash 가 있으면 비밀번호도 바꾸는데, 확인한 뒤 그사이 비밀번호가 바뀌었으면(oldHash 와 다르면) 아무것도 저장하지 않는다.
 * 결과: ok · changed(그사이 비밀번호가 바뀜) · missing(계정 없음 · 사용 중지)
 */
export async function updateMemberProfile(
  memberId: number,
  input: MemberProfileInput,
  password: { oldHash: string; newHash: string } | null,
): Promise<"ok" | "changed" | "missing"> {
  const pool = await getPool();
  const r = await pool
    .request()
    .input("id", sql.Int, memberId)
    .input("phone", sql.NVarChar(20), input.phone)
    .input("email", sql.NVarChar(100), input.email)
    .input("postalCode", sql.NVarChar(10), input.postalCode)
    .input("address", sql.NVarChar(200), input.address)
    .input("addressDetail", sql.NVarChar(200), input.addressDetail)
    .input("educationLevel", sql.NVarChar(30), input.educationLevel)
    .input("schoolName", sql.NVarChar(100), input.schoolName)
    .input("major", sql.NVarChar(100), input.major)
    .input("smsAgree", sql.Bit, input.smsAgree)
    .input("emailAgree", sql.Bit, input.emailAgree)
    .input("oldHash", sql.NVarChar(200), password?.oldHash ?? null)
    .input("newHash", sql.NVarChar(200), password?.newHash ?? null).query<{ result: string }>(`
      UPDATE dbo.members
      SET phone = @phone, email = @email, postal_code = @postalCode, address = @address, address_detail = @addressDetail,
          education_level = @educationLevel, school_name = @schoolName, major = @major,
          sms_agree = @smsAgree, email_agree = @emailAgree,
          password_hash = COALESCE(@newHash, password_hash), updated_at = SYSDATETIME()
      WHERE member_id = @id AND is_active = 1 AND (@newHash IS NULL OR password_hash = @oldHash);
      DECLARE @n INT = @@ROWCOUNT;
      SELECT CASE WHEN @n > 0 THEN N'ok'
                  WHEN EXISTS (SELECT 1 FROM dbo.members WHERE member_id = @id AND is_active = 1) THEN N'changed'
                  ELSE N'missing' END AS result;`);
  return (r.recordset[0]?.result as "ok" | "changed" | "missing") ?? "missing";
}
