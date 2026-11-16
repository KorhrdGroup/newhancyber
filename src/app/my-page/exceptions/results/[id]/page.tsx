import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageTabs from "@/components/common/PageTabs";
import MyPageShell from "@/components/my-page/MyPageShell";
import StatusBadge from "@/components/my-page/a/StatusBadge";
import { exceptionLabels, getExceptionRequest } from "@/components/my-page/myPageDataA";
import { myPageExceptionTabs } from "@/lib/navigation";
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "신청 상세 - 각종 예외 신청 - 마이페이지" };

/** U31 각종 예외 신청 — 신청 상세 (원본 /stdMng/excView.asp) */
export default async function ExceptionResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // TODO: API 예외 신청 상세 조회
  const r = getExceptionRequest(id);
  if (!r) notFound();
  const done = r.status === "승인" || r.status === "반려";

  return (
    <MyPageShell title="각종 예외 신청" desc="학습 규칙을 지키기 어려운 사정이 있을 때 신청합니다. 담당자가 확인한 뒤 결과를 알려 드립니다.">
      <PageTabs items={myPageExceptionTabs} />

      <article className="lx-panel lx-post">
        <div className="lx-post-head">
          <StatusBadge>{r.status}</StatusBadge>
          <h2 className="lx-post-title">{exceptionLabels[r.type]} 신청</h2>
          <p className="lx-post-meta">신청일 {r.appliedAt}</p>
        </div>
        <div className="lx-post-body">
          <table className="ds-table ds-table--info mp-info">
            <tbody>
              <tr>
                <th>신청 기간</th>
                <td>{r.period}</td>
              </tr>
              {r.details.map((d) => (
                <tr key={d.label}>
                  <th>{d.label}</th>
                  <td>{d.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* TODO: API 첨부파일 내려받기 주소 */}
        {r.files.map((file) => (
          <p key={file} className="lx-file-chip" aria-label={`증빙 서류 ${file}`}>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {file}
          </p>
        ))}
      </article>

      {done ? (
        <section className="lx-answer">
          <div className="lx-answer-head">
            <strong>처리 결과</strong>
            {r.processedAt && <span className="lx-post-meta">처리일 {r.processedAt}</span>}
          </div>
          <div className="lx-post-body">
            {r.status === "반려" && <p className="lx-answer-result lx-answer-result--danger">반려 사유</p>}
            <p>{r.resultNote}</p>
          </div>
        </section>
      ) : (
        <section className="lx-answer lx-answer--waiting">
          <p>{r.status === "접수" ? "접수되었습니다." : "처리 중입니다."}</p>
          <p>담당자가 신청 내용을 확인한 뒤 결과를 알려 드립니다.</p>
        </section>
      )}

      <div className="lx-actions">
        <Link href="/my-page/exceptions/results" className="ds-btn ds-btn--secondary ds-btn--lg">
          목록
        </Link>
      </div>
    </MyPageShell>
  );
}
