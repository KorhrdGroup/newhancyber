import type { Metadata } from "next";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import FinishedCourses from "@/components/my-classroom/FinishedCourses";

export const metadata: Metadata = { title: "종료된 과목 - 나의 강의실" };

export default function FinishedCoursesPage() {
  return (
    <>
      <MobilePageBanner name="my-classroom" text="종료된 과목" />
      <FinishedCourses />
    </>
  );
}
