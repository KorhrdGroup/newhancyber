import type { Metadata } from "next";
import { BoardTable, Pagination, SearchBox } from "@/components/learning-support/BoardParts";
import { formPosts } from "@/components/learning-support/boardData";

export const metadata: Metadata = { title: "서식자료실" };

export default function FormsDataRoomPage() {
  return (
    <main className="wrapper">
      <div className="practice-support-notice-list-section">
        <div className="container" style={{ backgroundColor: "#fff" }}>
          <SearchBox />
          <BoardTable posts={formPosts} />
          <Pagination prefix="practice-support-pagination" />
        </div>
      </div>
    </main>
  );
}
