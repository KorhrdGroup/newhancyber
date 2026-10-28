import type { Metadata } from "next";
import RefundContent from "@/components/course-registration/RefundContent";

export const metadata: Metadata = { title: "학습비 반환규정" };

export default function CourseRefundPage() {
  return <RefundContent />;
}
