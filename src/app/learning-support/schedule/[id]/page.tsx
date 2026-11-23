import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DbPostView, { DbPostUnavailable } from "@/components/learning-support/DbPostView";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import { loadBoardPost } from "@/lib/publicBoards";

export const metadata: Metadata = { title: "학사일정 상세" };

const BASE = "/learning-support/schedule";

/** 학사일정 상세 — 제목 말머리([사회복지현장실습])는 글에 적힌 그대로 보인다 */
export default async function LearningScheduleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await loadBoardPost("academic_schedule", id);
  if (post === "missing") notFound();

  return (
    <>
      <MobilePageBanner name="notice-detail" text="학사일정" />
      <main className="wrapper">{post === "failed" ? <DbPostUnavailable basePath={BASE} /> : <DbPostView post={post} basePath={BASE} />}</main>
    </>
  );
}
