"use client";

import { usePathname } from "next/navigation";

/** 학습·결제 팝업(/popup/...)에서는 사이트 머리글·바닥글을 숨긴다 */
export default function HideOnPopup({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/popup")) return null;
  return <>{children}</>;
}
