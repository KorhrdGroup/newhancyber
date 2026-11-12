import type { Metadata } from "next";
import Link from "next/link";
import PageTabs from "@/components/common/PageTabs";
import { sampleRefunds, type RefundStatus } from "@/components/course-registration/extra/extraData";
import PopupButton from "@/components/my-classroom/PopupButton";
import MyPageShell from "@/components/my-page/MyPageShell";
import { myPagePaymentTabs } from "@/lib/navigation";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "환불 내역 - 마이페이지" };

const statusBadge: Record<RefundStatus, string> = {
  "환불 신청": "ds-badge--brand",
  "환불 처리 중": "ds-badge--warning",
  "환불 완료": "ds-badge--success",
};

export default function PaymentRefundPage() {
  // TODO: API 환불 내역 조회
  const list = sampleRefunds;

  return (
    <MyPageShell title="환불 내역" desc="환불 신청과 처리 상태를 확인할 수 있어요.">
      <PageTabs items={myPagePaymentTabs} className="mp-subtabs" />
      {list.length === 0 ? (
        <p className="ex-empty">환불 신청 내역이 없어요.</p>
      ) : (
        <table className="ds-table ex-rtable">
          <thead>
            <tr>
              <th>결제명</th>
              <th>신청일</th>
              <th>환불 금액</th>
              <th>상태</th>
              <th>보기</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.paymentId}>
                <td className="ex-rtable-head is-left">{r.title}</td>
                <td data-label="신청일">{r.appliedAt}</td>
                <td data-label="환불 금액">{r.amount.toLocaleString("ko-KR")}원</td>
                <td data-label="상태">
                  <span className={`ds-badge ${statusBadge[r.status]}`}>{r.status}</span>
                </td>
                <td data-label="보기">
                  {/* 처리 전에는 환불 신청서, 끝난 건은 결제 상세 팝업 */}
                  {r.status === "환불 완료" ? (
                    <PopupButton href={`/popup/payment/${r.paymentId}`}>결제 상세</PopupButton>
                  ) : (
                    <PopupButton href={`/popup/refund/${r.paymentId}`}>신청 내용</PopupButton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="ex-note">
        환불 금액은 신청일과 수강 진행 정도에 따라 달라져요.{" "}
        <Link href="/course-registration/refund">환불 규정 보기</Link>
      </p>
    </MyPageShell>
  );
}
