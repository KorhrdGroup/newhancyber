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
  // 이전글/다음글은 같은 탭(이론 과목 · 실습과목) 안에서만 잇는다
  const found = findPostWithSiblings(
    [schedulePosts.theory, schedulePosts.practice],
    `/learning-support/schedule/${id}`,
  );
  if (!found) notFound();

  return (
    <>
      <MobilePageBanner name="notice-detail" text="학사일정" />
      <main className="wrapper">
        <PostView
          title={found.post.title}
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
