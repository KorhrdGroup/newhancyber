"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { startExamAction } from "@/app/popup/exam/actions";
import { CloseButton } from "../PopupActions";

/**
 * 유의사항 동의 → 응시 시작. db 가 있으면 시작을 서버에 남기고(「응시 중」) 시험지로 넘어간다.
 * 안 되면(기간 · 수강 상태 · 이미 제출) 까닭을 화면 안에 보인다.
 */
export default function ExamNoticeStart({ startHref, db }: { startHref: string; db?: { classId: number; assessmentId: number } }) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, startStarting] = useTransition();

  const start = () => {
    if (!db) {
      router.replace(startHref);
      return;
    }
    setError(null);
    startStarting(async () => {
      const r = await startExamAction(db.classId, db.assessmentId);
      if (r.needLogin) {
        router.push(`/member/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }
      if (!r.ok) {
        setError(r.message);
        return;
      }
      router.replace(startHref);
    });
  };

  return (
    <>
      <div className="pp-box ds-mt-16">
        <label className="ds-check">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          유의사항을 모두 읽었고, 이에 동의합니다.
        </label>
        {error && (
          <p className="ds-text-danger ds-mt-8" role="alert">
            {error}
          </p>
        )}
      </div>
      <div className="pp-actions">
        <CloseButton variant="button" label="나중에 보기" />
        <button type="button" className="ds-btn ds-btn--primary" disabled={!agreed || isStarting} onClick={start}>
          시험 시작
        </button>
      </div>
    </>
  );
}
