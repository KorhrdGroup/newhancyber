import type { Metadata } from "next";
import { BoardTable, MobileBoardList, Pagination, SearchBox } from "@/components/learning-support/BoardParts";
import { mobileNoticePosts, noticePosts } from "@/components/learning-support/boardData";
import SectionTabs, { noticeTabs } from "@/components/learning-support/extra/SectionTabs";
import MobilePageBanner from "@/components/layout/MobilePageBanner";

export const metadata: Metadata = { title: "공지사항" };

export default function LearningNoticePage() {
  return (
    <>
      <MobilePageBanner name="notice" text="공지사항" />
      <main className="wrapper">
        <SectionTabs items={noticeTabs} />
        <MobileBoardList kind="notice" posts={mobileNoticePosts} />

        <div className="practice-support-notice-list-section desktop-only">
          <div className="container" style={{ backgroundColor: "#fff" }}>
            <SearchBox total={noticePosts.length} />
            <BoardTable posts={noticePosts} />
            <Pagination />
          </div>
        </div>

        <Pagination className="mobile-only" />
      </main>
    </>
  );
}
