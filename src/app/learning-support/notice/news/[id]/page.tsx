import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsDetail from "@/components/learning-support/extra/NewsDetail";
import { getNewsWithSiblings } from "@/components/learning-support/extra/newsData";
import MobilePageBanner from "@/components/layout/MobilePageBanner";

export const metadata: Metadata = { title: "관련기관 소식 상세" };

// TODO: API — id 로 관련기관 소식 상세와 이전글/다음글을 조회한다
export default async function LearningNewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = getNewsWithSiblings(id);
  if (!found) notFound();

  return (
    <>
      <MobilePageBanner name="notice-detail" text="관련기관 소식" />
      <main className="wrapper">
        <NewsDetail post={found.post} prev={found.prev} next={found.next} />
      </main>
    </>
  );
}
