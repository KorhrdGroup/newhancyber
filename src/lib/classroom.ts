import "server-only";
import { notFound, redirect } from "next/navigation";
import {
  getAssessments,
  getAttendance,
  getCourse,
  getFinishedCourses,
  getLessons,
  getOngoingCourses,
  type Assessment,
  type AssessmentType,
  type AttendanceMark,
  type Course,
  type GradeItem,
  type Lesson,
  type Syllabus,
} from "@/components/my-classroom/classroomData";
import { readLearnerAssessment, type LearnerAssessment } from "./db/assessments";
import {
  readAssessments,
  readConfirmedGrade,
  readEnrollments,
  readSyllabus,
  type AssessmentRow,
  type ConfirmedGradeRow,
  type EnrollmentRow,
} from "./db/classroom";
import { readLessonSummaries } from "./db/lessons";
import { readCourseSurvey, surveyGatesGrade, type CourseSurvey } from "./db/surveys";
import { isDbConfigured } from "./db/client";
import { getCurrentMember } from "./memberAuth";

/**
 * 나의 강의실 화면 데이터 — 로그인한 회원의 수강(Azure DB)을 화면 모양(classroomData.ts 의 타입)으로. DB 설정이 없으면 샘플.
 * 진행 중 = 수강 대기 · 수강 중, 종료 = 수료 · 미수료 (LMS · 교강사 사이트의 수강 상태).
 * DB 에 없는 것은 지어내지 않는다:
 *   - 차시 상태 · 학습 시간은 학습 기록(lesson_progress — CDMS → LMS → 홈페이지 학습창)으로 (src/lib/db/lessons.ts)
 *   - 주차별 출석 표가 없어 출석은 합계(출석 n회 · 결석 n회)로
 */

export interface AttendSummary {
  attend: number;
  absent: number;
  total: number;
}

export interface CourseRoomData {
  course: Course;
  lessons: Lesson[];
  /** 샘플만 — 주차별 출석 */
  attendance: AttendanceMark[] | null;
  /** DB — 출석 합계 */
  attendSummary: AttendSummary | null;
  assessments: Assessment[];
}

const KIND_TYPE: Record<string, AssessmentType> = {
  중간고사: "midterm",
  기말고사: "final",
  과제: "assignment",
  퀴즈: "quiz",
  토론: "discussion",
  학습심화활동: "activity",
};


/** 성적 항목 — 성적 기준(class_grading)의 비율이 있고 점수가 있는 것만 */
function gradeItems(e: EnrollmentRow): GradeItem[] {
  const pairs: [string, number | null, number | null][] = [
    ["중간고사", e.wMid, e.midScore],
    ["기말고사", e.wFinal, e.finalScore],
    ["과제", e.wHomework, e.homeworkScore],
    ["퀴즈", e.wQuiz, e.quizScore],
    ["토론", e.wDiscussion, e.discussionScore],
    ["학습심화활동", e.wActivity, e.activityScore],
  ];
  return pairs
    .filter(([, w, s]) => (w ?? 0) > 0 && s !== null)
    .map(([label, w, s]) => ({ label, weight: w ?? 0, score: Math.round((s ?? 0) * 10) / 10 }));
}

function toCourse(e: EnrollmentRow): Course {
  const finished = e.status === "수료" || e.status === "미수료";
  return {
    id: String(e.classId),
    term: e.semester,
    title: e.courseName,
    classNo: `${e.classNo}반`,
    // 화면 배지 — DB 에는 전공구분 칸이 없어 실습 · 카테고리 이름으로
    category: (e.isPractice ? "실습" : (e.category ?? "교양")) as Course["category"],
    credit: e.credit,
    instructor: e.teacherName ?? "-",
    studyStart: e.studyStart,
    studyEnd: e.studyEnd,
    reviewEnd: e.reviewEnd ?? undefined,
    progress: Math.max(0, Math.min(100, Math.round(e.progress))),
    creditRecognition: e.creditApplyDate ? `${e.creditApplyDate} 신청` : "-",
    degreeTiming: e.degreeApplyDate ? `${e.degreeApplyDate} 신청` : "-",
    isPractice: e.isPractice,
    status: e.status,
    grade:
      finished && e.totalScore !== null
        ? { total: Math.round(e.totalScore * 10) / 10, letter: e.grade ?? "-", items: gradeItems(e), passed: e.status === "수료" }
        : undefined,
  };
}

