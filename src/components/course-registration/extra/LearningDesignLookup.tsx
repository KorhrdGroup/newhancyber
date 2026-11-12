"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { sampleDesignResult, type DesignStatus, type LearningDesignResult } from "./extraData";

const statusBadge: Record<DesignStatus, string> = {
  접수: "ds-badge--neutral",
  "상담 중": "ds-badge--warning",
  "상담 완료": "ds-badge--success",
};

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
          <div className="ex-box">
            <div className="ex-result-head">
              <h3>학습설계 신청 결과</h3>
              <span className={`ds-badge ${statusBadge[result.status]}`}>{result.status}</span>
            </div>
            <table className="ds-table ds-table--info">
              <tbody>
                <tr>
                  <th>신청일</th>
                  <td>{result.appliedAt}</td>
                </tr>
                <tr>
                  <th>희망 전공</th>
                  <td>{result.major}</td>
                </tr>
                <tr>
                  <th>상담 방법</th>
                  <td>{result.consultType}</td>
                </tr>
                <tr>
                  <th>담당자</th>
                  <td>{result.manager}</td>
                </tr>
              </tbody>
            </table>
            <div className="ex-memo">
              <strong>담당자 메모</strong>
              {result.memo}
            </div>
          </div>
        ) : (
          <p className="ex-empty">
            이름과 휴대폰 번호를 넣고 조회하면 신청 결과를 볼 수 있어요.
            <br />
            아직 신청 전이라면{" "}
            <Link href="/course-registration/learning-design" className="ex-link">
              무료 학습설계 신청
            </Link>
            부터 해 주세요.
          </p>
        )}
      </section>
    </>
  );
}
