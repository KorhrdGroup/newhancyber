import type { Metadata } from "next";
import Link from "next/link";
import PageTabs from "@/components/common/PageTabs";
import MyPageShell from "@/components/my-page/MyPageShell";
import StatusBadge from "@/components/my-page/a/StatusBadge";
import { exceptionLabels, exceptionRequests } from "@/components/my-page/myPageDataA";
import { myPageRequestTabs } from "@/lib/navigation";

export const metadata: Metadata = { title: "신청 결과 - 각종 예외 신청 - 마이페이지" };

/** U31 각종 예외 신청 — 신청 결과 목록 */
export default function ExceptionResultsPage() {
  // TODO: API 예외 신청 내역 조회
  const requests = exceptionRequests;

  return (
    <MyPageShell title="각종 예외 신청" desc="학습 규칙을 지키기 어려운 사정이 있을 때 신청합니다. 담당자가 확인한 뒤 결과를 알려 드립니다.">
      <PageTabs items={myPageRequestTabs} className="mp-subtabs" />
      {requests.length === 0 ? (
        <p className="cr-empty">신청한 내역이 없습니다.</p>
      ) : (
        <div className="cr-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>신청 구분</th>
                <th>신청일</th>
                <th>처리 상태</th>
                <th>처리일</th>
                <th>보기</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r, i) => (
                <tr key={r.id}>
                  <td>{requests.length - i}</td>
                  <td className="is-left">
                    <Link href={`/my-page/exceptions/results/${r.id}`} className="mp-title-link">
                      {exceptionLabels[r.type]} 신청
                    </Link>
                  </td>
                  <td>{r.appliedAt}</td>
                  <td>
                    <StatusBadge>{r.status}</StatusBadge>
                  </td>
                  <td>{r.processedAt ?? "-"}</td>
                  <td>
                    <Link href={`/my-page/exceptions/results/${r.id}`} className="ds-btn ds-btn--secondary ds-btn--sm">
                      상세 보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MyPageShell>
  );
}
