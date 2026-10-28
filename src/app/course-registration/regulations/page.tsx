import type { Metadata } from "next";
import RegulationsContent from "@/components/course-registration/RegulationsContent";

export const metadata: Metadata = { title: "수강규정" };

export default function CourseRegulationsPage() {
  return <RegulationsContent />;
}
