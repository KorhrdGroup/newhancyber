import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import PageTabs from "@/components/common/PageTabs";
import { sampleRefunds } from "@/components/course-registration/extra/extraData";
import PopupButton from "@/components/my-classroom/PopupButton";
import MyPageShell from "@/components/my-page/MyPageShell";
import { isDbConfigured } from "@/lib/db/client";
import { listMemberRefunds } from "@/lib/db/refunds";
import { getCurrentMember } from "@/lib/memberAuth";
import { myPagePaymentTabs } from "@/lib/navigation";

export const metadata: Metadata = { title: "환불 내역 - 마이페이지" };

/** 상태 배지 — DB(LMS 환불 관리) 이름과 샘플 이름 모두. 없는 이름은 회색 */
const statusBadge: Record<string, string> = {
  "환불 접수": "ds-badge--brand",
  "환불 신청": "ds-badge--brand",
  "환불 진행 중": "ds-badge--warning",
  "환불 처리 중": "ds-badge--warning",
  "환불 완료": "ds-badge--success",
  "환불 반려": "ds-badge--neutral",
};

interface Row {
  key: string;
  paymentId: string;
  title: string;
  appliedAt: string;
  amount: number;
  status: string;
  rejectReason?: string | null;
}

/**
 * 마이페이지 환불 내역 — 로그인한 회원의 환불(dbo.refunds, LMS 「환불 관리」가 처리). 최근 신청 순.
 * 「보기」는 결제 상세 팝업(상태 · 환불 금액이 보인다). DB 설정이 없으면 샘플.
 */
export default async function PaymentRefundPage() {
  let list: Row[];
  if (isDbConfigured()) {
    const member = await getCurrentMember();
    if (!member) redirect(`/member/login?next=${encodeURIComponent("/my-page/payments/refund")}`);
    list = (await listMemberRefunds(member.memberId)).map((r) => ({
      key: String(r.refundId),
      paymentId: String(r.paymentId),
      title: r.title,
      appliedAt: r.requestedAt,
      amount: r.amount,
      status: r.status,
      rejectReason: r.rejectReason,
    }));
  } else {
    list = sampleRefunds.map((r) => ({ ...r, key: r.paymentId }));
  }

  return (
    <MyPageShell title="환불 내역" desc="환불 신청과 처리 상태를 확인할 수 있어요.">
      <PageTabs items={myPagePaymentTabs} />
      {list.length === 0 ? (
        <p className="cr-empty">환불 신청 내역이 없어요.</p>
      ) : (
        <table className="ds-table ds-table--stack">
          <thead>
            <tr>
              <th className="is-left">결제명</th>
              <th>신청일</th>
              <th>환불 금액</th>
              <th>상태</th>
              <th>보기</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.key}>
                <td className="ds-table-stack-head is-left">{r.title}</td>
                <td data-label="신청일">{r.appliedAt}</td>
                <td data-label="환불 금액">{r.amount.toLocaleString("ko-KR")}원</td>
                <td data-label="상태">
                  <span className={`ds-badge ${statusBadge[r.status] ?? "ds-badge--neutral"}`}>{r.status}</span>
                  {r.rejectReason && <span className="pp-note"> · {r.rejectReason}</span>}
                </td>
                <td data-label="보기">
                  <PopupButton href={`/popup/payment/${r.paymentId}`}>결제 상세</PopupButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="pp-note ds-mt-12">
        환불 금액은 신청일과 수강 진행 정도에 따라 달라져요. 담당자가 확인하면서 금액이 바뀔 수 있어요.{" "}
        <Link href="/course-registration/refund">환불 규정 보기</Link>
      </p>
    </MyPageShell>
  );
}
