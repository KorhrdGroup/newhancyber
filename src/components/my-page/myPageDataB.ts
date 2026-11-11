/**
 * 마이페이지 2묶음(증명서 발급·성적 이의신청·내 정보 수정·문의 내역) 샘플 데이터.
 * TODO: API 연동 시 이 파일의 값·함수를 서버 조회로 바꾼다. 화면은 여기서 내보내는 타입만 쓴다.
 * 원본 화면은 로그인해야 보여서 사용자화면/pages.tsv U32·U34·U35·U36 기록을 보고 구성했다.
 */

import type { NavLink } from "@/types/navigation";
import {
  getFinishedCourses,
  getOngoingCourses,
  getPayment,
  sampleLearner,
  type Payment,
} from "@/components/my-classroom/classroomData";

export type Tone = "brand" | "success" | "warning" | "danger" | "neutral";

/* ------------------------------------------------------------------ */
/* 화면 안 탭                                                           */
/* ------------------------------------------------------------------ */

export const certificateTabs: NavLink[] = [
  { label: "수강 확인서", href: "/my-page/certificates" },
  { label: "성적 증명서", href: "/my-page/certificates/transcript" },
  { label: "수료증", href: "/my-page/certificates/completion" },
  { label: "교육비 납입 증명서", href: "/my-page/certificates/tuition" },
];

export const appealTabs: NavLink[] = [
  { label: "성적 이의신청", href: "/my-page/appeals" },
  { label: "기타 이의신청", href: "/my-page/appeals/etc" },
];

export const inquiryTabs: NavLink[] = [
  { label: "1:1 문의", href: "/my-page/inquiries" },
  { label: "학습 Q&A", href: "/my-page/inquiries/qna" },
];

/* ------------------------------------------------------------------ */
/* U32 증명서 발급                                                      */
/* ------------------------------------------------------------------ */

export interface CertificateRow {
  id: string;
  term: string;
  title: string;
  period: string;
  status: string;
  tone: Tone;
  /** 출력 팝업 주소. 없으면 아직 발급할 수 없음 */
  printHref?: string;
}

/** 수강 확인서: 지금 듣고 있는 과목 */
export function getEnrollmentRows(): CertificateRow[] {
  // TODO: API 수강 중 과목 조회
  return getOngoingCourses().map((c) => ({
    id: c.id,
    term: c.term,
    title: c.title,
    period: `${c.studyStart} ~ ${c.studyEnd}`,
    status: "수강 중",
    tone: "brand",
    printHref: `/popup/print/enrollment/${c.id}`,
  }));
}

/** 성적 증명서: 성적이 나온 과목만 발급 */
export function getTranscriptRows(): CertificateRow[] {
  // TODO: API 과목별 성적 확정 여부 조회
  const finished = getFinishedCourses().map<CertificateRow>((c) => ({
    id: c.id,
    term: c.term,
    title: c.title,
    period: `${c.studyStart} ~ ${c.studyEnd}`,
    status: c.grade ? `성적 확정 (${c.grade.letter})` : "성적 미확정",
    tone: c.grade ? "success" : "neutral",
    printHref: c.grade ? `/popup/print/transcript/${c.id}` : undefined,
  }));
  const ongoing = getOngoingCourses().map<CertificateRow>((c) => ({
    id: c.id,
    term: c.term,
    title: c.title,
    period: `${c.studyStart} ~ ${c.studyEnd}`,
    status: "성적 미확정",
    tone: "neutral",
  }));
  return [...finished, ...ongoing];
}

/** 수료증: 수료한 과목만 발급 */
export function getCompletionRows(): CertificateRow[] {
  // TODO: API 과목별 수료 여부 조회
  const finished = getFinishedCourses().map<CertificateRow>((c) => ({
    id: c.id,
    term: c.term,
    title: c.title,
    period: `${c.studyStart} ~ ${c.studyEnd}`,
    status: c.grade?.passed ? "수료" : "미수료",
    tone: c.grade?.passed ? "success" : "danger",
    printHref: c.grade?.passed ? `/popup/print/certificate/${c.id}` : undefined,
  }));
  const ongoing = getOngoingCourses().map<CertificateRow>((c) => ({
    id: c.id,
    term: c.term,
    title: c.title,
    period: `${c.studyStart} ~ ${c.studyEnd}`,
    status: "수강 중",
    tone: "brand",
  }));
  return [...finished, ...ongoing];
}

/** 교육비 납입 증명서에 넣을 수 있는 결제 (결제 완료 건만) */
const tuitionPayments: Payment[] = ["p2611001", "p2606001"].map(getPayment).filter((p) => p.status === "결제 완료");

/** 교육비 납입 증명서를 뗄 수 있는 해 */
export const tuitionYears = [...new Set(tuitionPayments.map((p) => (p.paidAt ?? "").slice(0, 4)))].filter(Boolean);

export function getTuitionPaymentList(): Payment[] {
  // TODO: API 결제 완료 내역 조회
  return tuitionPayments;
}

