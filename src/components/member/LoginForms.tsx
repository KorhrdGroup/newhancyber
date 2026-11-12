"use client";

import { useState, type FormEvent } from "react";

const MEMBER_IMG = "/resources/images/member";

type AuthMethod = "cert" | "simple";

const authMethods: { key: AuthMethod; label: string }[] = [
  { key: "cert", label: "공동 인증서" },
  { key: "simple", label: "간편 인증" },
];

/** 일반 로그인 · 공동 인증서/간편 인증 로그인 · SNS 로그인 */
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
    <div className="login-sections">
      <div className="login-section">
        <h2 className="login-section-title">일반 로그인</h2>
        <form className="login-form" id="generalLoginForm" onSubmit={handleGeneralLogin}>
          <div className="form-group">
            <input
              type="text"
              id="userId"
              name="userId"
              className="form-input"
              placeholder="아이디를 입력해주세요."
              autoComplete="username"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="userPassword"
              name="userPassword"
              className="form-input"
              placeholder="비밀번호를 입력해주세요."
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className="login-btn-primary">
            로그인
          </button>
        </form>
      </div>

      <div className="login-section">
        <h2 className="login-section-title">인증서 · 간편 인증 로그인</h2>
        {/* member.css 가 #certLoginForm 으로 버튼 간격을 잡는다 */}
        <form className="login-form" id="certLoginForm" onSubmit={handleCertLogin}>
          <div className="login-auth-tabs" role="tablist" aria-label="인증 방법">
            {authMethods.map((m) => (
              <button
                key={m.key}
                type="button"
                role="tab"
                aria-selected={authMethod === m.key}
                className={`login-auth-tab${authMethod === m.key ? " active" : ""}`}
                onClick={() => setAuthMethod(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="form-group">
            <input
              type="text"
              id="certUserId"
              name="certUserId"
              className="form-input"
              placeholder="아이디를 입력해주세요."
              required
            />
          </div>
          <button type="submit" className="login-btn-primary">
            로그인
          </button>
        </form>
      </div>

      <div className="login-section">
        <h2 className="login-section-title">SNS 로그인</h2>
        <div className="sns-login-buttons">
          <button type="button" className="sns-login-btn sns-naver" onClick={handleSnsLogin("naver")}>
            <span className="sns-icon">
              <img src={`${MEMBER_IMG}/login-naver.png`} alt="네이버" className="sns-icon-img" />
            </span>
            <span className="sns-text">네이버 로그인</span>
          </button>
          <button type="button" className="sns-login-btn sns-kakao" onClick={handleSnsLogin("kakao")}>
            <span className="sns-icon">
              <img src={`${MEMBER_IMG}/login-kakao.png`} alt="카카오" className="sns-icon-img" />
            </span>
            <span className="sns-text">카카오 로그인</span>
          </button>
        </div>
      </div>
    </div>
  );
}
