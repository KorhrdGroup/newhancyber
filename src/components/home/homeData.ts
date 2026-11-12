/**
 * 메인 페이지 표시용 데이터 (index.html 퍼블리싱 샘플 그대로).
 * TODO: 공지사항·학사일정·개강 일정은 API 연동 시 서버에서 받아온다.
 */
import { TBD_HREF } from "@/lib/navigation";

const MAIN_IMG = "/resources/images/main";
const MOBILE_IMG = "/resources/images/mobile";

export interface HeroSlide {
  desktopImage: string;
  mobileImage: string;
  /** 없으면 링크 없는 슬라이드 */
  href?: string;
}

export const heroSlides: HeroSlide[] = [
  {
    desktopImage: `${MAIN_IMG}/hero_banner.png`,
    mobileImage: `${MOBILE_IMG}/mobile-banner.png`,
  },
  {
    desktopImage: `${MAIN_IMG}/hero_banner02.png`,
    mobileImage: `${MOBILE_IMG}/mobile-banner02.png`,
    href: "/social-worker/info",
  },
  {
    desktopImage: `${MAIN_IMG}/hero_banner03.png`,
    mobileImage: `${MOBILE_IMG}/mobile-banner03.png`,
    href: "/event",
  },
];

/** 지금 모집 중인 차수 (실제 사이트 수강신청 화면 2026-11 기준) */
export const currentTerm = {
  name: "2026년도 2학기 4차",
  openingDate: "11월 12일",
  applyPeriod: "2026.10.15 ~ 2026.11.11",
  studyPeriod: "2026.11.12 ~ 2027.02.24",
  /** 수강신청 마감 (모바일 카운트다운) */
  applyDeadline: "2026-11-11T23:59:59+09:00",
};

/** 연락처 (실제 사이트 바닥글과 같은 값) */
export const phones = {
  registration: "1661-7769",
  support: "1661-7768",
};

export interface CourseOpening {
  semester: string;
  /** 없으면 "준비 중" */
  date?: string;
}

/** 모바일 카드 폭이 좁아 연도는 빼고 쓴다 */
export const courseOpenings: CourseOpening[] = [
  { semester: "2학기 4차", date: currentTerm.openingDate },
  { semester: "다음 개강반" },
];

export interface ScheduleItem {
  label: string;
  date: string;
  highlight?: boolean;
}

/** 시험·과제 기간은 나의 강의실 샘플(classroomData)과 같은 값 */
export const learningSchedule = {
  cohort: `${currentTerm.name} (${currentTerm.openingDate} 개강)`,
  items: [
    { label: "개강일", date: "26.11.12 (목)", highlight: true },
    { label: "학습기간", date: "26.11.12 ~ 27.02.24" },
    { label: "중간고사", date: "26.12.21 ~ 26.12.27" },
    { label: "기말고사", date: "27.02.15 ~ 27.02.21" },
    { label: "토론", date: "26.12.14 ~ 26.12.27" },
    { label: "과제", date: "26.11.30 ~ 26.12.13" },
    { label: "퀴즈", date: "26.12.07 ~ 27.01.31" },
  ] satisfies ScheduleItem[],
};

export interface NoticePost {
  id: number;
  title: string;
  date: string;
  isNew?: boolean;
}

export type NoticeTabKey = "notice" | "schedule" | "practice";

export interface NoticeTab {
  key: NoticeTabKey;
  label: string;
  /** 글 상세 주소 앞부분. 원본은 /notice/1 처럼 없는 주소였다 */
  basePath: string;
  posts: NoticePost[];
}