function toAssessment(a: AssessmentRow): Assessment {
  const done = a.submissionStatus === "제출 완료" || a.submissionStatus === "채점 완료";
  return {
    id: String(a.assessmentId),
    type: KIND_TYPE[a.kind] ?? "assignment",
    round: a.roundNo,
    title: a.title,
    start: a.openAt ?? "-",
    end: a.closeAt ?? "-",
    status: done ? "참여 완료" : a.phase === "before" ? "기간 전" : a.phase === "closed" ? "기간 종료" : "참여 전",
    score: a.score ?? undefined,
    maxScore: a.maxScore,
  };
}

/** 로그인한 회원 — 없으면 로그인 화면으로 (돌아올 주소 next) */
async function requireMember(next: string) {
  const member = await getCurrentMember();
  if (!member) redirect(`/member/login?next=${encodeURIComponent(next)}`);
  return member;
}

export async function getMyOngoingCourses(): Promise<Course[]> {
  if (!isDbConfigured()) return getOngoingCourses();
  const member = await requireMember("/my-classroom");
  return (await readEnrollments(member.memberId)).filter((e) => e.status === "수강 대기" || e.status === "수강 중").map(toCourse);
}

export async function getMyFinishedCourses(): Promise<Course[]> {
  if (!isDbConfigured()) return getFinishedCourses();
  const member = await requireMember("/my-classroom/finished");
  return (await readEnrollments(member.memberId)).filter((e) => e.status === "수료" || e.status === "미수료").map(toCourse);
}

/** 과목 강의실 — 그 회원의 수강이 아니면 404 */
export async function getMyCourseRoom(courseId: string, mode: "study" | "review"): Promise<CourseRoomData> {
  if (!isDbConfigured()) {
    const course = getCourse(courseId);
    return {
      course,
      lessons: getLessons(course.id),
      attendance: getAttendance(course.id),
      attendSummary: null,
      assessments: getAssessments(course.id),
    };
  }
  const classId = Number(courseId);
  if (!Number.isSafeInteger(classId) || classId <= 0) notFound();
  const member = await requireMember(mode === "review" ? `/my-classroom/finished/${classId}` : `/my-classroom/${classId}`);
  const e = (await readEnrollments(member.memberId, classId))[0];
  if (!e) notFound();
  const [summaries, assessmentRows] = await Promise.all([
    e.contentId ? readLessonSummaries(e.enrollmentId) : Promise.resolve([]),
    readAssessments(classId, e.enrollmentId),
  ]);
  // 차시 상태 — 학습 기록(lesson_progress, 80% 시청 = 완료)으로. 수강 대기(개강 전) · 열리기 전은 예정, 영상이 없는 차시는 준비 중(학습 가능 대신)
  const lessons: Lesson[] = summaries.map((l) => {
    const open = e.status !== "수강 대기" && l.isOpen;
    const status: Lesson["status"] = !open
      ? "예정"
      : l.pageCount === 0
        ? "학습 가능"
        : l.completedPages === l.pageCount
          ? "완료"
          : l.watchedSeconds > 0
            ? "학습 중"
            : "미학습";
    return {
      id: String(l.lessonId),
      week: l.weekNo,
      order: l.lessonNo,
      title: l.title,
      minutes: Math.round(l.totalSeconds / 60),
      studied: Math.round(l.watchedSeconds / 60),
      status,
      openDate: l.opensOn,
    };
  });
  return {
    course: toCourse(e),
    lessons,
    attendance: null,
    attendSummary: { attend: e.attendCount, absent: e.absentCount, total: e.totalSessions },
    assessments: assessmentRows.map(toAssessment),
  };
}

