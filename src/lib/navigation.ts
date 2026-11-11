import type { NavGroup, NavLink } from "@/types/navigation";

/** 아직 경로가 정해지지 않은 메뉴(퍼블리싱의 href="#") */
export const TBD_HREF = "#";

/** 데스크톱 상단 유틸리티 바 */
export const utilityLinks: NavLink[] = [
  { label: "전체 학사 일정", href: "/learning-support/schedule" },
  { label: "공지사항", href: "/learning-support/notice" },
  { label: "실습지원센터", href: "/practice-support/notice" },
  { label: "1:1 원격지원", href: "/learning-support/remote-support" },
];

export const authLinks: NavLink[] = [
  { label: "로그인", href: "/member/login" },
  { label: "회원가입", href: "/member/signup" },
];

/** GNB (includes/header.html 기준) */
export const gnb: NavGroup[] = [
  {
    label: "학점은행제",
    href: "/credit-bank/info",
    children: [
      { label: "학점은행제란", href: "/credit-bank/info" },
      { label: "행정절차 가이드", href: "/credit-bank/guide" },
      { label: "FAQ", href: "/credit-bank/faq" },
      { label: "주의사항", href: "/credit-bank/precautions" },
    ],
  },
  {
    label: "사회복지사",
    href: "/social-worker/info",
    children: [
      { label: "사회복지사란?", href: "/social-worker/info" },
      { label: "급수별 자격요건", href: "/social-worker/requirements" },
      { label: "대상별 학습설계", href: "/social-worker/learning-design" },
      { label: "자격증 발급 안내", href: "/social-worker/certificate" },
    ],
  },
  {
    label: "실습지원",
    href: "/practice-support/notice",
    children: [
      { label: "실습공지사항", href: "/practice-support/notice" },
      { label: "서류제출", href: "/practice-support/documents" },
      { label: "FAQ", href: "/practice-support/faq" },
      { label: "사회복지사실습", href: "/practice-support/social-worker-practice" },
      { label: "보육교사실습", href: "/practice-support/childcare-teacher-practice", hidden: true },
      { label: "한국어교원실습", href: "/practice-support/korean-teacher-practice", hidden: true },
      { label: "평생교육사실습", href: "/practice-support/lifelong-educator-practice", hidden: true },
    ],
  },
  {
    label: "학습지원",
    href: "/learning-support/notice",
    children: [
      { label: "공지사항", href: "/learning-support/notice" },
      { label: "학사일정", href: "/learning-support/schedule" },
      { label: "FAQ", href: "/learning-support/faq" },
      { label: "수강지원프로그램", href: "/learning-support/program" },
      { label: "모바일학습가이드", href: "/learning-support/mobile-guide" },
      { label: "원격지원", href: "/learning-support/remote-support" },
      { label: "서식자료실", href: "/learning-support/forms-data-room" },
    ],
  },
  {
    label: "나의강의실",
    href: "/my-classroom",
    children: [
      { label: "진행 중인 과목", href: "/my-classroom" },
      { label: "종료된 과목", href: "/my-classroom/finished" },
    ],
  },
  {
    label: "수강신청",
    href: "/course-registration/register",
    badge: "마감임박",
    children: [
      { label: "수강신청", href: "/course-registration/register" },
      { label: "수강신청 절차", href: "/course-registration/process" },
      { label: "수강후기", href: "/course-registration/reviews", hidden: true },
      { label: "학습비 반환규정", href: "/course-registration/refund" },
      { label: "수강규정", href: "/course-registration/regulations" },
      { label: "무료학습설계", href: "/course-registration/learning-design" },
    ],
  },
];

/** 나의강의실 앞에 구분선이 들어가는 위치 */
export const GNB_SEPARATOR_BEFORE = "나의강의실";

export const footerLinks: NavLink[] = [
  { label: "교육원 소개", href: "/footer/about" },
  { label: "개인정보처리방침", href: "/footer/privacy" },
  { label: "이용약관", href: "/footer/terms" },
  { label: "이메일무단수집거부", href: "/footer/email-refusal" },
  { label: "불편사항 접수", href: "/footer/contact" },
  { label: "사이트맵", href: "/footer/sitemap" },
];

export const isVisible = (link: NavLink) => !link.hidden;

/** 모바일 사이드바 상단 바로가기 (index.html 기준) */
export const mobileQuickLinks: (NavLink & { icon: string })[] = [
  { label: "수강신청", href: "/course-registration/register", icon: "mobile-help.png" },
  { label: "상담문의", href: TBD_HREF, icon: "mobile-chat.png" },
  { label: "내 강의실", href: "/my-classroom", icon: "mobile-user.png" },
];

/** 모바일 사이드바 메뉴. children 이 있으면 펼침 메뉴 */
export const mobileMenu: (NavGroup & { icon: string })[] = [
  { label: "수강신청", href: "/course-registration/register", icon: "ham-menu-01.png" },
  { label: "장바구니", href: "/course-registration/cart", icon: "ham-menu-02.png" },
  { label: "결제내역", href: "/course-registration/payment-history", icon: "ham-menu-03.png" },
  { label: "사회복지사", href: "/social-worker/info", icon: "ham-menu-04.png" },
  {
    label: "학습지원",
    href: "/learning-support/notice",
    icon: "ham-menu-05.png",
    children: [
      { label: "공지사항", href: "/learning-support/notice" },
      { label: "학사일정", href: "/learning-support/schedule" },
    ],
  },
  {
    label: "교육원 소개",
    href: "/footer/about",
    icon: "ham-menu-06.png",
    children: [{ label: "한평생원격교육원 소개", href: "/footer/about" }],
  },
];

const matches = (pathname: string, paths: string[]) =>
  paths.some((path) => (path.endsWith("/*") ? pathname.startsWith(path.slice(0, -1)) : pathname === path));

/** 모바일 헤더 아래 "회원가입·수강신청·나의 강의실" 줄이 있는 페이지 (원본 기준) */
const MOBILE_NAV_PATHS = ["/", "/footer/email-refusal", "/footer/contact", "/footer/terms", "/footer/sitemap", "/footer/privacy"];
export const hasMobileNav = (pathname: string) => matches(pathname, MOBILE_NAV_PATHS);

/** 공통 모바일 푸터가 붙는 페이지 (원본 기준). 메인은 본문 안에 따로 있다. */
const MOBILE_FOOTER_PATHS = [
  "/member/*",
  "/course-registration/cart",
  "/course-registration/payment-history",
  "/course-registration/register",
  "/footer/about",
  "/event",
  "/learning-support/notice",
  "/learning-support/notice/*",
  "/learning-support/schedule",
  "/learning-support/schedule/*",
  "/practice-support/notice/*",
  "/social-worker/info",
];
export const hasMobileFooter = (pathname: string) => matches(pathname, MOBILE_FOOTER_PATHS);
