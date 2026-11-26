import "server-only";
import { getPool, sql } from "./client";

/**
 * 장바구니 — dbo.cart_items (docs/db/cart_items.sql). 로그인한 회원이 담은 차수(class_id).
 * 홈페이지가 넣고 빼며, LMS 관리자는 읽기만 한다. 가격 · 마감 · 신청 기간은 courses.ts readCartClasses 가 볼 때마다 다시 읽는다.
 */

/** 한 회원이 담을 수 있는 최대 차수 수 */
export const CART_MAX = 30;

/** 회원이 담은 차수 번호 — 담은 순서대로 */
export async function readCartClassIds(memberId: number): Promise<number[]> {
  const pool = await getPool();
  const r = await pool.request().input("m", sql.Int, memberId).query<{ classId: number }>(`
    SELECT class_id AS classId FROM dbo.cart_items WHERE member_id = @m ORDER BY created_at, cart_item_id`);
  return r.recordset.map((row) => row.classId);
}

/**
 * 담기 — 이미 담긴 차수는 그대로 둔다. 다 담으면 CART_MAX 를 넘을 때는 하나도 담지 않고 "full".
 * 같은 회원이 두 창에서 동시에 눌러도 개수 확인 · 넣기가 겹치지 않게 그 회원의 줄을 잠근다.
 */
export async function insertCartItems(memberId: number, classIds: number[]): Promise<{ added: number } | "full"> {
  const ids = classIds.filter((id) => Number.isInteger(id) && id > 0);
  if (ids.length === 0) return { added: 0 };
  const pool = await getPool();
  const r = await pool
    .request()
    .input("m", sql.Int, memberId)
    .input("ids", sql.NVarChar(sql.MAX), ids.join(","))
    .input("max", sql.Int, CART_MAX).query<{ added: number }>(`
      SET XACT_ABORT ON;
      BEGIN TRANSACTION;
      DECLARE @have INT = (SELECT COUNT(*) FROM dbo.cart_items WITH (UPDLOCK, HOLDLOCK) WHERE member_id = @m);
      DECLARE @new TABLE (id INT PRIMARY KEY);
      INSERT INTO @new (id)
        SELECT DISTINCT v.id FROM (SELECT TRY_CAST(value AS INT) AS id FROM STRING_SPLIT(@ids, ',')) v
        WHERE v.id IS NOT NULL
          AND NOT EXISTS (SELECT 1 FROM dbo.cart_items c WHERE c.member_id = @m AND c.class_id = v.id);
      DECLARE @n INT = (SELECT COUNT(*) FROM @new);
      IF @have + @n > @max
      BEGIN
        ROLLBACK TRANSACTION;
        SELECT -1 AS added;
        RETURN;
      END
      INSERT INTO dbo.cart_items (member_id, class_id) SELECT @m, id FROM @new;
      COMMIT TRANSACTION;
      SELECT @n AS added;`);
  const added = r.recordset[0]?.added ?? 0;
  return added < 0 ? "full" : { added };
}

/** 빼기 — 그 회원의 줄만 지운다. 지운 줄 수를 돌려준다 */
export async function deleteCartItems(memberId: number, classIds: number[]): Promise<number> {
  const ids = classIds.filter((id) => Number.isInteger(id) && id > 0);
  if (ids.length === 0) return 0;
  const pool = await getPool();
  const r = await pool
    .request()
    .input("m", sql.Int, memberId)
    .input("ids", sql.NVarChar(sql.MAX), ids.join(",")).query(`
      DELETE FROM dbo.cart_items
      WHERE member_id = @m AND class_id IN (SELECT TRY_CAST(value AS INT) FROM STRING_SPLIT(@ids, ','))`);
  return r.rowsAffected[0] ?? 0;
}
