import type { Metadata } from "next";
import LearningDesignContent from "@/components/course-registration/LearningDesignContent";

export const metadata: Metadata = { title: "무료학습설계" };

export default function CourseLearningDesignPage() {
  return <LearningDesignContent />;
}
