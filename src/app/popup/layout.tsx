import type { Metadata } from "next";
import "@/styles/classroom.css";
import "@/styles/ds2-pages.css";

export const metadata: Metadata = { robots: { index: false } };

/** 학습·결제 팝업 — 사이트 머리글·바닥글 없이 (HideOnPopup 참고). 디자인 시스템 v2(.ds2) 적용 */
export default function PopupLayout({ children }: { children: React.ReactNode }) {
  return <div className="pp ds2">{children}</div>;
}
