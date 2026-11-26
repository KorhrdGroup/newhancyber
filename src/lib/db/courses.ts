import "server-only";
import { getPool } from "./client";

/**
 * 수강신청 화면이 읽는 학기 · 차수 · 과목 — dbo.semesters · classes · courses · course_categories (DB 002 · 005 · 012).
 * 관리자(LMS 「학사일정 관리 · 차수 관리 · 과목 관리」)가 만들고, 홈페이지는 읽기만 한다.
 * 칸 이름과 뜻은 newhancyber-lms src/lib/db/semesters.ts · classes.ts · courses.ts 와 같다.
 * 이 파일은 DB 그대로 읽기만 하고, 화면 모양 · 캐시 · DB 가 없을 때 샘플 쓰기는 src/lib/courses.ts 가 한다.
 *
 * 「한국 오늘」은 DB 시각(UTC) + 9시간 — 한국은 서머타임이 없다.
 */

const KST_TODAY = "CAST(DATEADD(HOUR, 9, SYSUTCDATETIME()) AS DATE)";

export interface OpenSemesterRow {
  semesterId: number;
  name: string;
  /** YYYY-MM-DD (한국 날짜) */
  applyStart: string;
  applyEnd: string;
  studyStart: string;
  studyEnd: string;
  creditApplyDate: string | null;
  degreeApplyDate: string | null;
}

/**
 * 수강신청을 받을 학기 — 사용 중이고, 수강신청 마감일이 오늘(한국)이나 그 뒤이며, 사용 중인 차수가 하나라도 있는 학기.
 * 수강신청 시작이 빠른 순(지금 받는 학기 → 다음 학기).
 */
export async function readOpenSemesters(): Promise<OpenSemesterRow[]> {
  const pool = await getPool();
  const r = await pool.request().query<OpenSemesterRow>(`
    SELECT s.semester_id AS semesterId, s.name,
      CONVERT(CHAR(10), s.apply_start, 23) AS applyStart, CONVERT(CHAR(10), s.apply_end, 23) AS applyEnd,
      CONVERT(CHAR(10), s.study_start, 23) AS studyStart, CONVERT(CHAR(10), s.study_end, 23) AS studyEnd,
      CONVERT(CHAR(10), s.credit_apply_date, 23) AS creditApplyDate, CONVERT(CHAR(10), s.degree_apply_date, 23) AS degreeApplyDate
    FROM dbo.semesters s
    WHERE s.is_active = 1
      AND CAST(s.apply_end AS DATE) >= ${KST_TODAY}
      AND EXISTS (
        SELECT 1 FROM dbo.classes cl JOIN dbo.courses co ON co.course_id = cl.course_id
        WHERE cl.semester_id = s.semester_id AND cl.is_active = 1 AND co.is_active = 1)
    ORDER BY s.apply_start, s.study_start, s.semester_id`);
  return r.recordset;
}

export interface OpenClassRow {
  classId: number;
  semesterId: number;
  courseId: number;
  courseNo: string;
  name: string;
  classNo: number;
  credit: number;
  isPractice: boolean;
  /** 과목이 고른 카테고리 이름 (보통 2차 — 「사회복지학」 · 「현장실습」) — 카테고리가 없으면 null */
  category: string | null;
  bachelorMajors: string | null;
  associateMajors: string | null;
  price: number;
  salePrice: number | null;
  capacity: number | null;
  /** 수강 취소를 뺀 수강 인원 (LMS 차수 관리와 같은 계산) */
  students: number;
  /** 「수강신청」 · 「마감임박」 · 「마감」 (LMS courseAdmin.ts CLASS_STATUSES) */
  status: string;
}

