import type { Metadata } from "next";
import PageTabs from "@/components/common/PageTabs";
import MyPageShell from "@/components/my-page/MyPageShell";
import ExceptionForm from "@/components/my-page/a/ExceptionForm";
import { getOngoingCourses } from "@/components/my-classroom/classroomData";
import { myPageRequestTabs } from "@/lib/navigation";

export const metadata: Metadata = { title: "중복 PC 등록 신청 - 각종 예외 신청 - 마이페이지" };

/** U31 각종 예외 신청 — 중복 PC 등록 신청 */
export default function DuplicatePcExceptionPage() {
  // TODO: API 수강 중인 과목 조회
  const courses = getOngoingCourses().map(({ id, title }) => ({ id, title }));
  return (
    <MyPageShell title="각종 예외 신청" desc="학습 규칙을 지키기 어려운 사정이 있을 때 신청합니다. 담당자가 확인한 뒤 결과를 알려 드립니다.">
      <PageTabs items={myPageRequestTabs} />
      <ExceptionForm type="duplicate-pc" courses={courses} />
    </MyPageShell>
  );
}
