import type { Metadata } from "next";
import NoticeBoard from "@/components/learning-support/NoticeBoard";
import SectionTabs, { noticeTabs } from "@/components/learning-support/extra/SectionTabs";
import MobilePageBanner from "@/components/layout/MobilePageBanner";

export const metadata: Metadata = { title: "공지사항" };

export default function LearningNoticePage() {
  return (
    <>
      <MobilePageBanner name="notice" text="공지사항" />
      <main className="wrapper">
        <SectionTabs items={noticeTabs} />
        <NoticeBoard />
      </main>
    </>
  );
}
