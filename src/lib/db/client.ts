import "server-only";
import mssqlModule from "mssql";

/**
 * MS-SQL 연결 — 서버에서만 쓴다. 접속 정보는 .env.local 에서 읽는다 (.env.example 참고).
 * DB_SERVER · DB_NAME · DB_USER · DB_PASSWORD 중 하나라도 없으면 회원가입·로그인은 「준비 중」 안내를 보인다 (홈페이지의 다른 화면은 DB 없이도 뜬다).
 */
export function isDbConfigured(): boolean {
  const { DB_SERVER, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  return Boolean(DB_SERVER && DB_NAME && DB_USER && DB_PASSWORD);
}

function config(): mssqlModule.config {
  const { DB_SERVER, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_TRUST_SERVER_CERTIFICATE } = process.env;
  if (!DB_SERVER || !DB_NAME || !DB_USER || !DB_PASSWORD) {
    throw new Error("DB 접속 정보가 모자랍니다. .env.local 의 DB_SERVER·DB_NAME·DB_USER·DB_PASSWORD 를 확인해 주세요.");
  }
  const port = DB_PORT ? Number(DB_PORT) : 1433;
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`DB_PORT 가 올바른 숫자가 아닙니다: "${DB_PORT}". .env.local 을 확인해 주세요.`);
  }
  return {
    server: DB_SERVER,
    port,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    options: {
      encrypt: true,
      trustServerCertificate: DB_TRUST_SERVER_CERTIFICATE === "true",
    },
    // Azure SQL 무료(서버리스) DB 는 한동안 안 쓰면 잠들었다가 첫 접속 때 깨어나는 데 수십 초 걸린다.
    // 기본 15초면 그 사이에 끊기므로 넉넉히 기다린다.
    connectionTimeout: 45_000,
    requestTimeout: 30_000,
    pool: { max: 10, min: 0, idleTimeoutMillis: 30_000 },
  };
}

/**
 * 연결 풀과 mssql 모듈을 전역에 하나씩만 둔다.
 * - 개발 서버는 파일을 고칠 때마다 모듈을 다시 읽는다.
 * - Next 는 입구(페이지 · 서버 액션 · 라우트 핸들러)마다 mssql 을 따로 묶을 수 있다. 풀은 하나인데
 *   다른 묶음의 sql.Int 를 넘기면 mssql 이 타입을 못 알아봐 "type.validate is not a function" 으로 깨진다.
 *   그래서 풀을 만든 쪽의 mssql(타입 객체 포함)을 모두가 같이 쓴다.
 */
const globalForDb = globalThis as unknown as {
  mssqlPool?: Promise<mssqlModule.ConnectionPool>;
  mssql?: typeof mssqlModule;
};
const sql = (globalForDb.mssql ??= mssqlModule);

export function getPool(): Promise<mssqlModule.ConnectionPool> {
  if (!globalForDb.mssqlPool) {
    globalForDb.mssqlPool = new sql.ConnectionPool(config()).connect().catch((err: unknown) => {
      // 연결에 실패하면 다음 요청에서 다시 시도하도록 비운다.
      globalForDb.mssqlPool = undefined;
      throw err;
    });
  }
  return globalForDb.mssqlPool;
}

export { sql };
