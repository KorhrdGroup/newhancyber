"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { submitSurveyAction } from "@/app/popup/survey/actions";

export interface SurveyFormQuestion {
  questionId: number;
  questionType: "하나" | "여럿" | "글";
  title: string;
  options: string[];
  isRequired: boolean;
}

const TEXT_MAX = 2000;

/**
 * 강의 평가 (DB) — LMS 설문 관리의 문항 그대로: 하나 고르기 · 여러 개 고르기 · 글쓰기.
 * 보기 번호는 1부터 센다 (LMS 결과가 choices_json 을 그렇게 읽는다). 필수 문항을 비우면 그 문항으로 옮겨 안내한다.
 */
export default function CourseSurveyForm({ classId, questions }: { classId: number; questions: SurveyFormQuestion[] }) {
  const router = useRouter();
  const [choices, setChoices] = useState<Record<number, number[]>>({});
  const [texts, setTexts] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const pick = (q: SurveyFormQuestion, n: number, on: boolean) =>
    setChoices((c) => {
      const cur = c[q.questionId] ?? [];
      const next = q.questionType === "하나" ? [n] : on ? [...new Set([...cur, n])] : cur.filter((x) => x !== n);
      return { ...c, [q.questionId]: next };
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = questions.findIndex((q) =>
      q.isRequired && (q.questionType === "글" ? !(texts[q.questionId] ?? "").trim() : (choices[q.questionId] ?? []).length === 0),
    );
    if (missing >= 0) {
      setError(`${missing + 1}번 문항에 답해 주세요.`);
      document.getElementById(`sq-${questions[missing].questionId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const answers: Record<string, number[] | string> = {};
    for (const q of questions) {
      if (q.questionType === "글") answers[q.questionId] = texts[q.questionId] ?? "";
      else answers[q.questionId] = choices[q.questionId] ?? [];
    }
    setError(null);
    start(async () => {
      const r = await submitSurveyAction(classId, answers);
      if (r.ok) {
        setDone(r.message);
        router.refresh();
      } else setError(r.message);
    });
  };

  if (done) {
    return (
      <div className="pp-box" role="status">
        <p className="pp-text">{done}</p>
        <div className="pp-actions">
          <Link href={`/popup/grade/${classId}`} className="ds-btn ds-btn--primary">
            성적 보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      {questions.map((q, i) => (
        <fieldset key={q.questionId} id={`sq-${q.questionId}`} className="pp-question pp-box">
          <legend className="pp-question-text">
            {i + 1}. {q.title}
            {q.isRequired ? <span className="ds-text-danger"> *</span> : <span className="pp-note"> (선택)</span>}
            {q.questionType === "여럿" && <span className="pp-note"> · 여러 개 고를 수 있어요</span>}
          </legend>
          {q.questionType === "글" ? (
            <>
              <textarea
                className="ds-textarea"
                aria-label={`${i + 1}번 답`}
                maxLength={TEXT_MAX}
                value={texts[q.questionId] ?? ""}
                onChange={(e) => setTexts((t) => ({ ...t, [q.questionId]: e.target.value }))}
              />
              <p className="pp-note ds-mt-8">
                {(texts[q.questionId] ?? "").length} / {TEXT_MAX}자
              </p>
            </>
          ) : (
            <div className="pp-options">
              {q.options.map((opt, oi) => {
                const n = oi + 1;
                const checked = (choices[q.questionId] ?? []).includes(n);
                return (
                  <label key={oi} className="ds-check">
                    <input
                      type={q.questionType === "하나" ? "radio" : "checkbox"}
                      name={`sq${q.questionId}`}
                      checked={checked}
                      onChange={(e) => pick(q, n, e.target.checked)}
                    />
                    {opt}
                  </label>
                );
              })}
            </div>
          )}
        </fieldset>
      ))}
      {error && (
        <p className="ds-text-danger ds-mt-8" role="alert">
          {error}
        </p>
      )}
      <div className="pp-actions">
        <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg" disabled={pending}>
          {pending ? "제출하는 중…" : "평가 제출"}
        </button>
      </div>
      <p className="pp-note ds-text-center ds-mt-8">제출한 뒤에는 고칠 수 없어요.</p>
    </form>
  );
}
