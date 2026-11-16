import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageTabs from "@/components/common/PageTabs";
import InquiryView from "@/components/learning-support/extra/InquiryView";
import { getInquiry } from "@/components/learning-support/extra/inquiryData";
import MyPageShell from "@/components/my-page/MyPageShell";
import { myPageBoardTabs } from "@/lib/navigation";

export const metadata: Metadata = { title: "1:1 문의 상세 - 학습 게시판 - 마이페이지" };

/** U36 문의 내역 — 1:1 문의 상세 (학습지원 1:1 문의 상세와 같은 글·답변) */
export default async function PersonalInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // TODO: API — id 로 문의 글과 답변을 조회한다 (본인 글만)
  const inquiry = getInquiry(id);
  if (!inquiry) notFound();

  return (
    <MyPageShell title="학습 게시판">
      <PageTabs items={myPageBoardTabs} />
      <InquiryView inquiry={inquiry} />
      <div className="lx-actions">
        <Link href="/my-page/inquiries" className="ds-btn ds-btn--secondary ds-btn--lg">
          목록
        </Link>
      </div>
    </MyPageShell>
  );
}
