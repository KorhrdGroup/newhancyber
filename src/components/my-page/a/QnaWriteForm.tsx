"use client";

import Link from "next/link";
import { useState } from "react";

/** U28 학습 Q&A 문의하기 */
export default function QnaWriteForm({ courses }: { courses: { id: string; title: string }[] }) {
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !title.trim() || !content.trim()) {
      alert("과목, 제목, 내용을 모두 적어 주세요.");
      return;
    }
    // TODO: API 학습 Q&A 등록 (courseId, title, content, 첨부파일)
    alert("학습 Q&A 등록 API 연동 전입니다.");
  };

  return (
    <form onSubmit={submit} className="pp-box">
      <div className="pp-field">
        <label className="ds-label" htmlFor="qna-course">
          과목
        </label>
        <select id="qna-course" className="ds-select" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">질문할 과목을 골라 주세요</option>
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
        </label>
        <input id="qna-title" className="ds-input" placeholder="질문을 한 줄로 적어 주세요." value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
      </div>
      <div className="pp-field">
        <label className="ds-label" htmlFor="qna-content">
          내용
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
          첨부파일 (선택)
        </label>
        <input id="qna-file" type="file" className="mp-file" />
        <p className="pp-note ds-mt-4">10MB 이하 파일 한 개를 붙일 수 있습니다.</p>
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
