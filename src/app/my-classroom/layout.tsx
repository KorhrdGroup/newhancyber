import "@/styles/classroom.css";
import "@/styles/ds2-pages.css";

/** 나의 강의실 — 디자인 시스템 v2(.ds2) 적용. 강의실 전용 모양은 .mc 로 묶는다. 감싸는 칸은 상자를 만들지 않는다 */
export default function MyClassroomLayout({ children }: { children: React.ReactNode }) {
  return <div className="ds2 mc" style={{ display: "contents" }}>{children}</div>;
}
