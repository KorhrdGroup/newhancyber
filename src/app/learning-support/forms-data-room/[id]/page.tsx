import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DbPostView, { DbPostUnavailable } from "@/components/learning-support/DbPostView";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import { loadBoardPost } from "@/lib/publicBoards";

export const metadata: Metadata = { title: "서식자료실 상세" };

const BASE = "/learning-support/forms-data-room";

/** 서식자료실 상세 — 본문 · 첨부(받기 /board/files/{번호}) · 이전글/다음글 */
export default async function FormsDataRoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await loadBoardPost("data_room", id);
  if (post === "missing") notFound();

  return (
    <>
      <MobilePageBanner name="notice-detail" text="서식자료실" />
      <main className="wrapper">{post === "failed" ? <DbPostUnavailable basePath={BASE} /> : <DbPostView post={post} basePath={BASE} />}</main>
    </>
  );
}
