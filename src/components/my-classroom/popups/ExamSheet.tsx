"use client";

import { useEffect, useState } from "react";
import type { ExamQuestion } from "../classroomData";
import { closePopup } from "../PopupActions";

/** 시험·퀴즈 답안지. minutes 가 있으면 남은 시간을 센다 */
export default function ExamSheet({ questions, minutes, submitLabel }: { questions: ExamQuestion[]; minutes?: number; submitLabel: string }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [left, setLeft] = useState(minutes ? minutes * 60 : 0);
  const answered = Object.keys(answers).length;

  useEffect(() => {
    if (!minutes) return;
    const timer = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [minutes]);

  const submit = () => {
    const blank = questions.length - answered;
    if (!confirm(blank > 0 ? `아직 ${blank}문항을 풀지 않았습니다. 제출할까요?` : "답안을 제출할까요? 제출하면 고칠 수 없습니다.")) return;
    // TODO: API 답안 제출
    alert("답안 제출 API 연동 전입니다.");
    closePopup();
  };

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="pp-exam">
      <div>
        {questions.map((q) => (
          <fieldset key={q.no} className="pp-question">
            <legend className="pp-question-text">
              {q.no}. {q.text}
            </legend>
            <div className="pp-options">
              {q.options.map((opt, i) => (
                <label key={i} className="ds-check">
                  <input type="radio" name={`q${q.no}`} checked={answers[q.no] === i} onChange={() => setAnswers((a) => ({ ...a, [q.no]: i }))} />
                  {["①", "②", "③", "④", "⑤"][i]} {opt}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <aside className="pp-side">
        {minutes ? (
          <>
            <div className="pp-note ds-text-center">
              남은 시간
            </div>
            <div className={`pp-timer${left < 300 ? " is-low" : ""}`}>
              {mm}:{ss}
            </div>
          </>
        ) : null}
        <div className="pp-note">
          푼 문항 {answered} / {questions.length}
        </div>
        <div className="pp-omr">
          {questions.map((q) => (
            <span key={q.no} className={answers[q.no] !== undefined ? "is-done" : undefined}>
              {q.no}
            </span>
          ))}
        </div>
        <button type="button" className="ds-btn ds-btn--primary" onClick={submit}>
          {submitLabel}
        </button>
      </aside>
    </div>
  );
}