// ── 시험 · 과제 팝업 ─────────────────────────────────────

/** 평가 종류 → 화면 종류 · 이름 (팝업 주소 /popup/exam/{과목}/{midterm|final|quiz} · /popup/assessments/{과목}/{type}) */
export const KIND_TO_TYPE = KIND_TYPE;

/**
 * 시험 · 과제 팝업이 여는 평가 — 주소의 과목(차수 번호)과 ?a=평가 번호. 로그인한 회원 자신의 수강 · 그 차수의 평가가 아니면 404.
 * DB 설정이 없으면 null (샘플 화면).
 */
export async function getMyAssessment(courseId: string, a: string | string[] | undefined, next: string): Promise<LearnerAssessment | null> {
  if (!isDbConfigured()) return null;
  const classId = Number(courseId);
  const assessmentId = Number(Array.isArray(a) ? a[0] : a);
  if (!Number.isSafeInteger(classId) || classId <= 0 || !Number.isSafeInteger(assessmentId) || assessmentId <= 0) notFound();
  const member = await requireMember(next);
  const la = await readLearnerAssessment(member.memberId, classId, assessmentId);
  if (!la) notFound();
  return la;
}

/** 지금 참여할 수 없는 까닭 (참여할 수 있으면 null) — 화면 안내용. 서버 액션이 잠근 뒤 같은 조건을 다시 본다 */
export function blockedReason(la: LearnerAssessment): string | null {
  if (la.enrollmentStatus !== "수강 중") return la.enrollmentStatus === "수강 대기" ? "개강한 뒤(수강 중)에 참여할 수 있어요." : "수강이 끝난 과목이에요.";
  if (la.phase === "before") return `참여 기간 전이에요 (${la.openAt ?? "-"}부터).`;
  if (la.phase === "closed") return "참여 기간이 끝났어요.";
  return null;
}

// ── 강의 평가 · 성적 · 강의계획서 · 출석 팝업 ─────────────────

const classIdOf = (courseId: string) => {
  const classId = Number(courseId);
  if (!Number.isSafeInteger(classId) || classId <= 0) notFound();
  return classId;
};

/** 강의 평가 팝업 — 로그인한 회원 자신의 수강이 아니면 404. DB 설정이 없으면 null (샘플) */
export async function getMyCourseSurvey(courseId: string, next: string): Promise<CourseSurvey | null> {
  if (!isDbConfigured()) return null;
  const classId = classIdOf(courseId);
  const member = await requireMember(next);
  const s = await readCourseSurvey(member.memberId, classId);
  if (!s) notFound();
  return s;
}

export interface MyGrade {
  course: Course;
  survey: CourseSurvey;
  /** 지금 참여할 수 있는 강의 평가가 남아 성적을 가린다 */
  needSurvey: boolean;
  /** 최종 성적의 항목별 반영 점수 (weight = 반영 비율, 실습 항목은 비율을 모르면 null) */
  items: { label: string; weight: number | null; score: number }[];
  attend: AttendSummary;
  /** 채점이 끝난 평가 (최종 성적 전) */
  scored: Assessment[];
}

/** LMS 이론 기본 반영 비율 (성적 기준이 없는 차수 — newhancyber-lms src/lib/gradeReport.ts DEFAULT_THEORY_WEIGHTS) */
const DEFAULT_WEIGHTS = { attend: 20, mid: 30, final: 40, homework: 10, quiz: 0, discussion: 0, activity: 0 };
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * 항목별 반영 점수 — LMS 가 확정한 값(conf_grades)이 있으면 그대로, 없으면 같은 식으로 계산
 * (반영 = 원점수 × 비율 / 100, 출석 = 진도율 × 출석 비율 / 100).
 */
