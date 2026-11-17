"use client";

import { useState, type ReactNode } from "react";
import ButtonTabs from "@/components/common/ButtonTabs";

const TABS = [
  { key: "privacy", label: "㈜한평생그룹 개인정보처리방침" },
  { key: "video", label: "영상정보 처리기기 운영·처리 방침" },
];

/** 개인정보처리방침 화면 위 탭 (원본처럼 같은 주소에서 본문만 바꿈). 두 본문 모두 그려 두고 고른 것만 보여준다 */
export default function PrivacyTabs({ children, video }: { children: ReactNode; video: ReactNode }) {
  const [active, setActive] = useState("privacy");
  return (
    <>
      <ButtonTabs items={TABS} active={active} onSelect={setActive} className="legal-tabs" ariaLabel="방침 고르기" />
      <div className="legal-tab-panel" role="tabpanel" hidden={active !== "privacy"}>
        {children}
      </div>
      <div className="legal-tab-panel" role="tabpanel" hidden={active !== "video"}>
        {video}
      </div>
    </>
  );
}
