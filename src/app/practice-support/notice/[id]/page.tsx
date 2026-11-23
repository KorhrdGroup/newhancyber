import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DbPostView, { DbPostUnavailable } from "@/components/learning-support/DbPostView";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import { loadBoardPost } from "@/lib/publicBoards";
// 글 상세 틀(PostView) 스타일은 학습지원 CSS 에 있어서 같이 불러온다
import "@/styles/learning-support.css";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "실습공지사항 상세" };

const BASE = "/practice-support/notice";

export default async function PracticeNoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await loadBoardPost("practice_notice", id);
  if (post === "missing") notFound();

  return (
    <>
      <MobilePageBanner name="notice-detail" text="실습공지사항" />
      <main className="wrapper">{post === "failed" ? <DbPostUnavailable basePath={BASE} /> : <DbPostView post={post} basePath={BASE} />}</main>
    </>
  );
}
