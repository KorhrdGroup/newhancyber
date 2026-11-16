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

/** 단계·흐름 그림 (원본 그림 그대로, 본문 폭에 맞춤). 폰에서는 글자가 너무 작아져 가로로 밀어 보게 한다 */
export function Figure({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="sw-figure">
      <img src={`/resources/images/social-worker/${src}`} alt={alt} />
    </div>
  );
}
