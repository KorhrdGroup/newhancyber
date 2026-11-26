import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import PageTabs from "@/components/common/PageTabs";
import { formatWon, getPayments } from "@/components/my-classroom/classroomData";
import PopupButton from "@/components/my-classroom/PopupButton";
import MyPageShell from "@/components/my-page/MyPageShell";
import { isDbConfigured } from "@/lib/db/client";
import { listMemberPayments } from "@/lib/db/payments";
import { getCurrentMember } from "@/lib/memberAuth";
import { myPagePaymentTabs } from "@/lib/navigation";

export const metadata: Metadata = { title: "결제 내역 - 마이페이지" };

/** 상태 배지 — DB 상태 이름 그대로 (샘플의 「환불 신청」 포함). 없는 이름은 회색 */
const statusBadge: Record<string, string> = {
  "결제 완료": "ds-badge--success",
  "입금 대기": "ds-badge--neutral",
  "환불 신청": "ds-badge--brand",
  "환불 접수": "ds-badge--brand",
  "환불 진행 중": "ds-badge--brand",
  "부분 환불": "ds-badge--brand",
  "환불 완료": "ds-badge--neutral",
  "환불 반려": "ds-badge--neutral",
  "결제 취소": "ds-badge--neutral",
};

/**
 * 마이페이지 결제 내역 — 로그인한 회원의 결제(dbo.payments, LMS 「결제 관리」와 같은 표). 최근 신청 순.
 * 로그인하지 않았으면 로그인 화면으로 보냈다가 돌아온다. DB 설정이 없으면 샘플.
 */
export default async function PaymentsPage() {
  let list: { id: string; title: string; courses: { title: string }[]; method: string; paid: number; paidAt?: string; status: string }[];
  if (isDbConfigured()) {
    const member = await getCurrentMember();
    if (!member) redirect(`/member/login?next=${encodeURIComponent("/my-page/payments")}`);
    list = await listMemberPayments(member.memberId);
  } else {
    list = getPayments();
  }

  return (
    <MyPageShell title="결제 내역" desc="수강료 결제와 환불 상태를 확인할 수 있어요.">
      <PageTabs items={myPagePaymentTabs} />
      {list.length === 0 ? (
        <p className="cr-empty">결제 내역이 없어요.</p>
      ) : (
        <table className="ds-table ds-table--stack">
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
                <td className="ds-table-stack-head is-left">{p.title}</td>
                <td data-label="결제일">{p.paidAt ?? "-"}</td>
                <td data-label="결제 과목">
                  {p.courses[0]?.title ?? "-"}
                  {p.courses.length > 1 && ` 외 ${p.courses.length - 1}과목`}
                </td>
                <td data-label="결제 수단">{p.method}</td>
                <td data-label="결제 금액">{formatWon(p.paid)}</td>
                <td data-label="상태">
                  <span className={`ds-badge ${statusBadge[p.status] ?? "ds-badge--neutral"}`}>{p.status}</span>
                </td>
                <td data-label="보기">
                  <PopupButton href={`/popup/payment/${p.id}`}>결제 상세</PopupButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="pp-note ds-mt-12">
        영수증 출력 · 장학 신청 · 환불 신청은 결제 상세에서 할 수 있어요.{" "}
        <Link href="/course-registration/refund">환불 규정 보기</Link>
      </p>
    </MyPageShell>
  );
}
