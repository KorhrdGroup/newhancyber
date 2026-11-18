import "@/styles/ds2-pages.css";

/** 바닥글 화면(약관 · 소개 · 불편사항 접수 등) — 디자인 시스템 v2(.ds2) 적용. 감싸는 칸은 상자를 만들지 않는다 */
export default function FooterPagesLayout({ children }: { children: React.ReactNode }) {
  return <div className="ds2" style={{ display: "contents" }}>{children}</div>;
}
