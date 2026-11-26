import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/my-classroom/ClassroomUI";
import PopupShell from "@/components/my-classroom/PopupShell";
import { formatWon, getPayment } from "@/components/my-classroom/classroomData";
import { isDbConfigured } from "@/lib/db/client";
import { getMemberPayment } from "@/lib/db/payments";
import { getCurrentMember } from "@/lib/memberAuth";

export const metadata: Metadata = { title: "결제 상세" };

/**
 * 결제 상세 (마이페이지 결제 내역 「결제 상세」 팝업) — 로그인한 회원 자신의 결제만 (다른 번호면 404). DB 설정이 없으면 샘플.
 * 장학 신청 · 환불 신청 · 영수증 출력 모두 DB 로 이어진다 (영수증은 돈을 받은 결제만).
 */
export default async function PaymentPopup({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;
  const isDb = isDbConfigured();
  let p;
  if (isDb) {
    const id = Number(paymentId);
    if (!Number.isSafeInteger(id) || id <= 0) notFound();
    const member = await getCurrentMember();
    if (!member) redirect(`/member/login?next=${encodeURIComponent(`/popup/payment/${id}`)}`);
    const found = await getMemberPayment(member.memberId, id);
    if (!found) notFound();
    p = found;
  } else {
    p = { ...getPayment(paymentId), refunded: 0 };
  }

  return (
    <PopupShell
      title="결제 상세"
      footer={
        isDb ? (
          <>
            {/* 결제 완료(또는 일부만 환불된) 결제만 — 과목별로 신청할 수 있는지는 환불 신청 화면이 다시 본다 */}
            {/* 장학 — LMS 가 승인할 수 있는 결제 상태만. 이미 신청했는지 · 대상 과목은 장학 신청 화면이 다시 본다 */}
            {["입금 대기", "결제 완료", "부분 환불", "환불 반려"].includes(p.status) && (
              <a href={`/popup/scholarship/${p.id}`} className="ds-btn ds-btn--secondary">
                장학 신청
              </a>
            )}
            {(p.status === "결제 완료" || p.status === "부분 환불") && (
              <a href={`/popup/refund/${p.id}`} className="ds-btn ds-btn--danger">
                환불 신청
              </a>
            )}
            {/* 영수증 — 돈을 받은 결제만 (입금 대기 · 결제 취소 제외, 출력 화면이 다시 본다) */}
            {!["입금 대기", "결제 취소"].includes(p.status) && (
              <a href={`/popup/print/payment-receipt/${p.id}`} className="ds-btn ds-btn--primary">
                영수증 출력
              </a>
            )}
          </>
        ) : (
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
        )
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
            {p.courses.map((c, i) => (
              <tr key={`${i}-${c.title}`}>
                <td className="is-left">{c.title}</td>
                <td>{formatWon(c.price)}</td>
              </tr>
            ))}
            <tr>
              <td className="is-left">총 학습비</td>
              <td>{formatWon(p.total)}</td>
            </tr>
            <tr>
              <td className="is-left">{isDb ? "할인" : "쿠폰 할인"}</td>
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
            {p.refunded > 0 && (
              <tr>
                <td className="is-left">환불 금액</td>
                <td>{formatWon(p.refunded)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </PopupShell>
  );
}
