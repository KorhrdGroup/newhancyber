import type { Metadata } from "next";
import MyPageShell from "@/components/my-page/MyPageShell";
import InquiryList from "@/components/my-page/b/InquiryList";

export const metadata: Metadata = { title: "학습 Q&A - 문의 내역 - 마이페이지" };

/** U36 문의 내역 — 학습 Q&A */
export default function QnaInquiriesPage() {
  return (
    <MyPageShell title="문의 내역" desc="남긴 문의와 답변을 한곳에서 볼 수 있어요.">
      <InquiryList kind="qna" />
    </MyPageShell>
  );
}
