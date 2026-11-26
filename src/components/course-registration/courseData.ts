/**
 * 수강신청·장바구니·결제내역 샘플 데이터 (퍼블리싱 인라인 스크립트 그대로).
 * TODO: 강의 목록·장바구니·결제내역 API 연동 시 서버에서 받아온다.
 */

/** 210000 → "210,000" (원본 toLocaleString 과 같은 결과) */
export const formatPrice = (amount: number) => amount.toLocaleString("ko-KR");

export type CourseCategory = "social-worker" | "childcare" | "business" | "psychology" | "beauty";

export interface Course {
  name: string;
  category: CourseCategory;
  majorType: string[];
  fee: number;
}

/** 수강신청 과목 목록 (register.html courseData) */
export const courses: Course[] = [
  { name: "가족복지론", category: "social-worker", majorType: ["전공필수", "교양"], fee: 210000 },
  { name: "가족상담및가족치료", category: "social-worker", majorType: ["전공필수"], fee: 210000 },
  { name: "가족생활교육", category: "social-worker", majorType: ["전공선택"], fee: 210000 },
  { name: "건강가정론", category: "social-worker", majorType: ["전공선택", "교양"], fee: 210000 },
  { name: "경영학개론", category: "business", majorType: ["전공선택"], fee: 210000 },
  { name: "경제학개론", category: "business", majorType: ["전공필수"], fee: 210000 },
  { name: "광고학", category: "business", majorType: ["전공선택"], fee: 210000 },
  { name: "노인복지론", category: "social-worker", majorType: ["교양"], fee: 210000 },
  { name: "리더십", category: "business", majorType: ["교양"], fee: 210000 },
];

/** 과목 분류 탭. 보육교사·경영학·심리학·미용은 원본에서 주석 처리 */
export const courseCategoryTabs: { key: CourseCategory | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "social-worker", label: "사회복지사" },
];

/** 전공보기 팝업 — 분류별 관련 전공영역 */
export const majorInfo: Record<CourseCategory, { bachelor: string; associate: string }> = {
  "social-worker": { bachelor: "사회복지학 전공, 아동학 전공, 청소년학 전공", associate: "아동 가족 전공" },
  childcare: { bachelor: "아동학 전공, 보육학 전공, 유아교육학 전공", associate: "보육 전공, 아동 가족 전공" },
  business: { bachelor: "경영학 전공, 경영정보학 전공, 회계학 전공", associate: "경영 전공, 회계 전공" },
  psychology: { bachelor: "심리학 전공, 상담심리학 전공, 임상심리학 전공", associate: "상담심리 전공" },
  beauty: { bachelor: "미용학 전공, 뷰티학 전공, 피부미용학 전공", associate: "미용 전공, 뷰티 전공" },
};

/** 수강신청 모바일 결제 요약: 3과목 이상이면 30% 할인 (원본 예시 로직) */
export const registerDiscount = (count: number, total: number) => (count >= 3 ? Math.floor(total * 0.3) : 0);

export interface SemesterSchedule {
  key: string;
  title: string;
  openingNote: string;
  openingDate: string;
  creditPeriod: string;
  learningPeriod: string;
  degreePeriod: string;
  degreeDate: string;
}

/** 학사일정 탭 */
export const semesterSchedules: SemesterSchedule[] = [
  {
    key: "semester-1",
    title: "2025년 2학기 7차",
    openingNote: "(10월 17일 개강)",
    openingDate: "2025년 10월 17일",
    creditPeriod: "2026년 2분기",
    learningPeriod: "2026-11-26(목) 10:00 ~ 2027-03-25(수) 23:59",
    degreePeriod: "2026년 3분기",
    degreeDate: "2026년 8월",
  },
  {
    key: "semester-2",
    title: "2026년 1학기 1차",
    openingNote: "(11월 26일 개강)",
    openingDate: "2026년 11월 26일",
    creditPeriod: "2027년 1분기",
    learningPeriod: "2026-11-26(목) 10:00 ~ 2027-03-25(수) 23:59",
    degreePeriod: "2027년 2분기",
    degreeDate: "2027년 8월",
  },
];

// ── 수강신청 화면 데이터 (DB 또는 샘플) ─────────────────────────
// DB 는 src/lib/courses.ts 가 이 모양으로 바꿔 넘긴다. DB 가 없거나 못 읽으면 아래 sampleRegisterData().

export interface RegisterSemester {
  key: string;
  title: string;
  /** 탭 두 번째 줄 — 「11월 26일 개강」 */
  openingNote: string;
  rows: { label: string; value: string }[];
}

