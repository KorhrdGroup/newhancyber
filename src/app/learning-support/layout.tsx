import "@/styles/learning-support.css";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";
import "@/styles/ds2-pages.css";

/** 학습지원 화면 — 디자인 시스템 v2(.ds2) 적용. 감싸는 칸은 상자를 만들지 않는다 */
export default function LearningSupportLayout({ children }: { children: React.ReactNode }) {
  return <div className="ds2" style={{ display: "contents" }}>{children}</div>;
}
