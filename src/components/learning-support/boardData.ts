/**
 * 학습지원 게시판 샘플 데이터 (원본 퍼블리싱 그대로).
 * TODO: 공지사항·학사일정·서식자료실 API 연동 시 서버에서 받아온다.
 */

export interface BoardPost {
  /** 원본 표기 그대로 ("공지" 글은 뱃지로 표시) */
  number: string;
  title: string;
  date: string;
  isNotice?: boolean;
  /** 원본에서 tr 에 practice-support-notice-row 가 붙은 줄 */
  emphasized?: boolean;
  /** 원본에서 링크가 있던 글만 */
  href?: string;
}

const notice = (title: string, id: number): BoardPost => ({
  number: "공지",
  title,
  date: "25.10.21",
  isNotice: true,
  emphasized: true,
  href: `/learning-support/notice/${id}`,
});
const post = (title: string, id: number): BoardPost => ({
  number: "000",
  title,
  date: "25.10.21",
  href: `/learning-support/notice/${id}`,
});

/** 공지사항 — 데스크톱 표 (원본 notice.html 표) */
export const noticePosts: BoardPost[] = [
  notice("학습지원 공지사항입니다.", 0),
  notice("온라인 학습 안내", 1),
  notice("2025년 학습 일정 안내", 2),
  notice("수강신청 방법 안내", 3),
  notice("학습 지원 프로그램 안내", 4),
  post("모바일 학습 가이드 업데이트 안내", 5),
  post("원격지원 서비스 이용 안내", 6),
  post("학습 자료실 이용 방법", 7),
  post("FAQ 업데이트 안내", 8),
  post("학사일정 변경 안내", 9),
  post("학습 지원 프로그램 신청 안내", 10),
  post("온라인 강의 접속 방법 안내", 11),
  post("학습 지원 센터 운영 시간 안내", 12),
];

/**
 * 공지사항 — 모바일 목록 (원본 notice.html 스크립트의 notices 배열).
 * 원본도 데스크톱 표와 글 목록이 다르다. API 를 붙이면 하나로 합친다.
 */
export const mobileNoticePosts: BoardPost[] = [
  { number: "공지", title: "26년 1학기 1차(12월 24일 개강반) 사회복지...", date: "25.10.21", isNotice: true },
  { number: "공지", title: "26년 1학기 1차(12월 24일 개강반) 사회복지...", date: "25.10.21", isNotice: true },
  { number: "공지", title: "25년 2학기 3차(09월 03일 개강반) 보육실...", date: "25.10.21", isNotice: true },
  { number: "공지", title: "[필독] 사회복지현장실습 서류 제출 안내(Q&A)", date: "25.10.21", isNotice: true },
  { number: "000", title: "26년 1학기 1차(12월 24일 개강반) 사회복지...", date: "25.10.21" },
  { number: "000", title: "26년 1학기 1차(12월 24일 개강반) 사회복지...", date: "25.10.21" },
  { number: "000", title: "25년 2학기 3차(09월 03일 개강반) 보육실...", date: "25.10.21" },
  { number: "000", title: "26년 1학기 1차(12월 24일 개강반) 사회복지...", date: "25.10.21" },
  { number: "000", title: "가족생활교육", date: "25.10.21" },
  { number: "000", title: "26년 1학기 1차(12월 24일 개강반) 사회복지...", date: "25.10.21" },
].map((p, index) => ({ ...p, href: `/learning-support/notice/${index}` }));

export type ScheduleTabKey = "theory" | "practice";

const schedule = (title: string, isNotice = false): BoardPost => ({
  number: isNotice ? "공지" : "000",
  title,
  date: "25.10.21",
  isNotice,
  emphasized: isNotice,
});

/** 학사일정 — 이론 과목 / 실습과목 (원본 schedule.html) */
export const schedulePosts: Record<ScheduleTabKey, BoardPost[]> = {
  theory: [
    schedule("[공지] 25년 제 4차 평생교육사 자격증 단체 접수 안내", true),
    schedule("[2025년 2학기 2차] (07/10 개강반) 학사일정 안내", true),
    schedule("[2025년 2학기 1차] (06/19 개강반) 학사일정 안내", true),
    schedule("[2025년 1학기 7차] (06/15 개강반) 학사일정 안내", true),
    schedule("[2025년 1학기 6차] (04/15 개강반) 학사일정 안내"),
    schedule("[2025년 1학기 5차] (03/20 개강반) 학사일정 안내"),
    schedule("[2025년 1학기 4차] (02/15 개강반) 학사일정 안내"),
    schedule("[2025년 1학기 3차] (01/20 개강반) 학사일정 안내"),
    schedule("[2024년 2학기 8차] (12/10 개강반) 학사일정 안내"),
    schedule("[2024년 2학기 7차] (11/15 개강반) 학사일정 안내"),
  ],
  practice: [
    schedule("실습과목 학사일정 안내", true),
    schedule("실습과목 수강신청 안내"),
    schedule("실습과목 진행 일정 안내"),
  ],
};

export const scheduleDetailHref = (index: number) => `/learning-support/schedule/${index}`;

/** 서식자료실 (원본 forms-data-room.html). 원본은 첫 글만 상세 링크가 있다. */
export const formPosts: BoardPost[] = [
  "서식자료실 공지사항입니다.",
  "학습자 등록 서식",
  "학점인정 신청 서식",
  "학위신청 서식 안내",
  "증명서 발급 신청 서식",
  "성적증명서 발급 신청서",
  "재학증명서 발급 신청서",
  "졸업증명서 발급 신청서",
  "휴학 신청서",
  "복학 신청서",
  "학적변동 신청서",
  "학습비 반환 신청서",
].map((title, i) => ({
  number: String(i + 1),
  title,
  date: "25.10.21",
  // 원본은 1~5번 줄을 강조하고 첫 글에만 링크 — 공지 배지가 없는 글이라 강조는 빼고, 모든 제목을 상세로 잇는다
  href: `/learning-support/forms-data-room/${i + 1}`,
}));
