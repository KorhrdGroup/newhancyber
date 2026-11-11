import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MyPageShell from "@/components/my-page/MyPageShell";
import InquiryDetail from "@/components/my-page/b/InquiryDetail";
import { getInquiry } from "@/components/my-page/myPageDataB";

export const metadata: Metadata = { title: "학습 Q&A 상세 - 문의 내역 - 마이페이지" };

/** U36 문의 내역 — 학습 Q&A 상세 */
export default async function QnaInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = getInquiry(id, "qna");
  if (!inquiry) notFound();

  return (
    <MyPageShell title="문의 내역">
      <InquiryDetail inquiry={inquiry} backHref="/my-page/inquiries/qna" />
    </MyPageShell>
  );
}
