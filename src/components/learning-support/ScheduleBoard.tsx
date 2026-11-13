"use client";

import { useState } from "react";
import { BoardTable, MobileBoardList, Pagination, SearchBox } from "./BoardParts";
import { scheduleDetailHref, schedulePosts, type ScheduleTabKey } from "./boardData";

const tabs: { key: ScheduleTabKey; label: string }[] = [
  { key: "theory", label: "이론 과목" },
  { key: "practice", label: "실습과목" },
];

/** 탭별 전체 글 수 (가데이터) — 가장 큰 글 번호와 같다 */
const totalOf = (key: ScheduleTabKey) =>
  Math.max(...schedulePosts[key].map((post) => Number(post.number)).filter(Number.isFinite));

/**
 * 학사일정 목록: 이론/실습 탭 + 공지사항과 같은 목록 부품(검색 줄 · 표 · 페이지 번호).
 * 이론/실습 탭은 모바일·데스크톱 모두 FAQ 분류와 같은 상자 탭이고, 같은 탭 상태를 쓴다.
 */
export default function ScheduleBoard() {
  const [tab, setTab] = useState<ScheduleTabKey>("theory");

  // TODO: API — 탭별 학사일정 목록 조회 (지금은 모든 글이 같은 샘플 상세로 간다)
  const posts = schedulePosts[tab].map((post, i) => ({ ...post, href: scheduleDetailHref(i) }));

  return (
    <>
      <div className="mobile-schedule-tabs mobile-only">
        <div className="ds-tabs-box" role="tablist" aria-label="과목 구분">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={t.key === tab}
              className={`ds-tab-box${t.key === tab ? " is-active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <MobileBoardList kind="schedule" posts={posts} />

      <div className="practice-support-notice-list-section desktop-only">
        <div className="container" style={{ backgroundColor: "#fff" }}>
          <div className="ds-tabs-box lx-schedule-tabs" role="tablist" aria-label="과목 구분">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={t.key === tab}
                className={`ds-tab-box${t.key === tab ? " is-active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <SearchBox total={totalOf(tab)} />
          <BoardTable posts={posts} />
          <Pagination className="desktop-only" />
        </div>
      </div>

      <Pagination className="mobile-only" />
    </>
  );
}
