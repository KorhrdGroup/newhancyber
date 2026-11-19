"use client";

import { useState } from "react";
import { BoardTable, MobileBoardList, Pagination, SearchBox } from "./BoardParts";
import type { BoardPost } from "./boardData";

/**
 * 글의 분류 배지(tag)로 거르는 게시판 목록 — 공지사항(교육원 · 자격증 · 학점은행제), 학사일정(사회복지현장실습).
 * 세그먼트는 데스크톱은 검색 줄 왼쪽, 모바일은 목록 위. 글마다 분류는 제목 앞 배지로 보인다.
 */
export default function TagFilterBoard({
  kind,
  posts: allPosts,
  tags,
  label,
}: {
  kind: "notice" | "schedule";
  posts: BoardPost[];
  tags: readonly string[];
  /** 세그먼트 묶음의 읽기 이름 (예: "공지 구분") */
  label: string;
}) {
  const [filter, setFilter] = useState("전체");

  // TODO: API — 분류별 목록 조회
  const posts = filter === "전체" ? allPosts : allPosts.filter((p) => p.tag === filter);

  const segment = (
    <div className="ds-tabs-box ds-tabs-box--segment" role="tablist" aria-label={label}>
      {["전체", ...tags].map((f) => (
        <button
          key={f}
          type="button"
          role="tab"
          aria-selected={f === filter}
          className={`ds-tab-box${f === filter ? " is-active" : ""}`}
          onClick={() => setFilter(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
  const empty = <p className="cr-empty">등록된 글이 없습니다.</p>;

  return (
    <>
      <div className="lx-board-segment mobile-only">{segment}</div>
      {posts.length > 0 ? <MobileBoardList kind={kind} posts={posts} /> : <div className="mobile-only">{empty}</div>}

      <div className="practice-support-notice-list-section desktop-only">
        <div className="container" style={{ backgroundColor: "#fff" }}>
          <SearchBox total={posts.length} lead={segment} />
          {posts.length > 0 ? <BoardTable posts={posts} /> : empty}
          <Pagination className="desktop-only" pages={1} />
        </div>
      </div>

      <Pagination className="mobile-only" pages={1} />
    </>
  );
}
