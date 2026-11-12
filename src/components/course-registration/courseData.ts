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

/** 과목명으로 찾기 (장바구니 샘플은 "가족 복지론"처럼 띄어 쓴 이름도 있다) */
export const findCourseByName = (name: string) =>
  courses.find((course) => course.name.replace(/\s/g, "") === name.replace(/\s/g, ""));

/** 맛보기(샘플강의) 팝업 주소 — 원본: /vod/(과목 번호)/pc/1/1.html */
export const sampleLectureHref = (name: string) => `/popup/sample-lecture/${encodeURIComponent(name)}`;

export interface CartCourse {
  name: string;
  icon: string;
  originalPrice: number;
  currentPrice: number;
}

/** 장바구니·결제내역 샘플 강의 (cart.html / payment-history.html) */
export const sampleCartCourses: CartCourse[] = [
  { name: "가족 복지론", icon: "사", originalPrice: 210000, currentPrice: 210000 },
  { name: "가족상담및가족치료", icon: "사", originalPrice: 210000, currentPrice: 210000 },
  { name: "가족상담및가족치료", icon: "사", originalPrice: 210000, currentPrice: 210000 },
  { name: "가족상담및가족치료", icon: "사", originalPrice: 210000, currentPrice: 210000 },
  { name: "가족생활교육", icon: "사", originalPrice: 210000, currentPrice: 210000 },
];

/** 장바구니·결제내역 할인액 — 원본도 쿠폰 계산 전이라 고정값 */
export const SAMPLE_DISCOUNT = 525000;

/** 장바구니·결제내역 결제 요약 (최종 금액은 0 미만으로 내려가지 않음) */
export const cartSummary = (prices: number[]) => {
  const totalFee = prices.reduce((sum, price) => sum + price, 0);
  return { totalFee, discount: SAMPLE_DISCOUNT, finalAmount: Math.max(totalFee - SAMPLE_DISCOUNT, 0) };
};
