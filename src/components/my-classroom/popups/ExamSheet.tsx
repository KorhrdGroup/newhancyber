"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitExamAction } from "@/app/popup/exam/actions";
import type { ExamQuestion } from "../classroomData";
import { closePopup } from "../PopupActions";

/**
 * 시험 · 퀴즈 답안지. minutes 가 있으면 남은 시간을 센다 (샘플 — DB 평가에는 시험 시간 칸이 없어 기간으로만 막는다).
 * db 가 있으면 실제로 낸다 (submitExamAction — 객관식은 보기 번호 1부터, 단답 · 서술은 글). 결과는 화면 안에 보인다.
 * 보기가 없는 문항(단답형 · 서술형)은 글 칸으로 받는다.
 */
export default function ExamSheet({
  questions,
  minutes,
  submitLabel,
  db,
}: {
  questions: ExamQuestion[];
  minutes?: number;
  submitLabel: string;
  db?: { classId: number; assessmentId: number };
}) {
  /** 문항 번호(no) → 객관식은 보기 순번(0부터), 글 문항은 글 */
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [left, setLeft] = useState(minutes ? minutes * 60 : 0);
  const [askConfirm, setAskConfirm] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [isSending, startSending] = useTransition();
  const router = useRouter();
  const isAnswered = (q: ExamQuestion) => {
    const v = answers[q.no];
    return typeof v === "number" || (typeof v === "string" && v.trim() !== "");
  };
  const answered = questions.filter(isAnswered).length;
  const blanks = questions.filter((q) => !isAnswered(q));
  // 처음부터 번호가 잔뜩 보이면 부담스러워서, 남은 문항이 10개 이하일 때만 번호를 보여 준다
  const SHOW_BLANKS_AT = 10;

  useEffect(() => {
    if (!minutes) return;
    const timer = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [minutes]);

  const send = () => {
    if (!db) {
      setResult({ ok: false, text: "샘플 화면이라 답안을 내지 않아요." });
      return;
    }
    const payload: Record<string, string> = {};
    for (const q of questions) {
      if (q.id === undefined) continue;
      const v = answers[q.no];
      payload[String(q.id)] = typeof v === "number" ? String(v + 1) : (v ?? "");
    }
    startSending(async () => {
      const r = await submitExamAction(db.classId, db.assessmentId, payload);
      if (r.needLogin) {
        router.push(`/member/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }
      setResult({ ok: r.ok, text: r.message });
      // 내면 여는 창(강의실)을 새로 그려 「참여 완료」로
      if (r.ok) window.opener?.location.reload();
    });
  };

  // 확인 창(confirm) 대신 버튼을 한 번 더 누르게 한다 — 앱 안 브라우저는 확인 창을 막기도 한다
  const submit = () => {
    if (!askConfirm) {
      setAskConfirm(true);
      return;
    }
    setAskConfirm(false);
    send();
  };

  if (result?.ok) {
    return (
      <div className="pp-box">
        <h2 className="pp-box-title">답안 제출</h2>
        <p role="status">{result.text}</p>
        <div className="pp-actions">
          <button type="button" className="ds-btn ds-btn--primary" onClick={closePopup}>
            닫기
          </button>
        </div>
      </div>
    );
  }

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const blank = questions.length - answered;

  return (
    <div className="pp-exam">
      <div>
        {questions.map((q) => (
          <fieldset key={q.no} id={`q-${q.no}`} className="pp-question">
            <legend className="pp-question-text">
              {q.no}. {q.text}
              {q.score !== undefined && <span className="pp-note"> ({q.score}점)</span>}
            </legend>
            {q.options.length > 0 ? (
              <div className="pp-options">
                {q.options.map((opt, i) => (
                  <label key={i} className="ds-check">
                    <input type="radio" name={`q${q.no}`} checked={answers[q.no] === i} onChange={() => setAnswers((a) => ({ ...a, [q.no]: i }))} />
                    {["①", "②", "③", "④", "⑤", "⑥"][i] ?? `${i + 1}.`} {opt}
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                className={`ds-textarea${q.type === "단답형" ? " ds-textarea--sm" : ""}`}
                aria-label={`${q.no}번 답`}
                placeholder={q.type === "단답형" ? "답을 적어 주세요" : "답안을 적어 주세요"}
                maxLength={4000}
                value={typeof answers[q.no] === "string" ? (answers[q.no] as string) : ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.no]: e.target.value }))}
              />
            )}
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
            <i style={{ width: `${questions.length ? (answered / questions.length) * 100 : 0}%` }} />
          </div>
        </div>
        {/* 안 푼 문항만 번호로 보여 준다(거의 다 풀었을 때만). 누르면 그 문항으로 간다 */}
        {blanks.length === 0 ? (
          <p className="pp-blanks-done">모두 풀었어요</p>
        ) : blanks.length <= SHOW_BLANKS_AT ? (
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
        ) : null}
        {askConfirm && (
          <p className="ds-text-danger" role="alert">
            {blank > 0 ? `아직 ${blank}문항을 풀지 않았어요. ` : ""}제출하면 고칠 수 없어요. 한 번 더 누르면 제출돼요.
          </p>
        )}
        {result && !result.ok && (
          <p className="ds-text-danger" role="alert">
            {result.text}
          </p>
        )}
        <button type="button" className="ds-btn ds-btn--primary" onClick={submit} disabled={isSending}>
          {askConfirm ? "정말 제출하기" : submitLabel}
        </button>
      </aside>
    </div>
  );
}
