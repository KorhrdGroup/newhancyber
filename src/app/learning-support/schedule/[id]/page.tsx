import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostView from "@/components/learning-support/PostView";
import SampleBody from "@/components/learning-support/SampleBody";
import { findPostWithSiblings, schedulePosts } from "@/components/learning-support/boardData";
import MobilePageBanner from "@/components/layout/MobilePageBanner";

export const metadata: Metadata = { title: "학사일정 상세" };

// TODO: API — id 로 학사일정 상세와 이전글/다음글을 조회한다 (지금은 목록 샘플에서 찾고 본문은 원본 샘플)
export default async function LearningScheduleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = findPostWithSiblings([schedulePosts], `/learning-support/schedule/${id}`);
  if (!found) notFound();

  return (
    <>
      <MobilePageBanner name="notice-detail" text="학사일정" />
      <main className="wrapper">
        <PostView
          // 목록의 분류 배지는 상세 제목 앞 말머리로 보인다 (운영 사이트 제목과 같은 모양)
          title={found.post.tag ? `[${found.post.tag}] ${found.post.title}` : found.post.title}
          date={found.post.date}
          fileName="파일명.PDF"
          prev={found.prev}
          next={found.next}
          listHref="/learning-support/schedule"
        >
          <SampleBody bannerAlt="학사일정 배너" />
        </PostView>
      </main>
    </>
  );
}
