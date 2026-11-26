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
} from "@/components/my-classroom/classroomData";
import { readLearnerAssessment, type LearnerAssessment } from "./db/assessments";
import { readAssessments, readEnrollments, type AssessmentRow, type EnrollmentRow } from "./db/classroom";
import { readLessonSummaries } from "./db/lessons";
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
