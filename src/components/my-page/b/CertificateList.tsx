import PageTabs from "@/components/common/PageTabs";
import { Badge } from "@/components/my-classroom/ClassroomUI";
import PopupButton from "@/components/my-classroom/PopupButton";
import { certificateTabs, type CertificateRow } from "../myPageDataB";
import Guide from "./Guide";

/** U32 증명서 발급 — 과목별 목록 (수강 확인서·성적 증명서·수료증) */
export default function CertificateList({
  guide,
  rows,
  emptyText,
  actions,
}: {
  guide: React.ReactNode[];
  rows: CertificateRow[];
  emptyText: string;
  actions?: React.ReactNode;
}) {
  return (
    <>
      <PageTabs items={certificateTabs} className="mq-subtabs" />
      <Guide items={guide} />
      {actions && <div className="mq-toolbar">{actions}</div>}
      {rows.length === 0 ? (
        <p className="cr-empty">{emptyText}</p>
      ) : (
        <div className="cr-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>차수</th>
                <th>과목명</th>
                <th>수강 기간</th>
                <th>상태</th>
                <th>발급</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.term}</td>
                  <td className="is-left">
                    <strong>{row.title}</strong>
                  </td>
                  <td>{row.period}</td>
                  <td>
                    <Badge tone={row.tone}>{row.status}</Badge>
                  </td>
                  <td>
                    {row.printHref ? (
                      <PopupButton href={row.printHref}>발급받기</PopupButton>
                    ) : (
                      <button type="button" className="ds-btn ds-btn--secondary ds-btn--sm" disabled>
                        발급 불가
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