function reflectedItems(e: EnrollmentRow, conf: ConfirmedGradeRow | null): MyGrade["items"] {
  const w = {
    attend: e.wAttend ?? DEFAULT_WEIGHTS.attend,
    mid: e.wMid ?? DEFAULT_WEIGHTS.mid,
    final: e.wFinal ?? DEFAULT_WEIGHTS.final,
    homework: e.wHomework ?? DEFAULT_WEIGHTS.homework,
    quiz: e.wQuiz ?? DEFAULT_WEIGHTS.quiz,
    discussion: e.wDiscussion ?? DEFAULT_WEIGHTS.discussion,
    activity: e.wActivity ?? DEFAULT_WEIGHTS.activity,
  };
  if (conf?.kind === "실습") {
    const practice: [string, number | null][] = [
      ["오프라인 출석", conf.offline],
      ["출석", conf.attend],
      ["현장 평가", conf.site],
      ["실습 일지", conf.journal],
      ["과제", conf.homework],
      ["평가", conf.evalScore],
    ];
    return practice.filter(([, s]) => s !== null).map(([label, s]) => ({ label, weight: null, score: r2(s ?? 0) }));
  }
  const rows: [string, number, number | null, number | null][] = [
    ["출석", w.attend, conf?.attend ?? null, e.progress],
    ["중간고사", w.mid, conf?.mid ?? null, e.midScore],
    ["기말고사", w.final, conf?.final ?? null, e.finalScore],
    ["과제", w.homework, conf?.homework ?? null, e.homeworkScore],
    ["퀴즈", w.quiz, conf?.quiz ?? null, e.quizScore],
    ["토론", w.discussion, conf?.discussion ?? null, e.discussionScore],
    ["학습심화활동", w.activity, conf?.activity ?? null, e.activityScore],
  ];
  return rows
    .filter(([, weight]) => weight > 0)
    .map(([label, weight, confirmed, raw]) => ({ label, weight, score: r2(confirmed ?? ((raw ?? 0) * weight) / 100) }));
}

/** 성적 보기 — 최종 성적은 수료 · 미수료(LMS 성적 확정)일 때, 그 전에는 채점 끝난 평가만. 평가를 마쳐야 볼 수 있다 */
export async function getMyGrade(courseId: string): Promise<MyGrade | null> {
  if (!isDbConfigured()) return null;
  const classId = classIdOf(courseId);
  const member = await requireMember(`/popup/grade/${classId}`);
  const [e] = await readEnrollments(member.memberId, classId);
  if (!e) notFound();
  const [survey, rows, conf] = await Promise.all([
    readCourseSurvey(member.memberId, classId),
    readAssessments(classId, e.enrollmentId),
    readConfirmedGrade(e.enrollmentId),
  ]);
  if (!survey) notFound();
  return {
    course: toCourse(e),
    survey,
    needSurvey: surveyGatesGrade(survey),
    items: reflectedItems(e, conf),
    attend: { attend: e.attendCount, absent: e.absentCount, total: e.totalSessions },
    scored: rows.map(toAssessment).filter((a) => a.score !== undefined),
  };
}

export interface MyAttendanceWeek {
  week: number;
  lessons: number;
  completed: number;
  studied: number;
  minutes: number;
  /** 출석 = 그 주 차시를 모두 완료 · 미완료 = 열렸는데 덜 들음 · 미진행 = 아직 안 열림 */
  mark: "출석" | "미완료" | "미진행";
  opensOn: string | null;
}