/** 출력 팝업용: id 가 연도(2026)면 그 해 결제 전체, 아니면 결제 한 건 */
export function getTuitionPayments(id: string): { payments: Payment[]; period: string } {
  // TODO: API 교육비 납입 내역 조회
  if (/^\d{4}$/.test(id)) {
    return { payments: tuitionPayments.filter((p) => p.paidAt?.startsWith(id)), period: `${id}.01.01 ~ ${id}.12.31` };
  }
  const payments = tuitionPayments.filter((p) => p.id === id);
  return { payments, period: payments[0]?.paidAt ?? "-" };
}

/* ------------------------------------------------------------------ */
/* U34 성적 이의신청                                                    */
/* ------------------------------------------------------------------ */

export type AppealKind = "grade" | "etc";
export type AppealStatus = "접수" | "검토 중" | "처리 완료";

export const appealStatusTone: Record<AppealStatus, Tone> = {
  접수: "brand",
  "검토 중": "warning",
  "처리 완료": "success",
};

export interface Appeal {
  id: string;
  kind: AppealKind;
  courseTitle: string;
  /** 성적: 평가 항목 / 기타: 신청 구분 */
  item: string;
  appliedAt: string;
  status: AppealStatus;
  reason: string;
  attachment?: string;
  answer?: { answeredAt: string; result: string; body: string };
}

/** 이의신청 기간: 성적 공개일부터 7일 */
export const appealPeriodDays = 7;

export const appealSchedules = [
  { term: "2026년도 1학기 3차", openedAt: "2026.10.05", period: "2026.10.05 ~ 2026.10.11" },
  { term: "2026년도 2학기 4차", openedAt: "2027.03.03 (예정)", period: "2027.03.03 ~ 2027.03.09" },
];

/** 성적 이의신청에서 고를 평가 항목 */
export const gradeAppealItems = ["출석", "중간고사", "기말고사", "과제", "퀴즈", "토론"];

/** 기타 이의신청 구분 */
export const etcAppealItems = ["출석·진도 인정", "수료 판정", "학점 인정", "기타"];

/** 이의신청할 수 있는 과목 (성적이 나온 과목) */
export function getAppealCourses(): { id: string; title: string; term: string }[] {
  // TODO: API 이의신청 가능 과목 조회
  return getFinishedCourses().map((c) => ({ id: c.id, title: c.title, term: c.term }));
}

const appeals: Appeal[] = [
  {
    id: "ap1002",
    kind: "grade",
    courseTitle: "지역사회복지론",
    item: "과제",
    appliedAt: "2026.10.08",
    status: "검토 중",
    reason:
      "과제를 기한 안에 제출했는데 점수가 8점으로 나왔습니다.\n채점 기준에서 어느 부분이 감점되었는지 알고 싶습니다.",
    attachment: "과제_제출화면.png",
  },
  {
    id: "ap1001",
    kind: "grade",
    courseTitle: "사회복지정책론",
    item: "기말고사",
    appliedAt: "2026.10.06",
    status: "처리 완료",
    reason: "기말고사 18번 문항의 정답이 보기 2번과 4번 모두 맞는 것 같습니다. 다시 확인 부탁드립니다.",
    answer: {
      answeredAt: "2026.10.10",
      result: "점수 정정 (기말고사 35점 → 36점)",
      body: "담당 교수님이 18번 문항을 다시 검토한 결과, 보기 4번도 정답으로 인정하기로 했습니다.\n정정된 점수는 성적 조회 화면에 반영되었습니다.",
    },
  },
  {
    id: "ap2001",
    kind: "etc",
    courseTitle: "사회복지정책론",
    item: "출석·진도 인정",
    appliedAt: "2026.09.20",
    status: "처리 완료",
    reason: "7주차 강의를 끝까지 들었는데 진도율이 90%로 표시됩니다. 학습 기록을 확인해 주세요.",
    answer: {
      answeredAt: "2026.09.22",
      result: "출석 인정",
      body: "학습 기록을 확인해 보니 마지막 화면에서 저장이 늦게 된 것이었습니다. 7주차 출석을 인정 처리했습니다.",
    },
  },
  {
    id: "ap2002",
    kind: "etc",
    courseTitle: "지역사회복지론",
    item: "수료 판정",
    appliedAt: "2026.10.07",
    status: "접수",
    reason: "수료 기준을 모두 채웠다고 생각하는데 수료 처리가 늦어지고 있어 문의드립니다.",
  },
];

export function getAppeals(kind: AppealKind): Appeal[] {
  // TODO: API 이의신청 목록 조회
  return appeals.filter((a) => a.kind === kind);
}

export function getAppeal(id: string, kind: AppealKind): Appeal | undefined {
  // TODO: API 이의신청 상세 조회
  return appeals.find((a) => a.id === id && a.kind === kind);
}

/* ------------------------------------------------------------------ */
/* U35 내 정보 수정                                                     */
/* ------------------------------------------------------------------ */

