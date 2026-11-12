"use client";

import Link from "next/link";
import { useState } from "react";
import type { AppealKind } from "../myPageDataB";

/** U34 이의신청 쓰기 (성적 / 기타) */
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
  const [reason, setReason] = useState("");
  const itemLabel = kind === "grade" ? "평가 항목" : "신청 구분";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !item) {
      alert(`과목과 ${itemLabel}을 골라 주세요.`);
      return;
    }
    if (!reason.trim()) {
      alert("신청 사유를 적어 주세요.");
      return;
    }
    // TODO: API 이의신청 등록 (kind, courseId, item, reason, 첨부 파일)
    alert("이의신청 API 연동 전입니다.");
  };

  return (
    <form onSubmit={submit} className="pp-box">
      <div className="pp-field">
        <label className="ds-label" htmlFor="appeal-course">
          과목
        </label>
        <select id="appeal-course" className="ds-select" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">골라 주세요</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title} ({c.term})
            </option>
          ))}
        </select>
      </div>
      <div className="pp-field">
        <label className="ds-label" htmlFor="appeal-item">
          {itemLabel}
        </label>
        <select id="appeal-item" className="ds-select" value={item} onChange={(e) => setItem(e.target.value)}>
          <option value="">골라 주세요</option>
          {items.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </div>
      <div className="pp-field">
        <label className="ds-label" htmlFor="appeal-reason">
          신청 사유
        </label>
        <textarea
          id="appeal-reason"
          className="ds-textarea"
          placeholder="어떤 부분에 이의가 있는지, 그렇게 생각하는 까닭을 구체적으로 적어 주세요."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <p className="pp-note ds-mt-4 ds-text-right">{reason.length}자</p>
      </div>
      <div className="pp-field">
        <label className="ds-label" htmlFor="appeal-file">
          첨부 파일 <span className="pp-note">(선택)</span>
        </label>
        <input id="appeal-file" type="file" accept=".jpg,.jpeg,.png,.pdf,.hwp,.hwpx,.doc,.docx" />
        <p className="pp-note ds-mt-4">화면 캡처·답안 사진 같은 근거 자료를 올려 주세요. 10MB까지 올릴 수 있어요.</p>
      </div>
      <div className="pp-actions">
        <Link href={backHref} className="ds-btn ds-btn--secondary">
          취소
        </Link>
        <button type="submit" className="ds-btn ds-btn--primary">
          신청하기
        </button>
      </div>
    </form>
  );
}
