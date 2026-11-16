"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** 필수 칸 표시 */
const Req = () => <span className="mp-req">*</span>;

/** U35 내 정보 수정 1단계 — 비밀번호 확인 */
export default function PasswordConfirmForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      alert("비밀번호를 입력해 주세요.");
      return;
    }
    // TODO: API 비밀번호 확인 (틀리면 알림 후 머무름, 맞으면 수정 화면 접근 허용)
    router.push("/my-page/profile/edit");
  };

  return (
    <form onSubmit={submit} className="pp-box mp-form mq-confirm">
      <div className="mp-form-head">
        <h3 className="pp-box-title">현재 비밀번호 입력</h3>
      </div>
      <p className="pp-note mq-form-desc">개인정보를 지키기 위해 비밀번호를 한 번 더 확인합니다.</p>
      <div className="pp-field">
        <span className="ds-label">아이디</span>
        <p className="mp-static">{userId}</p>
      </div>
      <div className="pp-field">
        <label className="ds-label" htmlFor="confirm-password">
          비밀번호
          <Req />
        </label>
        <input
          id="confirm-password"
          type="password"
          className="ds-input"
          placeholder="영문, 숫자, 특수문자 조합 8~20자"
          autoComplete="current-password"
          maxLength={20}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="pp-actions">
        <Link href="/my-page/certificates" className="ds-btn ds-btn--secondary">
          취소
        </Link>
        <button type="submit" className="ds-btn ds-btn--primary">
          확인
        </button>
      </div>
    </form>
  );
}
