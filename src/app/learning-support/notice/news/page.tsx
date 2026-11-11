import type { Metadata } from "next";
import { BoardTable, MobileBoardList, Pagination, SearchBox } from "@/components/learning-support/BoardParts";
import SectionTabs, { noticeTabs } from "@/components/learning-support/extra/SectionTabs";
import { newsBoardPosts } from "@/components/learning-support/extra/newsData";
import MobilePageBanner from "@/components/layout/MobilePageBanner";

export const metadata: Metadata = { title: "관련기관 소식" };

export default function LearningNewsPage() {
  return (
    <>
      <MobilePageBanner name="notice" text="관련기관 소식" />
      <main className="wrapper">
        <SectionTabs items={noticeTabs} />
        <MobileBoardList kind="notice" posts={newsBoardPosts} />

        <div className="practice-support-notice-list-section desktop-only">
          <div className="container" style={{ backgroundColor: "#fff" }}>
            <SearchBox />
            <BoardTable posts={newsBoardPosts} />
            <Pagination prefix="practice-support-pagination" />
          </div>
        </div>

        <Pagination prefix="mobile-notice-pagination" className="mobile-only" />
      </main>
    </>
  );
}
