import type { Metadata } from "next";
import Link from "next/link";
import SignupCompleteInfo from "@/components/member/SignupCompleteInfo";
import SignupProgress from "@/components/member/SignupProgress";

export const metadata: Metadata = { title: "회원가입 완료" };

export default function SignupCompletePage() {
  return (
    <main className="wrapper">
      <div className="signup-container">
        <h1 className="signup-title">회원가입</h1>
        <SignupProgress current={3} />

        <div className="signup-complete-wrapper">
          <div className="complete-message">
            <h2 className="complete-title">
              회원가입이 <span className="complete-highlight">완료</span>되었습니다.
            </h2>
            <p className="complete-subtitle">한평생원격교육원의 회원이 되신 것을 진심으로 축하합니다.</p>
          </div>

          <div className="complete-icon">
            <img src="/resources/images/member/signsucess.png" alt="가입 완료" className="success-icon" />
          </div>

          <SignupCompleteInfo />

          <div className="complete-btn-wrapper">
            <Link href="/" className="complete-btn btn-home">
              홈으로 돌아가기
            </Link>
            <Link href="/member/login" className="complete-btn btn-login">
              로그인하러 가기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
