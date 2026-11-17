import "server-only";
import { getPool, sql } from "./db/client";

/**
 * 로그인 실패 횟수 제한 — Azure DB 의 dbo.login_failures 에 기록한다.
 * (서버 메모리에 두면 Vercel 처럼 요청마다 다른 서버가 뜨는 곳에서 횟수가 흩어져 잠금이 안 걸린다.)
 *
 * - 같은 접속 주소 + 같은 아이디로 10분 안에 5번 틀리면 10분 잠금
 *   (주소까지 묶는 이유: 아이디만으로 막으면 남이 일부러 틀려서 진짜 사용자를 못 들어오게 할 수 있다)
 * - 주소와 상관없이 같은 아이디로 10분 안에 20번 틀리면 10분 잠금 (주소를 바꿔 가며 시도하는 경우)
 * 시각은 모두 DB 의 UTC 기준이라 서버 시간대와 상관없다.
 */
const SCOPE = "home";
const MAX_FAILURES = 5;
const MAX_FAILURES_PER_ID = 20;
const WINDOW_SECONDS = 10 * 60;
const LOCK_SECONDS = 10 * 60;

const keyOf = (ip: string, loginId: string) => `${SCOPE}|${ip}|${loginId.toLowerCase()}`.slice(0, 200);
const idKeyOf = (loginId: string) => `${SCOPE}|*|${loginId.toLowerCase()}`.slice(0, 200);

/** 잠겨 있으면 남은 분, 아니면 0 */
export async function lockedMinutes(ip: string, loginId: string): Promise<number> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("k1", sql.NVarChar(200), keyOf(ip, loginId))
    .input("k2", sql.NVarChar(200), idKeyOf(loginId))
    .query<{ seconds: number | null }>(`
      SELECT MAX(DATEDIFF(SECOND, SYSUTCDATETIME(), locked_until)) AS seconds
      FROM dbo.login_failures
      WHERE failure_key IN (@k1, @k2) AND locked_until > SYSUTCDATETIME()`);
  const seconds = result.recordset[0]?.seconds ?? 0;
  return seconds > 0 ? Math.ceil(seconds / 60) : 0;
}

/** 한 번 틀림 — 두 기준(주소+아이디, 아이디 전체)에 모두 더하고, 한도에 닿으면 잠근다. */
export async function recordFailure(ip: string, loginId: string): Promise<void> {
  const pool = await getPool();
  await pool
    .request()
    .input("k1", sql.NVarChar(200), keyOf(ip, loginId))
    .input("k2", sql.NVarChar(200), idKeyOf(loginId))
    .input("limit1", sql.Int, MAX_FAILURES)
    .input("limit2", sql.Int, MAX_FAILURES_PER_ID)
    .input("window", sql.Int, WINDOW_SECONDS)
    .input("lock", sql.Int, LOCK_SECONDS).query(`
      SET XACT_ABORT ON;
      BEGIN TRANSACTION;
      MERGE dbo.login_failures WITH (HOLDLOCK) AS t
      USING (VALUES (@k1, @limit1), (@k2, @limit2)) AS s (failure_key, max_failures)
        ON t.failure_key = s.failure_key
      WHEN MATCHED THEN
        -- 10분이 지났으면 새 묶음으로 다시 센다 (이미 걸린 잠금 시각은 그대로 둔다)
        UPDATE SET
          failures = CASE WHEN DATEDIFF(SECOND, t.first_failure_at, SYSUTCDATETIME()) > @window THEN 1 ELSE t.failures + 1 END,
          first_failure_at = CASE WHEN DATEDIFF(SECOND, t.first_failure_at, SYSUTCDATETIME()) > @window THEN SYSUTCDATETIME() ELSE t.first_failure_at END
      WHEN NOT MATCHED THEN
        INSERT (failure_key, failures, first_failure_at, locked_until) VALUES (s.failure_key, 1, SYSUTCDATETIME(), NULL);

      UPDATE f SET locked_until = DATEADD(SECOND, @lock, SYSUTCDATETIME()), failures = 0, first_failure_at = SYSUTCDATETIME()
      FROM dbo.login_failures f
      JOIN (VALUES (@k1, @limit1), (@k2, @limit2)) AS s (failure_key, max_failures) ON s.failure_key = f.failure_key
      WHERE f.failures >= s.max_failures;

      -- 하루 넘은 기록은 조금씩 정리한다 (잠겨 있는 기록은 남긴다)
      DELETE TOP (100) FROM dbo.login_failures
      WHERE first_failure_at < DATEADD(DAY, -1, SYSUTCDATETIME())
        AND (locked_until IS NULL OR locked_until < SYSUTCDATETIME());
      COMMIT TRANSACTION;`);
}

/** 로그인에 성공하면 그 주소의 기록만 지운다 (아이디 전체 기록은 시간이 지나 풀리게 둔다). */
export async function clearFailures(ip: string, loginId: string): Promise<void> {
  const pool = await getPool();
  await pool.request().input("k1", sql.NVarChar(200), keyOf(ip, loginId)).query(`
    DELETE FROM dbo.login_failures WHERE failure_key = @k1`);
}
