"use client";

import Link from "next/link";
import { useState } from "react";
import FileField from "@/components/common/FileField";
import { checkUserUpload, USER_UPLOAD_ACCEPT, USER_UPLOAD_NOTE } from "@/lib/upload";

/** 필수 칸 표시 */
const Req = () => <span className="mp-req">*</span>;

/** U28 학습 Q&A 문의하기 */
export default function QnaWriteForm({ courses }: { courses: { id: string; title: string }[] }) {
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) {
      alert("과목을 선택해 주세요.");
      return;
    }
    if (!title.trim()) {
      alert("제목을 입력해 주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해 주세요.");
      return;
    }
    // TODO: API 학습 Q&A 등록 (courseId, title, content, 첨부파일)
    alert("학습 Q&A 등록 API 연동 전입니다.");
  };

  return (
    <form onSubmit={submit} className="pp-box mp-form">
      <div className="mp-form-head">
        <h3 className="pp-box-title">학습 Q&A 문의하기</h3>
        <p className="pp-note">
          <Req /> 표시는 필수 입력 사항입니다.
        </p>
      </div>
      <div className="pp-field">
        <label className="ds-label" htmlFor="qna-course">
          과목
          <Req />
        </label>
        <select id="qna-course" className="ds-select" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">과목을 선택해 주세요.</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>
      <div className="pp-field">
        <label className="ds-label" htmlFor="qna-title">
          제목
          <Req />
        </label>
        <input id="qna-title" className="ds-input" placeholder="질문을 한 줄로 적어 주세요." value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
      </div>
      <div className="pp-field">
        <label className="ds-label" htmlFor="qna-content">
          내용
          <Req />
        </label>
        <textarea
          id="qna-content"
          className="ds-textarea"
          placeholder="궁금한 점을 자세히 적어 주시면 더 정확하게 답해 드릴 수 있어요. (몇 주차 몇 차시인지 등)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="pp-field">
        <label className="ds-label" htmlFor="qna-file">
          첨부 파일
        </label>
        <FileField id="qna-file" accept={USER_UPLOAD_ACCEPT} validate={checkUserUpload} />
        <p className="pp-note ds-mt-4">{USER_UPLOAD_NOTE}</p>
      </div>
      <div className="pp-actions">
        <Link href="/my-page/study-board/qna" className="ds-btn ds-btn--secondary">
          취소
        </Link>
        <button type="submit" className="ds-btn ds-btn--primary">
          등록
        </button>
      </div>
    </form>
  );
}
