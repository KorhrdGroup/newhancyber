/**
 * 나의 강의실·학습 팝업·결제 문서 샘플 데이터.
 * TODO: API 연동 시 이 파일의 함수들을 서버 조회로 바꾼다. 화면은 여기서 내보내는 타입만 쓴다.
 * 구성은 기존 사이트(hancyber.co.kr) 데모 계정 확인 기록(사용자화면/pages.tsv U37·U38·U27·U32)을 따른다.
 */

export type CourseCategory = "전공필수" | "전공선택" | "교양" | "실습";

export interface Course {
  id: string;
  /** 차수 — 예: 2026년도 2학기 4차 */
  term: string;
  title: string;
  classNo: string;
  category: CourseCategory;
  credit: number;
  instructor: string;
  studyStart: string;
  studyEnd: string;
  /** 복습 가능 기간 끝 (종료된 과목) */
  reviewEnd?: string;
  /** 진도율 0~100 */
  progress: number;
  creditRecognition: string;
  degreeTiming: string;
  isPractice?: boolean;
  /** 실습 과목: 사전 서류를 모두 냈는지 */
  practiceDocsDone?: boolean;
  /** 종료된 과목: 성적 */
  grade?: GradeResult;
}

export type LessonStatus = "완료" | "학습 중" | "미학습" | "예정";

export interface Lesson {
  id: string;
  week: number;
  order: number;
  title: string;
  minutes: number;
  status: LessonStatus;
  /** 학습한 시간(분) */
  studied: number;
  openDate: string;
}

export type AttendanceMark = "출석" | "결석" | "지각" | "미진행";

export type AssessmentType = "midterm" | "final" | "assignment" | "quiz" | "note" | "discussion" | "activity";

export const assessmentLabels: Record<AssessmentType, string> = {
  midterm: "중간고사",
  final: "기말고사",
  assignment: "과제",
  quiz: "퀴즈",
  note: "쪽지시험",
  discussion: "토론",
  activity: "학습심화활동",
};

export type AssessmentStatus = "참여 전" | "참여 완료" | "기간 전" | "기간 종료";

export interface Assessment {
  id: string;
  type: AssessmentType;
  round: number;
  title: string;
  start: string;
  end: string;
  status: AssessmentStatus;
  score?: number;
  maxScore: number;
}

export interface GradeItem {
  label: string;
  weight: number;
  score: number;
}

export interface GradeResult {
  total: number;
  letter: string;
  items: GradeItem[];
  /** 수료 여부 */
  passed: boolean;
}

export interface ExamQuestion {
  no: number;
  text: string;
  options: string[];
}

export interface PracticeDoc {
  id: string;
  name: string;
  description: string;
  status: "제출 완료" | "미제출" | "반려";
  submittedAt?: string;
  note?: string;
}

export interface SyllabusWeek {
  week: number;
  topic: string;
  lessons: string[];
}

export interface Syllabus {
  overview: { label: string; value: string }[];
  intro: string;
  goals: string[];
  periods: { label: string; value: string }[];
  criteria: { label: string; weight: number; note: string }[];
  weeks: SyllabusWeek[];
  instructor: { name: string; career: string[] };
}

export type PaymentStatus = "결제 완료" | "입금 대기" | "환불 신청" | "환불 완료";

export interface Payment {
  id: string;
  title: string;
  courses: { title: string; price: number }[];
  method: string;
  account?: string;
  depositor?: string;
  total: number;
  coupon: number;
  paid: number;
  appliedAt: string;
  paidAt?: string;
  status: PaymentStatus;
}

export interface Learner {
  name: string;
  birth: string;
  learnerNo: string;
  phone: string;
}

/* ------------------------------------------------------------------ */
/* 샘플 값                                                              */
/* ------------------------------------------------------------------ */

export const institution = {
  name: "한평생원격교육원",
  representative: "양병웅",
  address: "경기도 의정부시 의정부동 486-11, 601호 일부",
  // 사이트 바닥글(hancyber.co.kr)과 같은 값
  businessNo: "227-88-03196",
  phone: "1661-7769",
};

