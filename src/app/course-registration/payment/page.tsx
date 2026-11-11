import type { Metadata } from "next";
import PaymentForm from "@/components/course-registration/extra/PaymentForm";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import "@/styles/classroom.css";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "결제하기" };

export default function CoursePaymentPage() {
  return (
    <>
      {/* 장바구니와 같은 파란 제목 띠 모양을 쓴다 (course-registration.css 의 mobile-cart-banner) */}
      <MobilePageBanner name="cart" text="결제하기" />
      <main className="wrapper">
        <div className="ex-page">
          <div className="ex-page-head">
            <h1 className="ex-title">결제하기</h1>
            <p className="ex-desc">주문 과목과 결제 금액을 확인하고 결제 수단을 골라 주세요.</p>
          </div>
          <PaymentForm />
        </div>
      </main>
    </>
  );
}
