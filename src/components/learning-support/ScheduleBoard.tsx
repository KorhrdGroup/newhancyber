"use client";

import { useState } from "react";
import { BoardTable, MobileBoardList, Pagination, SearchBox } from "./BoardParts";
import { scheduleDetailHref, schedulePosts, type ScheduleTabKey } from "./boardData";

const tabs: { key: ScheduleTabKey; label: string }[] = [
  { key: "theory", label: "이론 과목" },
  { key: "practice", label: "실습과목" },
];

// 원본 데스크톱 표는 이론 과목 첫 글만 상세 링크가 있다
const desktopPosts: Record<ScheduleTabKey, typeof schedulePosts.theory> = {
  theory: schedulePosts.theory.map((post, i) => (i === 0 ? { ...post, href: scheduleDetailHref(0) } : post)),
  practice: schedulePosts.practice,
};

/** 학사일정 목록: 이론/실습 탭 (모바일과 데스크톱 탭은 원본처럼 따로 움직인다) */
export default function ScheduleBoard() {
  const [mobileTab, setMobileTab] = useState<ScheduleTabKey>("theory");
  const [desktopTab, setDesktopTab] = useState<ScheduleTabKey>("theory");

  const mobilePosts = schedulePosts[mobileTab].map((post, i) => ({ ...post, href: scheduleDetailHref(i) }));

  return (
    <>
      <div className="mobile-schedule-tabs mobile-only">
        <div className="mobile-schedule-tabs-nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`mobile-schedule-tab-btn${tab.key === mobileTab ? " active" : ""}`}
              onClick={() => setMobileTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <MobileBoardList kind="schedule" posts={mobilePosts} />

      <div className="practice-support-notice-list-section desktop-only">
        <div className="container" style={{ backgroundColor: "#fff" }}>
          <div className="schedule-tabs desktop-only">
            <div className="schedule-tabs-container">
              <div className="schedule-tabs-nav">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    className={`schedule-tab-btn${tab.key === desktopTab ? " active" : ""}`}
                    onClick={() => setDesktopTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <SearchBox />

          {tabs.map((tab) => (
            <div
              key={tab.key}
              id={`tab-${tab.key}`}
              className={`schedule-tab-panel${tab.key === desktopTab ? " active" : ""}`}
            >
              <BoardTable posts={desktopPosts[tab.key]} />
            </div>
          ))}

          <Pagination prefix="practice-support-pagination" className="desktop-only" />
        </div>
      </div>

      <Pagination prefix="mobile-schedule-pagination" className="mobile-only" />
    </>
  );
}
