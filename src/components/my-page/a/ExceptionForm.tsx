"use client";

import { useState } from "react";
import { absenceExams, absenceKinds, exceptionGuides, exceptionLabels, type ExceptionType } from "../myPageDataA";

/**
 * U31 각종 예외 신청서 (공인인증서 예외·중복 PC 등록·공결 및 추가시험 공통).
 * 종류마다 붙는 칸: 공인인증서 → 예외 기간, 중복 PC → 함께 쓰는 학습자, 공결 → 신청 종류·과목·시험·결석 기간
 */
export default function ExceptionForm({ type, courses }: { type: ExceptionType; courses: { id: string; title: string }[] }) {
  const { guide, reasons } = exceptionGuides[type];
  const [reason, setReason] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [kind, setKind] = useState(absenceKinds[0]);
  const label = exceptionLabels[type];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      alert("신청 사유를 골라 주세요.");
      return;
    }
    // TODO: API 예외 신청 등록 (type, 사유, 기간·과목·시험, 증빙 파일)
    alert(`${label} 신청 API 연동 전입니다.`);
  };

  return (
    <>
      <div className="pp-box">
        <h3 className="pp-box-title">신청 전에 읽어 주세요</h3>
        <ul className="pp-list">
          {guide.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>

      <form onSubmit={submit} className="pp-box">
        <h3 className="pp-box-title">{label} 신청서</h3>

        {type === "absence" && (
          <>
            <div className="pp-field">
              <span className="ds-label">신청 종류</span>
              <div className="mp-choices">
                {absenceKinds.map((k) => (
                  <label key={k} className="ds-check">
                    <input type="radio" name="absence-kind" className="ds-radio" checked={kind === k} onChange={() => setKind(k)} />
                    {k}
                  </label>
                ))}
              </div>
            </div>
            <div className="pp-field mp-field-grid">
              <div>
                <label className="ds-label" htmlFor="ex-course">
                  과목
                </label>
                <select id="ex-course" className="ds-select" defaultValue="">
                  <option value="">골라 주세요</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              {kind === "추가시험 신청" && (
                <div>
                  <label className="ds-label" htmlFor="ex-exam">
                    시험
                  </label>
                  <select id="ex-exam" className="ds-select" defaultValue="">
                    <option value="">골라 주세요</option>
                    {absenceExams.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </>
        )}

        <div className="pp-field">
          <label className="ds-label" htmlFor="ex-reason">
            신청 사유
          </label>
          <select id="ex-reason" className="ds-select" value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">골라 주세요</option>
            {reasons.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        {type !== "duplicate-pc" && (
          <div className="pp-field">
            <span className="ds-label">{type === "cert" ? "예외 기간" : "결석(미응시) 기간"}</span>
            <div className="pp-row">
              <input type="date" className="ds-input" aria-label="시작일" />
              <span>~</span>
              <input type="date" className="ds-input" aria-label="종료일" />
            </div>
          </div>
        )}

        {type === "duplicate-pc" && (
          <div className="pp-field">
            <label className="ds-label" htmlFor="ex-mate">
              함께 쓰는 학습자
            </label>
            <input id="ex-mate" className="ds-input" placeholder="같은 PC로 수강하는 학습자의 이름과 아이디를 적어 주세요" />
          </div>
        )}

        <div className="pp-field">
          <label className="ds-label" htmlFor="ex-detail">
            상세 사유
          </label>
          <textarea id="ex-detail" className="ds-textarea ds-textarea--sm" placeholder="어떤 사정인지 자세히 적어 주세요." />
        </div>

        <div className="pp-field">
          <label className="ds-label" htmlFor="ex-file">
            증빙 서류
          </label>
          <input id="ex-file" type="file" className="mp-file" multiple />
          <p className="pp-note ds-mt-4">사정을 확인할 수 있는 서류를 붙여 주세요. 서류가 없으면 승인되지 않을 수 있습니다.</p>
        </div>

        <div className="pp-field">
          <label className="ds-check">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            적은 내용이 사실이며, 사실과 다르면 승인이 취소될 수 있음에 동의합니다.
          </label>
        </div>

        <div className="pp-actions">
          <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg" disabled={!agreed}>
            신청하기
          </button>
        </div>
      </form>
    </>
  );
}