/** 고른 학기들의 사용 중인 차수 (과목도 사용 중인 것만) — 과목 이름, 반 순 */
export async function readOpenClasses(semesterIds: number[]): Promise<OpenClassRow[]> {
  const ids = semesterIds.filter((id) => Number.isInteger(id) && id > 0);
  if (ids.length === 0) return [];
  const pool = await getPool();
  const r = await pool.request().input("ids", ids.join(",")).query<OpenClassRow>(`
    SELECT cl.class_id AS classId, cl.semester_id AS semesterId, co.course_id AS courseId, co.course_no AS courseNo, co.name,
      CAST(cl.class_no AS INT) AS classNo, CAST(co.credit AS INT) AS credit, co.is_practice AS isPractice,
      cc.name AS category,
      co.bachelor_majors AS bachelorMajors, co.associate_majors AS associateMajors,
      cl.price, cl.sale_price AS salePrice, cl.capacity,
      (SELECT COUNT(*) FROM dbo.enrollments e WHERE e.class_id = cl.class_id AND e.status <> N'수강 취소') AS students,
      cl.status
    FROM dbo.classes cl
    JOIN dbo.courses co ON co.course_id = cl.course_id
    LEFT JOIN dbo.course_categories cc ON cc.category_id = co.category_id
    WHERE cl.semester_id IN (SELECT TRY_CAST(value AS INT) FROM STRING_SPLIT(@ids, ','))
      AND cl.is_active = 1 AND co.is_active = 1
    ORDER BY co.name, cl.class_no, cl.class_id`);
  return r.recordset;
}

export interface CartClassRow extends OpenClassRow {
  semesterName: string;
  /** 같은 학기 · 같은 과목의 사용 중인 반 수 — 2개 이상이면 화면에 「n반」을 붙인다 (수강신청 화면과 같은 규칙) */
  siblingCount: number;
  /** 오늘(한국)이 수강신청 기간 안이고 학기 · 차수 · 과목이 모두 사용 중 — 지금 담거나 결제할 수 있는 차수 */
  applyOpen: boolean;
}

/**
 * 장바구니에 담긴 차수 — 화면을 그릴 때마다 DB 에서 다시 읽어 가격 · 마감 · 신청 기간을 지금 값으로 본다
 * (장바구니 쿠키에는 차수 번호만 있다). 없어진 차수는 빠진다. 사용자마다 달라서 캐시하지 않는다.
 */
export async function readCartClasses(classIds: number[]): Promise<CartClassRow[]> {
  const ids = classIds.filter((id) => Number.isInteger(id) && id > 0);
  if (ids.length === 0) return [];
  const pool = await getPool();
  const r = await pool.request().input("ids", ids.join(",")).query<CartClassRow>(`
    SELECT cl.class_id AS classId, cl.semester_id AS semesterId, s.name AS semesterName,
      co.course_id AS courseId, co.course_no AS courseNo, co.name,
      CAST(cl.class_no AS INT) AS classNo, CAST(co.credit AS INT) AS credit, co.is_practice AS isPractice,
      cc.name AS category, co.bachelor_majors AS bachelorMajors, co.associate_majors AS associateMajors,
      cl.price, cl.sale_price AS salePrice, cl.capacity,
      (SELECT COUNT(*) FROM dbo.enrollments e WHERE e.class_id = cl.class_id AND e.status <> N'수강 취소') AS students,
      cl.status,
      (SELECT COUNT(*) FROM dbo.classes x WHERE x.semester_id = cl.semester_id AND x.course_id = cl.course_id AND x.is_active = 1) AS siblingCount,
      CAST(CASE WHEN s.is_active = 1 AND cl.is_active = 1 AND co.is_active = 1
                 AND ${KST_TODAY} BETWEEN CAST(s.apply_start AS DATE) AND CAST(s.apply_end AS DATE)
           THEN 1 ELSE 0 END AS BIT) AS applyOpen
    FROM dbo.classes cl
    JOIN dbo.semesters s ON s.semester_id = cl.semester_id
    JOIN dbo.courses co ON co.course_id = cl.course_id
    LEFT JOIN dbo.course_categories cc ON cc.category_id = co.category_id
    WHERE cl.class_id IN (SELECT TRY_CAST(value AS INT) FROM STRING_SPLIT(@ids, ','))`);
  return r.recordset;
}
