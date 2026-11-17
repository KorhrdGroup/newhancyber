import type { Metadata } from "next";
import Link from "next/link";
import SignupCompleteInfo from "@/components/member/SignupCompleteInfo";
import SignupProgress from "@/components/member/SignupProgress";
import "@/styles/classroom.css";

export const metadata: Metadata = { title: "회원가입 완료" };

export default function SignupCompletePage() {
  return (
    <main className="wrapper">
      <div className="container member-page">
        <h1 className="member-title">회원가입</h1>
        <SignupProgress current={3} />

        <div className="signup-panel signup-done">
          <img src="/resources/images/member/signsucess.png" alt="" className="signup-done-icon" />
          <h2 className="signup-done-title">
            회원가입이 <span className="signup-done-highlight">완료</span>되었습니다.
          </h2>
          <p className="signup-done-desc">한평생원격교육원의 회원이 되신 것을 진심으로 축하합니다.</p>

          {/* 가입 정보는 2단계가 가입을 마치고 브라우저 저장소에 둔 값으로 채운다 */}
          <SignupCompleteInfo />

          <div className="signup-actions">
            <Link href="/" className="ds-btn ds-btn--secondary ds-btn--lg signup-submit">
              홈으로 돌아가기
            </Link>
            <Link href="/member/login" className="ds-btn ds-btn--primary ds-btn--lg signup-submit">
              로그인하러 가기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
