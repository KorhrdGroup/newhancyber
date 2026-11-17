import "server-only";
import { getPool, sql } from "./client";

/**
 * 무료 학습설계 신청 — dbo.study_plans (DB 002 · 007). 관리자 「학습설계 관리」가 보고 처리한다.
 * 비회원도 신청하므로 member_id 는 로그인했을 때만 넣는다. 상태는 DB 기본값 「접수완료」로 시작한다.
 */
export interface NewStudyPlan {
  name: string;
  /** 010-1234-5678 모양 */
  phone: string;
  memberId: number | null;
  /** 상담 유형 · 희망 시간 · 문의 내용을 줄로 묶은 글 */
  content: string;
}

/** 같은 번호로 이 시간(분) 안에 들어온 신청이 있으면(상태와 상관없이) 또 받지 않는다 — 두 번 누름 · 반복 등록 막기 */
export const STUDY_PLAN_REPEAT_MINUTES = 10;

/** 신청을 넣는다. 같은 번호로 방금 넣은 신청이 있으면 넣지 않고 false. */
export async function createStudyPlan(p: NewStudyPlan): Promise<boolean> {
  const pool = await getPool();
  // 같은 번호의 줄 범위를 잠가서, 두 번 눌러 동시에 들어와도 하나만 들어가게 한다.
  const r = await pool
    .request()
    .input("name", sql.NVarChar(50), p.name)
    .input("phone", sql.NVarChar(20), p.phone)
    .input("memberId", sql.Int, p.memberId)
    .input("content", sql.NVarChar(2000), p.content)
    .input("minutes", sql.Int, STUDY_PLAN_REPEAT_MINUTES).query(`
      INSERT INTO dbo.study_plans (name, phone, member_id, content)
      SELECT @name, @phone, @memberId, @content
      WHERE NOT EXISTS (
        SELECT 1 FROM dbo.study_plans WITH (UPDLOCK, HOLDLOCK)
        WHERE phone = @phone
          AND created_at > DATEADD(MINUTE, -@minutes, SYSDATETIME()));`);
  return r.rowsAffected[0] > 0;
}
