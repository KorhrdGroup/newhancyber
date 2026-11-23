import type { Metadata } from "next";
import DbBoardList, { readListParams, toBoardPosts } from "@/components/learning-support/DbBoard";
import SectionTabs, { noticeTabs } from "@/components/learning-support/extra/SectionTabs";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import { NOTICE_CATEGORY_VALUES } from "@/lib/db/boardPosts";
import { loadBoardList } from "@/lib/publicBoards";

export const metadata: Metadata = { title: "공지사항" };

const BASE = "/learning-support/notice";

/** 공지사항 — 관리자 「게시판 관리 › 공지사항」(board_posts.notice). 구분(교육원 · 자격증 · 학점은행제)으로 거른다 */
export default async function LearningNoticePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = readListParams(await searchParams, NOTICE_CATEGORY_VALUES);
  const { rows, total, failed } = await loadBoardList({ board: "notice", category: params.tag, q: params.q, scope: params.scope, page: params.page });
  const posts = toBoardPosts(rows, {
    basePath: BASE,
    total,
    page: params.page,
    tagOf: (row) => ({ tag: row.category ?? undefined, title: row.title }),
  });

  return (
    <>
      <MobilePageBanner name="notice" text="공지사항" />
      <main className="wrapper">
        <SectionTabs items={noticeTabs} />
        <DbBoardList kind="notice" basePath={BASE} posts={posts} total={total} params={params} tags={NOTICE_CATEGORY_VALUES} label="공지 구분" failed={failed} />
      </main>
    </>
  );
}
