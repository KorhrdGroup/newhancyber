/**
 * 마이페이지 1묶음(학습 게시판·쿠폰·설문조사·각종 예외 신청·학습자 PC 등록) 샘플 데이터.
 * 원본 화면(/stdMng/...)은 로그인해야 들어가므로 사용자화면/pages.tsv U28~U33 기록만 보고 구성했다.
 * TODO: API 연동 시 이 파일의 함수들을 서버 조회로 바꾼다. 화면은 여기서 내보내는 타입만 쓴다.
 */

import type { NavLink } from "@/types/navigation";
import { getCourse } from "@/components/my-classroom/classroomData";

/* ------------------------------------------------------------------ */
/* U28 학습 게시판                                                       */
/* ------------------------------------------------------------------ */

export type BoardKind = "notice" | "qna" | "materials";

export const boardListHref: Record<BoardKind, string> = {
  notice: "/my-page/study-board",
  qna: "/my-page/study-board/qna",
  materials: "/my-page/study-board/materials",
};

export const boardLabels: Record<BoardKind, string> = {
  notice: "과목 공지",
  qna: "학습 Q&A",
  materials: "과목 자료실",
};

export type AnswerStatus = "답변 완료" | "답변 대기";

export interface BoardPost {
  id: string;
  kind: BoardKind;
  courseId: string;
  title: string;
  author: string;
  date: string;
  views: number;
  /** 본문 문단 */
  body: string[];
  /** TODO: 첨부파일 다운로드 링크 (지금은 파일 이름만) */
  files?: string[];
  /** 학습 Q&A 답변 */
  answer?: { author: string; date: string; body: string[] };
}

const boardPosts: BoardPost[] = [
  {
    id: "n103",
    kind: "notice",
    courseId: "c101",
    title: "중간고사 응시 기간과 범위 안내",
    author: "김사회 교수",
    date: "2026.11.10",
    views: 128,
    body: [
      "중간고사는 2026년 12월 21일부터 27일까지 온라인으로 치릅니다.",
      "시험 범위는 1주차부터 7주차까지이며, 시험 시간은 50분입니다. 시험 중에는 창을 닫거나 다른 화면으로 옮기지 마세요.",
      "진도율이 기준에 못 미치면 시험에 응시할 수 없으니 미리 강의를 들어 두세요.",
    ],
  },
  {
    id: "n102",
    kind: "notice",
    courseId: "c103",
    title: "현장실습 사전 서류 제출 안내",
    author: "운영팀",
    date: "2026.11.06",
    views: 96,
    body: [
      "현장실습을 시작하기 전에 실습 신청서, 실습 기관 승낙서, 개인정보 동의서를 내야 합니다.",
      "서류는 과목 강의실의 '실습 서류'에서 올릴 수 있습니다. 양식은 과목 자료실에 있습니다.",
    ],
    files: ["현장실습_사전서류_안내.pdf"],
  },
  {
    id: "n101",
    kind: "notice",
    courseId: "c102",
    title: "1주차 강의 열림 안내",
    author: "이행동 교수",
    date: "2026.11.03",
    views: 154,
    body: ["1주차 강의는 11월 12일 0시에 열립니다. 강의계획서를 먼저 읽어 보시면 학습 흐름을 잡는 데 도움이 됩니다."],
  },
  {
    id: "q204",
    kind: "qna",
    courseId: "c101",
    title: "3주차 강의 영상이 중간에 멈춰요",
    author: "홍길동",
    date: "2026.11.09",
    views: 12,
    body: ["3주차 2차시 영상이 10분쯤에서 멈추고 더 넘어가지 않습니다. 다른 브라우저로도 해 봤는데 같습니다."],
    answer: {
      author: "운영팀",
      date: "2026.11.10",
      body: [
        "불편을 드려 죄송합니다. 해당 영상 파일을 다시 올렸으니 새로고침 후 다시 들어 주세요.",
        "같은 문제가 계속되면 학습지원센터(1661-7768)로 연락 주시면 바로 도와드리겠습니다.",
      ],
    },
  },
  {
    id: "q203",
    kind: "qna",
    courseId: "c102",
    title: "과제 분량은 몇 쪽이 적당한가요?",
    author: "홍길동",
    date: "2026.11.08",
    views: 8,
    body: ["사례 분석 보고서 과제의 분량 기준이 따로 있는지 궁금합니다."],
  },
  {
    id: "q202",
    kind: "qna",
    courseId: "c001",
    title: "기말고사 점수 확인은 언제 되나요?",
    author: "홍길동",
    date: "2026.09.25",
    views: 21,
    body: ["기말고사를 마쳤는데 점수는 언제부터 볼 수 있는지 알고 싶습니다."],
    answer: {
      author: "박정책 교수",
      date: "2026.09.26",
      body: ["성적은 학습 기간이 끝나고 강의 평가를 마치면 '종료된 과목'에서 볼 수 있습니다."],
    },
  },
  {
    id: "m302",
    kind: "materials",
    courseId: "c103",
    title: "현장실습 서류 양식 모음",
    author: "운영팀",
    date: "2026.11.05",
    views: 77,
    body: ["실습 신청서, 실습 기관 승낙서, 실습 일지 양식을 한 번에 받을 수 있습니다."],
    files: ["실습신청서.hwp", "실습기관승낙서.hwp", "실습일지.hwp"],
  },
  {
    id: "m301",
    kind: "materials",
    courseId: "c101",
    title: "1~4주차 강의 요약 자료",
    author: "김사회 교수",
    date: "2026.11.04",
    views: 63,
    body: ["1~4주차 강의 내용을 한 장씩 정리한 자료입니다. 복습할 때 참고하세요."],
    files: ["사회복지학개론_1-4주차_요약.pdf"],
  },
];

