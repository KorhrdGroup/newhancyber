/**
 * 실습공지사항 샘플 데이터 (practice-support/notice.html 퍼블리싱 그대로. 상세 본문은 학습지원 공지와 같은 샘플(SampleBody)).
 * TODO: 실습 공지 목록·상세 API 연동 시 서버에서 받아온다 (페이지네이션·검색 포함).
 */

export interface PracticeNotice {
  id: number;
  title: string;
  date: string;
  /** 상단 고정 공지 (번호 대신 "공지" 뱃지) */
  pinned?: boolean;
  /** 일반 글 번호 (가데이터, 최신 글이 큰 번호) */
  number?: number;
}

export const practiceNotices: PracticeNotice[] = [
  { id: 1, title: "사회복지현장실습 기관 찾기", date: "25.10.21", pinned: true },
  { id: 2, title: "사회복지사 자격증 신청 방법", date: "25.10.21", pinned: true },
  { id: 3, title: "2025년 사회복지사 자격관리 지침 및 주요 개정 내용 안내", date: "25.10.21", pinned: true },
  { id: 4, title: "사회복지실습 규정 안내 (실습시간, 선이수과목 등)", date: "25.10.21", pinned: true },
  { id: 5, title: "사회복지실습 진행 절차 안내", date: "25.10.21", pinned: true },
  { id: 6, number: 87, title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습 모집 안내문(서울, 경기, 인천)", date: "25.10.21" },
  { id: 7, number: 86, title: "25년 2학기 3차(09월 03일 개강반) 보육실습 모집 안내문", date: "25.10.21" },
  { id: 8, number: 85, title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습 모집 안내문(지방)", date: "25.10.21" },
  { id: 9, number: 84, title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습 모집 안내문(지방)", date: "25.10.21" },
  { id: 10, number: 83, title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습 모집 안내문(지방)", date: "25.10.21" },
  { id: 11, number: 82, title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습 모집 안내문(서울, 경기, 인천)", date: "25.10.21" },
  { id: 12, number: 81, title: "25년 2학기 3차(09월 03일 개강반) 보육실습 모집 안내문", date: "25.10.21" },
  { id: 13, number: 80, title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습 모집 안내문(지방)", date: "25.10.21" },
  { id: 14, number: 79, title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습 모집 안내문(지방)", date: "25.10.21" },
];
