import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

/** 사회복지사 안내 화면 공통: 위 제목 줄 + 여러 칸 표 (디자인 시스템 표) */
export function DataTable({ head, children }: { head: React.ReactNode[]; children: React.ReactNode }) {
  return (
    <div className="lx-table-scroll sw-table-wrap">
      <table className="ds-table lx-table sw-table">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
