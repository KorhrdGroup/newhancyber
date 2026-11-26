import "server-only";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { unstable_cache } from "next/cache";
import {
  sampleCartData,
  sampleRegisterData,
  type CartData,
  type CartItem,
  type RegisterCourse,
  type RegisterData,
  type RegisterSemester,
} from "@/components/course-registration/courseData";
import { currentTerm, type RecruitingTerm } from "@/components/home/homeData";
import { readCartClassIds } from "./db/cart";
import { listUsableCoupons } from "./db/coupons";
import { isDbConfigured } from "./db/client";
import { getCurrentMember } from "./memberAuth";
import {
  readCartClasses,
  readOpenClasses,
  readOpenSemesters,
  type CartClassRow,
  type OpenClassRow,
  type OpenSemesterRow,
} from "./db/courses";

/**
 * 수강신청 화면 · 메인 「지금 모집 중」 — LMS 관리자가 만든 학기 · 차수 · 과목(DB)을 화면 모양으로.
 * 1분 캐시 (관리자가 고친 값은 1분 안에 보인다). DB 설정이 없거나 못 읽거나 받을 학기가 없으면
 * 지금 코드 샘플을 그대로 쓴다 — src/lib/site.ts 와 같은 방식.
 */

const CACHE_SECONDS = 60;
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function parts(ymd: string): { y: number; m: number; d: number; w: string } {
  const [y, m, d] = ymd.split("-").map(Number);
  return { y, m, d, w: WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] };
}

/** 2026-11-26 → 2026년 11월 26일 */
const longDate = (ymd: string) => {
  const p = parts(ymd);
  return `${p.y}년 ${p.m}월 ${p.d}일`;
};
/** 2026-11-26 → 2026-11-26(목) */
const dayDate = (ymd: string) => `${ymd}(${parts(ymd).w})`;
/** 2026-11-26 → 2026.11.26 */
const dotDate = (ymd: string) => ymd.replaceAll("-", ".");

function toSemester(s: OpenSemesterRow): RegisterSemester {
  const open = parts(s.studyStart);
  const rows = [
    { label: "개강일", value: longDate(s.studyStart) },
    { label: "수강신청기간", value: `${dayDate(s.applyStart)} ~ ${dayDate(s.applyEnd)}` },
    { label: "학습기간", value: `${dayDate(s.studyStart)} ~ ${dayDate(s.studyEnd)}` },
  ];
  if (s.creditApplyDate) rows.push({ label: "학점인정신청일", value: longDate(s.creditApplyDate) });
  if (s.degreeApplyDate) rows.push({ label: "학위신청일", value: longDate(s.degreeApplyDate) });
  return { key: `semester-${s.semesterId}`, title: s.name, openingNote: `${open.m}월 ${open.d}일 개강`, rows };
}

/** 한국 오늘 YYYY-MM-DD (한국은 서머타임이 없다) */
const todayKst = () => new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);

/** 마감 · 정원 다 참 — 관리자 차수 상태와 수강 인원으로 본다 */
const isClassClosed = (c: OpenClassRow) => c.status === "마감" || (c.capacity !== null && c.students >= c.capacity);

/** 할인가(sale_price)가 정가보다 낮으면 할인가 */
const feeOf = (c: OpenClassRow) => (c.salePrice !== null && c.salePrice < c.price ? c.salePrice : c.price);

function toCourse(c: OpenClassRow, applyStarted: boolean): RegisterCourse {
  // 수강신청 시작 전인 학기는 일정만 보여 주고 아직 담지 못한다
  if (!applyStarted) {
    return { ...toOpenCourse(c), closed: true, statusLabel: "접수 전" };
  }
  return toOpenCourse(c);
}

