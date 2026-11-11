import Link from "next/link";
import PageTabs from "@/components/common/PageTabs";
import { Badge } from "@/components/my-classroom/ClassroomUI";
import { appealStatusTone, appealTabs, type Appeal } from "../myPageDataB";

/** U34 이의신청 상세 — 신청 내용 + 처리 결과 */
export default function AppealDetail({ appeal, backHref }: { appeal: Appeal; backHref: string }) {
  const isGrade = appeal.kind === "grade";

  return (
    <>
      <PageTabs items={appealTabs} className="mq-subtabs" />
      <section className="pp-box">
        <h3 className="pp-box-title">신청 내용</h3>
        <table className="ds-table ds-table--info">
          <tbody>
            <tr>
              <th>과목명</th>
              <td>{appeal.courseTitle}</td>
            </tr>
            <tr>
              <th>{isGrade ? "평가 항목" : "신청 구분"}</th>
              <td>{appeal.item}</td>
            </tr>
            <tr>
              <th>신청일</th>
              <td>{appeal.appliedAt}</td>
            </tr>
            <tr>
              <th>처리 상태</th>
              <td>
                <Badge tone={appealStatusTone[appeal.status]}>{appeal.status}</Badge>
              </td>
            </tr>
            <tr>
              <th>첨부 파일</th>
              <td>{appeal.attachment ?? "없음"}</td>
            </tr>
          </tbody>
        </table>
        <p className="mq-body ds-mt-16">{appeal.reason}</p>
      </section>

      {appeal.answer ? (
        <section className="pp-box mq-answer">
          <div className="pp-row pp-row--between">
            <h3 className="pp-box-title pp-box-title--flush">처리 결과</h3>
            <span className="pp-note">{appeal.answer.answeredAt}</span>
          </div>
          <p className="mq-answer-result ds-mt-12">{appeal.answer.result}</p>
          <p className="mq-body ds-mt-8">{appeal.answer.body}</p>
        </section>
      ) : (
        <section className="pp-box mq-waiting">
          <p className="mq-waiting-title">처리 결과를 기다리고 있어요</p>
          <p className="pp-note ds-mt-4">검토가 끝나면 이 화면에서 결과를 알려 드리고, 문자로도 안내해 드려요.</p>
        </section>
      )}

      <div className="pp-actions">
        <Link href={backHref} className="ds-btn ds-btn--secondary">
          목록으로
        </Link>
      </div>
    </>
  );
}
