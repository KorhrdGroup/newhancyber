import type { Metadata } from "next";
import ExTabs from "@/components/course-registration/extra/ExTabs";
import { reviewTabs, scholarshipReviews } from "@/components/course-registration/extra/extraData";
import { BoardTable, MobileBoardList, Pagination, SearchBox } from "@/components/learning-support/BoardParts";
import type { BoardPost } from "@/components/learning-support/boardData";
import "@/styles/extra-pages.css";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "장학후기" };

/** 공지사항과 같은 목록 (번호 자리에 BEST 배지, 작성자·첨부·조회 칸) */
export default function ScholarshipReviewsPage() {
  // TODO: API 장학후기 목록·페이지 조회
  const reviews = scholarshipReviews;
  const normal = reviews.filter((r) => !r.best);

  const posts: BoardPost[] = reviews.map((review) => ({
    number: review.best ? "" : String(normal.length - normal.indexOf(review)),
    badge: review.best ? "BEST" : undefined,
    title: review.title,
    date: review.date,
    // 상세는 베스트 수강후기 상세 화면을 같이 쓴다
    href: `/course-registration/reviews/best/${review.id}`,
    cells: {
      writer: review.writer,
      file: review.hasFile ? "있음" : "-",
      views: review.views.toLocaleString("ko-KR"),
    },
  }));

  return (
    <>
      <ExTabs items={reviewTabs} underHeader />
      <main className="wrapper">
        <MobileBoardList kind="notice" posts={posts} dateLabel="등록일" />

        <div className="practice-support-notice-list-section desktop-only">
          <div className="container" style={{ backgroundColor: "#fff" }}>
            <SearchBox total={reviews.length} />
            <BoardTable
              posts={posts}
              columns={[
                { key: "writer", label: "작성자", width: 96 },
                { key: "file", label: "첨부", width: 72 },
                { key: "views", label: "조회", at: "end", width: 80 },
              ]}
              dateLabel="등록일"
            />
            <Pagination pages={1} />
          </div>
        </div>

        <Pagination className="mobile-only" pages={1} />
      </main>
    </>
  );
}
