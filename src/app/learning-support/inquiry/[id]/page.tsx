import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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

        <article className="lx-panel lx-post">
          <div className="lx-post-head">
            {inquiry.answer ? (
              <span className="ds-badge ds-badge--success">답변 완료</span>
            ) : (
              <span className="ds-badge ds-badge--neutral">답변 대기</span>
            )}
            <h2 className="lx-post-title">{inquiry.title}</h2>
            <p className="lx-post-meta">문의일 {inquiry.date}</p>
          </div>
          <div className="lx-post-body">
            {inquiry.body.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          {inquiry.fileName && (
            // TODO: 첨부파일 다운로드 링크
            <p className="lx-file-chip" aria-label={`첨부파일 ${inquiry.fileName}`}>
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {inquiry.fileName}
            </p>
          )}
        </article>

        {inquiry.answer ? (
          <section className="lx-answer">
            <div className="lx-answer-head">
              <strong>답변</strong>
              <span className="lx-post-meta">답변일 {inquiry.answer.date}</span>
            </div>
            <div className="lx-post-body">
              {inquiry.answer.body.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        ) : (
          <section className="lx-answer lx-answer--waiting">
            <strong>답변 대기 중입니다.</strong>
            <p>담당자가 확인한 뒤 답변을 드립니다.</p>
          </section>
        )}

        <div className="lx-actions">
          <Link href="/learning-support/inquiry" className="ds-btn ds-btn--secondary ds-btn--lg">
            목록
          </Link>
        </div>
      </div>
    </main>
  );
}
