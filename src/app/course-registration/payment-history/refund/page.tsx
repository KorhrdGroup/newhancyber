import type { Metadata } from "next";
import Link from "next/link";
import ExTabs from "@/components/course-registration/extra/ExTabs";
import { paymentHistoryTabs, sampleRefunds, type RefundStatus } from "@/components/course-registration/extra/extraData";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import PopupButton from "@/components/my-classroom/PopupButton";
import "@/styles/classroom.css";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "환불 내역" };

const statusBadge: Record<RefundStatus, string> = {
  "환불 신청": "ds-badge--brand",
  "환불 처리 중": "ds-badge--warning",
  "환불 완료": "ds-badge--success",
};

export default function PaymentRefundPage() {
  // TODO: API 환불 내역 조회
  const list = sampleRefunds;

  return (
    <>
      <MobilePageBanner name="payment-history" text="결제내역" />
      <ExTabs items={paymentHistoryTabs} />
      <main className="wrapper">
        <div className="ex-page">
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
        </div>
      </main>
    </>
  );
}
