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
          <fieldset key={q.no} id={`q-${q.no}`} className="pp-question">
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
        <div className="pp-progress">
          <p className="pp-progress-head">
            <span>푼 문항</span>
            <strong>
              {answered}
              <small> / {questions.length}</small>
            </strong>
          </p>
          <div className="pp-progress-bar" aria-hidden="true">
            <i style={{ width: `${(answered / questions.length) * 100}%` }} />
          </div>
        </div>
        {/* 번호를 누르면 그 문항으로 간다. 푼 문항은 연한 파랑 동그라미 */}
        <nav className="pp-omr" aria-label="문항 바로가기">
          {questions.map((q) => {
            const done = answers[q.no] !== undefined;
            return (
              <a key={q.no} href={`#q-${q.no}`} className={done ? "is-done" : undefined} aria-label={`${q.no}번${done ? " (풀었음)" : ""}`}>
                {q.no}
              </a>
            );
          })}
        </nav>
        <button type="button" className="ds-btn ds-btn--primary" onClick={submit}>
          {submitLabel}
        </button>
      </aside>
    </div>
  );
}
