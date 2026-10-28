/**
 * 실습공지사항 샘플 데이터 (practice-support/notice.html, notice-detail.html 퍼블리싱 그대로).
 * TODO: 실습 공지 목록·상세 API 연동 시 서버에서 받아온다 (페이지네이션·검색 포함).
 */

export interface PracticeNotice {
  id: number;
  title: string;
  date: string;
  /** 상단 고정 공지 (번호 대신 "공지" 뱃지) */
  pinned?: boolean;
}

export const practiceNotices: PracticeNotice[] = [
  { id: 1, title: "사회복지현장실습 기관 찾기", date: "25.10.21", pinned: true },
  { id: 2, title: "사회복지사 자격증 신청 방법", date: "25.10.21", pinned: true },
  { id: 3, title: "2025년 사회복지사 자격관리 지침 및 주요 개정 내용 안내", date: "25.10.21", pinned: true },
  { id: 4, title: "사회복지실습 규정 안내 (실습시간, 선이수과목 등)", date: "25.10.21", pinned: true },
  { id: 5, title: "사회복지실습 진행 절차 안내", date: "25.10.21", pinned: true },
  { id: 6, title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습 모집 안내문(서울, 경기, 인천)", date: "25.10.21" },
  { id: 7, title: "25년 2학기 3차(09월 03일 개강반) 보육실습 모집 안내문", date: "25.10.21" },
  { id: 8, title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습 모집 안내문(지방)", date: "25.10.21" },
  { id: 9, title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습 모집 안내문(지방)", date: "25.10.21" },
  { id: 10, title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습 모집 안내문(지방)", date: "25.10.21" },
  { id: 11, title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습 모집 안내문(서울, 경기, 인천)", date: "25.10.21" },
  { id: 12, title: "25년 2학기 3차(09월 03일 개강반) 보육실습 모집 안내문", date: "25.10.21" },
  { id: 13, title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습 모집 안내문(지방)", date: "25.10.21" },
  { id: 14, title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습 모집 안내문(지방)", date: "25.10.21" },
];

/** 원본 일반 글의 번호 칸 (퍼블리싱 자리표시) */
export const NOTICE_NUMBER_PLACEHOLDER = "000";

export interface AdjacentPost {
  /** 모바일은 제목을 두 줄(title/subtitle)로 나눠 보여준다 */
  title: string;
  subtitle?: string;
  href?: string;
}

export interface PracticeNoticeDetail {
  title: string;
  /** 목록·상세 제목 칸에 들어가는 줄임 제목 */
  shortTitle: string;
  date: string;
  fileName: string;
  summary: string[];
  bannerImage: string;
  mobile: { prev: AdjacentPost; next: AdjacentPost };
  desktop: { prev: AdjacentPost | null; next: AdjacentPost | null };
}

/** 상세 샘플 — 원본은 어떤 글을 열어도 같은 내용이다 */
export const sampleNoticeDetail: PracticeNoticeDetail = {
  title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습 모집 안내문(지방)",
  shortTitle: "26년 1학기 1차(12월 24일 개강반) 사회복지...",
  date: "25.10.21",
  fileName: "파일명.PDF",
  summary: [
    "선 이수과목 확인 후 수강신청 시 성적증명서 반드시 제출",
    "1명(한국어학이, 3명(한국어교육)을 합하여 24학점 이상 이수자",
    "반드시 선 이수과목을 이수한 학습자이어야 수강 가능",
  ],
  bannerImage: "/resources/images/learning-support/exbanner.png",
  mobile: {
    prev: { title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습", subtitle: "모집 안내문(지방)" },
    next: { title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습", subtitle: "모집 안내문(지방)", href: "#" },
  },
  desktop: {
    prev: null,
    next: { title: "[한국어교원] 2024-2학기 성적우수수강생 진로선택 학습자 수기", href: "#" },
  },
};
