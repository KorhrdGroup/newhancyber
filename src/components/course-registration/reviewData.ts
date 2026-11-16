/**
 * 수강후기 가데이터 (원본 표 그대로) — 목록과 상세가 같이 쓴다.
 * TODO: API 수강후기 목록·상세 조회 (페이지·검색·조회수 포함)
 */

export interface CourseReview {
  id: number;
  title: string;
  writer: string;
  date: string;
  /** 목록 위에 BEST 배지로 고정되는 글 — 상세 주소가 /reviews/best/[id] */
  best?: boolean;
}

export const REVIEWS_HREF = "/course-registration/reviews";

export const courseReviews: CourseReview[] = [
  { id: 1, best: true, title: "[사회복지사] 2025-1학기 성적우수장학생 김지현 학습자 장학후기", writer: "한*생", date: "25.10.21" },
  { id: 2, best: true, title: "[평생교육사] 2024-2학기 성적우수장학생 최현서 학습자 장학후기", writer: "한*생", date: "25.10.21" },
  { id: 3, best: true, title: "[사회복지사] 2024-2학기 성적우수장학생 이설희 학습자 장학후기", writer: "한*생", date: "25.10.21" },
  { id: 4, best: true, title: "[청소년지도사] 2024-2학기 성적우수장학생 맹민영 학습자 장학후기", writer: "한*생", date: "25.10.21" },
  { id: 1, title: "[사회복지사] 2024-1학기 성적우수장학생 박민수 학습자 장학후기", writer: "김*영", date: "25.10.20" },
  { id: 2, title: "[보육교사] 2024-2학기 성적우수장학생 이지은 학습자 장학후기", writer: "최*호", date: "25.10.19" },
  { id: 3, title: "[경영학] 2024-1학기 성적우수장학생 정수진 학습자 장학후기", writer: "박*수", date: "25.10.18" },
  { id: 4, title: "[심리학] 2024-2학기 성적우수장학생 강민지 학습자 장학후기", writer: "이*희", date: "25.10.17" },
  { id: 5, title: "[미용] 2024-1학기 성적우수장학생 윤서연 학습자 장학후기", writer: "장*우", date: "25.10.16" },
  { id: 6, title: "[사회복지사] 2023-2학기 성적우수장학생 황지훈 학습자 장학후기", writer: "오*진", date: "25.10.15" },
  { id: 7, title: "[평생교육사] 2023-1학기 성적우수장학생 송민규 학습자 장학후기", writer: "신*아", date: "25.10.14" },
  { id: 8, title: "[청소년지도사] 2023-2학기 성적우수장학생 임다은 학습자 장학후기", writer: "조*현", date: "25.10.13" },
  { id: 9, title: "[보육교사] 2023-1학기 성적우수장학생 한소희 학습자 장학후기", writer: "배*민", date: "25.10.12" },
  { id: 10, title: "[경영학] 2023-2학기 성적우수장학생 조현우 학습자 장학후기", writer: "윤*서", date: "25.10.11" },
  { id: 11, title: "[심리학] 2023-1학기 성적우수장학생 김태영 학습자 장학후기", writer: "강*지", date: "25.10.10" },
  { id: 12, title: "[미용] 2023-2학기 성적우수장학생 이하늘 학습자 장학후기", writer: "송*규", date: "25.10.09" },
];

export const reviewHref = (review: CourseReview) =>
  `${REVIEWS_HREF}${review.best ? "/best" : ""}/${review.id}`;

/** 제목 앞 [과정명] — 상세의 '수강 과정' 칸 */
export const reviewCourse = (review: CourseReview) => review.title.match(/^\[(.+?)\]/)?.[1] ?? "";

/** 목록에 보이는 순서대로 찾고, 위 줄을 다음글 · 아래 줄을 이전글로 (다른 게시판과 같은 규칙) */
export function findReviewWithSiblings(id: string, best = false) {
  const index = courseReviews.findIndex((r) => String(r.id) === id && !!r.best === best);
  if (index < 0) return undefined;
  const link = (r?: CourseReview) => (r ? { title: r.title, href: reviewHref(r) } : undefined);
  return { review: courseReviews[index], next: link(courseReviews[index - 1]), prev: link(courseReviews[index + 1]) };
}

/** 상세 본문 샘플 (원본 review-detail.html 의 질문·답변 그대로). TODO: API 의 후기 본문 */
export const sampleReviewQna: [question: string, answer: string][] = [
  ["1. 간단한 자기소개 (이름, 하고 있는 일 등)", "안녕하세요, 저는 약 8년간 군복무 후 현재는 전역하여 새로운 미래를 위해 취업준비와 주부로서 육아를 병행하고 있는 변지영입니다."],
  ["2. 해당 과정 수강동기는?", "미래지향적이고 지속 가능한 자격증이며, 연계된 직업군으로 취업 시 일과 육아의 병행이 가능한 분야를 찾아보던 중, 사회복지사 자격증을 알게 되었습니다. 제가 원하는 조건을 충족할 뿐만 아니라 폭넓고 다양한 직업 선택이 가능하다는 점, 그리고 사회에 긍정적인 기여를 할 수 있다는 점에서 수강을 결심하게 되었습니다."],
  ["3. 한평생원격교육원을 선택한 이유는?", "인터넷을 통해 한평생원격교육원을 선택하였고 신뢰도가 높은것같아 선택 하였습니다."],
  ["4. 나만의 학습 노하우가 있다면?", "저는 효율적인 시간관리를 위해 꾸준히 노력했습니다. 틈틈이 시간이 날 때마다 공부했고, 자투리시간에는 교안을 독서하듯 읽으며 학습했습니다. 사회복지사 과정은 특히 심리학과 관련된 내용이 많아 재미있게 공부할 수 있었고, 교양적인 측면에서도 유익한 시간이었습니다."],
  ["5. 다른 학습자들에게 해주고 싶은 조언이 있다면?", "다른 학습자님들도 교육받고 자격증과 학위취득을 동시에 누리세요~ 화이팅입니다~~"],
  ["6. 앞으로의 계획은?", "앞으로 자격증과 학위취득을 하여 취업에 성공하고 싶습니다. 아자아자~~"],
];

/** 원본 상세의 조회수 샘플. TODO: API 조회수 */
export const SAMPLE_REVIEW_VIEWS = "5233";