export function getBoardPosts(kind: BoardKind): BoardPost[] {
  return boardPosts.filter((p) => p.kind === kind);
}

export function getBoardPost(id: string): BoardPost | undefined {
  return boardPosts.find((p) => p.id === id);
}

/** 같은 게시판 안의 이전글(더 오래된 글)·다음글(더 새 글) */
export function getAdjacentPosts(post: BoardPost): { prev?: BoardPost; next?: BoardPost } {
  const list = getBoardPosts(post.kind);
  const i = list.findIndex((p) => p.id === post.id);
  return { prev: list[i + 1], next: list[i - 1] };
}

export const courseTitle = (courseId: string) => getCourse(courseId).title;

/* ------------------------------------------------------------------ */
/* U29 쿠폰 사용내역                                                     */
/* ------------------------------------------------------------------ */

export type CouponStatus = "사용 가능" | "사용 완료" | "기간 만료";

export interface Coupon {
  id: string;
  name: string;
  discount: string;
  validFrom: string;
  validTo: string;
  status: CouponStatus;
  usedAt?: string;
  usedCourse?: string;
}

export const coupons: Coupon[] = [
  { id: "cp05", name: "재학생 학기 등록 할인", discount: "10%", validFrom: "2026.11.01", validTo: "2027.01.31", status: "사용 가능" },
  { id: "cp04", name: "친구 추천 감사 쿠폰", discount: "30,000원", validFrom: "2026.10.15", validTo: "2026.12.31", status: "사용 가능" },
  { id: "cp03", name: "2학기 조기 등록 할인", discount: "20,000원", validFrom: "2026.09.01", validTo: "2026.10.31", status: "사용 완료", usedAt: "2026.10.20", usedCourse: "사회복지학개론" },
  { id: "cp02", name: "첫 수강 환영 쿠폰", discount: "10%", validFrom: "2026.05.01", validTo: "2026.06.30", status: "사용 완료", usedAt: "2026.06.10", usedCourse: "사회복지정책론" },
  { id: "cp01", name: "여름 특별 할인", discount: "15,000원", validFrom: "2026.07.01", validTo: "2026.08.31", status: "기간 만료" },
];

/* ------------------------------------------------------------------ */
/* U30 설문조사                                                          */
/* ------------------------------------------------------------------ */

export const surveyTabs: NavLink[] = [
  { label: "과정 만족도 조사", href: "/my-page/surveys" },
  { label: "수요 조사", href: "/my-page/surveys/demand" },
];

export type SurveyStatus = "참여 전" | "참여 완료" | "기간 전" | "기간 종료";

export interface SatisfactionSurvey {
  courseId: string;
  start: string;
  end: string;
  status: SurveyStatus;
}

