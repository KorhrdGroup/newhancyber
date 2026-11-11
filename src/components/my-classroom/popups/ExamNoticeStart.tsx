"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CloseButton } from "../PopupActions";

/** 유의사항 동의 → 응시 시작 */
export default function ExamNoticeStart({ startHref }: { startHref: string }) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  return (
    <>
      <div className="pp-box ds-mt-16">
        <label className="ds-check">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          유의사항을 모두 읽었고, 이에 동의합니다.
        </label>
      </div>
      <div className="pp-actions">
        <CloseButton variant="button" label="나중에 보기" />
        <button type="button" className="ds-btn ds-btn--primary" disabled={!agreed} onClick={() => router.replace(startHref)}>
          시험 시작
        </button>
      </div>
    </>
  );
}
