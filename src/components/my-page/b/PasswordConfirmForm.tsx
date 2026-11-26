"use client";

import Link from "next/link";
import { useActionState } from "react";
import { confirmProfilePassword, type ConfirmState } from "@/app/my-page/profile/actions";

/** 필수 칸 표시 */
const Req = () => <span className="mp-req">*</span>;

/** U35 내 정보 수정 1단계 — 비밀번호 확인 (맞으면 서버가 수정 화면으로 보낸다) */
export default function PasswordConfirmForm({ userId }: { userId: string }) {
  const [state, action, pending] = useActionState<ConfirmState, FormData>(confirmProfilePassword, {});

  return (
    <form action={action} className="pp-box mp-form mq-confirm">
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
          name="password"
          type="password"
          className="ds-input"
          placeholder="영문, 숫자, 특수문자 조합 8~20자"
          autoComplete="current-password"
          maxLength={20}
          required
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "confirm-error" : undefined}
        />
        {state.error && (
          <p id="confirm-error" className="ds-text-danger ds-mt-8" role="alert">
            {state.error}
          </p>
        )}
      </div>
      <div className="pp-actions">
        <Link href="/my-page/certificates" className="ds-btn ds-btn--secondary">
          취소
        </Link>
        <button type="submit" className="ds-btn ds-btn--primary" disabled={pending}>
          {pending ? "확인하는 중…" : "확인"}
        </button>
      </div>
    </form>
  );
}
