"use client";

import { useState } from "react";
import DraftNote from "@/components/common/DraftNote";
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
  const isAbsence = type === "absence";
  const termChosen = Boolean(year && half && round);
  const termStart = termChosen ? exceptionTermStart(year, half, round) : null;
  /** n주차의 월요일~일요일 */
  const weekRange = (start: Date, n: number) => {
    const from = addDays(start, (n - 1) * 7);
    return { from, to: addDays(from, 6) };
  };

  const toggleWeek = (n: number) =>
    setWeeks(weeks.includes(n) ? weeks.filter((w) => w !== n) : [...weeks, n].sort((a, b) => a - b));

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
        <div className="pp-row mp-dates">
          <input type="date" className="ds-input" aria-label="시작일" />
          <span>~</span>
          <input type="date" className="ds-input" aria-label="종료일" />
        </div>
        {isAbsence && (
          <>
            <DraftNote>
              원본에는 주차별 날짜가 없어 임시로 계산해 표시했습니다(1학기 3월·2학기 9월 첫 월요일부터 한 주씩, 기수마다
              2주 늦춤). 실제 학기·기수별 주차 날짜와 주차 수(원본 강의실 출석은 15주, 신청서는 16주차)를 확인해야 합니다.
            </DraftNote>
            <p className="pp-note mp-weeks-hint">
              신청할 주차를 모두 골라 주세요.{!termChosen && " 학기 구분을 고르면 주차마다 날짜가 표시됩니다."}
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
          </>
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
