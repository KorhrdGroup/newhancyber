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
      <div className="container lx-page lx-page--top">
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
            <p className="lx-post-file">
              {/* TODO: 첨부파일 다운로드 링크 */}
              첨부파일 <span>{inquiry.fileName}</span>
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
            <p>담당자가 확인한 뒤 답변을 드립니다. 평일 09:00~18:00 (점심시간 12:00~13:00 제외)</p>
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
