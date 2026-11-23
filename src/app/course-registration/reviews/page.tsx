import type { Metadata } from "next";
import { BEST_COUNT, REVIEWS_HREF, reviewHref } from "@/components/course-registration/reviewData";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import DbBoardList, { kstDate, readListParams, redirectIfPastEnd, toBoardPosts } from "@/components/learning-support/DbBoard";
import type { BoardPost } from "@/components/learning-support/boardData";
import { loadBoardList, writerLabel } from "@/lib/publicBoards";
import "@/styles/extra-pages.css";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "수강후기" };

// 추후 오픈 예정 — 메뉴·사이트맵에서 숨김 처리된 페이지

/**
 * 수강후기 — 공지사항과 같은 목록 (번호 자리에 BEST 배지, 학습자명 칸).
 * 아래 줄 = 수강 후기(board_posts.review, 회원이 쓴다 — 학습자명은 가려서), 쪽 번호 · 검색은 이 글들로.
 * 위 BEST 줄 = 장학후기(board_posts.scholarship_review) 최근 BEST_COUNT 개 — 쪽마다 맨 위에, 같은 검색어로 거른다.
 * DB 에 「BEST」 칸이 없어서 옛 화면의 BEST 자리를 장학후기로 채웠다(BEST 상세가 장학후기 배너 모양이라).
 */
export default async function CourseReviewsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = readListParams(await searchParams);
  const search = { q: params.q, scope: params.scope };
  const [list, best] = await Promise.all([
    loadBoardList({ board: "review", ...search, page: params.page }),
    loadBoardList({ board: "scholarship_review", ...search, page: 1, pageSize: BEST_COUNT }),
  ]);
  redirectIfPastEnd(REVIEWS_HREF, params, list.total);

  const posts = toBoardPosts(list.rows, { basePath: REVIEWS_HREF, total: list.total, page: params.page, tagOf: (row) => ({ title: row.title }) }).map(
    (post, i) => ({ ...post, cells: { writer: writerLabel(list.rows[i].authorType, list.rows[i].authorName) } }),
  );
  const bestPosts: BoardPost[] = best.rows.map((row) => ({
    number: "",
    badge: "BEST",
    title: row.title,
    date: kstDate(row.createdAt),
    href: reviewHref(row.postId, true),
    cells: { writer: writerLabel(row.authorType, row.authorName) },
  }));

  return (
    <>
      <MobilePageBanner name="cart" text="수강후기" />
      <main className="wrapper">
        <DbBoardList
          kind="notice"
          basePath={REVIEWS_HREF}
          posts={posts}
          total={list.total}
          params={params}
          failed={list.failed}
          // 「총 N건」은 볼 수 있는 글만 — BEST 는 보이는 장학후기 4개까지만 센다
          topPosts={list.failed ? [] : bestPosts}
          columns={[{ key: "writer", label: "학습자명", width: 104 }]}
          dateLabel="등록일"
        />
      </main>
    </>
  );
}
