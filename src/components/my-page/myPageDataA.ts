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
  notice: "학습 공지사항",
  qna: "학습 Q&A",
  materials: "학습 자료실",
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
export const courseTerm = (courseId: string) => getCourse(courseId).term;

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

/* 신청서 선택지 — 원본 /stdMng/exception.asp · absentApply.asp 와 같은 값 */
export const exceptionYears = ["2026년", "2027년"];
export const exceptionHalves = ["1학기", "2학기"];
/** 기수 목록. TODO: API 연도·학기에 맞는 기수 조회 (원본은 연도·학기를 고르면 채운다) */
export const exceptionRounds = ["1차", "2차", "3차", "4차"];
export const absenceKinds = ["공결", "추가시험"];
export const absenceReasons = [
  "배우자, 본인 또는 배우자의 직계가족의 사망",
  "병역법 등 관계 법령에 의한 동원 소집된 사람",
  "본인의 결혼 또는 질병 등으로 입원한 사람",
  "천재지변으로 인한 사고",
];
export const absenceProofs = ["입원확인서", "청첩장 또는 혼인신고서", "사망진단서", "동원훈련소집증", "기타"];
export const EXCEPTION_FILE_NOTE = "(첨부파일 최대 용량 : 10MB / 확장자 : doc, pdf, hwp, ppt, xls, txt, jpg, png, gif)";

export type ExceptionStatus = "접수" | "처리 중" | "승인" | "반려";

export interface ExceptionRequest {
  id: string;
  type: ExceptionType;
  /** 신청 기간 */
  period: string;
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
    period: "2026.10.13 ~ 2026.12.31",
    appliedAt: "2026.10.12",
    status: "승인",
    processedAt: "2026.10.14",
    details: [
      { label: "학기 구분", value: "2026년 2학기 4차" },
      { label: "신청 과목", value: "사회복지학개론, 인간행동과사회환경" },
      { label: "예외 사유", value: "배우자와 같은 집 PC로 함께 공부합니다." },
    ],
    files: ["가족관계증명서.pdf"],
    resultNote: "승인되었습니다. 이제 함께 쓰는 학습자도 등록한 PC에서 수강할 수 있습니다.",
  },
  {
    id: "ex2609003",
    type: "absence",
    period: "2026.09.21 ~ 2026.09.23",
    appliedAt: "2026.09.24",
    status: "처리 중",
    details: [
      { label: "신청 종류", value: "공결" },
      { label: "학기 구분", value: "2026년 2학기 4차" },
      { label: "신청 과목", value: "사회복지학개론" },
      { label: "공결 사유", value: "본인의 결혼 또는 질병 등으로 입원한 사람" },
      { label: "신청 주차", value: "4주차" },
    ],
    files: ["입원확인서.pdf"],
  },
  {
    id: "ex2609001",
    type: "cert",
    period: "2026.09.05 ~ 2026.09.30",
    appliedAt: "2026.09.02",
    status: "반려",
    processedAt: "2026.09.04",
    details: [
      { label: "학기 구분", value: "2026년 2학기 4차" },
      { label: "신청 과목", value: "사회복지학개론" },
      { label: "예외 사유", value: "출장으로 해외에 머물러 인증서를 쓸 수 없습니다." },
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
