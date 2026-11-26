import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import PopupShell from "@/components/my-classroom/PopupShell";
import RefundForm from "@/components/my-classroom/popups/RefundForm";
import { formatWon, getPayment, refundNotices, refundRules } from "@/components/my-classroom/classroomData";
import { isDbConfigured } from "@/lib/db/client";
import { readRefundForm } from "@/lib/db/refunds";
import { getCurrentMember } from "@/lib/memberAuth";
import { refundNeedsAccount } from "@/lib/refundReasons";

export const metadata: Metadata = { title: "환불 신청" };

/**
 * 환불 신청 팝업 (결제 상세 「환불 신청」) — 로그인한 회원 자신의 결제만 (다른 번호면 404).
 * 과목마다 오늘 신청하면 받을 예상 금액(LMS 와 같은 4단계)을 보여 주고, 고른 과목으로 「환불 접수」를 남긴다.
 * DB 설정이 없으면 샘플.
 */
export default async function RefundPopup({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;

  if (!isDbConfigured()) {
    const p = getPayment(paymentId);
    return (
      <PopupShell title="환불 신청" sub={p.title} footer={null}>
        <RefundRules paid={p.paid} />
        <div className="ds-mt-16">
          <RefundForm needAccount={refundNeedsAccount(p.method)} />
        </div>
      </PopupShell>
    );
  }

  const id = Number(paymentId);
  if (!Number.isSafeInteger(id) || id <= 0) notFound();
  const member = await getCurrentMember();
  if (!member) redirect(`/member/login?next=${encodeURIComponent(`/popup/refund/${id}`)}`);
  const form = await readRefundForm(member.memberId, id);
  if (!form) notFound();

  return (
    <PopupShell title="환불 신청" sub={form.title} footer={null}>
      <RefundRules paid={form.paidAmount} />
      <div className="ds-mt-16">
        <RefundForm
          needAccount={refundNeedsAccount(form.method)}
          db={{
            paymentId: form.paymentId,
            lines: form.lines,
            defaults: { bank: form.refundBank ?? "", account: form.refundAccount ?? "", holder: form.memberName },
          }}
        />
      </div>
    </PopupShell>
  );
}

/** 학습비 반환 규정 · 유의사항 (샘플 · DB 같이) */
function RefundRules({ paid }: { paid: number }) {
  return (
    <>
      <div className="pp-box">
        <h2 className="pp-box-title">학습비 반환 규정</h2>
        <table className="ds-table">
          <thead>
            <tr>
              <th>신청 시점</th>
              <th>돌려드리는 금액</th>
            </tr>
          </thead>
          <tbody>
            {refundRules.map((r) => (
              <tr key={r.when}>
                <td>{r.when}</td>
                <td>{r.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="pp-note ds-mt-12">
          결제 금액 {formatWon(paid)} · 정확한 환불 금액은 신청 뒤 담당자가 확인해 문자로 알려 드립니다.
        </p>
      </div>
      <div className="pp-box">
        <h2 className="pp-box-title">유의사항</h2>
        <ul className="pp-list">
          {refundNotices.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