export interface RegisterCourse {
  /** 화면 안에서 고르는 열쇠 — DB 는 차수 번호(class_id) */
  id: string;
  /** DB 차수 번호 (샘플은 null) — 장바구니 · 결제가 payment_items.class_id 로 쓴다 */
  classId: number | null;
  /** 이 과목이 열리는 학기 (RegisterSemester.key). 샘플은 "*" = 모든 학기 */
  semesterKey: string;
  name: string;
  /** 과목 구분 탭 열쇠 · 이름 */
  category: string;
  majorType: string[];
  /** 결제할 금액 (할인가가 있으면 할인가) */
  fee: number;
  /** 정가 */
  listPrice: number;
  majors: { bachelor: string; associate: string } | null;
  /** 마감 · 정원 다 참 — 고를 수 없다 */
  closed: boolean;
  /** 「마감임박」 · 「마감」 표시 (없으면 null) */
  statusLabel: string | null;
}

export interface RegisterData {
  source: "db" | "sample";
  semesters: RegisterSemester[];
  courses: RegisterCourse[];
  categoryTabs: { key: string; label: string }[];
}

/** 장바구니 한 줄 — DB 는 src/lib/courses.ts getCartData() 가 이 모양으로 */
export interface CartItem {
  /** 화면 열쇠 — DB 는 차수 번호, 샘플은 순번 */
  id: string;
  /** DB 차수 번호 (샘플은 null) */
  classId: number | null;
  name: string;
  /** 학기 이름 「2027년도 1학기 1차」 (샘플은 null) */
  semester: string | null;
  fee: number;
  listPrice: number;
  /** 지금 결제할 수 있는가 — 마감 · 신청 기간이 지난 차수는 false */
  available: boolean;
  /** 결제할 수 없는 까닭 (「마감」 · 「수강신청 기간 아님」) */
  note: string | null;
}

export interface CartData {
  source: "db" | "sample";
  items: CartItem[];
  /** 로그인하지 않음 — 장바구니는 회원별로 DB(dbo.cart_items)에 있다 */
  needLogin?: boolean;
  /** 결제하기 — 그 회원이 지금 쓸 수 있는 쿠폰 (LMS 쿠폰 관리 · 홈페이지 쿠폰 번호 등록) */
  coupons?: import("@/lib/coupons").UsableCoupon[];
}

/** DB 를 쓸 수 없을 때의 장바구니 — 퍼블리싱 샘플 그대로 */
export function sampleCartData(): CartData {
  return {
    source: "sample",
    items: sampleCartCourses.map((c, i) => ({
      id: String(i),
      classId: null,
      name: c.name,
      semester: null,
      fee: c.currentPrice,
      listPrice: c.originalPrice,
      available: true,
      note: null,
    })),
  };
}

const categoryLabel: Record<CourseCategory, string> = {
  "social-worker": "사회복지사",
  childcare: "보육교사",
  business: "경영학",
  psychology: "심리학",
  beauty: "미용",
};

/** DB 를 쓸 수 없을 때의 수강신청 화면 — 지금까지의 퍼블리싱 샘플 그대로 */
export function sampleRegisterData(): RegisterData {
  return {
    source: "sample",
    semesters: semesterSchedules.map((s) => ({
      key: s.key,
      title: s.title,
      openingNote: s.openingNote.replace(/[()]/g, ""),
      rows: [
        { label: "개강일", value: s.openingDate },
        { label: "학점인정신청기간", value: s.creditPeriod },
        { label: "학습기간", value: s.learningPeriod },
        { label: "학위신청기간", value: s.degreePeriod },
        { label: "학위취득시기", value: s.degreeDate },
      ],
    })),
    courses: courses.map((c) => ({
      id: c.name,
      classId: null,
      semesterKey: "*",
      name: c.name,
      category: c.category,
      majorType: c.majorType,
      fee: c.fee,
      listPrice: c.fee,
      majors: majorInfo[c.category],
      closed: false,
      statusLabel: null,
    })),
    categoryTabs: courseCategoryTabs.map((t) => ({ key: t.key, label: t.key === "all" ? t.label : categoryLabel[t.key] })),
  };
}

/** 과목명으로 찾기 (장바구니 샘플은 "가족 복지론"처럼 띄어 쓴 이름도 있다) */
export const findCourseByName = (name: string) =>
  courses.find((course) => course.name.replace(/\s/g, "") === name.replace(/\s/g, ""));

/** 맛보기(샘플강의) 팝업 주소 — 원본: /vod/(과목 번호)/pc/1/1.html */
export const sampleLectureHref = (name: string) => `/popup/sample-lecture/${encodeURIComponent(name)}`;

export interface CartCourse {
  name: string;
  originalPrice: number;
  currentPrice: number;
}

/** 장바구니·결제내역 샘플 강의 (cart.html / payment-history.html) */
export const sampleCartCourses: CartCourse[] = [
  { name: "가족 복지론", originalPrice: 210000, currentPrice: 210000 },
  { name: "가족상담및가족치료", originalPrice: 210000, currentPrice: 210000 },
  { name: "가족상담및가족치료", originalPrice: 210000, currentPrice: 210000 },
  { name: "가족상담및가족치료", originalPrice: 210000, currentPrice: 210000 },
  { name: "가족생활교육", originalPrice: 210000, currentPrice: 210000 },
];
