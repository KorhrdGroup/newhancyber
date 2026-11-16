"use client";

import Link from "next/link";
import { useState } from "react";
import FileField from "@/components/common/FileField";
import { checkUserUpload, USER_UPLOAD_ACCEPT, USER_UPLOAD_NOTE } from "@/lib/upload";
import type { AppealKind } from "../myPageDataB";

/** 필수 칸 표시 */
const Req = () => <span className="mp-req">*</span>;

/** 성적 이의신청 첨부 칸 수 (원본 bbsAppealIn.asp 에 첨부 칸 4개) */
const GRADE_FILE_SLOTS = [1, 2, 3, 4];

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/**
 * U34 이의신청 쓰기 — 원본 칸 그대로.
 * 성적(/stdMng/bbsAppealIn.asp): 과목 · 구분 · 제목 · 내용 · 첨부 파일 4개, 버튼 '등록'.
 * 기타(/stdMng/appeal/appealEtcIn.asp): 신청일 · 과목 · 구분 · 내용, 첨부 없음, 버튼 '신청'.
 */
export default function AppealForm({
  kind,
  courses,
  items,
  backHref,
}: {
  kind: AppealKind;
  courses: { id: string; title: string; term: string }[];
  items: string[];
  backHref: string;
}) {
  const [courseId, setCourseId] = useState("");
  const [item, setItem] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const isGrade = kind === "grade";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) {
      alert("과목을 선택해 주세요.");
      return;
    }
    if (!item) {
      alert("구분을 선택해 주세요.");
      return;
    }
    if (isGrade && !title.trim()) {
      alert("제목을 입력해 주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해 주세요.");
      return;
    }
    // TODO: API 이의신청 등록 (성적: 과목, 구분, 제목, 내용, 첨부 파일 / 기타: 과목, 구분, 내용)
    alert("이의신청 API 연동 전입니다.");
  };

  return (
    <form onSubmit={submit} className="pp-box mp-form">
      <div className="mp-form-head">
        <h3 className="pp-box-title">{isGrade ? "성적 이의신청" : "기타 항목 이의신청"}</h3>
        <p className="pp-note">
          <Req /> 표시는 필수 입력 사항입니다.
        </p>
      </div>

      {!isGrade && (
        <div className="pp-field">
          <span className="ds-label">신청일</span>
          <p className="mp-static">{today()}</p>
        </div>
      )}

      <div className="pp-field">
        <label className="ds-label" htmlFor="appeal-course">
          과목
          <Req />
        </label>
        <select id="appeal-course" className="ds-select" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">{isGrade ? "과목을 선택해 주세요." : "선택해 주세요."}</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title} ({c.term})
            </option>
          ))}
        </select>
      </div>

      <div className="pp-field">
        <label className="ds-label" htmlFor="appeal-item">
          구분
          <Req />
        </label>
        <select id="appeal-item" className="ds-select" value={item} onChange={(e) => setItem(e.target.value)}>
          <option value="">{isGrade ? "구분을 선택해 주세요." : "선택해 주세요."}</option>
          {items.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </div>

      {isGrade && (
        <div className="pp-field">
          <label className="ds-label" htmlFor="appeal-title">
            제목
            <Req />
          </label>
          <input
            id="appeal-title"
            className="ds-input"
            placeholder="제목을 입력해 주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      )}

      <div className="pp-field">
        <label className="ds-label" htmlFor="appeal-content">
          내용
          <Req />
        </label>
        <textarea
          id="appeal-content"
          className="ds-textarea"
          placeholder={isGrade ? "내용을 입력해 주세요." : undefined}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {isGrade && (
        <div className="pp-field">
          <span className="ds-label">첨부 파일</span>
          <div className="mp-file-list">
            {GRADE_FILE_SLOTS.map((n) => (
              <FileField
                key={n}
                id={`appeal-file-${n}`}
                accept={USER_UPLOAD_ACCEPT}
                validate={checkUserUpload}
                label={`첨부 파일 ${n}`}
              />
            ))}
          </div>
          <p className="pp-note ds-mt-4">{USER_UPLOAD_NOTE}</p>
        </div>
      )}

      <div className="pp-actions">
        <Link href={backHref} className="ds-btn ds-btn--secondary">
          취소
        </Link>
        <button type="submit" className="ds-btn ds-btn--primary">
          {isGrade ? "등록" : "신청"}
        </button>
      </div>
    </form>
  );
}
