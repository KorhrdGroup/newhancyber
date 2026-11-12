import type { Metadata } from "next";
import InquiryWriteForm from "@/components/learning-support/extra/InquiryWriteForm";

export const metadata: Metadata = { title: "1:1 문의하기" };

// TODO: 로그인 확인 — 로그인하지 않았으면 /member/login 으로 보낸다
export default function LearningInquiryWritePage() {
  return (
    <main className="wrapper">
      <div className="container lx-page lx-page--top">
        <h1 className="page-title">1:1 문의하기</h1>
        <p className="lx-desc">답변이 등록되면 1:1 문의 목록에서 확인하실 수 있습니다.</p>
        <InquiryWriteForm />
      </div>
    </main>
  );
}