export const sampleLearner: Learner = {
  name: "홍길동",
  birth: "1990. 01. 01",
  learnerNo: "26000001",
  phone: "010-0000-0000",
};

const TERM = "2026년도 2학기 4차";

const ongoingCourses: Course[] = [
  {
    id: "c101",
    term: TERM,
    title: "사회복지학개론",
    classNo: "1반",
    category: "전공필수",
    credit: 3,
    instructor: "김사회",
    studyStart: "2026.11.12",
    studyEnd: "2027.02.24",
    progress: 40,
    creditRecognition: "2027년 4월 학점 인정 신청",
    degreeTiming: "2027년 8월 학위 취득 가능",
  },
  {
    id: "c102",
    term: TERM,
    title: "인간행동과사회환경",
    classNo: "2반",
    category: "전공필수",
    credit: 3,
    instructor: "이행동",
    studyStart: "2026.11.12",
    studyEnd: "2027.02.24",
    progress: 13,
    creditRecognition: "2027년 4월 학점 인정 신청",
    degreeTiming: "2027년 8월 학위 취득 가능",
  },
  {
    id: "c103",
    term: TERM,
    title: "사회복지현장실습",
    classNo: "1반",
    category: "실습",
    credit: 3,
    instructor: "박실습",
    studyStart: "2026.11.12",
    studyEnd: "2027.02.24",
    progress: 0,
    creditRecognition: "2027년 4월 학점 인정 신청",
    degreeTiming: "2027년 8월 학위 취득 가능",
    isPractice: true,
    practiceDocsDone: false,
  },
];

const finishedCourses: Course[] = [
  {
    id: "c001",
    term: "2026년도 1학기 3차",
    title: "사회복지정책론",
    classNo: "1반",
    category: "전공필수",
    credit: 3,
    instructor: "최정책",
    studyStart: "2026.06.18",
    studyEnd: "2026.09.30",
    reviewEnd: "2027.03.31",
    progress: 100,
    creditRecognition: "2026년 10월 학점 인정 신청",
    degreeTiming: "2027년 2월 학위 취득 가능",
    grade: {
      total: 92,
      letter: "A",
      passed: true,
      items: [
        { label: "출석", weight: 20, score: 20 },
        { label: "중간고사", weight: 30, score: 27 },
        { label: "기말고사", weight: 40, score: 36 },
        { label: "과제", weight: 10, score: 9 },
      ],
    },
  },
  {
    id: "c002",
    term: "2026년도 1학기 3차",
    title: "지역사회복지론",
    classNo: "3반",
    category: "전공선택",
    credit: 3,
    instructor: "정지역",
    studyStart: "2026.06.18",
    studyEnd: "2026.09.30",
    reviewEnd: "2027.03.31",
    progress: 100,
    creditRecognition: "2026년 10월 학점 인정 신청",
    degreeTiming: "2027년 2월 학위 취득 가능",
    grade: {
      total: 84,
      letter: "B+",
      passed: true,
      items: [
        { label: "출석", weight: 20, score: 18 },
        { label: "중간고사", weight: 30, score: 25 },
        { label: "기말고사", weight: 40, score: 33 },
        { label: "과제", weight: 10, score: 8 },
      ],
    },
  },
];

const WEEK_TOPICS = [
  "과목 안내와 기본 개념",
  "역사적 흐름",
  "주요 이론 (1)",
  "주요 이론 (2)",
  "제도와 정책",
  "대상별 접근 (1)",
  "대상별 접근 (2)",
  "중간 정리",
  "실천 방법",
  "현장 사례 (1)",
  "현장 사례 (2)",
  "전달 체계",
  "최근 쟁점",
  "앞으로의 과제",
  "기말 정리",
];

/** 주차별 차시 — 진도율에 맞춰 상태를 정한다 */
function buildLessons(course: Course): Lesson[] {
  const doneWeeks = Math.floor((course.progress / 100) * 15);
  const lessons: Lesson[] = [];
  WEEK_TOPICS.forEach((topic, i) => {
    const week = i + 1;
    for (let order = 1; order <= 2; order++) {
      let status: LessonStatus = "예정";
      if (week <= doneWeeks) status = "완료";
      else if (week === doneWeeks + 1) status = order === 1 ? "학습 중" : "미학습";
      else if (week === doneWeeks + 2) status = "미학습";
      lessons.push({
        id: `${course.id}-w${week}-${order}`,
        week,
        order,
        title: `${topic} ${order === 1 ? "— 개념" : "— 적용"}`,
        minutes: 25,
        status,
        studied: status === "완료" ? 25 : status === "학습 중" ? 12 : 0,
        openDate: `${week}주차`,
      });
    }
  });
  return lessons;
}

