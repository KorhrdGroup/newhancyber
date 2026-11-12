"use client";

import { useState } from "react";
import type { RegisteredPc } from "../myPageDataA";

/** U33 등록한 PC 목록 + 이 PC 등록하기 */
export default function PcList({ initialPcs, max }: { initialPcs: RegisteredPc[]; max: number }) {
  const [pcs, setPcs] = useState(initialPcs);
  const full = pcs.length >= max;

  const register = () => {
    if (full) {
      alert(`PC는 ${max}대까지 등록할 수 있습니다. 쓰지 않는 PC를 먼저 삭제해 주세요.`);
      return;
    }
    // TODO: API 이 PC 등록 (PC 식별값 수집 프로그램/스크립트 연동 필요)
    alert("PC 등록 API 연동 전입니다.");
  };

  const remove = (pc: RegisteredPc) => {
    if (!confirm(`'${pc.name}'을(를) 삭제할까요? 삭제하면 이 PC에서는 수강할 수 없습니다.`)) return;
    // TODO: API 등록 PC 삭제 (pc.id) — 성공하면 목록에서 뺀다
    alert("PC 삭제 API 연동 전입니다.");
    setPcs((list) => list.filter((p) => p.id !== pc.id));
  };

  return (
    <section className="cr-section">
      <h3 className="cr-section-title">
        등록한 PC
        <small>
          {pcs.length} / {max}대
        </small>
      </h3>
      {pcs.length === 0 ? (
        <p className="cr-empty">등록한 PC가 없습니다. 지금 쓰는 PC를 등록해 주세요.</p>
      ) : (
        <div className="cr-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>PC 이름</th>
                <th>등록일</th>
                <th>최근 사용일</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {pcs.map((pc, i) => (
                <tr key={pc.id}>
                  <td>{i + 1}</td>
                  <td className="is-left">{pc.name}</td>
                  <td>{pc.registeredAt}</td>
                  <td>{pc.lastUsedAt}</td>
                  <td>
                    <button type="button" className="ds-btn ds-btn--danger ds-btn--sm" onClick={() => remove(pc)}>
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="pp-actions">
        <button type="button" className="ds-btn ds-btn--primary ds-btn--lg" onClick={register} aria-disabled={full}>
          이 PC 등록하기
        </button>
      </div>
    </section>
  );
}
