"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";
import FileField from "@/components/common/FileField";

/** 원본 글쓰기 화면 기준: 최대 10MB, doc·pdf·hwp·ppt·xls·txt·jpg·png·gif */
const MAX_FILE_SIZE = 10 * 1024 * 1024;
/** 원본 /bbs/bbsIn.asp 의 실제 확장자 검사(expExractAllUsr) 목록. 원본 화면 문구(ppt·txt·gif 포함)는 검사와 달랐음 */
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "pdf", "hwp", "hwpx", "doc", "docx", "xls", "xlsx"];

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
    if (file.size >= MAX_FILE_SIZE) error = "파일은 최대 10MB까지 올릴 수 있습니다.";
    else if (!ALLOWED_EXTENSIONS.includes(ext)) error = "올릴 수 없는 파일 형식입니다. 아래 확장자의 파일만 올릴 수 있습니다.";

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
        <FileField
          id="inquiry-file"
          accept={ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
          onChange={handleFile}
        />
        {fileError && <p className="lx-note ds-text-danger">{fileError}</p>}
        <p className="lx-note">최대 10MB, {ALLOWED_EXTENSIONS.join("·")} 파일만 올릴 수 있습니다.</p>
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
