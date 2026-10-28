import type { Metadata } from "next";
import { CONTACT_PHONE } from "@/components/layout/MobileFooter";
import FindUserForms from "@/components/member/FindUserForms";

export const metadata: Metadata = { title: "아이디 찾기/비밀번호 재발급" };

export default function FindUserPage() {
  return (
    <main className="wrapper">
      <div className="find-id-wrapper">
        <h1 className="find-id-main-title">아이디 찾기/비밀번호 재발급</h1>
        <FindUserForms />

        <div className="find-id-info-boxes">
          <div className="find-id-info-box">
            <p className="find-id-info-text">
              휴대폰 번호 변경 등 로그인에 문제가 있을 경우
              <br />
              <a href={`tel:${CONTACT_PHONE}`} className="find-id-phone-link">
                학사운영팀 {CONTACT_PHONE}
              </a>
              으로 문의바랍니다.
            </p>
          </div>
          <div className="find-id-info-box">
            <p className="find-id-info-text" style={{ textAlign: "center" }}>
              <strong>운영시간</strong> <strong>평일 09:00 ~ 18:00</strong>
              <br />
              <span className="find-id-info-text-small">점심시간 12:00~13:00 제외, 주말/공휴일 휴무</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
