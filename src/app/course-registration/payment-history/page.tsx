import type { Metadata } from "next";
import ExTabs from "@/components/course-registration/extra/ExTabs";
import { paymentHistoryTabs } from "@/components/course-registration/extra/extraData";
import PaymentHistoryContent from "@/components/course-registration/PaymentHistoryContent";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "결제내역" };

export default function CoursePaymentHistoryPage() {
  return (
    <>
      <MobilePageBanner name="payment-history" text="결제내역" />
      <ExTabs items={paymentHistoryTabs} />
      <PaymentHistoryContent />
    </>
  );
}
