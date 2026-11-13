import type { Metadata } from "next";
import Link from "next/link";
import PageTabs from "@/components/common/PageTabs";
import MyPageShell from "@/components/my-page/MyPageShell";
import StatusBadge from "@/components/my-page/a/StatusBadge";
import { exceptionLabels, exceptionRequests } from "@/components/my-page/myPageDataA";
import { SUPPORT_PHONE } from "@/lib/contact";
import { myPageRequestTabs } from "@/lib/navigation";

export const metadata: Metadata = { title: "신청 결과 - 각종 예외 신청 - 마이페이지" };

/** U31 각종 예외 신청 — 신청 결과 목록 (원본 칸: 구분 · 신청 기간 · 신청일 · 상태 · 상세 보기) */
export default function ExceptionResultsPage() {
  // TODO: API 예외 신청 내역 조회
  const requests = exceptionRequests;

  return (
    <MyPageShell title="각종 예외 신청" desc="학습 규칙을 지키기 어려운 사정이 있을 때 신청합니다. 담당자가 확인한 뒤 결과를 알려 드립니다.">
      <PageTabs items={myPageRequestTabs} />
      {requests.length === 0 ? (
        <p className="cr-empty">신청 결과가 없습니다.</p>
      ) : (
        <div className="cr-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>신청 기간</th>
                <th>신청일</th>
                <th>상태</th>
                <th>상세 보기</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td className="is-left">
                    <Link href={`/my-page/exceptions/results/${r.id}`} className="mp-title-link">
                      {exceptionLabels[r.type]} 신청
                    </Link>
                  </td>
                  <td>{r.period}</td>
                  <td>{r.appliedAt}</td>
                  <td>
                    <StatusBadge>{r.status}</StatusBadge>
                  </td>
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
      <p className="pp-note ds-mt-12">* 신청 결과에 대한 자세한 문의 사항은 상담실({SUPPORT_PHONE})로 연락해 주시기 바랍니다.</p>
    </MyPageShell>
  );
}
