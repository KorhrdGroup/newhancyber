"use client";

import { useState } from "react";
import { closePopup } from "../PopupActions";

export default function SurveyForm({ questions, scale }: { questions: string[]; scale: string[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [comment, setComment] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length < questions.length) {
      alert("모든 문항에 답해 주세요.");
      return;
    }
    // TODO: API 강의 평가 제출 (comment 포함)
    alert("강의 평가 제출 API 연동 전입니다.");
    closePopup();
  };

  return (
    <form onSubmit={submit}>
      <div className="pp-box cr-table-wrap">
        <table className="ds-table">
          <thead>
            <tr>
              <th>문항</th>
              {scale.map((s) => (
                <th key={s} className="pp-scale-col">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {questions.map((q, qi) => (
              <tr key={qi}>
                <td className="is-left">
                  {qi + 1}. {q}
                </td>
                {scale.map((s, si) => (
                  <td key={s}>
                    <input
                      type="radio"
                      name={`s${qi}`}
                      aria-label={`${qi + 1}번 ${s}`}
                      checked={answers[qi] === si}
                      onChange={() => setAnswers((a) => ({ ...a, [qi]: si }))}
                      className="ds-radio"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pp-box">
        <label className="ds-label" htmlFor="survey-comment">
          하고 싶은 말 (선택)
        </label>
        <textarea id="survey-comment" className="ds-textarea" placeholder="강의에서 좋았던 점이나 바라는 점을 적어 주세요." value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>
      <div className="pp-actions">
        <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg">
          평가 제출
        </button>
      </div>
    </form>
  );
}
