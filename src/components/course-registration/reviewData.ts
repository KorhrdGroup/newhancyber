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

/** 제목의 "2025-1학기 … 김지현 학습자" 부분 — 베스트 배너의 학기 · 이름 */
export function reviewPerson(review: CourseReview) {
  const [, year = "", term = ""] = review.title.match(/(\d{4})-(\d)학기/) ?? [];
  return {
    semester: year ? `${year}-${term}학기` : "",
    semesterLabel: year ? `${year}년 ${term}학기` : "",
    name: review.title.match(/(\S+) 학습자/)?.[1] ?? "",
  };
}

/** 베스트 배너의 사진 · 한 줄 소감 샘플 (원본 그림 속 내용). TODO: API 의 학습자 사진 · 소감 */
export const SAMPLE_BEST_PHOTO = "/resources/images/course-registration/best/photo-sample.webp";
export const SAMPLE_BEST_QUOTE =
  "대면이 어려운 원격강의 특성에도 불구하고 학습자별 밀착 관리 시스템을 통해 학습자가 도움을 청할 때 빠르게 답변해 주신 한평생원격교육원 플래너분들의 존재 덕분에 편안한 마음으로 학습을 진행할 수 있었습니다.";

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

/** 베스트 상세 본문 샘플 (원본 review-detail-best.html 그대로). TODO: API 의 후기 본문 */
export const sampleBestReviewQna: [question: string, answer: string][] = [
  ["1. 간단한 자기소개 (이름, 하고 있는 일 등)", "안녕하세요, 저는 약 8년간 군복무 후 현재는 전역하여 새로운 미래를 위해 취업준비와 주부로서 육아를 병행하고 있는 김지현입니다."],
  ["2. 해당 과정 수강동기는?", "사회복지사 자격증을 선택한 이유는 미래지향적이고 지속가능한 자격증이며, 육아와 병행하여 일할 수 있는 직업이고, 다양한 진로 선택이 가능하며, 사회에 긍정적인 기여를 할 수 있는 기회가 되기 때문입니다."],
  ["3. 한평생원격교육원을 선택한 이유는?", "인터넷을 통해 찾게 되었고, 신뢰도가 높아 보여서 선택하게 되었습니다."],
  ["4. 나만의 학습 노하우가 있다면?", "효율적인 시간 관리로 꾸준한 노력이 중요합니다. 틈나는 시간마다 학습을 하였고, 교안을 책처럼 읽으며 시간을 활용했습니다. 또한 사회복지사 과정의 심리 관련 내용이 흥미롭고 도움이 되었습니다."],
  ["5. 다른 학습자들에게 해주고 싶은 조언이 있다면?", "모든 것을 미리미리 해두시는 것을 추천합니다. 학습을 바로바로 하시고, 뒤로 미루지 마시기 바랍니다. 강의계획서를 활용하여 과제와 토론 주제를 미리 파악하고, 여유 있게 완료하시면 자연스럽게 좋은 결과와 학업성취를 얻으실 수 있습니다."],
  ["6. 앞으로의 계획은?", "사회복지사 2급 자격증 취득을 위한 실습만 남아있습니다. 출산 후 여건이 허락한다면 빠르게 실습을 마치고 2급 자격증을 취득하고자 합니다. 최종 목표는 사회복지사 1급 자격증 취득이며, 이를 위해 학습을 가속화할 계획입니다."],
];

/** 원본 상세의 조회수 샘플. TODO: API 조회수 */
export const SAMPLE_REVIEW_VIEWS = "5233";