function buildAttendance(course: Course): AttendanceMark[] {
  const doneWeeks = Math.floor((course.progress / 100) * 15);
  return Array.from({ length: 15 }, (_, i) => (i < doneWeeks ? (i === 2 && course.id === "c102" ? "결석" : "출석") : "미진행"));
}

function buildAssessments(course: Course): Assessment[] {
  const finished = !!course.grade;
  const status = (open: boolean): AssessmentStatus => (finished ? "기간 종료" : open ? "참여 전" : "기간 전");
  return [
    { id: `${course.id}-mid`, type: "midterm", round: 1, title: "중간고사", start: "2026.12.21", end: "2026.12.27", status: status(false), maxScore: 30, score: finished ? course.grade?.items[1].score : undefined },
    { id: `${course.id}-fin`, type: "final", round: 1, title: "기말고사", start: "2027.02.15", end: "2027.02.21", status: status(false), maxScore: 40, score: finished ? course.grade?.items[2].score : undefined },
    { id: `${course.id}-as1`, type: "assignment", round: 1, title: "사례 분석 보고서", start: "2026.11.30", end: "2026.12.13", status: status(true), maxScore: 10 },
    { id: `${course.id}-qz1`, type: "quiz", round: 1, title: "1~4주차 확인 퀴즈", start: "2026.12.07", end: "2026.12.13", status: status(true), maxScore: 5 },
    { id: `${course.id}-qz2`, type: "quiz", round: 2, title: "9~12주차 확인 퀴즈", start: "2027.01.25", end: "2027.01.31", status: status(false), maxScore: 5 },
    { id: `${course.id}-nt1`, type: "note", round: 1, title: "용어 쪽지시험", start: "2026.12.01", end: "2026.12.07", status: finished ? "기간 종료" : "참여 완료", score: 9, maxScore: 10 },
    { id: `${course.id}-ds1`, type: "discussion", round: 1, title: "우리 동네 복지 자원 나누기", start: "2026.12.14", end: "2026.12.27", status: status(false), maxScore: 5 },
    { id: `${course.id}-ac1`, type: "activity", round: 1, title: "현장 기사 읽고 생각 쓰기", start: "2027.01.04", end: "2027.01.17", status: status(false), maxScore: 5 },
  ];
}

export function getOngoingCourses(): Course[] {
  return ongoingCourses;
}

export function getFinishedCourses(): Course[] {
  return finishedCourses;
}

export function getCourse(id: string): Course {
  return [...ongoingCourses, ...finishedCourses].find((c) => c.id === id) ?? ongoingCourses[0];
}

export function getLessons(courseId: string): Lesson[] {
  return buildLessons(getCourse(courseId));
}

export function getLesson(courseId: string, lessonId: string): Lesson {
  const lessons = getLessons(courseId);
  return lessons.find((l) => l.id === lessonId) ?? lessons[0];
}

export function getAttendance(courseId: string): AttendanceMark[] {
  return buildAttendance(getCourse(courseId));
}

export function getAssessments(courseId: string): Assessment[] {
  return buildAssessments(getCourse(courseId));
}

export const examRules = {
  minutes: 60,
  questions: 25,
  notices: [
    "시험은 한 번만 응시할 수 있고, 시작하면 중간에 멈출 수 없습니다.",
    "제한 시간 60분이 지나면 답안이 자동으로 제출됩니다.",
    "응시 중 창을 닫거나 새로고침하면 그때까지 고른 답만 저장됩니다.",
    "다른 창을 열거나 자료를 찾아보는 행위는 부정행위로 처리될 수 있습니다.",
    "인터넷 연결이 불안정하면 응시 전에 1:1 원격지원(1661-7768)을 요청하세요.",
  ],
};

