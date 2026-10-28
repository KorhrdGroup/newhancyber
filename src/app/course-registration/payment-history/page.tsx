import type { Metadata } from "next";
import PaymentHistoryContent from "@/components/course-registration/PaymentHistoryContent";
import MobilePageBanner from "@/components/layout/MobilePageBanner";

export const metadata: Metadata = { title: "결제내역" };

export default function CoursePaymentHistoryPage() {
  return (
    <>
      <MobilePageBanner name="payment-history" text="결제내역" />
      <PaymentHistoryContent />
    </>
  );
}
