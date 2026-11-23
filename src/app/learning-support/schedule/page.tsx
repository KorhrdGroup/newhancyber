import type { Metadata } from "next";
import DbBoardList, { readListParams, splitTitleTag, toBoardPosts } from "@/components/learning-support/DbBoard";
import { SCHEDULE_TAGS } from "@/components/learning-support/boardData";
import SectionTabs, { scheduleTabs } from "@/components/learning-support/extra/SectionTabs";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import { loadBoardList } from "@/lib/publicBoards";

export const metadata: Metadata = { title: "학사일정" };

const BASE = "/learning-support/schedule";

/**
 * 학사일정 — 관리자 「게시판 관리 › 학사일정」(board_posts.academic_schedule).
 * 관리자 화면에 구분 칸이 없어서, 운영 사이트처럼 제목 말머리 「[사회복지현장실습]」로 실습 글을 가른다 (말머리는 배지로 보인다).
 */
export default async function LearningSchedulePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = readListParams(await searchParams, SCHEDULE_TAGS);
  const { rows, total, failed } = await loadBoardList({
    board: "academic_schedule",
    titlePrefix: params.tag ? `[${params.tag}]` : null,
    q: params.q,
    scope: params.scope,
    page: params.page,
  });
  const posts = toBoardPosts(rows, { basePath: BASE, total, page: params.page, tagOf: (row) => splitTitleTag(row.title, SCHEDULE_TAGS) });

  return (
    <>
      <MobilePageBanner name="schedule" text="학사일정" />
      <main className="wrapper">
        <SectionTabs items={scheduleTabs} />
        <DbBoardList kind="schedule" basePath={BASE} posts={posts} total={total} params={params} tags={SCHEDULE_TAGS} label="학사일정 구분" failed={failed} />
      </main>
    </>
  );
}
