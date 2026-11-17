import type { Metadata } from "next";
import Link from "next/link";
import LoginForms from "@/components/member/LoginForms";

export const metadata: Metadata = { title: "로그인" };

const MEMBER_IMG = "/resources/images/member";

export default function LoginPage() {
  return (
    <main className="wrapper">
      <div className="container member-page">
        <h1 className="member-title">로그인</h1>
        <LoginForms />

        <div className="member-links">
          <Link href="/member/signup" className="ds-btn ds-btn--secondary ds-btn--lg">
            <img src={`${MEMBER_IMG}/join-user.png`} alt="" className="member-link-icon" />
            회원가입
          </Link>
          <Link href="/member/find-user" className="ds-btn ds-btn--secondary ds-btn--lg">
            <img src={`${MEMBER_IMG}/find-IdPw.png`} alt="" className="member-link-icon" />
            아이디 찾기/비밀번호 재발급
          </Link>
        </div>
      </div>
    </main>
  );
}
