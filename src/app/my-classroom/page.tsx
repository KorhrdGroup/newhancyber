import type { Metadata } from "next";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import OngoingCourses from "@/components/my-classroom/OngoingCourses";

export const metadata: Metadata = { title: "나의 강의실" };

export default function MyClassroomPage() {
  return (
    <>
      <MobilePageBanner name="my-classroom" text="나의 강의실" />
      <OngoingCourses />
    </>
  );
}
