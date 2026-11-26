"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitWritingAction } from "@/app/popup/exam/actions";
import FileField from "@/components/common/FileField";
import { closePopup } from "../PopupActions";

/**
 * 과제 · 학습심화활동 · 토론 글쓰기.
 * db 가 있으면 실제로 낸다 (submitWritingAction — 채점 전 · 기간 안이면 고쳐 낸다, initial 은 지금 낸 글).
 * 첨부 파일은 DB 에 둘 곳이 아직 없어 db 화면에서는 받지 않는다 (샘플 화면만 칸이 보인다).
 * 결과는 알림 창 대신 화면 안에 보인다.
 */
export default function WriteForm({
  withFile,
  submitLabel,
  placeholder,
  db,
}: {
  withFile?: boolean;
  submitLabel: string;
  placeholder: string;
  db?: { classId: number; assessmentId: number; initial?: string };
}) {
  const [body, setBody] = useState(db?.initial ?? "");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [isSending, startSending] = useTransition();
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) {
      setMessage({ ok: false, text: "내용을 적어 주세요." });
      return;
    }
    if (!db) {
      setMessage({ ok: false, text: "샘플 화면이라 제출하지 않아요." });
      return;
    }
    setMessage(null);
    startSending(async () => {
      const r = await submitWritingAction(db.classId, db.assessmentId, body);
      if (r.needLogin) {
        router.push(`/member/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }
      setMessage({ ok: r.ok, text: r.message });
      if (r.ok) {
        window.opener?.location.reload(); // 강의실을 「참여 완료」로
        router.refresh(); // 이 창의 제출 내용 · 토론 글 목록
      }
    });
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
      {withFile && !db && (
        <div className="pp-field">
          <label className="ds-label" htmlFor="write-file">
            첨부 파일
          </label>
          <FileField id="write-file" accept=".hwp,.hwpx,.doc,.docx,.pdf" />
          <p className="pp-note ds-mt-4">
            한글·워드·PDF 파일, 10MB까지 올릴 수 있습니다.
          </p>
        </div>
      )}
      {message && (
        <p className={message.ok ? "pp-note" : "ds-text-danger"} role={message.ok ? "status" : "alert"}>
          {message.text}
        </p>
      )}
      <div className="pp-actions">
        {message?.ok && (
          <button type="button" className="ds-btn ds-btn--secondary ds-btn--lg" onClick={closePopup}>
            닫기
          </button>
        )}
        <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg" disabled={isSending}>
          {db?.initial ? "고쳐서 다시 내기" : submitLabel}
        </button>
      </div>
    </form>
  );
}
