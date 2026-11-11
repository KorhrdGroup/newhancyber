import type { Metadata } from "next";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import CourseRoom from "@/components/my-classroom/CourseRoom";

export const metadata: Metadata = { title: "과목 강의실 - 나의 강의실" };

export default async function CourseRoomPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return (
    <>
      <MobilePageBanner name="my-classroom" text="과목 강의실" />
      <CourseRoom courseId={courseId} mode="study" />
    </>
  );
}
