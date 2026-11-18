import "@/styles/classroom.css";
import "@/styles/mypage.css";
import "@/styles/mypage2.css";
import "@/styles/ds2-pages.css";

/** 마이페이지 화면 — 디자인 시스템 v2(.ds2) 적용. 감싸는 칸은 상자를 만들지 않는다 */
export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return <div className="ds2" style={{ display: "contents" }}>{children}</div>;
}
