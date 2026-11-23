import type { Metadata } from "next";
import InquiryWriteForm from "@/components/learning-support/extra/InquiryWriteForm";
import { InquiryLoginNeeded, InquiryUnavailable } from "@/components/learning-support/extra/MemberInquiries";
import { loadCurrentMember } from "@/lib/publicBoards";

export const metadata: Metadata = { title: "1:1 문의하기" };

/** 1:1 문의하기 — 로그인한 회원만 쓴다(저장은 서버 액션이 로그인을 한 번 더 본다) */
export default async function LearningInquiryWritePage() {
  const member = await loadCurrentMember();
  return (
    <main className="wrapper">
      <div className="container lx-page lx-page--top lx-page--plain">
        <h1 className="page-title">1:1 문의하기</h1>
        <p className="lx-desc">답변이 등록되면 1:1 문의 목록에서 확인하실 수 있습니다.</p>
        {member === null ? <InquiryLoginNeeded /> : member === "failed" ? <InquiryUnavailable /> : <InquiryWriteForm />}
      </div>
    </main>
  );
}
