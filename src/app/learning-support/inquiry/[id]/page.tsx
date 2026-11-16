import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InquiryView from "@/components/learning-support/extra/InquiryView";
import { getInquiry } from "@/components/learning-support/extra/inquiryData";

export const metadata: Metadata = { title: "1:1 문의 상세" };

// TODO: 로그인 확인 — 로그인하지 않았거나 본인 글이 아니면 볼 수 없다
// TODO: API — id 로 문의 글과 답변을 조회한다
export default async function LearningInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = getInquiry(id);
  if (!inquiry) notFound();

  return (
    <main className="wrapper">
      <div className="container lx-page lx-page--top lx-page--plain">
        <h1 className="page-title">1:1 문의</h1>

        <InquiryView inquiry={inquiry} />

        <div className="lx-actions">
          <Link href="/learning-support/inquiry" className="ds-btn ds-btn--secondary ds-btn--lg">
            목록
          </Link>
        </div>
      </div>
    </main>
  );
}
