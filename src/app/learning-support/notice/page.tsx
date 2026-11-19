import type { Metadata } from "next";
import TagFilterBoard from "@/components/learning-support/TagFilterBoard";
import { NOTICE_CATEGORIES, noticePosts } from "@/components/learning-support/boardData";
import SectionTabs, { noticeTabs } from "@/components/learning-support/extra/SectionTabs";
import MobilePageBanner from "@/components/layout/MobilePageBanner";

export const metadata: Metadata = { title: "공지사항" };

export default function LearningNoticePage() {
  return (
    <>
      <MobilePageBanner name="notice" text="공지사항" />
      <main className="wrapper">
        <SectionTabs items={noticeTabs} />
        <TagFilterBoard kind="notice" posts={noticePosts} tags={NOTICE_CATEGORIES} label="공지 구분" />
      </main>
    </>
  );
}
