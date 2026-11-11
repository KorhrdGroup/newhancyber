import type { Metadata } from "next";
import "@/styles/classroom.css";

export const metadata: Metadata = { robots: { index: false } };

/** 학습·결제 팝업 — 사이트 머리글·바닥글 없이 (HideOnPopup 참고) */
export default function PopupLayout({ children }: { children: React.ReactNode }) {
  return <div className="pp">{children}</div>;
}
