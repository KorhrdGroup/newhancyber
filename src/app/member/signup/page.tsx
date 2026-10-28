import type { Metadata } from "next";
import SignupProgress from "@/components/member/SignupProgress";
import SignupTerms from "@/components/member/SignupTerms";

export const metadata: Metadata = { title: "회원가입" };

export default function SignupTermsPage() {
  return (
    <main className="wrapper">
      <div className="signup-container">
        <h1 className="signup-title">회원가입</h1>
        <SignupProgress current={1} />
        <SignupTerms />
      </div>
    </main>
  );
}
