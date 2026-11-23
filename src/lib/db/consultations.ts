import "server-only";
import { getPool, sql } from "./client";

/**
 * 간편 상담 신청 — dbo.consultations (DB 002). 관리자 「상담 관리 › 간편 상담 관리」(/coun/coun_mng)가 본다.
 * 안내판 9장 11/19 요청: source 는 학습상담 · 간편 무료 학습상담 · 랜딩상담 중 하나, status 는 넣지 않으면 「상담 대기」.
 */
export interface NewConsultation {
  source: "학습상담" | "간편 무료 학습상담" | "랜딩상담";
  category: string | null;
  courseInterest: string | null;
  name: string;
  /** 010-1234-5678 모양 */
  phone: string;
  memberId: number | null;
  /** 첫 메모 — 상담 희망 시간처럼 칸이 없는 신청 내용 (관리자 상담 메모 칸) */
  memo: string | null;
}

/** 같은 번호로 이 시간(분) 안에 들어온 상담 신청이 있으면 또 받지 않는다 — 두 번 누름 · 반복 등록 막기 */
export const CONSULT_REPEAT_MINUTES = 10;

export async function createConsultation(c: NewConsultation): Promise<boolean> {
  const pool = await getPool();
  const r = await pool
    .request()
    .input("source", sql.NVarChar(20), c.source)
    .input("category", sql.NVarChar(20), c.category)
    .input("interest", sql.NVarChar(50), c.courseInterest)
    .input("name", sql.NVarChar(50), c.name)
    .input("phone", sql.NVarChar(20), c.phone)
    .input("memberId", sql.Int, c.memberId)
    .input("memo", sql.NVarChar(sql.MAX), c.memo)
    .input("minutes", sql.Int, CONSULT_REPEAT_MINUTES).query(`
      INSERT INTO dbo.consultations (source, category, course_interest, name, phone, member_id, memo)
      SELECT @source, @category, @interest, @name, @phone, @memberId, @memo
      WHERE NOT EXISTS (
        SELECT 1 FROM dbo.consultations WITH (UPDLOCK, HOLDLOCK)
        WHERE phone = @phone AND created_at > DATEADD(MINUTE, -@minutes, SYSDATETIME()));`);
  return r.rowsAffected[0] > 0;
}
