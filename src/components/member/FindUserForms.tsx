"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

/** 아이디 찾기 · 비밀번호 재발급 */
export default function FindUserForms() {
  const router = useRouter();

  const handleFindId = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 아이디 찾기 API 연동 (findIdName, findIdPhone)
    router.push("/member/find-user/result?type=id");
  };

  const handleFindPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 비밀번호 재발급 API 연동 (findPwName, findPwUserId, findPwPhone)
    router.push("/member/find-user/result?type=pw");
  };

  return (
    <div className="find-id-sections">
      <div className="find-id-section">
        <h2 className="find-id-section-title">아이디 찾기</h2>
        {/* member.css 가 #findIdForm 으로 버튼 간격을 잡는다 */}
        <form className="find-id-form" id="findIdForm" onSubmit={handleFindId}>
          <div className="form-group">
            <input
              type="text"
              id="findIdName"
              name="findIdName"
              className="form-input"
              placeholder="이름을 입력해주세요."
              required
            />
          </div>
          <div className="form-group">
            <input
              type="tel"
              id="findIdPhone"
              name="findIdPhone"
              className="form-input"
              placeholder="핸드폰 번호를 입력해주세요."
              required
            />
          </div>
          <button type="submit" className="find-id-btn-primary">
            확인
          </button>
          <p className="find-id-notice">
            이름 · 핸드폰 번호를 입력하시면,
            <br />
            핸드폰 번호로 아이디를 전송해드립니다.
          </p>
        </form>
      </div>

      <div className="find-id-section">
        <h2 className="find-id-section-title find-password-title">비밀번호 재발급</h2>
        <form className="find-id-form" id="findPasswordForm" onSubmit={handleFindPassword}>
          <div className="form-group">
            <input
              type="text"
              id="findPwName"
              name="findPwName"
              className="form-input"
              placeholder="이름을 입력해주세요."
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="findPwUserId"
              name="findPwUserId"
              className="form-input"
              placeholder="아이디를 입력해주세요."
              required
            />
          </div>
          <div className="form-group">
            <input
              type="tel"
              id="findPwPhone"
              name="findPwPhone"
              className="form-input"
              placeholder="핸드폰 번호를 입력해주세요."
              required
            />
          </div>
          <button type="submit" className="find-id-btn-primary">
            확인
          </button>
          <p className="find-id-notice">
            이름 · 아이디 · 핸드폰 번호를 입력하시면,
            <br />
            핸드폰 번호로 임시 비밀번호를 전송해드립니다.
          </p>
        </form>
      </div>
    </div>
  );
}
