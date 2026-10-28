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

export interface CourseOpening {
  semester: string;
  date: string;
}

export const courseOpenings: CourseOpening[] = [
  { semester: "2026년도 1학기", date: "3월 2일" },
  { semester: "2026년도 1학기", date: "4월 17일" },
];

export interface ScheduleItem {
  /** 글자 사이 간격까지 원본 그대로 (nbsp 포함) */
  label: string;
  date: string;
  highlight?: boolean;
}

const sp = (chars: string, gap: number) => chars.split("").join(" ".repeat(gap));

export const learningSchedule = {
  cohort: "2025년 2학기 6차 개강반",
  items: [
    { label: sp("개강일", 3), date: "25.10.17 (금)", highlight: true },
    { label: sp("학습기간", 1), date: "25.10.17 ~ 26.01.29" },
    { label: sp("중간고사", 1), date: "25.10.17 ~ 26.01.29" },
    { label: sp("기말고사", 1), date: "25.10.17 ~ 26.01.29" },
    { label: sp("토론", 9), date: "25.10.17 ~ 26.01.29" },
    { label: sp("과제", 9), date: "25.10.17 ~ 26.01.29" },
    { label: sp("퀴즈", 9), date: "25.10.17 ~ 26.01.29" },
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
      { id: 1, title: "2025년 10월 4분기 학습자 등록 및 학점 인정 신청", date: "25.10.28" },
      { id: 2, title: "[2025년 10월] 카드사별 무이자 안내", date: "25.10.22" },
      { id: 3, title: "[국가평생교육진흥원] 25-4차 평생교육사 자격증 발급 안내사항전달", date: "25.10.19", isNew: true },
      { id: 4, title: "[공지] 2025년도 2학기 7기수(2025년 11월 13일 개강반 모집 안내)", date: "25.10.17", isNew: true },
      { id: 5, title: "[공지] 2024년도 2학기 6기수(2025년 10월 2일 개강) 학사", date: "25.10.13" },
      { id: 6, title: "[2025년 9월] 카드사별 무이자 안내", date: "25.10.03" },
      { id: 7, title: "[공지] 2025년도 2학기 7기수(2025년 11월 13일 개강반 모집 안내)", date: "25.10.01" },
    ],
  },
  {
    key: "schedule",
    label: "학사일정",
    basePath: "/learning-support/schedule",
    posts: [
      { id: 1, title: "2025년 2학기 학사일정 안내", date: "25.10.15" },
      { id: 2, title: "중간고사 일정 변경 안내", date: "25.10.10" },
      { id: 3, title: "기말고사 일정 공지", date: "25.10.05" },
      { id: 4, title: "2025년 1학기 학사일정", date: "25.09.28" },
      { id: 5, title: "방학 일정 안내", date: "25.09.20" },
    ],
  },
  {
    key: "practice",
    label: "실습공지",
    basePath: "/practice-support/notice",
    posts: [
      { id: 1, title: "2025년 2학기 실습 일정 안내", date: "25.10.20" },
      { id: 2, title: "실습 신청 기간 안내", date: "25.10.12" },
      { id: 3, title: "실습 지도교수 배정 안내", date: "25.10.08" },
      { id: 4, title: "실습 보고서 제출 안내", date: "25.10.01" },
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

export { CONTACT_PHONE } from "@/components/layout/MobileFooter";
