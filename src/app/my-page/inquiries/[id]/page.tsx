import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MyPageShell from "@/components/my-page/MyPageShell";
import InquiryDetail from "@/components/my-page/b/InquiryDetail";
import { getInquiry } from "@/components/my-page/myPageDataB";

export const metadata: Metadata = { title: "1:1 문의 상세 - 문의 내역 - 마이페이지" };

/** U36 문의 내역 — 1:1 문의 상세 */
export default async function PersonalInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = getInquiry(id, "personal");
  if (!inquiry) notFound();

  return (
    <MyPageShell title="문의 내역">
      <InquiryDetail inquiry={inquiry} backHref="/my-page/inquiries" />
    </MyPageShell>
  );
}
