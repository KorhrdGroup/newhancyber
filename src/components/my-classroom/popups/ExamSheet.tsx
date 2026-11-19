"use client";

import { useEffect, useState } from "react";
import type { ExamQuestion } from "../classroomData";
import { closePopup } from "../PopupActions";

/** 시험·퀴즈 답안지. minutes 가 있으면 남은 시간을 센다 */
export default function ExamSheet({ questions, minutes, submitLabel }: { questions: ExamQuestion[]; minutes?: number; submitLabel: string }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [left, setLeft] = useState(minutes ? minutes * 60 : 0);
  const answered = Object.keys(answers).length;
  const blanks = questions.filter((q) => answers[q.no] === undefined);

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
        {/* 안 푼 문항만 번호로 보여 준다. 누르면 그 문항으로 간다 */}
        {blanks.length > 0 ? (
          <nav className="pp-blanks" aria-label="안 푼 문항 바로가기">
            <p className="pp-blanks-title">안 푼 문항</p>
            <div className="pp-blanks-list">
              {blanks.map((q) => (
                <a key={q.no} href={`#q-${q.no}`} aria-label={`${q.no}번 문항으로`}>
                  {q.no}
                </a>
              ))}
            </div>
          </nav>
        ) : (
          <p className="pp-blanks-done">모두 풀었어요</p>
        )}
        <button type="button" className="ds-btn ds-btn--primary" onClick={submit}>
          {submitLabel}
        </button>
      </aside>
    </div>
  );
}