/** 과정 만족도 조사 — 참여하면 기존 강의 평가 팝업(/popup/survey/[courseId])이 열린다 */
export const satisfactionSurveys: SatisfactionSurvey[] = [
  { courseId: "c101", start: "2027.02.01", end: "2027.03.03", status: "기간 전" },
  { courseId: "c102", start: "2027.02.01", end: "2027.03.03", status: "기간 전" },
  { courseId: "c103", start: "2027.02.01", end: "2027.03.03", status: "기간 전" },
  { courseId: "c002", start: "2026.09.17", end: "2026.11.30", status: "참여 전" },
  { courseId: "c001", start: "2026.09.17", end: "2026.10.15", status: "참여 완료" },
];

export type DemandQuestion =
  | { id: string; type: "radio" | "checkbox"; text: string; options: string[] }
  | { id: string; type: "textarea"; text: string; placeholder?: string };

export interface DemandSurvey {
  id: string;
  title: string;
  start: string;
  end: string;
  status: "진행 중" | "참여 완료" | "마감";
  intro: string;
  questions: DemandQuestion[];
}

export const demandSurveys: DemandSurvey[] = [
  {
    id: "d2027a",
    title: "2027년 1학기 개설 희망 과목 조사",
    start: "2026.11.01",
    end: "2026.11.30",
    status: "진행 중",
    intro: "다음 학기에 열었으면 하는 과목과 수강 방식을 알려 주세요. 응답은 과목 개설 계획에만 씁니다.",
    questions: [
      { id: "q1", type: "radio", text: "다음 학기에도 수강할 계획이 있나요?", options: ["네, 수강할 예정이에요", "아직 정하지 못했어요", "이번 학기로 마칠 예정이에요"] },
      { id: "q2", type: "checkbox", text: "열렸으면 하는 과목을 모두 골라 주세요.", options: ["사회복지실천기술론", "노인복지론", "아동복지론", "정신건강론", "가족복지론"] },
      { id: "q3", type: "radio", text: "한 학기에 몇 과목을 듣고 싶나요?", options: ["1~2과목", "3~4과목", "5과목 이상"] },
      { id: "q4", type: "textarea", text: "그 밖에 바라는 점이 있으면 적어 주세요. (선택)", placeholder: "예: 주말에 실시간 특강이 있으면 좋겠어요." },
    ],
  },
  {
    id: "d2026b",
    title: "학습 사이트 이용 편의 조사",
    start: "2026.10.01",
    end: "2026.10.31",
    status: "참여 완료",
    intro: "학습 사이트를 쓰면서 불편했던 점을 알려 주세요.",
    questions: [
      { id: "q1", type: "radio", text: "주로 어떤 기기로 공부하나요?", options: ["PC", "휴대폰", "태블릿"] },
      { id: "q2", type: "textarea", text: "불편했던 점을 적어 주세요." },
    ],
  },
  {
    id: "d2026a",
    title: "2026년 2학기 특강 수요 조사",
    start: "2026.07.01",
    end: "2026.07.31",
    status: "마감",
    intro: "2학기 특강 주제를 정하기 위한 조사입니다.",
    questions: [{ id: "q1", type: "checkbox", text: "관심 있는 특강 주제를 골라 주세요.", options: ["자격증 시험 대비", "현장실습 준비", "취업 준비"] }],
  },
];

export function getDemandSurvey(id: string): DemandSurvey | undefined {
  return demandSurveys.find((s) => s.id === id);
}

/* ------------------------------------------------------------------ */
/* U31 각종 예외 신청                                                     */
/* ------------------------------------------------------------------ */

export type ExceptionType = "cert" | "duplicate-pc" | "absence";

export const exceptionLabels: Record<ExceptionType, string> = {
  cert: "공인인증서 예외",
  "duplicate-pc": "중복 PC 등록",
  absence: "공결 및 추가시험",
};

