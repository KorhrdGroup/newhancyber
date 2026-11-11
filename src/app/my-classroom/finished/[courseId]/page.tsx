import type { Metadata } from "next";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import CourseRoom from "@/components/my-classroom/CourseRoom";

export const metadata: Metadata = { title: "복습 강의실 - 나의 강의실" };

export default async function ReviewRoomPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return (
    <>
      <MobilePageBanner name="my-classroom" text="복습 강의실" />
      <CourseRoom courseId={courseId} mode="review" />
    </>
  );
}