export const sampleExamQuestions: ExamQuestion[] = [
  { no: 1, text: "사회복지의 기본 가치로 보기 어려운 것은?", options: ["인간 존엄성", "자기결정권", "사회 정의", "효율 우선주의"] },
  { no: 2, text: "잔여적 관점에 대한 설명으로 옳은 것은?", options: ["보편적 서비스를 강조한다", "가족·시장이 제 역할을 못할 때 개입한다", "예방을 가장 중시한다", "모든 국민을 대상으로 한다"] },
  { no: 3, text: "우리나라 사회보험에 해당하지 않는 것은?", options: ["국민연금", "고용보험", "기초생활보장", "산재보험"] },
  { no: 4, text: "사례관리의 과정 순서로 옳은 것은?", options: ["사정 → 계획 → 개입 → 평가", "계획 → 사정 → 평가 → 개입", "개입 → 사정 → 계획 → 평가", "평가 → 계획 → 사정 → 개입"] },
];

export const surveyQuestions = [
  "강의 내용이 과목 목표에 맞게 짜여 있었다.",
  "강의 시간과 분량이 적절했다.",
  "교강사의 설명이 이해하기 쉬웠다.",
  "평가(시험·과제)가 강의 내용과 잘 맞았다.",
  "학습 사이트를 쓰는 데 불편함이 없었다.",
];

export const surveyScale = ["매우 그렇다", "그렇다", "보통", "그렇지 않다", "전혀 그렇지 않다"];

export const practiceDocs: PracticeDoc[] = [
  { id: "basic", name: "기본정보", description: "실습생 인적사항과 희망 실습 지역", status: "제출 완료", submittedAt: "2026.11.13" },
  { id: "transcript", name: "성적증명서", description: "사회복지 필수 과목 이수가 보이는 성적증명서", status: "제출 완료", submittedAt: "2026.11.13" },
  { id: "privacy", name: "개인정보활용동의서", description: "실습기관 배정을 위한 개인정보 제공 동의", status: "반려", submittedAt: "2026.11.13", note: "서명이 빠졌어요. 서명한 뒤 다시 올려 주세요." },
  { id: "profile", name: "실습생 프로파일", description: "자기소개와 실습 목표", status: "미제출" },
  { id: "schedule", name: "실습일정표", description: "실습 기간과 요일별 시간", status: "미제출" },
  { id: "agency", name: "실습기관현황서", description: "실습기관 정보와 실습지도자 자격", status: "미제출" },
];

export function getSyllabus(courseId: string): Syllabus {
  const course = getCourse(courseId);
  return {
    overview: [
      { label: "과목명", value: course.title },
      { label: "이수 구분", value: course.category },
      { label: "학점", value: `${course.credit}학점` },
      { label: "차수", value: course.term },
      { label: "수강 기간", value: `${course.studyStart} ~ ${course.studyEnd}` },
      { label: "교강사", value: course.instructor },
    ],
    intro: `${course.title}의 기본 개념과 이론을 익히고, 현장에서 어떻게 쓰이는지 사례로 살펴봅니다. 주차마다 25분짜리 강의 2개로 구성됩니다.`,
    goals: ["과목의 핵심 개념과 이론을 설명할 수 있다.", "제도와 정책의 흐름을 이해한다.", "현장 사례에 배운 내용을 적용할 수 있다."],
    periods: [
      { label: "중간고사", value: "2026.12.21 ~ 2026.12.27" },
      { label: "기말고사", value: "2027.02.15 ~ 2027.02.21" },
      { label: "성적 이의신청", value: "2027.02.26 ~ 2027.03.02" },
    ],
    criteria: [
      { label: "출석", weight: 20, note: "주차별 강의를 기간 안에 모두 들으면 출석" },
      { label: "중간고사", weight: 30, note: "객관식 25문항, 60분" },
      { label: "기말고사", weight: 40, note: "객관식 25문항, 60분" },
      { label: "과제", weight: 10, note: "사례 분석 보고서 1회" },
    ],
    weeks: WEEK_TOPICS.map((topic, i) => ({ week: i + 1, topic, lessons: [`${topic} — 개념`, `${topic} — 적용`] })),
    instructor: { name: course.instructor, career: ["사회복지학 박사", "현) 사회복지 현장 슈퍼바이저", "전) 대학 사회복지학과 강사"] },
  };
}

