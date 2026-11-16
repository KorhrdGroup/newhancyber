"use client";

import { useState } from "react";
import {
  absenceKinds,
  absenceProofs,
  absenceReasons,
  EXCEPTION_FILE_NOTE,
  EXCEPTION_WEEKS,
  exceptionHalves,
  exceptionLabels,
  exceptionRounds,
  exceptionTermStart,
  exceptionYears,
  type ExceptionType,
} from "../myPageDataA";

const WEEKS = Array.from({ length: EXCEPTION_WEEKS }, (_, i) => i + 1);

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const pad = (n: number) => String(n).padStart(2, "0");
/** date 입력 칸 값 (YYYY-MM-DD) */
const toInput = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
/** 주차 칩 아래 짧은 날짜 (M/D) */
const toShort = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

/** 필수 칸 표시 */
const Req = () => <span className="mp-req">*</span>;

/**
 * U31 각종 예외 신청서 — 원본 /stdMng/exception.asp(공인인증서·중복 PC), absentApply.asp(공결 및 추가시험) 와 같은 칸.
 * 공통: 학기 구분 → 신청 과목 → 증빙서류. 공인인증서·중복 PC 는 예외 사유·신청 기간, 공결은 신청 종류·공결 사유·주차가 붙는다.
 */
export default function ExceptionForm({ type, courses }: { type: ExceptionType; courses: { id: string; title: string }[] }) {
  const [year, setYear] = useState("");
  const [half, setHalf] = useState("");
  const [round, setRound] = useState("");
  const [weeks, setWeeks] = useState<number[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const isAbsence = type === "absence";
  const termChosen = Boolean(year && half && round);
  const termStart = termChosen ? exceptionTermStart(year, half, round) : null;
  /** n주차의 월요일~일요일 */
  const weekRange = (start: Date, n: number) => {
    const from = addDays(start, (n - 1) * 7);
    return { from, to: addDays(from, 6) };
  };

  /** 신청 기간을 고른 주차의 첫 주 월요일 ~ 마지막 주 일요일로 채운다 (날짜는 직접 고칠 수 있음) */
  const fillDates = (picked: number[], start: Date | null) => {
    if (!start) return;
    setStartDate(picked.length ? toInput(weekRange(start, picked[0]).from) : "");
    setEndDate(picked.length ? toInput(weekRange(start, picked[picked.length - 1]).to) : "");
  };

  /** 고른 첫 주차 ~ 마지막 주차 사이에서 빠진 주차 (신청 기간에는 들어간다) */
  const gapWeeks = weeks.length > 1 ? WEEKS.filter((n) => n > weeks[0] && n < weeks[weeks.length - 1] && !weeks.includes(n)) : [];

  const toggleWeek = (n: number) => {
    const next = weeks.includes(n) ? weeks.filter((w) => w !== n) : [...weeks, n].sort((a, b) => a - b);
    setWeeks(next);
    fillDates(next, termStart);
  };

  /** 학기 구분을 바꾸면, 이미 고른 주차가 있을 때 새 학기 날짜로 다시 채운다 */
  const changeTerm = (y: string, h: string, r: string) => {
    setYear(y);
    setHalf(h);
    setRound(r);
    if (isAbsence && weeks.length && y && h && r) fillDates(weeks, exceptionTermStart(y, h, r));
  };

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
    <form onSubmit={submit} className="pp-box mp-form">
      <div className="mp-form-head">
        <h3 className="pp-box-title">{exceptionLabels[type]} 신청</h3>
        <p className="pp-note">
          <Req /> 표시는 필수 입력 사항입니다.
        </p>
      </div>

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
          학기 구분
          <Req />
        </span>
        <div className="mp-term">
          <select className="ds-select" aria-label="연도" value={year} onChange={(e) => changeTerm(e.target.value, half, round)}>
            <option value="">연도</option>
            {exceptionYears.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
          <select className="ds-select" aria-label="학기" value={half} onChange={(e) => changeTerm(year, e.target.value, round)}>
            <option value="">학기</option>
            {exceptionHalves.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
          <select className="ds-select" aria-label="기수" value={round} onChange={(e) => changeTerm(year, half, e.target.value)}>
            <option value="">기수</option>
            {exceptionRounds.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pp-field">
        <span className="ds-label">
          신청 과목
          <Req />
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
          <p className="mp-empty-field">연도, 학기, 기수를 먼저 선택하면 수강 과목이 나옵니다.</p>
        )}
      </div>

      {isAbsence ? (
        <div className="pp-field">
          <span className="ds-label">
            공결 사유
            <Req />
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
            예외 사유
            <Req />
          </label>
          <input id="ex-reason" className="ds-input" />
        </div>
      )}

      <div className="pp-field">
        <span className="ds-label">
          {isAbsence ? "신청 기간 및 주차" : "신청 기간"}
          <Req />
        </span>
        {isAbsence && (
          <>
            <p className="pp-note mp-weeks-hint">
              {termChosen
                ? "주차를 누르면 신청 기간이 자동으로 채워집니다. 여러 주차를 고를 수 있습니다."
                : "학기 구분을 고르면 주차마다 날짜가 표시되고, 신청 기간이 자동으로 채워집니다."}
            </p>
            <div className="mp-weeks" role="group" aria-label="신청 주차">
              {WEEKS.map((n) => {
                const on = weeks.includes(n);
                const range = termStart ? weekRange(termStart, n) : null;
                return (
                  <button key={n} type="button" className="mp-week" aria-pressed={on} onClick={() => toggleWeek(n)}>
                    <span className="mp-week-name">{n}주차</span>
                    {range && (
                      <span className="mp-week-date">
                        {toShort(range.from)}~{toShort(range.to)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {weeks.map((n) => (
              <input key={n} type="hidden" name="week" value={`${n}주차`} />
            ))}
            {weeks.length > 0 && (
              <p className="mp-weeks-picked">
                선택한 주차 <strong>{weeks.map((n) => `${n}주차`).join(", ")}</strong>
              </p>
            )}
            {gapWeeks.length > 0 && (
              <p className="mp-weeks-gap" role="status">
                고르지 않은 {gapWeeks.map((n) => `${n}주차`).join(", ")}도 신청 기간에 들어갑니다. 떨어진 기간은 따로
                신청하거나 신청 기간을 고쳐 주세요.
              </p>
            )}
          </>
        )}
        <div className="pp-row mp-dates">
          <input
            type="date"
            className="ds-input"
            aria-label="시작일"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>~</span>
          <input
            type="date"
            className="ds-input"
            aria-label="종료일"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
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