export const noticeTabs: NoticeTab[] = [
  {
    key: "notice",
    label: "공지사항",
    basePath: "/learning-support/notice",
    posts: [
      { id: 1, title: "[2026년 11월] 카드사 무이자 할부 안내", date: "26.10.31", isNew: true },
      { id: 2, title: "[공지] 2026년도 2학기 4차(11월 12일 개강) 학사 안내", date: "26.10.28", isNew: true },
      { id: 3, title: "2026년 4분기 학습자 등록 및 학점 인정 신청 안내", date: "26.10.20" },
      { id: 4, title: "[국가평생교육진흥원] 26-4차 사회복지사 자격증 발급 안내", date: "26.10.15" },
      { id: 5, title: "[2026년 10월] 카드사 무이자 할부 안내", date: "26.10.08" },
      { id: 6, title: "[2026년 9월] 카드사 무이자 할부 안내", date: "26.10.08" },
      { id: 7, title: "[공지] 2026년도 2학기 3차(10월 15일 개강) 학사 안내", date: "26.10.01" },
    ],
  },
  {
    key: "schedule",
    label: "학사일정",
    basePath: "/learning-support/schedule",
    posts: [
      { id: 1, title: "2026년도 2학기 4차 학사일정 안내", date: "26.10.28", isNew: true },
      { id: 2, title: "2026년도 2학기 4차 중간고사 일정 안내", date: "26.10.28" },
      { id: 3, title: "2026년도 2학기 3차 기말고사 일정 안내", date: "26.10.20" },
      { id: 4, title: "2026년도 2학기 3차 학사일정 안내", date: "26.09.30" },
      { id: 5, title: "추석 연휴 학습지원센터 운영 안내", date: "26.09.18" },
      { id: 6, title: "2026년도 2학기 3차 중간고사 일정 안내", date: "26.09.11" },
      { id: 7, title: "2026년도 2학기 2차 기말고사 일정 안내", date: "26.09.04" },
    ],
  },
  {
    key: "practice",
    label: "실습공지",
    basePath: "/practice-support/notice",
    posts: [
      { id: 1, title: "2027년 1학기 사회복지현장실습 신청 안내", date: "26.10.25", isNew: true },
      { id: 2, title: "실습 기관 선정 및 서류 제출 안내", date: "26.10.18" },
      { id: 3, title: "실습 지도교수 배정 안내", date: "26.10.08" },
      { id: 4, title: "실습 보고서 제출 안내", date: "26.09.30" },
      { id: 5, title: "실습 세미나 수업 일정 안내", date: "26.09.22" },
      { id: 6, title: "실습 기관 변경 신청 절차 안내", date: "26.09.15" },
      { id: 7, title: "2026년 2학기 사회복지현장실습 오리엔테이션 안내", date: "26.09.05" },
    ],
  },
];

export interface EssentialCard {
  /** 줄바꿈 위치는 "\n" 으로 표시 */
  label: string;
  alt: string;
  icon: string;
  href: string;
  external?: boolean;
  /** 줄바꿈을 데스크톱에서만 적용 */
  desktopOnlyBreak?: boolean;
}

export const essentialCards: EssentialCard[] = [
  { label: "교육원 소개", alt: "교육원 소개", icon: "check001.png", href: "/footer/about" },
  { label: "장학제도", alt: "장학제도", icon: "check002.png", href: "/footer/about#tab-scholarship" },
  { label: "학점은행", alt: "학점은행", icon: "check003.png", href: "/credit-bank/info" },
  { label: "실습지원센터", alt: "실습지원센터", icon: "check004.png", href: "/practice-support/notice" },
  { label: "자주 하는 질문", alt: "자주 하는 질문", icon: "check005.png", href: "/learning-support/faq" },
  {
    label: "사회복지사 자격증\n신청 가이드",
    alt: "사회복지사 자격증 신청 가이드",
    icon: "check006.png",
    href: "/learning-support/forms-data-room",
    desktopOnlyBreak: true,
  },
  {
    label: "교육부 기관\n인증 확인",
    alt: "교육부 기관 인증 확인",
    icon: "check007.png",
    href: "https://www.cb.or.kr/creditbank/eduOrg/nEduOrg1_1_List.do",
    external: true,
  },
  // 나의 강의실 > 증명서 발급 메뉴가 생기면 그 주소로 바꾼다.
  { label: "증명서 발급", alt: "증명서 발급", icon: "check008.png", href: TBD_HREF },
];

export interface SelectOption {
  value: string;
  label: string;
}

export const interestOptions: SelectOption[] = [
  { value: "social-welfare", label: "사회복지사" },
  { value: "etc", label: "기타" },
];

export const educationOptions: SelectOption[] = [
  { value: "high-school", label: "고등학교 졸업" },
  { value: "college-2", label: "전문대학 졸업(2년제)" },
  { value: "college-3", label: "전문대학 졸업(3년제)" },
  { value: "university-enrolled", label: "대학교 재학" },
  { value: "university-dropout", label: "대학교 중퇴" },
  { value: "university-4", label: "대학교 졸업(4년제)" },
  { value: "other", label: "기타" },
];

export const quickMenuLinks = [
  { label: "원격지원", href: "/learning-support/remote-support" },
  { label: "공지사항", href: "/learning-support/notice" },
  { label: "모바일 학습가이드", href: "/learning-support/mobile-guide", active: true },
  { label: "증명서 발급", href: TBD_HREF },
  { label: "서식 자료실", href: "/learning-support/forms-data-room" },
];

/** 소셜 채널 주소는 추후 전달 예정 (퍼블리싱 가이드) */
export const socialLinks = [
  { label: "블로그", icon: `${MAIN_IMG}/naver-blog.png`, href: TBD_HREF },
  { label: "인스타그램", icon: `${MAIN_IMG}/insta.png`, href: TBD_HREF },
  { label: "유튜브", icon: `${MAIN_IMG}/youtube.png`, href: TBD_HREF },
];

