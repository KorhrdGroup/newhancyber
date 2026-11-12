import Link from "next/link";
import PageTabs from "@/components/common/PageTabs";
import { Badge } from "@/components/my-classroom/ClassroomUI";
import { appealPeriodDays, appealStatusTone, getAppeals, type AppealKind } from "../myPageDataB";
import Guide from "./Guide";
import { myPageRequestTabs } from "@/lib/navigation";

const base = { grade: "/my-page/appeals", etc: "/my-page/appeals/etc" } as const;

/** U34 성적 이의신청 — 목록 (성적 / 기타) */
export default function AppealList({ kind }: { kind: AppealKind }) {
  const appeals = getAppeals(kind);
  const isGrade = kind === "grade";

  return (
    <>
      <PageTabs items={myPageRequestTabs} className="mp-subtabs" />
      <Guide
        title="이의신청 기간"
        items={
          isGrade
            ? [
                `성적 공개일부터 ${appealPeriodDays}일 동안 신청할 수 있어요. 기간이 지나면 신청할 수 없어요.`,
                "과목과 평가 항목을 고르고, 이의가 있는 까닭을 구체적으로 적어 주세요.",
                "담당 교수님이 검토한 뒤 이 화면에서 처리 결과를 알려 드려요.",
              ]
            : [
                "출석·진도 인정, 수료 판정처럼 성적 말고 다른 학사 처리에 이의가 있을 때 신청해요.",
                `수강 기간이 끝나고 성적이 공개된 날부터 ${appealPeriodDays}일 안에 신청해 주세요.`,
                "담당자가 확인한 뒤 이 화면에서 처리 결과를 알려 드려요.",
              ]
        }
      />
      <div className="mq-toolbar mq-toolbar--between">
        <p className="pp-note">총 {appeals.length}건</p>
        <Link href={`${base[kind]}/new`} className="ds-btn ds-btn--primary ds-btn--sm">
          신청하기
        </Link>
      </div>
      {appeals.length === 0 ? (
        <p className="cr-empty">신청한 이의신청이 없어요.</p>
      ) : (
        <div className="cr-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>과목명</th>
                <th>{isGrade ? "평가 항목" : "신청 구분"}</th>
                <th>신청일</th>
                <th>처리 상태</th>
              </tr>
            </thead>
            <tbody>
              {appeals.map((a) => (
                <tr key={a.id}>
                  <td className="is-left">
                    <Link href={`${base[kind]}/${a.id}`} className="mq-link">
                      {a.courseTitle}
                    </Link>
                  </td>
                  <td>{a.item}</td>
                  <td>{a.appliedAt}</td>
                  <td>
                    <Badge tone={appealStatusTone[a.status]}>{a.status}</Badge>
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
