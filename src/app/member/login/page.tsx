import type { Metadata } from "next";
import Link from "next/link";
import LoginForms from "@/components/member/LoginForms";

export const metadata: Metadata = { title: "로그인" };

const MEMBER_IMG = "/resources/images/member";

/** ?next=/course-registration/cart 처럼 오면 로그인한 뒤 그 주소로 돌아간다 (검사는 서버 액션 safeNext) */
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const { next } = await searchParams;
  return (
    <main className="wrapper">
      <div className="container member-page">
        <h1 className="member-title">로그인</h1>
        <LoginForms next={typeof next === "string" ? next : undefined} />

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
