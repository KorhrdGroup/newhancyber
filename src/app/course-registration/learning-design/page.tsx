import type { Metadata } from "next";
import ExTabs from "@/components/course-registration/extra/ExTabs";
import { learningDesignTabs } from "@/components/course-registration/extra/extraData";
import LearningDesignContent from "@/components/course-registration/LearningDesignContent";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "무료학습설계" };

export default function CourseLearningDesignPage() {
  return (
    <>
      <ExTabs items={learningDesignTabs} underHeader />
      <LearningDesignContent />
    </>
  );
}
