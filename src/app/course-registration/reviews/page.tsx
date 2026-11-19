import type { Metadata } from "next";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import { BoardTable, MobileBoardList, Pagination, SearchBox } from "@/components/learning-support/BoardParts";
import type { BoardPost } from "@/components/learning-support/boardData";
import { courseReviews as reviews, reviewHref } from "@/components/course-registration/reviewData";
import "@/styles/extra-pages.css";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "수강후기" };

// 추후 오픈 예정 — 메뉴·사이트맵에서 숨김 처리된 페이지

const normal = reviews.filter((r) => !r.best);

/** 공지사항과 같은 목록 (번호 자리에 BEST 배지, 학습자명 칸) — 번호는 다른 게시판처럼 최신 글이 큰 번호 */
const posts: BoardPost[] = reviews.map((review) => ({
  number: review.best ? "" : String(normal.length - normal.indexOf(review)),
  badge: review.best ? "BEST" : undefined,
  title: review.title,
  date: review.date,
  href: reviewHref(review),
  cells: { writer: review.writer },
}));

export default function CourseReviewsPage() {
  return (
    <>
      <MobilePageBanner name="cart" text="수강후기" />
      <main className="wrapper">
        <MobileBoardList kind="notice" posts={posts} dateLabel="등록일" />

        <div className="practice-support-notice-list-section desktop-only">
          <div className="container" style={{ backgroundColor: "#fff" }}>
            <SearchBox total={reviews.length} />
            <BoardTable posts={posts} columns={[{ key: "writer", label: "학습자명", width: 104 }]} dateLabel="등록일" />
            <Pagination />
          </div>
        </div>

        <Pagination className="mobile-only" />
      </main>
    </>
  );
}