/** 신청 화면 안내·사유 목록. TODO: 안내 문구와 사유는 원본(로그인 후 화면) 확인 뒤 맞춘다 */
export const exceptionGuides: Record<ExceptionType, { guide: string[]; reasons: string[] }> = {
  cert: {
    guide: [
      "시험·과제에 참여하기 전에 공인인증서(공동·금융인증서)로 본인 확인을 합니다.",
      "외국 국적이거나 해외에 머무는 등 인증서를 쓸 수 없는 사정이 있으면 예외를 신청해 주세요.",
      "승인되면 정한 기간 동안 휴대폰 본인 인증으로 대신할 수 있습니다.",
    ],
    reasons: ["외국 국적이라 인증서 발급이 어려움", "해외 체류 중", "장애로 인증서 사용이 어려움", "기타"],
  },
  "duplicate-pc": {
    guide: [
      "부정 수강을 막기 위해 한 PC에서는 학습자 한 명만 수강할 수 있습니다.",
      "가족이 같은 PC로 함께 공부하는 등 다른 학습자와 PC를 같이 써야 하면 신청해 주세요.",
      "승인되면 함께 쓰는 학습자도 이 PC에서 수강할 수 있습니다.",
    ],
    reasons: ["가족과 같은 PC를 씀", "직장 공용 PC를 씀", "기타"],
  },
  absence: {
    guide: [
      "질병·입원, 가족의 경조사, 천재지변 등 어쩔 수 없는 사정으로 출석하거나 시험을 치르지 못했을 때 신청합니다.",
      "사정을 확인할 수 있는 증빙 서류(진단서, 입원 확인서, 가족관계증명서 등)를 꼭 붙여 주세요.",
      "신청은 사유가 생긴 날부터 7일 안에 해 주세요. 처리 결과는 '신청 결과'에서 볼 수 있습니다.",
    ],
    reasons: ["질병·입원", "본인·가족의 경조사", "천재지변·재난", "예비군·민방위 훈련", "기타"],
  },
};

export const absenceKinds = ["공결 신청", "추가시험 신청"];
export const absenceExams = ["중간고사", "기말고사", "퀴즈", "쪽지시험"];

export type ExceptionStatus = "접수" | "처리 중" | "승인" | "반려";

export interface ExceptionRequest {
  id: string;
  type: ExceptionType;
  appliedAt: string;
  status: ExceptionStatus;
  processedAt?: string;
  /** 신청 내용 (항목 | 값) */
  details: { label: string; value: string }[];
  files: string[];
  /** 승인 안내 또는 반려 사유 */
  resultNote?: string;
}

export const exceptionRequests: ExceptionRequest[] = [
  {
    id: "ex2610002",
    type: "duplicate-pc",
    appliedAt: "2026.10.12",
    status: "승인",
    processedAt: "2026.10.14",
    details: [
      { label: "사유", value: "가족과 같은 PC를 씀" },
      { label: "함께 쓰는 학습자", value: "홍길순" },
      { label: "상세 사유", value: "배우자와 같은 집 PC로 함께 공부합니다." },
    ],
    files: ["가족관계증명서.pdf"],
    resultNote: "승인되었습니다. 이제 함께 쓰는 학습자도 등록한 PC에서 수강할 수 있습니다.",
  },
  {
    id: "ex2609003",
    type: "absence",
    appliedAt: "2026.09.24",
    status: "처리 중",
    details: [
      { label: "신청 종류", value: "추가시험 신청" },
      { label: "과목", value: "사회복지정책론" },
      { label: "시험", value: "기말고사" },
      { label: "사유", value: "질병·입원" },
      { label: "상세 사유", value: "시험 기간에 입원해 기말고사를 치르지 못했습니다." },
    ],
    files: ["입원확인서.pdf"],
  },
  {
    id: "ex2609001",
    type: "cert",
    appliedAt: "2026.09.02",
    status: "반려",
    processedAt: "2026.09.04",
    details: [
      { label: "사유", value: "해외 체류 중" },
      { label: "예외 기간", value: "2026.09.05 ~ 2026.09.30" },
      { label: "상세 사유", value: "출장으로 해외에 머물러 인증서를 쓸 수 없습니다." },
    ],
    files: [],
    resultNote: "해외 체류를 확인할 수 있는 서류(출입국 사실 증명서 등)가 없습니다. 서류를 붙여 다시 신청해 주세요.",
  },
];

export function getExceptionRequest(id: string): ExceptionRequest | undefined {
  return exceptionRequests.find((r) => r.id === id);
}

/* ------------------------------------------------------------------ */
/* U33 학습자 PC 등록                                                     */
/* ------------------------------------------------------------------ */

/** 등록할 수 있는 PC 수. 가정한 값 — 원본 화면에서 실제 한도를 확인하지 못했다. TODO: API 설정값으로 바꾼다 */
export const MAX_PCS = 2;

export interface RegisteredPc {
  id: string;
  name: string;
  registeredAt: string;
  lastUsedAt: string;
}

export const registeredPcs: RegisteredPc[] = [
  { id: "pc1", name: "집 데스크톱 (Windows 11 · Chrome)", registeredAt: "2026.06.18", lastUsedAt: "2026.11.10" },
];