function toOpenCourse(c: OpenClassRow): RegisterCourse {
  const closed = isClassClosed(c);
  const fee = feeOf(c);
  const bachelor = c.bachelorMajors?.trim() ?? "";
  const associate = c.associateMajors?.trim() ?? "";
  return {
    id: String(c.classId),
    classId: c.classId,
    semesterKey: `semester-${c.semesterId}`,
    // 같은 학기에 같은 과목이 여러 반이면 반 번호를 붙인다
    name: c.name,
    category: c.category ?? "기타",
    majorType: [],
    fee,
    listPrice: c.price,
    majors: bachelor || associate ? { bachelor: bachelor || "-", associate: associate || "-" } : null,
    closed,
    statusLabel: closed ? "마감" : c.status === "마감임박" ? "마감임박" : null,
  };
}

/** 같은 학기 · 같은 과목에 반이 여럿이면 「과목명 2반」처럼 구분한다 */
function labelClasses(rows: OpenClassRow[], list: RegisterCourse[]): RegisterCourse[] {
  const count = new Map<string, number>();
  for (const r of rows) count.set(`${r.semesterId}:${r.courseId}`, (count.get(`${r.semesterId}:${r.courseId}`) ?? 0) + 1);
  return list.map((c, i) => {
    const r = rows[i];
    return (count.get(`${r.semesterId}:${r.courseId}`) ?? 0) > 1 ? { ...c, name: `${c.name} ${r.classNo}반` } : c;
  });
}

const readOpen = unstable_cache(
  async () => {
    const semesters = await readOpenSemesters();
    const classes = semesters.length ? await readOpenClasses(semesters.map((s) => s.semesterId)) : [];
    return { semesters, classes };
  },
  ["open-semesters-v1"],
  { revalidate: CACHE_SECONDS, tags: ["courses"] },
);

async function loadOpen(): Promise<{ semesters: OpenSemesterRow[]; classes: OpenClassRow[] } | null> {
  // 빌드 중에는 DB 를 부르지 않는다 (src/lib/site.ts 와 같은 이유)
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD || !isDbConfigured()) return null;
  try {
    return await readOpen();
  } catch (err) {
    const e = err as { name?: string; code?: string; number?: number };
    console.error("수강신청 학기 · 차수 읽기 실패", [e?.name, e?.code, e?.number].filter(Boolean).join(" "));
    return null;
  }
}

/**
 * 수강신청 화면 데이터.
 * DB 를 읽었으면 받을 학기가 없어도 DB 결과(빈 목록)를 돌려준다 — 실제 운영에서 샘플 과목이 보이면 안 되므로.
 * DB 설정이 없거나(개발 · 미리보기) 읽기에 실패했을 때만 샘플.
 */
export async function getRegisterData(): Promise<RegisterData> {
  const open = await loadOpen();
  if (!open) return sampleRegisterData();
  const today = todayKst();
  const started = new Set(open.semesters.filter((s) => s.applyStart <= today).map((s) => s.semesterId));
  const courses = labelClasses(
    open.classes,
    open.classes.map((c) => toCourse(c, started.has(c.semesterId))),
  );
  const categories = [...new Set(courses.map((c) => c.category))];
  return {
    source: "db",
    semesters: open.semesters.map(toSemester),
    courses,
    categoryTabs: [{ key: "all", label: "전체" }, ...categories.map((c) => ({ key: c, label: c }))],
  };
}

/**
 * 메인 「지금 모집 중」 — 수강신청을 받는 학기 가운데 가장 먼저 마감하는 것 (없으면 다음에 받을 학기).
 * DB 가 없거나 못 읽으면 코드 값(homeData.currentTerm), 받을 학기가 없으면 null(줄을 숨긴다).
 */
export async function getRecruitingTerm(): Promise<RecruitingTerm | null> {
  const open = await loadOpen();
  if (!open) return currentTerm;
  const s = open.semesters[0];
  if (!s) return null;
  const open1 = parts(s.studyStart);
  return {
    name: s.name,
    openingDate: `${open1.m}월 ${open1.d}일`,
    applyPeriod: `${dotDate(s.applyStart)} ~ ${dotDate(s.applyEnd)}`,
    studyPeriod: `${dotDate(s.studyStart)} ~ ${dotDate(s.studyEnd)}`,
    applyDeadline: `${s.applyEnd}T23:59:59+09:00`,
  };
}

