import type { Metadata } from "next";
import ReviewDetail from "@/components/course-registration/ReviewDetail";

export const metadata: Metadata = { title: "수강후기 상세" };

// 추후 오픈 예정 — 메뉴·사이트맵에서 숨김 처리된 페이지. BEST = 장학후기(board_posts.scholarship_review) 상세
export default async function CourseBestReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReviewDetail id={id} best />;
}
