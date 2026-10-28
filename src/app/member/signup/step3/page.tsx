import type { Metadata } from "next";
import Link from "next/link";
import SignupProgress from "@/components/member/SignupProgress";

export const metadata: Metadata = { title: "회원가입 완료" };

// TODO: 가입 API 응답으로 받은 회원 정보로 바꾼다 (원본 샘플 값)
const member = {
  name: "김덧셈",
  id: "pluskor",
  phone: "010-0000-0000",
  email: "plus@korhrd.com",
};

export default function SignupCompletePage() {
  const rows = [
    { label: "이름", value: member.name },
    { label: "아이디", value: member.id },
    { label: "핸드폰", value: member.phone },
    { label: "이메일", value: member.email },
  ];

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
            <p className="complete-subtitle">덧셈원격평생교육원의 회원이 되신 것을 진심으로 축하합니다.</p>
          </div>

          <div className="complete-icon">
            <img src="/resources/images/member/signsucess.png" alt="가입 완료" className="success-icon" />
          </div>

          <div className="member-info-section">
            <h3 className="member-info-title">회원님의 가입정보입니다.</h3>
            <div className="member-info-table">
              {rows.map((row) => (
                <div key={row.label} className="member-info-row">
                  <div className="member-info-label">{row.label}</div>
                  <div className="member-info-value">{row.value}</div>
                </div>
              ))}
            </div>
          </div>

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
