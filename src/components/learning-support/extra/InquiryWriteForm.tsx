"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";

/** 원본 글쓰기 화면 기준: 최대 10MB, doc·pdf·hwp·ppt·xls·txt·jpg·png·gif */
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["doc", "pdf", "hwp", "ppt", "xls", "txt", "jpg", "png", "gif"];

/** 1:1 문의 쓰기 (제목·내용·첨부파일) */
export default function InquiryWriteForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [fileError, setFileError] = useState("");

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError("");
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    let error = "";
    if (!ALLOWED_EXTENSIONS.includes(ext)) error = "올릴 수 없는 파일 형식입니다.";
    else if (file.size > MAX_FILE_SIZE) error = "10MB 이하 파일만 올릴 수 있습니다.";

    if (error) {
      setFileError(error);
      e.target.value = "";
    }
  };

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
        <input
          id="inquiry-file"
          type="file"
          className="lx-file"
          accept={ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
          onChange={handleFile}
        />
        {fileError && <p className="lx-note ds-text-danger">{fileError}</p>}
        <p className="lx-note">최대 10MB, doc·pdf·hwp·ppt·xls·txt·jpg·png·gif 파일만 올릴 수 있습니다.</p>
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
