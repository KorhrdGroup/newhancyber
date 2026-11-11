"use client";

import { useState } from "react";
import { closePopup } from "../PopupActions";

export default function ReviewForm() {
  const [stars, setStars] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stars || !title.trim() || body.trim().length < 20) {
      alert("별점, 제목, 20자 이상의 후기를 모두 적어 주세요.");
      return;
    }
    // TODO: API 수강후기 등록
    alert("수강후기 등록 API 연동 전입니다.");
    closePopup();
  };

  return (
    <form onSubmit={submit} className="pp-box">
      <div className="pp-field">
        <span className="ds-label">별점</span>
        <div className="pp-stars" role="radiogroup" aria-label="별점">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={stars === n} aria-label={`${n}점`} className={`pp-star${n <= stars ? " is-on" : ""}`} onClick={() => setStars(n)}>
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="pp-field">
        <label className="ds-label" htmlFor="review-title">
          제목
        </label>
        <input id="review-title" className="ds-input" maxLength={50} placeholder="한 줄로 적어 주세요." value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="pp-field">
        <label className="ds-label" htmlFor="review-body">
          후기
        </label>
        <textarea id="review-body" className="ds-textarea" placeholder="강의가 어땠는지 다른 학습자에게 알려 주세요. (20자 이상)" value={body} onChange={(e) => setBody(e.target.value)} />
        <p className="pp-note ds-mt-4 ds-text-right">
          {body.length}자
        </p>
      </div>
      <div className="pp-actions pp-actions--sm">
        <button type="button" className="ds-btn ds-btn--secondary" onClick={closePopup}>
          취소
        </button>
        <button type="submit" className="ds-btn ds-btn--primary">
          후기 등록
        </button>
      </div>
    </form>
  );
}
