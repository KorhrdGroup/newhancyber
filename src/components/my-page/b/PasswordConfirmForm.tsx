"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <form onSubmit={submit} className="pp-box mq-confirm">
      <p className="mq-confirm-title">비밀번호를 한 번 더 확인할게요</p>
      <p className="pp-note ds-mt-4">개인정보를 지키기 위해 비밀번호를 다시 입력해 주세요.</p>
      <div className="pp-field ds-mt-20">
        <label className="ds-label" htmlFor="confirm-id">
          아이디
        </label>
        <input id="confirm-id" className="ds-input" value={userId} readOnly disabled />
      </div>
      <div className="pp-field">
        <label className="ds-label" htmlFor="confirm-password">
          비밀번호
        </label>
        <input
          id="confirm-password"
          type="password"
          className="ds-input"
          placeholder="비밀번호를 입력해 주세요."
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="pp-actions">
        <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg mq-full">
          확인
        </button>
      </div>
    </form>
  );
}
