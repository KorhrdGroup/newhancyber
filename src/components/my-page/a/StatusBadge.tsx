import { Badge } from "@/components/my-classroom/ClassroomUI";

type Tone = "brand" | "success" | "warning" | "danger" | "neutral";

/** 마이페이지 1묶음 상태 글자 → 배지 색 (나의 강의실 Badge 에 없는 글자만 여기서 정한다) */
const tones: Record<string, Tone> = {
  "답변 완료": "success",
  "답변 대기": "warning",
  "사용 가능": "brand",
  "사용 완료": "neutral",
  "기간 만료": "neutral",
  "진행 중": "brand",
  마감: "neutral",
  접수: "neutral",
  "처리 중": "warning",
  승인: "success",
  반려: "danger",
};

export default function StatusBadge({ children }: { children: string }) {
  return <Badge tone={tones[children]}>{children}</Badge>;
}
