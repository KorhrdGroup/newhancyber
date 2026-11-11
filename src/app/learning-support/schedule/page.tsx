import type { Metadata } from "next";
import ScheduleBoard from "@/components/learning-support/ScheduleBoard";
import SectionTabs, { scheduleTabs } from "@/components/learning-support/extra/SectionTabs";
import MobilePageBanner from "@/components/layout/MobilePageBanner";

export const metadata: Metadata = { title: "학사일정" };

export default function LearningSchedulePage() {
  return (
    <>
      <MobilePageBanner name="schedule" text="학사일정" />
      <main className="wrapper">
        <SectionTabs items={scheduleTabs} />
        <ScheduleBoard />
      </main>
    </>
  );
}
