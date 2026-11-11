import type { AssessmentStatus, AttendanceMark, LessonStatus, PaymentStatus, PracticeDoc } from "./classroomData";

type Tone = "brand" | "success" | "warning" | "danger" | "neutral";

const toneByStatus: Record<string, Tone> = {
  완료: "success",
  "학습 중": "brand",
  미학습: "warning",
  예정: "neutral",
  "참여 전": "brand",
  "참여 완료": "success",
  "기간 전": "neutral",
  "기간 종료": "neutral",
  "제출 완료": "success",
  미제출: "warning",
  반려: "danger",
  "결제 완료": "success",
  "입금 대기": "warning",
  "환불 신청": "danger",
  "환불 완료": "neutral",
};

type BadgeText = LessonStatus | AssessmentStatus | PracticeDoc["status"] | PaymentStatus | AttendanceMark | string;

/** Figma Badge — 상태 글자에 맞는 색을 고른다 */
export function Badge({ children, tone }: { children: BadgeText; tone?: Tone }) {
  return <span className={`ds-badge ds-badge--${tone ?? toneByStatus[children] ?? "neutral"}`}>{children}</span>;
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="ds-progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label="진도율">
      <div className="ds-progress-track">
        <div className="ds-progress-bar" style={{ width: `${value}%` }} />
      </div>
      <span className="ds-progress-value">{value}%</span>
    </div>
  );
}
