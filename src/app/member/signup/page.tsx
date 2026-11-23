import type { Metadata } from "next";
import SignupProgress from "@/components/member/SignupProgress";
import SignupTerms from "@/components/member/SignupTerms";
import { getSiteTerms } from "@/lib/site";

export const metadata: Metadata = { title: "회원가입" };

export default async function SignupTermsPage() {
  // 관리자 「약관 관리」에 있는 약관만 바꿔 보인다 — 없는 칸은 지금 코드 안 문서
  const t = await getSiteTerms();
  const texts = {
    terms: t["이용약관"]?.content,
    agreement1: t["개인정보 수집 및 이용 동의"]?.content,
    privacy2: t["마케팅 수신 정보"]?.content,
  };
  return (
    <main className="wrapper">
      <div className="container member-page">
        <h1 className="member-title">회원가입</h1>
        <SignupProgress current={1} />
        <SignupTerms texts={texts} />
      </div>
    </main>
  );
}