/** 주차별 출석 — 학습 기록(lesson_progress)으로 주마다 완료 차시를 센다. 합계는 수강의 출석 · 결석 횟수 (LMS 와 같은 값) */
export async function getMyAttendance(courseId: string): Promise<{ course: Course; summary: AttendSummary; weeks: MyAttendanceWeek[] } | null> {
  if (!isDbConfigured()) return null;
  const room = await getMyCourseRoom(courseId, "study");
  const byWeek = new Map<number, Lesson[]>();
  // 영상이 없는 차시(「학습 가능」 — 들을 것이 없다)는 세지 않는다
  for (const l of room.lessons.filter((x) => x.status !== "학습 가능")) byWeek.set(l.week, [...(byWeek.get(l.week) ?? []), l]);
  const weeks = [...byWeek.entries()]
    .sort(([a], [b]) => a - b)
    .map(([week, ls]): MyAttendanceWeek => {
      const completed = ls.filter((l) => l.status === "완료").length;
      const open = ls.some((l) => l.status !== "예정");
      return {
        week,
        lessons: ls.length,
        completed,
        studied: ls.reduce((s, l) => s + l.studied, 0),
        minutes: ls.reduce((s, l) => s + l.minutes, 0),
        mark: !open ? "미진행" : completed === ls.length ? "출석" : "미완료",
        opensOn: ls[0]?.openDate ?? null,
      };
    });
  return { course: room.course, summary: room.attendSummary ?? { attend: 0, absent: 0, total: 0 }, weeks };
}

/** LMS 편집기 글(HTML 일 수 있다) → 글자만. 줄 바꿈 태그는 줄로, 나머지 태그는 지우고 흔한 문자 참조만 푼다 */
const plainText = (html: string | null) =>
  (html ?? "")
    .replace(/<\s*(br|\/p|\/div|\/li|\/h\d)\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const lines = (text: string | null) =>
  plainText(text)
    .split(/\r?\n/)
    .map((s) => s.replace(/^\s*[-·•*\d.)]+\s*/, "").trim())
    .filter(Boolean);

/** 강의계획서 — 과목 안내라 로그인 없이 본다 (장바구니 · 수강신청에서도 연다). DB 설정이 없으면 null (샘플) */
export async function getClassSyllabus(courseId: string): Promise<Syllabus | null> {
  if (!isDbConfigured()) return null;
  const data = await readSyllabus(classIdOf(courseId));
  if (!data) notFound();
  const { head: h, periods, lessons } = data;
  const weights: [string, number | null][] = [
    ["출석", h.wAttend ?? DEFAULT_WEIGHTS.attend],
    ["중간고사", h.wMid ?? DEFAULT_WEIGHTS.mid],
    ["기말고사", h.wFinal ?? DEFAULT_WEIGHTS.final],
    ["과제", h.wHomework ?? DEFAULT_WEIGHTS.homework],
    ["퀴즈", h.wQuiz],
    ["토론", h.wDiscussion],
    ["학습심화활동", h.wActivity],
  ];
  const weekMap = new Map<number, string[]>();
  for (const l of lessons) weekMap.set(l.weekNo, [...(weekMap.get(l.weekNo) ?? []), l.title]);
  return {
    overview: [
      { label: "과목명", value: h.courseName },
      { label: "이수 구분", value: h.isPractice ? "실습" : (h.category ?? "-") },
      { label: "학점", value: `${h.credit}학점` },
      { label: "차수", value: `${h.semester} · ${h.classNo}반` },
      { label: "수강 기간", value: `${h.studyStart} ~ ${h.studyEnd}` },
      { label: "교강사", value: h.teacherName ?? "-" },
    ],
    intro: plainText(h.intro),
    goals: lines(h.goal),
    periods: periods.map((p) => ({
      label: p.kind === "과제" ? `과제 ${p.roundNo}` : p.roundNo > 1 ? `${p.kind} ${p.roundNo}` : p.kind,
      value: p.openAt || p.closeAt ? `${p.openAt ?? ""} ~ ${p.closeAt ?? ""}` : "추후 안내",
    })),
    criteria: weights.filter(([, w]) => (w ?? 0) > 0).map(([label, w]) => ({ label, weight: w ?? 0, note: "" })),
    weeks: [...weekMap.entries()].sort(([a], [b]) => a - b).map(([week, titles]) => ({ week, topic: titles[0] ?? "", lessons: titles })),
    instructor: { name: h.teacherName ?? "-", career: lines(h.teacherIntro).slice(0, 10) },
  };
}
