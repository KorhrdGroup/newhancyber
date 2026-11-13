import type { Metadata } from "next";
import Link from "next/link";
import PageTabs from "@/components/common/PageTabs";
import { formatWon, getPayments, type PaymentStatus } from "@/components/my-classroom/classroomData";
import PopupButton from "@/components/my-classroom/PopupButton";
import MyPageShell from "@/components/my-page/MyPageShell";
import { myPagePaymentTabs } from "@/lib/navigation";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "결제 내역 - 마이페이지" };

const statusBadge: Record<PaymentStatus, string> = {
  "결제 완료": "ds-badge--success",
  "입금 대기": "ds-badge--neutral",
  "환불 신청": "ds-badge--brand",
  "환불 완료": "ds-badge--neutral",
};

export default function PaymentsPage() {
  // TODO: API 결제 목록 조회
  const list = getPayments();

  return (
    <MyPageShell title="결제 내역" desc="수강료 결제와 환불 상태를 확인할 수 있어요.">
      <PageTabs items={myPagePaymentTabs} />
      {list.length === 0 ? (
        <p className="ex-empty">결제 내역이 없어요.</p>
      ) : (
        <table className="ds-table ex-rtable">
          <thead>
            <tr>
              <th className="is-left">결제명</th>
              <th>결제일</th>
              <th>결제 과목</th>
              <th>결제 수단</th>
              <th>결제 금액</th>
              <th>상태</th>
              <th>보기</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td className="ex-rtable-head is-left">{p.title}</td>
                <td data-label="결제일">{p.paidAt ?? "-"}</td>
                <td data-label="결제 과목">
                  {p.courses[0].title}
                  {p.courses.length > 1 && ` 외 ${p.courses.length - 1}과목`}
                </td>
                <td data-label="결제 수단">{p.method}</td>
                <td data-label="결제 금액">{formatWon(p.paid)}</td>
                <td data-label="상태">
                  <span className={`ds-badge ${statusBadge[p.status]}`}>{p.status}</span>
                </td>
                <td data-label="보기">
                  <PopupButton href={`/popup/payment/${p.id}`}>결제 상세</PopupButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="ex-note">
        영수증 출력과 환불 신청은 결제 상세에서 할 수 있어요.{" "}
        <Link href="/course-registration/refund">환불 규정 보기</Link>
      </p>
    </MyPageShell>
  );
}
