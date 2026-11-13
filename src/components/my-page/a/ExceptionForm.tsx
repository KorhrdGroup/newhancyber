"use client";

import { useState } from "react";
import {
  absenceKinds,
  absenceProofs,
  absenceReasons,
  EXCEPTION_FILE_NOTE,
  exceptionHalves,
  exceptionLabels,
  exceptionRounds,
  exceptionYears,
  type ExceptionType,
} from "../myPageDataA";

const WEEKS = Array.from({ length: 16 }, (_, i) => `${i + 1}주차`);

/** 필수 칸 표시 */
const Req = () => <span className="mp-req">* </span>;

/**
 * U31 각종 예외 신청서 — 원본 /stdMng/exception.asp(공인인증서·중복 PC), absentApply.asp(공결 및 추가시험) 와 같은 칸.
 * 공통: 학기 구분 → 신청 과목 → 증빙서류. 공인인증서·중복 PC 는 예외 사유·신청 기간, 공결은 신청 종류·공결 사유·주차가 붙는다.
 */
export default function ExceptionForm({ type, courses }: { type: ExceptionType; courses: { id: string; title: string }[] }) {
  const [year, setYear] = useState("");
  const [half, setHalf] = useState("");
  const [round, setRound] = useState("");
  const isAbsence = type === "absence";
  const termChosen = Boolean(year && half && round);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termChosen) {
      alert("학기 구분(연도, 학기, 기수)을 선택해 주세요.");
      return;
    }
    // TODO: API 예외 신청 등록 (학기, 과목, 사유, 기간·주차, 증빙 파일)
    alert(`${exceptionLabels[type]} 신청 API 연동 전입니다.`);
  };

  return (
    <form onSubmit={submit} className="pp-box">
      <h3 className="pp-box-title">{exceptionLabels[type]} 신청</h3>
      <p className="pp-note mp-req-note">
        <Req />
        표시는 필수 입력 사항입니다.
      </p>

      {isAbsence && (
        <div className="pp-field">
          <span className="ds-label">신청 종류</span>
          <div className="mp-choices">
            {absenceKinds.map((k, i) => (
              <label key={k} className="ds-check">
                <input type="radio" name="absence-kind" className="ds-radio" defaultChecked={i === 0} />
                {k}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="pp-field">
        <span className="ds-label">
          <Req />
          학기 구분
        </span>
        <div className="mp-term">
          <select className="ds-select" aria-label="연도" value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">연도</option>
            {exceptionYears.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
          <select className="ds-select" aria-label="학기" value={half} onChange={(e) => setHalf(e.target.value)}>
            <option value="">학기</option>
            {exceptionHalves.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
          <select className="ds-select" aria-label="기수" value={round} onChange={(e) => setRound(e.target.value)}>
            <option value="">기수</option>
            {exceptionRounds.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pp-field">
        <span className="ds-label">
          <Req />
          신청 과목
        </span>
        {termChosen ? (
          // TODO: API 고른 학기의 수강 과목 조회
          <div className="mp-choices">
            {courses.map((c) => (
              <label key={c.id} className="ds-check">
                <input type="checkbox" name="course" value={c.id} />
                {c.title}
              </label>
            ))}
          </div>
        ) : (
          <p className="pp-note">연도, 학기, 기수를 선택해 주세요.</p>
        )}
      </div>

      {isAbsence ? (
        <div className="pp-field">
          <span className="ds-label">
            <Req />
            공결 사유
          </span>
          <div className="mp-choices mp-choices--column">
            {absenceReasons.map((r, i) => (
              <label key={r} className="ds-check">
                <input type="radio" name="absence-reason" className="ds-radio" defaultChecked={i === 0} />
                {r}
              </label>
            ))}
          </div>
        </div>
      ) : (
        <div className="pp-field">
          <label className="ds-label" htmlFor="ex-reason">
            <Req />
            예외 사유
          </label>
          <input id="ex-reason" className="ds-input" />
        </div>
      )}

      <div className="pp-field">
        <span className="ds-label">
          <Req />
          {isAbsence ? "신청 기간 및 주차" : "신청 기간"}
        </span>
        <div className="pp-row mp-dates">
          <input type="date" className="ds-input" aria-label="시작일" />
          <span>~</span>
          <input type="date" className="ds-input" aria-label="종료일" />
        </div>
        {isAbsence && (
          <div className="mp-weeks">
            {WEEKS.map((w) => (
              <label key={w} className="ds-check">
                <input type="checkbox" name="week" value={w} />
                {w}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="pp-field">
        <label className="ds-label" htmlFor="ex-file">
          증빙서류 업로드
        </label>
        {isAbsence && (
          <select className="ds-select mp-proof" aria-label="증빙서류 종류" defaultValue="">
            <option value="">증빙서류 선택</option>
            {absenceProofs.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        )}
        <input id="ex-file" type="file" className="mp-file" />
        <p className="pp-note ds-mt-4">{EXCEPTION_FILE_NOTE}</p>
      </div>

      <div className="pp-actions">
        <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg">
          신청하기
        </button>
      </div>
    </form>
  );
}
