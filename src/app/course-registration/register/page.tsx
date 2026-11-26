import type { Metadata } from "next";
import RegisterContent from "@/components/course-registration/RegisterContent";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import { getRegisterData } from "@/lib/courses";

export const metadata: Metadata = { title: "수강신청" };

/** 수강신청 — 학기 · 과목은 LMS 「학사일정 관리 · 차수 관리 · 과목 관리」(DB). DB 를 쓸 수 없으면 샘플 */
export default async function CourseRegisterPage() {
  const data = await getRegisterData();
  return (
    <>
      <MobilePageBanner name="register" text="수강신청" />
      <RegisterContent data={data} />
    </>
  );
}