export const sampleMember = {
  userId: "hong1990",
  name: sampleLearner.name,
  birth: sampleLearner.birth,
  phone: ["010", "0000", "0000"] as [string, string, string],
  emailId: "hong",
  emailDomain: "naver.com",
  postalCode: "11690",
  address: "경기도 의정부시 의정부동 486-11",
  addressDetail: "101동 101호",
  education: "high-school",
  smsConsent: true,
  emailConsent: false,
};

export const phonePrefixes = ["010", "011", "016", "017", "018", "019"];
export const emailDomains = ["naver.com", "gmail.com", "daum.net", "hanmail.net", "yahoo.com"];
/** 회원가입(SignupForm)과 같은 목록 */
export const educationLevels = [
  { value: "high-school", label: "고등학교 졸업" },
  { value: "college-2", label: "전문대학 졸업(2년제)" },
  { value: "college-3", label: "전문대학 졸업(3년제)" },
  { value: "university-enrolled", label: "대학교 재학" },
  { value: "university-dropout", label: "대학교 중퇴" },
  { value: "university-4", label: "대학교 졸업(4년제)" },
  { value: "other", label: "기타" },
];

/* ------------------------------------------------------------------ */
/* U36 문의 내역                                                        */
/* ------------------------------------------------------------------ */

export type InquiryKind = "personal" | "qna";
export type InquiryStatus = "답변 대기" | "답변 완료";

export const inquiryStatusTone: Record<InquiryStatus, Tone> = {
  "답변 대기": "warning",
  "답변 완료": "success",
};

export interface Inquiry {
  id: string;
  kind: InquiryKind;
  no: number;
  /** 1:1 문의: 문의 분류 / 학습 Q&A: 과목명 */
  category: string;
  title: string;
  askedAt: string;
  body: string;
  answer?: { answeredAt: string; writer: string; body: string };
}

const inquiries: Inquiry[] = [
  {
    id: "q1003",
    kind: "personal",
    no: 3,
    category: "학습 이용",
    title: "학습자 PC를 새 컴퓨터로 바꾸고 싶어요",
    askedAt: "2026.11.10",
    body: "컴퓨터를 새로 사서 등록된 PC를 바꾸고 싶습니다. 어떻게 하면 되나요?",
  },
  {
    id: "q1002",
    kind: "personal",
    no: 2,
    category: "결제·환불",
    title: "교육비 납입 증명서는 어디서 받나요?",
    askedAt: "2026.11.06",
    body: "연말정산에 쓰려고 하는데 교육비 납입 증명서를 어디서 받을 수 있는지 궁금합니다.",
    answer: {
      answeredAt: "2026.11.07",
      writer: "학습지원센터",
      body: "마이페이지 > 증명서 발급 > 교육비 납입 증명서 탭에서 바로 발급받을 수 있습니다.\n연도별로 한 장에 모아서 뽑을 수도 있어요.",
    },
  },
  {
    id: "q1001",
    kind: "personal",
    no: 1,
    category: "수강 신청",
    title: "수강 신청한 과목을 바꿀 수 있나요?",
    askedAt: "2026.11.03",
    body: "인간행동과사회환경 대신 다른 전공선택 과목을 듣고 싶은데 변경이 가능한가요?",
    answer: {
      answeredAt: "2026.11.04",
      writer: "학습지원센터",
      body: "개강 전에는 과목 변경이 가능합니다. 1661-7769로 전화 주시면 바로 바꿔 드릴게요.\n개강 뒤에는 환불 규정에 따라 처리되니 참고해 주세요.",
    },
  },
  {
    id: "s2002",
    kind: "qna",
    no: 2,
    category: "인간행동과사회환경",
    title: "2주차 강의 자료는 어디서 받나요?",
    askedAt: "2026.11.09",
    body: "2주차 강의에서 말씀하신 참고 자료를 내려받을 곳을 못 찾겠습니다.",
  },
  {
    id: "s2001",
    kind: "qna",
    no: 1,
    category: "사회복지학개론",
    title: "잔여적 복지와 제도적 복지의 차이가 궁금해요",
    askedAt: "2026.11.05",
    body: "1주차 강의에서 나온 잔여적 복지와 제도적 복지를 예를 들어 설명해 주실 수 있을까요?",
    answer: {
      answeredAt: "2026.11.06",
      writer: "김사회 교수",
      body: "잔여적 복지는 가족·시장이 제 역할을 못 할 때만 국가가 돕는 방식이고, 제도적 복지는 복지를 사회의 기본 기능으로 보고 누구나 받을 수 있게 하는 방식입니다.\n기초생활보장은 잔여적, 아동수당은 제도적 성격에 가깝다고 보면 됩니다.",
    },
  },
];

export function getInquiries(kind: InquiryKind): Inquiry[] {
  // TODO: API 문의 목록 조회
  return inquiries.filter((q) => q.kind === kind);
}

export function getInquiry(id: string, kind: InquiryKind): Inquiry | undefined {
  // TODO: API 문의 상세 조회
  return inquiries.find((q) => q.id === id && q.kind === kind);
}

export const inquiryStatus = (q: Inquiry): InquiryStatus => (q.answer ? "답변 완료" : "답변 대기");
