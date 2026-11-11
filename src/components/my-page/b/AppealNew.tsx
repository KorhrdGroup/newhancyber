import PageTabs from "@/components/common/PageTabs";
import {
  appealPeriodDays,
  appealSchedules,
  appealTabs,
  etcAppealItems,
  getAppealCourses,
  gradeAppealItems,
  type AppealKind,
} from "../myPageDataB";
import AppealForm from "./AppealForm";
import Guide from "./Guide";

/** U34 이의신청 쓰기 화면 — 기간 안내 + 신청서 */
export default function AppealNew({ kind }: { kind: AppealKind }) {
  const backHref = kind === "grade" ? "/my-page/appeals" : "/my-page/appeals/etc";

  return (
    <>
      <PageTabs items={appealTabs} className="mq-subtabs" />
      <Guide
        title="이의신청 기간"
        items={[
          `성적 공개일부터 ${appealPeriodDays}일 동안 신청할 수 있어요.`,
          "한 과목의 같은 평가 항목은 한 번만 신청할 수 있어요.",
          "처리 결과는 마이페이지 > 성적 이의신청에서 확인할 수 있어요.",
        ]}
      />
      <div className="cr-table-wrap ds-mb-16">
        <table className="ds-table">
          <thead>
            <tr>
              <th>차수</th>
              <th>성적 공개일</th>
              <th>이의신청 기간</th>
            </tr>
          </thead>
          <tbody>
            {appealSchedules.map((s) => (
              <tr key={s.term}>
                <td>{s.term}</td>
                <td>{s.openedAt}</td>
                <td>{s.period}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* TODO: API 이의신청 기간이 아니면 신청서 대신 기간 안내만 보여 줌 */}
      <AppealForm
        kind={kind}
        courses={getAppealCourses()}
        items={kind === "grade" ? gradeAppealItems : etcAppealItems}
        backHref={backHref}
      />
    </>
  );
}
