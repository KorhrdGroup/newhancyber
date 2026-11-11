import type { Metadata } from "next";
import { Badge } from "@/components/my-classroom/ClassroomUI";
import PopupShell from "@/components/my-classroom/PopupShell";
import { formatWon, getPayment } from "@/components/my-classroom/classroomData";

export const metadata: Metadata = { title: "결제 상세" };

export default async function PaymentPopup({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;
  // TODO: API 결제 상세 조회
  const p = getPayment(paymentId);

  return (
    <PopupShell
      title="결제 상세"
      footer={
        <>
          {p.status === "결제 완료" && (
            <a href={`/popup/refund/${p.id}`} className="ds-btn ds-btn--danger">
              환불 신청
            </a>
          )}
          <a href={`/popup/print/payment-receipt/${p.id}`} className="ds-btn ds-btn--primary">
            영수증 출력
          </a>
        </>
      }
    >
      <div className="pp-box">
        <table className="ds-table ds-table--info">
          <tbody>
            <tr>
              <th>결제명</th>
              <td>{p.title}</td>
            </tr>
            <tr>
              <th>상태</th>
              <td>
                <Badge>{p.status}</Badge>
              </td>
            </tr>
            <tr>
              <th>결제 수단</th>
              <td>{p.method}</td>
            </tr>
            {p.account && (
              <tr>
                <th>입금 계좌</th>
                <td>{p.account}</td>
              </tr>
            )}
            {p.depositor && (
              <tr>
                <th>입금자</th>
                <td>{p.depositor}</td>
              </tr>
            )}
            <tr>
              <th>신청일</th>
              <td>{p.appliedAt}</td>
            </tr>
            <tr>
              <th>결제일</th>
              <td>{p.paidAt ?? "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="pp-box">
        <h2 className="pp-box-title">신청 과목</h2>
        <table className="ds-table">
          <thead>
            <tr>
              <th>과목명</th>
              <th>학습비</th>
            </tr>
          </thead>
          <tbody>
            {p.courses.map((c) => (
              <tr key={c.title}>
                <td className="is-left">{c.title}</td>
                <td>{formatWon(c.price)}</td>
              </tr>
            ))}
            <tr>
              <td className="is-left">총 학습비</td>
              <td>{formatWon(p.total)}</td>
            </tr>
            <tr>
              <td className="is-left">쿠폰 할인</td>
              <td className="ds-text-danger">- {formatWon(p.coupon)}</td>
            </tr>
            <tr>
              <td className="is-left">
                <strong>결제 금액</strong>
              </td>
              <td>
                <strong className="pp-amount">{formatWon(p.paid)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </PopupShell>
  );
}
