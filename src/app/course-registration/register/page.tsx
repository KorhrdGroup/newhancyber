import type { Metadata } from "next";
import RegisterContent from "@/components/course-registration/RegisterContent";
import MobilePageBanner from "@/components/layout/MobilePageBanner";

export const metadata: Metadata = { title: "수강신청" };

export default function CourseRegisterPage() {
  return (
    <>
      <MobilePageBanner name="register" text="수강신청" />
      <RegisterContent />
    </>
  );
}
