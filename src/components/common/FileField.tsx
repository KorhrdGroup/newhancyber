"use client";

import { useRef, useState, type ChangeEvent } from "react";
import "@/styles/classroom.css";

/**
 * 파일 첨부 칸 — 입력 칸과 같은 높이·테두리 안에 파일 이름(없으면 '선택된 파일 없음'),
 * 오른쪽 안쪽에 파일 선택 버튼. 파일을 고르면 지우기(×)가 나온다. 실제 file 입력은 숨기고 label 로 연다.
 * onChange 에서 e.target.value 를 비우면(형식·용량 검사 실패 등) 이름도 비운다.
 */
export default function FileField({
  id,
  accept,
  onChange,
}: {
  id: string;
  accept?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="ds-file-field">
      <input
        id={id}
        ref={inputRef}
        type="file"
        className="ds-file-input"
        accept={accept}
        onChange={(e) => {
          onChange?.(e);
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
  );
}
