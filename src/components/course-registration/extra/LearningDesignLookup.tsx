"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { sampleDesignResult, type DesignStatus, type LearningDesignResult } from "./extraData";

/** 상담 진행 단계 — 신청 결과의 상태값 순서 */
const designSteps: DesignStatus[] = ["접수", "상담 중", "상담 완료"];

/** 무료 학습설계 신청 결과 확인: 이름·연락처로 조회 → 결과 카드 */
export default function LearningDesignLookup() {
  const [result, setResult] = useState<LearningDesignResult | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: API 학습설계 신청 내역 조회 (new FormData(e.currentTarget) — lookupName, lookupPhone)
    setResult(sampleDesignResult);
  };

  return (
    <>
      <section className="ex-box">
        <h2 className="ex-section-title">신청 내역 조회</h2>
        <form className="ex-lookup" onSubmit={handleSubmit}>
          <div>
            <label className="ds-label" htmlFor="lookupName">
              이름
            </label>
            <input id="lookupName" name="lookupName" className="ds-input" placeholder="신청할 때 쓴 이름" required />
          </div>
          <div>
            <label className="ds-label" htmlFor="lookupPhone">
              휴대폰 번호
            </label>
            <input
              id="lookupPhone"
              name="lookupPhone"
              type="tel"
              className="ds-input"
              placeholder="010-1234-5678"
              required
            />
          </div>
          <button type="submit" className="ds-btn ds-btn--primary">
            조회하기
          </button>
        </form>
      </section>

      <section className="ex-section">
        {result ? (
          <ResultCard result={result} />
        ) : (
          <div className="ex-lookup-empty">
            <p>
              이름과 휴대폰 번호를 넣고 조회하면 신청 결과를 볼 수 있어요.
              <br />
              아직 신청 전이라면 무료 학습설계 신청부터 해 주세요.
            </p>
            <Link href="/course-registration/learning-design" className="ds-btn ds-btn--secondary">
              무료 학습설계 신청
            </Link>
          </div>
        )}
      </section>
    </>
  );
}

function ResultCard({ result }: { result: LearningDesignResult }) {
  const current = designSteps.indexOf(result.status);
  const info = [
    ["신청일", result.appliedAt],
    ["희망 전공", result.major],
    ["상담 방법", result.consultType],
    ["담당자", result.manager],
  ];
  return (
    <div className="ex-box">
      <h3 className="ex-section-title">학습설계 신청 결과</h3>
      <ol className="ex-result-steps" aria-label="상담 진행 단계">
        {designSteps.map((step, i) => (
          <li
            key={step}
            className={i < current ? "is-done" : i === current ? "is-current" : undefined}
            aria-current={i === current ? "step" : undefined}
          >
            <span className="ex-result-step-num">{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>
      <dl className="ex-result-info">
        {info.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="ex-memo">
        <strong>담당자 메모</strong>
        {result.memo}
      </div>
    </div>
  );
}
