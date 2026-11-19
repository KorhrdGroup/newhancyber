"use client";

import { useState } from "react";
import { BoardTable, MobileBoardList, Pagination, SearchBox } from "./BoardParts";
import { NOTICE_CATEGORIES, noticePosts } from "./boardData";

const filters = ["전체", ...NOTICE_CATEGORIES];

/**
 * 공지사항 목록: 운영 사이트의 구분(교육원 · 자격증 · 학점은행제)을 작은 토글로 고른다.
 * 데스크톱은 검색 줄 왼쪽, 모바일은 목록 위. 글마다 구분은 제목 앞 배지로 보인다.
 */
export default function NoticeBoard() {
  const [filter, setFilter] = useState<string>("전체");

  // TODO: API — 구분별 공지사항 목록 조회
  const posts = filter === "전체" ? noticePosts : noticePosts.filter((p) => p.tag === filter);

  const toggle = (
    <div className="ds-tabs-box ds-tabs-box--toggle" role="tablist" aria-label="공지 구분">
      {filters.map((f) => (
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
      <div className="lx-board-toggle mobile-only">{toggle}</div>
      {posts.length > 0 ? <MobileBoardList kind="notice" posts={posts} /> : <div className="mobile-only">{empty}</div>}

      <div className="practice-support-notice-list-section desktop-only">
        <div className="container" style={{ backgroundColor: "#fff" }}>
          <SearchBox total={posts.length} lead={toggle} />
          {posts.length > 0 ? <BoardTable posts={posts} /> : empty}
          <Pagination className="desktop-only" pages={1} />
        </div>
      </div>

      <Pagination className="mobile-only" pages={1} />
    </>
  );
}
