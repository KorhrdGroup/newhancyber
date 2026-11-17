import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostView from "@/components/learning-support/PostView";
import SampleBody from "@/components/learning-support/SampleBody";
import { findPostWithSiblings, noticePosts } from "@/components/learning-support/boardData";
import MobilePageBanner from "@/components/layout/MobilePageBanner";

export const metadata: Metadata = { title: "공지사항 상세" };

// TODO: API — id 로 공지사항 상세와 이전글/다음글을 조회한다 (지금은 목록 샘플에서 찾고 본문은 원본 샘플)
export default async function LearningNoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = findPostWithSiblings([noticePosts], `/learning-support/notice/${id}`);
  if (!found) notFound();

  return (
    <>
      <MobilePageBanner name="notice-detail" text="공지사항" />
      <main className="wrapper">
        <PostView
          title={found.post.title}
          date={found.post.date}
          fileName="파일명.PDF"
          prev={found.prev}
          next={found.next}
          listHref="/learning-support/notice"
        >
          <SampleBody bannerAlt="공지사항 배너" />
        </PostView>
      </main>
    </>
  );
}
