import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { formatPrice } from "@/components/course-registration/courseData";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import { isDbConfigured } from "@/lib/db/client";
import { readMemberPayment } from "@/lib/db/payments";
import { getCurrentMember } from "@/lib/memberAuth";
import "@/styles/classroom.css";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "결제 완료" };

/** 결제 완료 — ?p=결제 번호. 로그인한 회원 자신의 결제만 보인다 (다른 번호면 404) */
export default async function PaymentCompletePage({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  const { p } = await searchParams;
  const paymentId = Number(p);
  if (!isDbConfigured() || !Number.isSafeInteger(paymentId) || paymentId <= 0) notFound();
  const member = await getCurrentMember();
  if (!member) redirect(`/member/login?next=${encodeURIComponent(`/course-registration/payment/complete?p=${paymentId}`)}`);
  const pay = await readMemberPayment(member.memberId, paymentId);
  if (!pay) notFound();

  return (
    <>
      <MobilePageBanner name="cart" text="결제 완료" />
      <main className="wrapper">
        <div className="ex-page">
          <div className="ex-page-head">
            <h1 className="ex-title">결제가 완료되었어요</h1>
            <p className="ex-desc">
              {member.name}님, 수강신청이 접수되었어요. 개강일부터 나의 강의실에서 수강할 수 있어요.
            </p>
          </div>
          <div className="ex-pay">
            <section className="ex-box">
              <h2 className="ex-section-title">결제한 과목 ({pay.items.length})</h2>
              <ul className="ex-order">
                {pay.items.map((item) => (
                  <li key={item.classId} className="ex-order-item">
                    <span className="ex-order-name">
                      <span className="ex-order-sub">{item.semester}</span>
                      {item.name}
                    </span>
                    <span className="ex-order-price">{formatPrice(item.paidAmount)}원</span>
                  </li>
                ))}
              </ul>
            </section>
            <aside className="ex-pay-side ex-box">
              <h2 className="ex-section-title">결제 정보</h2>
              <div className="ex-sum">
                <div className="ex-sum-row">
                  <span>결제 번호</span>
                  <strong>{pay.paymentId}</strong>
                </div>
                <div className="ex-sum-row">
                  <span>결제 수단</span>
                  <strong>{pay.method}</strong>
                </div>
                {pay.paidAt && (
                  <div className="ex-sum-row">
                    <span>결제 일시</span>
                    <strong>{pay.paidAt}</strong>
                  </div>
                )}
                <div className="ex-sum-total">
                  <span>결제 금액</span>
                  <strong>{formatPrice(pay.paidAmount)}원</strong>
                </div>
              </div>
              <Link href="/my-classroom" className="ds-btn ds-btn--primary ds-btn--lg ex-pay-btn">
                나의 강의실
              </Link>
              <Link href="/course-registration/register" className="ds-btn ds-btn--secondary ds-btn--lg ex-pay-btn">
                수강신청 계속하기
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
