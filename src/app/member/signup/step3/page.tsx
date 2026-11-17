import type { Metadata } from "next";
import Link from "next/link";
import SignupProgress from "@/components/member/SignupProgress";
import "@/styles/classroom.css";

export const metadata: Metadata = { title: "회원가입 완료" };

// TODO: 가입 API 응답으로 받은 회원 정보로 바꾼다 (원본 샘플 값)
const member = {
  name: "홍길동",
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
      <div className="container member-page">
        <h1 className="member-title">회원가입</h1>
        <SignupProgress current={3} />

        <div className="signup-panel signup-done">
          <img src="/resources/images/member/signsucess.png" alt="" className="signup-done-icon" />
          <h2 className="signup-done-title">
            회원가입이 <span className="signup-done-highlight">완료</span>되었습니다.
          </h2>
          <p className="signup-done-desc">한평생원격교육원의 회원이 되신 것을 진심으로 축하합니다.</p>

          <section className="signup-done-info">
            <h3 className="pp-box-title">회원님의 가입정보입니다.</h3>
            <table className="ds-table ds-table--info">
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

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
