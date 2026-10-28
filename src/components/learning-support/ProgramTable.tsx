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

/** 프로그램 표 한 개: 전체 선택 체크박스 + 선택/전체 다운로드 */
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
    <div className="container">
      <h1 className="page-title">{title}</h1>
      <table className="program-table">
        <thead>
          <tr>
            <th>구분</th>
            <th>설명</th>
            <th>
              <div className="program-download-header">
                <span className="program-download-label">다운로드</span>
                <input
                  type="checkbox"
                  id={`select-all-${group}`}
                  className="program-checkbox"
                  checked={allChecked}
                  onChange={(e) => setChecked(e.target.checked ? new Set(programs.map((p) => p.key)) : new Set())}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {programs.map((program) => (
            <tr key={program.key}>
              <td>
                <div className="program-item">
                  <img
                    src={`/resources/images/learning-support/${program.icon}`}
                    alt={program.alt}
                    className="program-icon"
                  />
                  <span className="program-item-text">{program.name}</span>
                </div>
              </td>
              <td>{program.description}</td>
              <td>
                <div className="program-download-cell">
                  {/* TODO: 프로그램별 다운로드 링크 */}
                  <button type="button" className="program-download-btn">
                    다운로드
                  </button>
                  <input
                    type="checkbox"
                    className={`program-checkbox program-item-checkbox program-${group}-checkbox`}
                    data-program={program.key}
                    checked={checked.has(program.key)}
                    onChange={(e) => toggle(program.key, e.target.checked)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="program-actions">
        <button
          type="button"
          className={`program-action-btn program-select-btn program-${group}-select-btn`}
          onClick={handleSelectedDownload}
        >
          선택 다운로드
        </button>
        <button
          type="button"
          className={`program-action-btn program-all-btn program-${group}-all-btn`}
          onClick={handleAllDownload}
        >
          전체 다운로드
        </button>
      </div>
    </div>
  );
}
