/**
 * 수강후기 화면 도움 함수 — 목록 · 상세가 같이 쓴다.
 * 수강후기 = board_posts.review(회원이 쓴다, 과목 course_id), 위 BEST 줄 = board_posts.scholarship_review(관리자가 쓰는 장학후기, 썸네일).
 */

export const REVIEWS_HREF = "/course-registration/reviews";

/** 상세 주소 — BEST(장학후기)는 /reviews/best/[id] */
export const reviewHref = (postId: number, best = false) => `${REVIEWS_HREF}${best ? "/best" : ""}/${postId}`;

/** 목록 위 BEST 줄로 보이는 장학후기 수 (옛 화면 샘플과 같은 4개) */
export const BEST_COUNT = 4;

/** 제목 앞 [과정명] — 과목이 없는 장학후기의 '수강 과정' 칸 */
export const titleCourse = (title: string) => title.match(/^\[(.+?)\]/)?.[1] ?? "";

/** 제목의 "2025-1학기 … 김지현 학습자" 부분 — 베스트 배너의 학기 · 이름 (없으면 빈 글자) */
export function reviewPerson(title: string) {
  const [, year = "", term = ""] = title.match(/(\d{4})-(\d)학기/) ?? [];
  return {
    semester: year ? `${year}-${term}학기` : "",
    semesterLabel: year ? `${year}년 ${term}학기` : "",
    name: title.match(/(\S+) 학습자/)?.[1] ?? "",
  };
}
