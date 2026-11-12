import type { Metadata } from "next";
import ExTabs from "@/components/course-registration/extra/ExTabs";
import LearningDesignLookup from "@/components/course-registration/extra/LearningDesignLookup";
import { learningDesignTabs } from "@/components/course-registration/extra/extraData";
import "@/styles/classroom.css";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "무료학습설계 신청 결과 확인" };

export default function LearningDesignResultPage() {
  return (
    <>
      <ExTabs items={learningDesignTabs} underHeader />
      <main className="wrapper">
        <div className="ex-page">
          <LearningDesignLookup />
        </div>
      </main>
    </>
  );
}
