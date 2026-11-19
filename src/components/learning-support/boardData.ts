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
  /** 제목 앞 작은 분류 배지 (예: 공지사항 구분 "교육원", 학사일정 "사회복지현장실습") */
  tag?: string;
  /** 번호 대신 보일 배지 글자 (예: 수강후기 "BEST"). isNotice 면 "공지" */
  badge?: string;
  /** 더 붙는 칸의 값 (BoardTable columns 의 key 로 찾음) */
  cells?: Record<string, React.ReactNode>;
  /** 모바일 목록에서 제목 아래 한 줄 (과목·답변 상태 등) */
  meta?: React.ReactNode;
}

/** 공지사항 구분 (운영 사이트 공지사항의 구분 선택과 같음) */
export const NOTICE_CATEGORIES = ["교육원", "자격증", "학점은행제"] as const;

/** 공지사항 — 운영 사이트(hancyber.co.kr) 공지사항 글 그대로. 데스크톱 표와 모바일 목록이 같이 쓴다 */
export const noticePosts: BoardPost[] = [
  { tag: "교육원", title: "[2026년 11월] 카드사 무이자 할부 안내", date: "26.10.31" },
  { tag: "교육원", title: "[2026년 10월] 카드사 무이자 할부 안내", date: "26.10.08" },
  { tag: "교육원", title: "[2026년 9월] 카드사 무이자 할부 안내", date: "26.10.08" },
  { tag: "교육원", title: "[2026년 8월] 카드사 무이자 할부 안내", date: "26.10.08" },
  { tag: "교육원", title: "[2026년 7월] 카드사 무이자 할부 안내", date: "26.10.08" },
].map((p, index, list) => ({ ...p, number: String(list.length - index), href: `/learning-support/notice/${index}` }));

/**
 * 학사일정 — 운영 사이트(hancyber.co.kr) 학사일정 글 그대로. 이론/실습을 나누지 않고 한 목록에 두고,
 * 실습 글은 운영 사이트 제목 말머리 [사회복지현장실습] 대신 tag 배지로 보인다
 */
export const schedulePosts: BoardPost[] = [
  { tag: "사회복지현장실습", title: "2026년 11월 26일 개강반(27년 1-1차) 학사일정 안내", date: "26.11.09" },
  { title: "2026년 11월 26일 개강반(27년 1-1차) 학사일정 안내", date: "26.11.09" },
  { tag: "사회복지현장실습", title: "2026년 11월 12일 개강반(26년 2-4차) 학사일정 안내", date: "26.11.09" },
  { title: "2026년 11월 12일 개강반(26년 2-4차) 학사일정 안내", date: "26.10.31" },
  { title: "2026년 10월 15일 개강반(26년 2-3차) 학사일정 안내", date: "26.10.12" },
  { title: "2026년 09월 10일 개강반(26년 2-2차) 학사일정 안내", date: "26.10.08" },
].map((p, index, list) => ({ ...p, number: String(list.length - index), href: `/learning-support/schedule/${index}` }));

export const FORM_TOTAL = 58;

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
  number: String(FORM_TOTAL - i),
  title,
  date: "25.10.21",
  // 원본은 1~5번 줄을 강조하고 첫 글에만 링크 — 공지 배지가 없는 글이라 강조는 빼고, 모든 제목을 상세로 잇는다
  href: `/learning-support/forms-data-room/${i + 1}`,
}));

/**
 * 목록에서 상세 주소(href)가 같은 글과 앞뒤 글을 찾는다.
 * 목록이 최신 글부터라서 앞 칸이 다음글, 뒤 칸이 이전글이다.
 * TODO: API — 글 상세 조회가 이전글/다음글을 함께 돌려주면 이 함수는 없앤다.
 */
export function findPostWithSiblings(lists: BoardPost[][], href: string) {
  for (const posts of lists) {
    const index = posts.findIndex((p) => p.href === href);
    if (index < 0) continue;
    const link = (p?: BoardPost) => (p?.href ? { title: p.title, href: p.href } : undefined);
    return { post: posts[index], next: link(posts[index - 1]), prev: link(posts[index + 1]) };
  }
  return undefined;
}
