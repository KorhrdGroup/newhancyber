import type { Metadata } from "next";
import { BoardTable, MobileBoardList, Pagination, SearchBox } from "@/components/learning-support/BoardParts";
import { formPosts } from "@/components/learning-support/boardData";
import MobilePageBanner from "@/components/layout/MobilePageBanner";

export const metadata: Metadata = { title: "서식자료실" };

export default function FormsDataRoomPage() {
  return (
    <>
      {/* 모바일은 공지사항과 같은 목록·제목 띠를 쓴다 (원본은 모바일 목록이 없어 표가 숨겨지고 페이지 번호만 남았다) */}
      <MobilePageBanner name="notice" text="서식자료실" />
      <main className="wrapper">
        <MobileBoardList kind="notice" posts={formPosts} />

        <div className="practice-support-notice-list-section desktop-only">
          <div className="container" style={{ backgroundColor: "#fff" }}>
            <SearchBox total={formPosts.length} />
            <BoardTable posts={formPosts} />
            <Pagination />
          </div>
        </div>

        <Pagination className="mobile-only" />
      </main>
    </>
  );
}
