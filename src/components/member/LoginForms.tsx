"use client";

import { useState, type FormEvent } from "react";
import ButtonTabs from "@/components/common/ButtonTabs";
import "@/styles/classroom.css";

const MEMBER_IMG = "/resources/images/member";

type AuthMethod = "cert" | "simple";

const authMethods: { key: AuthMethod; label: string }[] = [
  { key: "cert", label: "공동 인증서" },
  { key: "simple", label: "간편 인증" },
];

/** 일반 로그인 · 공동 인증서/간편 인증 로그인 · SNS 로그인 (PC 3칸, 휴대폰은 인증서 칸 없이 세로로) */
export default function LoginForms() {
  const [authMethod, setAuthMethod] = useState<AuthMethod>("cert");

  const handleGeneralLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 로그인 API 연동 (userId, userPassword)
    alert("로그인 API 연동 전입니다.");
  };

  const handleCertLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 공동 인증서(certUserId) · 간편 인증 모듈 연동. 원본도 간편 인증은 "모듈을 연동해 주세요." 상태
    alert(authMethod === "cert" ? "공동 인증서 로그인 연동 전입니다." : "간편 인증 로그인 연동 전입니다.");
  };

  // TODO: 네이버/카카오 로그인 URL 로 이동
  const handleSnsLogin = (provider: "naver" | "kakao") => () => {
    alert(`${provider === "naver" ? "네이버" : "카카오"} 로그인 연동 전입니다.`);
  };

  return (
    <div className="member-cols member-cols--3">
      <section className="member-col">
        <h2 className="member-col-title">일반 로그인</h2>
        <form className="member-form" onSubmit={handleGeneralLogin}>
          <input
            type="text"
            id="userId"
            name="userId"
            className="ds-input"
            placeholder="아이디를 입력해주세요."
            aria-label="아이디"
            autoComplete="username"
            required
          />
          <input
            type="password"
            id="userPassword"
            name="userPassword"
            className="ds-input"
            placeholder="비밀번호를 입력해주세요."
            aria-label="비밀번호"
            autoComplete="current-password"
            required
          />
          <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg member-submit">
            로그인
          </button>
        </form>
      </section>

      <section className="member-col member-col--cert">
        <h2 className="member-col-title">인증서 · 간편 인증 로그인</h2>
        <form className="member-form" onSubmit={handleCertLogin}>
          <ButtonTabs items={authMethods} active={authMethod} onSelect={(k) => setAuthMethod(k as AuthMethod)} ariaLabel="인증 방법" />
          <input
            type="text"
            id="certUserId"
            name="certUserId"
            className="ds-input"
            placeholder="아이디를 입력해주세요."
            aria-label="아이디"
            required
          />
          <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg member-submit">
            로그인
          </button>
        </form>
      </section>

      <section className="member-col">
        <h2 className="member-col-title">SNS 로그인</h2>
        <div className="member-sns">
          <button type="button" className="member-sns-btn member-sns-btn--naver" onClick={handleSnsLogin("naver")}>
            <img src={`${MEMBER_IMG}/login-naver.png`} alt="" className="member-sns-icon" />
            <span className="member-sns-text">네이버 로그인</span>
          </button>
          <button type="button" className="member-sns-btn member-sns-btn--kakao" onClick={handleSnsLogin("kakao")}>
            <img src={`${MEMBER_IMG}/login-kakao.png`} alt="" className="member-sns-icon" />
            <span className="member-sns-text">카카오 로그인</span>
          </button>
        </div>
      </section>
    </div>
  );
}
