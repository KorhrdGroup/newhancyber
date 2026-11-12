import type { Metadata } from "next";
import PageTabs from "@/components/common/PageTabs";
import {
  sampleScholarships,
  type ScholarshipStatus,
} from "@/components/course-registration/extra/extraData";
import MyPageShell from "@/components/my-page/MyPageShell";
import { myPagePaymentTabs } from "@/lib/navigation";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "장학 현황 - 마이페이지" };

const statusBadge: Record<ScholarshipStatus, string> = {
  "지급 완료": "ds-badge--success",
  "지급 예정": "ds-badge--brand",
  "심사 중": "ds-badge--warning",
};

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

export default function PaymentScholarshipPage() {
  // TODO: API 장학 현황 조회
  const list = sampleScholarships;
  const paidTotal = list.filter((s) => s.status === "지급 완료").reduce((sum, s) => sum + s.amount, 0);
  const pendingCount = list.filter((s) => s.status !== "지급 완료").length;

  return (
    <MyPageShell title="장학 현황" desc="받은 장학금과 지급 상태를 확인할 수 있어요.">
      <PageTabs items={myPagePaymentTabs} className="mp-subtabs" />
      <div className="ds-stats ex-summary">
        <div className="ds-stat">
          <p className="ds-stat-label">받은 장학금 합계</p>
          <p className="ds-stat-value">{won(paidTotal)}</p>
        </div>
        <div className="ds-stat">
          <p className="ds-stat-label">장학 내역</p>
          <p className="ds-stat-value">
            {list.length}
            <small>건</small>
          </p>
        </div>
        <div className="ds-stat">
          <p className="ds-stat-label">심사·지급 대기</p>
          <p className="ds-stat-value">
            {pendingCount}
            <small>건</small>
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="ex-empty">아직 받은 장학금이 없어요.</p>
      ) : (
        <table className="ds-table ex-rtable">
          <thead>
            <tr>
              <th>장학명</th>
              <th>학기</th>
              <th>장학 금액</th>
              <th>지급 방식</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s, i) => (
              <tr key={i}>
                <td className="ex-rtable-head">{s.name}</td>
                <td data-label="학기">{s.semester}</td>
                <td data-label="장학 금액">{won(s.amount)}</td>
                <td data-label="지급 방식">{s.method}</td>
                <td data-label="상태">
                  <span className={`ds-badge ${statusBadge[s.status]}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="ex-note">수강료 감면 장학금은 해당 학기 결제 금액에서 바로 빠지고, 계좌 입금은 학기 종료 후 한 달 안에 보내 드려요.</p>
    </MyPageShell>
  );
}
