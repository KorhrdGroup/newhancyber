"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import FileField from "@/components/common/FileField";
import { checkUserUpload, USER_UPLOAD_ACCEPT, USER_UPLOAD_NOTE } from "@/lib/upload";

/** 1:1 문의 쓰기 (제목·내용·첨부파일) */
export default function InquiryWriteForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("제목을 입력해 주세요.");
      return;
    }
    if (!body.trim()) {
      alert("내용을 입력해 주세요.");
      return;
    }
    // TODO: 1:1 문의 등록 API 연동 (제목, 내용, 첨부파일) 후 목록으로 이동
    alert("1:1 문의 등록 API 연동 전입니다.");
  };

  return (
    <form className="lx-panel lx-form" onSubmit={handleSubmit}>
      <div className="lx-field">
        <label className="ds-label" htmlFor="inquiry-title">
          제목
        </label>
        <input
          id="inquiry-title"
          type="text"
          className="ds-input"
          placeholder="제목을 입력해 주세요."
          maxLength={100}
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
          className="ds-textarea lx-textarea"
          placeholder="문의 내용을 자세히 적어 주세요. (수강 과목, 차수 등)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div className="lx-field">
        <label className="ds-label" htmlFor="inquiry-file">
          첨부파일
        </label>
        <FileField id="inquiry-file" accept={USER_UPLOAD_ACCEPT} validate={checkUserUpload} />
        <p className="lx-note">{USER_UPLOAD_NOTE}</p>
      </div>

      <div className="lx-actions">
        <Link href="/learning-support/inquiry" className="ds-btn ds-btn--secondary ds-btn--lg">
          취소
        </Link>
        <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg">
          등록
        </button>
      </div>
    </form>
  );
}
