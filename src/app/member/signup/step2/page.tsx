import type { Metadata } from "next";
import SignupForm from "@/components/member/SignupForm";
import SignupProgress from "@/components/member/SignupProgress";

export const metadata: Metadata = { title: "회원가입" };

export default function SignupFormPage() {
  return (
    <main className="wrapper">
      <div className="container member-page">
        <h1 className="member-title">회원가입</h1>
        <SignupProgress current={2} />
        <SignupForm />
      </div>
    </main>
  );
}
