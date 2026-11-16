import PageTabs from "@/components/common/PageTabs";
import { etcAppealItems, getAppealCourses, gradeAppealItems, type AppealKind } from "../myPageDataB";
import AppealForm from "./AppealForm";
import Guide from "./Guide";
import { myPageAppealTabs } from "@/lib/navigation";

/** U34 이의신청 쓰기 화면 — 원본처럼 신청서만. 기타 이의신청은 원본 안내 한 줄을 위에 둔다 */
export default function AppealNew({ kind }: { kind: AppealKind }) {
  const backHref = kind === "grade" ? "/my-page/appeals" : "/my-page/appeals/etc";

  return (
    <>
      <PageTabs items={myPageAppealTabs} />
      {kind === "etc" && <Guide items={["최종 이의신청 기간에 한하여 이의 신청 가능합니다."]} />}
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