// ── 장바구니 ─────────────────────────────────────────────

/** 지금 결제할 수 없는 까닭 — 없으면 null */
function cartNote(c: CartClassRow): string | null {
  if (!c.applyOpen) return "수강신청 기간 아님";
  if (isClassClosed(c)) return "마감";
  return null;
}

function toCartItem(c: CartClassRow): CartItem {
  const note = cartNote(c);
  return {
    id: String(c.classId),
    classId: c.classId,
    name: c.siblingCount > 1 ? `${c.name} ${c.classNo}반` : c.name,
    semester: c.semesterName,
    fee: feeOf(c),
    listPrice: c.price,
    available: note === null,
    note,
  };
}

/**
 * 담을 수 있는 차수만 고른다 — 수강신청 기간 안 · 마감 아님 · 학기 · 차수 · 과목 사용 중.
 * 장바구니 담기 서버 액션이 브라우저가 보낸 번호를 믿지 않고 이것으로 다시 본다.
 */
export async function filterAddableClassIds(classIds: number[]): Promise<number[]> {
  const rows = await readCartClasses(classIds);
  return rows.filter((c) => cartNote(c) === null).map((c) => c.classId);
}

/**
 * 장바구니 화면 데이터 — 로그인한 회원의 dbo.cart_items 를 차수의 지금 값으로 읽는다 (담은 순서 그대로).
 * 로그인하지 않았으면 needLogin. DB 설정이 없으면 샘플.
 * DB 를 못 읽으면 오류를 그대로 던진다 — 빈 장바구니로 보이면 학습자가 잃어버린 줄 알기 때문.
 */
export async function getCartData(): Promise<CartData> {
  if (!isDbConfigured()) return sampleCartData();
  const member = await getCurrentMember();
  if (!member) return { source: "db", items: [], needLogin: true };
  const ids = await readCartClassIds(member.memberId);
  if (ids.length === 0) return { source: "db", items: [] };
  const rows = await readCartClasses(ids);
  const byId = new Map(rows.map((r) => [r.classId, r]));
  const items = ids.map((id) => byId.get(id)).filter((r): r is CartClassRow => r !== undefined).map(toCartItem);
  return { source: "db", items };
}

// ── 결제하기 ─────────────────────────────────────────────

/** 결제하기 주소의 ?c=4.7 → [4, 7] (모양이 틀리면 빈 목록, 많아야 30개) */
export function parseClassIdsParam(raw: string | string[] | undefined): number[] {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (!v || !/^\d{1,9}(\.\d{1,9})*$/.test(v)) return [];
  return [...new Set(v.split(".").map(Number))].filter((n) => Number.isSafeInteger(n) && n > 0).slice(0, 30);
}

/**
 * 결제하기 화면 데이터 — 고른 차수를 지금 값으로 다시 읽는다 (고른 순서대로, 없어진 차수는 빠진다).
 * 로그인하지 않았으면 needLogin. DB 설정이 없으면 샘플(장바구니 샘플 그대로).
 * 실제 결제 가능 여부(이미 신청한 과목 등)는 결제 버튼을 누를 때 서버가 잠그고 다시 본다.
 */
export async function getPaymentData(classIds: number[]): Promise<CartData> {
  if (!isDbConfigured()) return sampleCartData();
  const member = await getCurrentMember();
  if (!member) return { source: "db", items: [], needLogin: true };
  if (classIds.length === 0) return { source: "db", items: [] };
  const [rows, coupons] = await Promise.all([readCartClasses(classIds), listUsableCoupons(member.memberId)]);
  const byId = new Map(rows.map((r) => [r.classId, r]));
  const items = classIds.map((id) => byId.get(id)).filter((r): r is CartClassRow => r !== undefined).map(toCartItem);
  return { source: "db", items, coupons };
}
