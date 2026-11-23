import type { Metadata } from "next";
import DbBoardList, { readListParams, redirectIfPastEnd, toBoardPosts } from "@/components/learning-support/DbBoard";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import { loadBoardList } from "@/lib/publicBoards";
// 모바일 목록 · 파란 제목 띠 스타일은 학습지원 CSS 에만 있어서 같이 불러온다 (실습지원 CSS 엔 모바일 스타일이 없음)
import "@/styles/learning-support.css";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "실습공지사항" };

const BASE = "/practice-support/notice";

/** 실습공지사항 — 관리자 「게시판 관리 › 실습 공지사항」(board_posts.practice_notice, 옛 관련기관 소식 자리). 학습지원 공지사항과 같은 화면 */
export default async function PracticeNoticePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = readListParams(await searchParams);
  const { rows, total, failed } = await loadBoardList({ board: "practice_notice", q: params.q, scope: params.scope, page: params.page });
  redirectIfPastEnd(BASE, params, total);
  const posts = toBoardPosts(rows, { basePath: BASE, total, page: params.page, tagOf: (row) => ({ title: row.title }) });

  return (
    <>
      <MobilePageBanner name="notice" text="실습공지사항" />
      <main className="wrapper">
        <DbBoardList kind="notice" basePath={BASE} posts={posts} total={total} params={params} failed={failed} />
      </main>
    </>
  );
}