const payments: Payment[] = [
  {
    id: "p2611001",
    title: "2026년도 2학기 4차 수강료",
    courses: [
      { title: "사회복지학개론", price: 280000 },
      { title: "인간행동과사회환경", price: 280000 },
      { title: "사회복지현장실습", price: 380000 },
    ],
    method: "신용카드 (일시불)",
    total: 940000,
    coupon: 50000,
    paid: 890000,
    appliedAt: "2026.11.05",
    paidAt: "2026.11.05",
    status: "결제 완료",
  },
  {
    id: "p2606001",
    title: "2026년도 1학기 3차 수강료",
    courses: [
      { title: "사회복지정책론", price: 280000 },
      { title: "지역사회복지론", price: 280000 },
    ],
    method: "무통장 입금",
    account: "국민은행 000000-00-000000 (주)한평생그룹",
    depositor: "홍길동",
    total: 560000,
    coupon: 0,
    paid: 560000,
    appliedAt: "2026.06.10",
    paidAt: "2026.06.11",
    status: "결제 완료",
  },
  {
    id: "p2609002",
    title: "2026년도 2학기 3차 수강료",
    courses: [{ title: "사회복지실천론", price: 280000 }],
    method: "신용카드 (일시불)",
    total: 280000,
    coupon: 0,
    paid: 280000,
    appliedAt: "2026.09.02",
    paidAt: "2026.09.02",
    status: "환불 신청",
  },
  {
    id: "p2603002",
    title: "2026년도 1학기 2차 수강료",
    courses: [{ title: "사회복지조사론", price: 280000 }],
    method: "신용카드 (일시불)",
    total: 280000,
    coupon: 0,
    paid: 280000,
    appliedAt: "2026.03.03",
    paidAt: "2026.03.03",
    status: "환불 완료",
  },
];

/** 결제 목록 (최근 결제가 위) */
export function getPayments(): Payment[] {
  // TODO: API 결제 목록 조회
  return [...payments].sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));
}

export function getPayment(id: string): Payment {
  return payments.find((p) => p.id === id) ?? payments[0];
}

export const refundRules = [
  { when: "수강 시작 전", amount: "낸 학습비 전액" },
  { when: "총 수강 기간의 1/3이 지나기 전", amount: "낸 학습비의 2/3" },
  { when: "총 수강 기간의 1/2이 지나기 전", amount: "낸 학습비의 1/2" },
  { when: "총 수강 기간의 1/2이 지난 뒤", amount: "돌려드리지 않음" },
];

export const refundNotices = [
  "환불 금액은 신청일을 기준으로 계산합니다.",
  "쿠폰으로 할인받은 금액은 돌려드리지 않으며, 쓴 쿠폰은 다시 쓸 수 없습니다.",
  "카드 결제는 카드사 사정에 따라 취소까지 3~7일이 걸립니다.",
  "무통장 입금은 적어 주신 계좌로 영업일 기준 5일 안에 보내 드립니다.",
];

export const formatWon = (n: number) => `${n.toLocaleString("ko-KR")}원`;

/** 오늘 날짜 표기 (출력물) */
export const issueDate = "2026년 11월 11일";

/** 시험 문항 25개 — 샘플 4문항을 돌려 채운다 */
export function getExamQuestions(count: number = examRules.questions): ExamQuestion[] {
  return Array.from({ length: count }, (_, i) => ({ ...sampleExamQuestions[i % sampleExamQuestions.length], no: i + 1 }));
}

/** 토론 샘플 글 */
export const sampleDiscussionPosts = [
  { author: "김**", date: "2026.12.15", body: "우리 동네 주민센터에서 하는 어르신 도시락 배달이 생각났어요. 자원봉사자가 부족하다고 들었습니다." },
  { author: "이**", date: "2026.12.16", body: "지역아동센터가 방과 후 돌봄에서 큰 역할을 하는 것 같아요. 다만 운영비 지원이 늘 부족하다고 하네요." },
];
