import type { Metadata } from "next";
import DbBoardList, { readListParams, redirectIfPastEnd, toBoardPosts } from "@/components/learning-support/DbBoard";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import { loadBoardList } from "@/lib/publicBoards";

export const metadata: Metadata = { title: "서식자료실" };

const BASE = "/learning-support/forms-data-room";

/** 서식자료실 — 관리자 「게시판 관리 › 자료실」(board_posts.data_room). 공지사항과 같은 화면(구분 없음) */
export default async function FormsDataRoomPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = readListParams(await searchParams);
  const { rows, total, failed } = await loadBoardList({ board: "data_room", q: params.q, scope: params.scope, page: params.page });
  redirectIfPastEnd(BASE, params, total);
  const posts = toBoardPosts(rows, { basePath: BASE, total, page: params.page, tagOf: (row) => ({ title: row.title }) });

  return (
    <>
      {/* 모바일은 공지사항과 같은 목록·제목 띠를 쓴다 (원본은 모바일 목록이 없어 표가 숨겨지고 페이지 번호만 남았다) */}
      <MobilePageBanner name="notice" text="서식자료실" />
      <main className="wrapper">
        <DbBoardList kind="notice" basePath={BASE} posts={posts} total={total} params={params} failed={failed} />
      </main>
    </>
  );
}
