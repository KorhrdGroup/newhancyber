import type { Metadata } from "next";
import Link from "next/link";
import LoginForms from "@/components/member/LoginForms";

export const metadata: Metadata = { title: "로그인" };

const MEMBER_IMG = "/resources/images/member";

export default function LoginPage() {
  return (
    <main className="wrapper">
      <div className="login-wrapper">
        <h1 className="login-main-title">로그인</h1>
        <LoginForms />

        <div className="login-bottom-buttons">
          <Link href="/member/signup" className="login-bottom-btn signup-btn">
            <span className="btn-icon">
              <img src={`${MEMBER_IMG}/join-user.png`} alt="회원가입" className="btn-icon-img" />
            </span>
            <span className="btn-text">회원가입</span>
          </Link>
          <Link href="/member/find-user" className="login-bottom-btn find-btn">
            <span className="btn-icon">
              <img
                src={`${MEMBER_IMG}/find-IdPw.png`}
                alt="아이디 찾기/비밀번호 재발급"
                className="btn-icon-img"
              />
            </span>
            <span className="btn-text">아이디 찾기/비밀번호 재발급</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
