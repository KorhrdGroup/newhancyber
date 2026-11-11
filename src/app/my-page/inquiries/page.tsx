import type { Metadata } from "next";
import MyPageShell from "@/components/my-page/MyPageShell";
import InquiryList from "@/components/my-page/b/InquiryList";

export const metadata: Metadata = { title: "1:1 문의 - 문의 내역 - 마이페이지" };

/** U36 문의 내역 — 1:1 문의 */
export default function PersonalInquiriesPage() {
  return (
    <MyPageShell title="문의 내역" desc="남긴 문의와 답변을 한곳에서 볼 수 있어요.">
      <InquiryList kind="personal" />
    </MyPageShell>
  );
}
