"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DemandQuestion } from "../myPageDataA";

/** U30 수요 조사 응답 — 고르기(radio)·여러 개 고르기(checkbox)·글로 적기(textarea, 선택) */
export default function DemandSurveyForm({ questions }: { questions: DemandQuestion[] }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const pick = (id: string, option: string, multiple: boolean) =>
    setAnswers((a) => {
      const current = a[id] ?? [];
      if (!multiple) return { ...a, [id]: [option] };
      return { ...a, [id]: current.includes(option) ? current.filter((o) => o !== option) : [...current, option] };
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = questions.findIndex((q) => q.type !== "textarea" && !answers[q.id]?.length);
    if (missing >= 0) {
      alert(`${missing + 1}번 문항에 답해 주세요.`);
      return;
    }
    // TODO: API 수요 조사 응답 제출 (answers)
    alert("수요 조사 제출 API 연동 전입니다.");
    router.push("/my-page/surveys/demand");
  };

  return (
    <form onSubmit={submit} className="ds-mt-16">
      {questions.map((q, i) => (
        <div key={q.id} className="pp-question" role="group" aria-labelledby={`dq-${q.id}`}>
          <p id={`dq-${q.id}`} className="pp-question-text">
            {i + 1}. {q.text}
          </p>
          {q.type === "textarea" ? (
            <textarea
              className="ds-textarea ds-textarea--sm"
              placeholder={q.placeholder}
              aria-label={`${i + 1}번 답`}
              value={answers[q.id]?.[0] ?? ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: [e.target.value] }))}
            />
          ) : (
            <div className="pp-options">
              {q.type === "checkbox" && <p className="pp-note">여러 개 고를 수 있어요.</p>}
              {q.options.map((option) => (
                <label key={option} className="ds-check">
                  <input
                    type={q.type}
                    name={q.id}
                    className={q.type === "radio" ? "ds-radio" : undefined}
                    checked={answers[q.id]?.includes(option) ?? false}
                    onChange={() => pick(q.id, option, q.type === "checkbox")}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="pp-actions">
        <button type="button" className="ds-btn ds-btn--secondary" onClick={() => router.push("/my-page/surveys/demand")}>
          취소
        </button>
        <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg">
          제출
        </button>
      </div>
    </form>
  );
}
