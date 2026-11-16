import "server-only";
import { getPool, sql } from "./client";

/**
 * PC 등록 — 학습자가 로그인할 때 그 기기를 dbo.pc_registrations 에 남긴다 (DB 007, 관리자 「PC등록 관리」가 본다).
 * 같은 회원 · 같은 기기는 한 번만 (UNIQUE member_id + access_url). reg_order 는 그 회원의 몇 번째 기기인지 — 지금까지 가장 큰 번호 + 1.
 * 관리자가 중간 번호를 지워도 번호를 다시 쓰지 않는다(새 기기는 늘 맨 뒤 번호).
 * 대수 제한은 아직 정하지 않아서(11/16) 막지 않고 기록만 한다.
 */
export async function registerMemberPc(
  memberId: number,
  deviceId: string,
  ip: string,
  userAgent: string,
): Promise<boolean> {
  const pool = await getPool();
  // HOLDLOCK 으로 그 회원의 줄 범위를 잡아서, 같은 회원이 두 기기에서 동시에 로그인해도 번호가 겹치지 않게 한다.
  const r = await pool
    .request()
    .input("memberId", sql.Int, memberId)
    .input("accessUrl", sql.NVarChar(100), deviceId.slice(0, 100))
    .input("ip", sql.NVarChar(45), ip.slice(0, 45))
    .input("ua", sql.NVarChar(300), userAgent.slice(0, 300)).query(`
      INSERT INTO dbo.pc_registrations (member_id, access_url, ip, reg_order, user_agent)
      SELECT @memberId, @accessUrl, @ip, ISNULL(MAX(p.reg_order), 0) + 1, @ua
      FROM dbo.pc_registrations p WITH (UPDLOCK, HOLDLOCK)
      WHERE p.member_id = @memberId
      HAVING ISNULL(SUM(CASE WHEN p.access_url = @accessUrl THEN 1 ELSE 0 END), 0) = 0;`);
  return r.rowsAffected[0] > 0;
}
