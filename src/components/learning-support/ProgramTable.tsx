"use client";

import { useState } from "react";

export interface Program {
  /** 원본 data-program 값 */
  key: string;
  name: string;
  description: string;
  icon: string;
  /** 원본 alt 그대로 (복사해 둔 값이라 이름과 안 맞는 것이 있다) */
  alt: string;
}

interface ProgramTableProps {
  title: string;
  /** 원본 클래스·id 구분용: basic / etc */
  group: "basic" | "etc";
  programs: Program[];
}

/** 프로그램 표 한 개 (디자인 시스템 표·버튼): 전체 선택 체크박스 + 선택/전체 다운로드 */
export default function ProgramTable({ title, group, programs }: ProgramTableProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const allChecked = checked.size === programs.length;

  const toggle = (key: string, on: boolean) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (on) next.add(key);
      else next.delete(key);
      return next;
    });

  const handleSelectedDownload = () => {
    if (checked.size === 0) {
      alert("다운로드할 프로그램을 선택해주세요.");
      return;
    }
    // TODO: 선택한 프로그램 다운로드 (원본도 console.log 만)
    console.log(`선택된 ${group === "basic" ? "기본" : "기타"} 프로그램:`, [...checked]);
  };

  const handleAllDownload = () => {
    // TODO: 전체 다운로드 (원본도 console.log 만)
    console.log(`${group === "basic" ? "기본" : "기타"} 프로그램 전체 다운로드`);
  };

  return (
    <section className="lx-panel">
      <h2 className="lx-section-title">{title}</h2>
      <div className="lx-table-scroll">
        <table className="ds-table lx-program-table">
          <colgroup>
            <col className="lx-program-col-name" />
            <col />
            <col className="lx-program-col-down" />
            <col className="lx-program-col-check" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="is-left">
                구분
              </th>
              <th scope="col" className="is-left">
                설명
              </th>
              <th scope="col">다운로드</th>
              <th scope="col">
                <input
                  type="checkbox"
                  className="lx-program-check"
                  aria-label={`${title} 전체 선택`}
                  checked={allChecked}
                  onChange={(e) => setChecked(e.target.checked ? new Set(programs.map((p) => p.key)) : new Set())}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.key}>
                <td className="is-left">
                  <span className="lx-program-name">
                    <img src={`/resources/images/learning-support/${program.icon}`} alt={program.alt} />
                    {program.name}
                  </span>
                </td>
                <td className="is-left lx-program-desc">{program.description}</td>
                <td>
                  {/* TODO: 프로그램별 다운로드 링크 */}
                  <button type="button" className="ds-btn ds-btn--secondary ds-btn--sm">
                    다운로드
                  </button>
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="lx-program-check"
                    aria-label={`${program.name} 선택`}
                    data-program={program.key}
                    checked={checked.has(program.key)}
                    onChange={(e) => toggle(program.key, e.target.checked)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="lx-program-actions">
        <button type="button" className="ds-btn ds-btn--secondary" onClick={handleSelectedDownload}>
          선택 다운로드{checked.size > 0 && ` (${checked.size})`}
        </button>
        <button type="button" className="ds-btn ds-btn--primary" onClick={handleAllDownload}>
          전체 다운로드
        </button>
      </div>
    </section>
  );
}
