"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { createInquiry } from "@/app/learning-support/inquiry/actions";
import { INQUIRY_CONTENT_MAX, INQUIRY_TITLE_MAX } from "@/app/learning-support/inquiry/limits";

const LIST = "/learning-support/inquiry";

/**
 * 1:1 문의 쓰기 (제목·내용) — 서버 액션 createInquiry 가 board_posts(qna)에 넣는다.
 * 첨부파일 칸은 뺐다: 관리자 1:1 문의는 첨부가 없어(boards.ts files: false) 올려도 남길 곳 · 볼 곳이 없다.
 */
export default function InquiryWriteForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    if (!title.trim()) {
      alert("제목을 입력해 주세요.");
      document.getElementById("inquiry-title")?.focus();
      return;
    }
    if (!body.trim()) {
      alert("내용을 입력해 주세요.");
      document.getElementById("inquiry-body")?.focus();
      return;
    }
    const data = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const result = await createInquiry(data);
        alert(result.message);
        if (result.ok) {
          router.push(LIST);
          router.refresh();
        } else if (result.needLogin) {
          router.push("/member/login");
        } else if (result.field) {
          document.getElementById(result.field)?.focus();
        }
      } catch {
        alert("지금은 문의를 등록할 수 없어요. 잠시 뒤 다시 시도해 주세요.");
      }
    });
  };

  return (
    <form className="lx-panel lx-form" onSubmit={handleSubmit}>
      <div className="lx-field">
        <label className="ds-label" htmlFor="inquiry-title">
          제목
        </label>
        <input
          id="inquiry-title"
          name="title"
          type="text"
          className="ds-input"
          placeholder="제목을 입력해 주세요."
          maxLength={INQUIRY_TITLE_MAX}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="lx-field">
        <label className="ds-label" htmlFor="inquiry-body">
          내용
        </label>
        <textarea
          id="inquiry-body"
          name="content"
          className="ds-textarea lx-textarea"
          placeholder="문의 내용을 자세히 적어 주세요. (수강 과목, 차수 등)"
          maxLength={INQUIRY_CONTENT_MAX}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div className="lx-actions">
        <Link href={LIST} className="ds-btn ds-btn--secondary ds-btn--lg">
          취소
        </Link>
        <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg" disabled={pending}>
          {pending ? "등록 중…" : "등록"}
        </button>
      </div>
    </form>
  );
}
