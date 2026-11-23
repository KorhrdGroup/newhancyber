import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DbPostView, { DbPostUnavailable } from "@/components/learning-support/DbPostView";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import { loadBoardPost } from "@/lib/publicBoards";

export const metadata: Metadata = { title: "공지사항 상세" };

const BASE = "/learning-support/notice";

/** 공지사항 상세 — 구분(교육원 등)은 제목 앞 말머리로 */
export default async function LearningNoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await loadBoardPost("notice", id);
  if (post === "missing") notFound();

  return (
    <>
      <MobilePageBanner name="notice-detail" text="공지사항" />
      <main className="wrapper">
        {post === "failed" ? (
          <DbPostUnavailable basePath={BASE} />
        ) : (
          <DbPostView post={post} basePath={BASE} title={post.category ? `[${post.category}] ${post.title}` : post.title} />
        )}
      </main>
    </>
  );
}
