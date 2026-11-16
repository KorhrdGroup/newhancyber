"use client";

import { useRef, useState } from "react";
import "@/styles/classroom.css";

/**
 * 파일 첨부 칸 — 입력 칸과 같은 높이·테두리 안에 파일 이름(없으면 '선택된 파일 없음'),
 * 오른쪽 안쪽에 파일 선택 버튼. 파일을 고르면 지우기(×)가 나온다. 실제 file 입력은 숨기고 label 로 연다.
 * validate 가 안내 문구를 돌려주면 칸을 비우고 칸 아래에 빨간 글씨로 보여 준다 (원본처럼 고를 때 바로 검사).
 */
export default function FileField({
  id,
  accept,
  validate,
}: {
  id: string;
  accept?: string;
  /** 통과하면 빈 문자열, 걸리면 안내 문구 */
  validate?: (file: File) => string;
}) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="ds-file-field">
        <input
          id={id}
          ref={inputRef}
          type="file"
          className="ds-file-input"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            const message = file && validate ? validate(file) : "";
            if (message) e.target.value = "";
            setError(message);
            setFileName(e.target.files?.[0]?.name ?? "");
          }}
        />
        <span className={fileName ? "ds-file-name" : "ds-file-name ds-file-name--empty"}>
          {fileName || "선택된 파일 없음"}
        </span>
        {fileName && (
          <button
            type="button"
            className="ds-file-clear"
            aria-label="첨부한 파일 지우기"
            onClick={() => {
              if (inputRef.current) inputRef.current.value = "";
              setFileName("");
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3.5 3.5l7 7m0-7l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
        <label htmlFor={id} className="ds-btn ds-btn--secondary ds-btn--sm ds-file-btn">
          파일 선택
        </label>
      </div>
      {error && (
        <p className="ds-file-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
