import type { Metadata } from "next";
import { SUPPORT_PHONE } from "@/lib/contact";
import FindUserForms from "@/components/member/FindUserForms";

export const metadata: Metadata = { title: "아이디 찾기/비밀번호 재발급" };

export default function FindUserPage() {
  return (
    <main className="wrapper">
      <div className="container member-page">
        <h1 className="member-title">아이디 찾기/비밀번호 재발급</h1>
        <FindUserForms />

        <div className="member-help">
          <p className="member-help-item">
            휴대폰 번호 변경 등 로그인에 문제가 있을 경우
            <br />
            <a href={`tel:${SUPPORT_PHONE}`} className="member-help-phone">
              학습지원센터 {SUPPORT_PHONE}
            </a>
            으로 문의바랍니다.
          </p>
          <p className="member-help-item">
            <strong>운영시간 평일 09:00 ~ 18:00</strong>
            <br />
            <small>점심시간 12:00~13:00 제외, 주말/공휴일 휴무</small>
          </p>
        </div>
      </div>
    </main>
  );
}
