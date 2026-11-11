import type { Metadata } from "next";
import PopupShell from "@/components/my-classroom/PopupShell";
import RefundForm from "@/components/my-classroom/popups/RefundForm";
import { formatWon, getPayment, refundNotices, refundRules } from "@/components/my-classroom/classroomData";

export const metadata: Metadata = { title: "환불 신청" };

export default async function RefundPopup({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;
  // TODO: API 결제 조회·예상 환불 금액 계산
  const p = getPayment(paymentId);

  return (
    <PopupShell title="환불 신청" sub={p.title} footer={null}>
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
          결제 금액 {formatWon(p.paid)} · 정확한 환불 금액은 신청 뒤 담당자가 확인해 문자로 알려 드립니다.
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
      <div className="ds-mt-16">
        <RefundForm needAccount={!p.method.includes("카드")} />
      </div>
    </PopupShell>
  );
}
