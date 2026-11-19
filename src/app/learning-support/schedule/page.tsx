import type { Metadata } from "next";
import TagFilterBoard from "@/components/learning-support/TagFilterBoard";
import { SCHEDULE_TAGS, schedulePosts } from "@/components/learning-support/boardData";
import SectionTabs, { scheduleTabs } from "@/components/learning-support/extra/SectionTabs";
import MobilePageBanner from "@/components/layout/MobilePageBanner";

export const metadata: Metadata = { title: "학사일정" };

export default function LearningSchedulePage() {
  return (
    <>
      <MobilePageBanner name="schedule" text="학사일정" />
      <main className="wrapper">
        <SectionTabs items={scheduleTabs} />
        {/* 운영 사이트처럼 이론/실습을 나누지 않은 한 목록. 실습 글만 모아 보려면 세그먼트로 거른다 */}
        <TagFilterBoard kind="schedule" posts={schedulePosts} tags={SCHEDULE_TAGS} label="학사일정 구분" />
      </main>
    </>
  );
}
