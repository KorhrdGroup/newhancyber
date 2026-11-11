"use client";

import { useState } from "react";
import { closePopup } from "../PopupActions";

/** 과제·학습심화활동·토론 글쓰기 */
export default function WriteForm({ withFile, submitLabel, placeholder }: { withFile?: boolean; submitLabel: string; placeholder: string }) {
  const [body, setBody] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) {
      alert("내용을 적어 주세요.");
      return;
    }
    // TODO: API 제출 (본문 + 첨부 파일)
    alert(`${submitLabel} API 연동 전입니다.`);
    closePopup();
  };

  return (
    <form onSubmit={submit}>
      <div className="pp-field">
        <label className="ds-label" htmlFor="write-body">
          내용
        </label>
        <textarea id="write-body" className="ds-textarea" placeholder={placeholder} value={body} onChange={(e) => setBody(e.target.value)} />
        <p className="pp-note ds-mt-4 ds-text-right">
          {body.length}자
        </p>
      </div>
      {withFile && (
        <div className="pp-field">
          <label className="ds-label" htmlFor="write-file">
            첨부 파일
          </label>
          <input id="write-file" type="file" accept=".hwp,.hwpx,.doc,.docx,.pdf" />
          <p className="pp-note ds-mt-4">
            한글·워드·PDF 파일, 10MB까지 올릴 수 있습니다.
          </p>
        </div>
      )}
      <div className="pp-actions">
        <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
