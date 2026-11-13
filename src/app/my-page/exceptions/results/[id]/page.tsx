import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageTabs from "@/components/common/PageTabs";
import MyPageShell from "@/components/my-page/MyPageShell";
import StatusBadge from "@/components/my-page/a/StatusBadge";
import { exceptionLabels, getExceptionRequest } from "@/components/my-page/myPageDataA";
import { myPageRequestTabs } from "@/lib/navigation";

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
      <PageTabs items={myPageRequestTabs} />

      <section className="pp-box">
        <h3 className="pp-box-title">신청 내용</h3>
        <table className="ds-table ds-table--info mp-info">
          <tbody>
            <tr>
              <th>신청 구분</th>
              <td>{exceptionLabels[r.type]} 신청</td>
            </tr>
            <tr>
              <th>신청 기간</th>
              <td>{r.period}</td>
            </tr>
            <tr>
              <th>신청일</th>
              <td>{r.appliedAt}</td>
            </tr>
            {r.details.map((d) => (
              <tr key={d.label}>
                <th>{d.label}</th>
                <td>{d.value}</td>
              </tr>
            ))}
            <tr>
              <th>증빙 서류</th>
              {/* TODO: API 첨부파일 내려받기 주소 */}
              <td>{r.files.length ? r.files.join(", ") : "없음"}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={`pp-box${r.status === "반려" ? " mp-result--danger" : r.status === "승인" ? " mp-answer" : ""}`}>
        <h3 className="pp-box-title">처리 결과</h3>
        <p className="pp-row">
          <StatusBadge>{r.status}</StatusBadge>
          {r.processedAt && <span className="pp-note">처리일 {r.processedAt}</span>}
        </p>
        {done ? (
          <p className="pp-text ds-mt-12">
            {r.status === "반려" && <strong className="ds-text-danger">반려 사유 </strong>}
            {r.resultNote}
          </p>
        ) : (
          <p className="pp-text ds-mt-12">담당자가 신청 내용을 확인하고 있습니다. 처리되면 이 화면에서 결과를 볼 수 있습니다.</p>
        )}
      </section>

      <div className="pp-actions">
        <Link href="/my-page/exceptions/results" className="ds-btn ds-btn--secondary">
          목록
        </Link>
      </div>
    </MyPageShell>
  );
}
