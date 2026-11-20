"use client";

import { useState } from "react";
import { BoardTable, MobileBoardList, Pagination, SearchBox, type BoardColumn } from "@/components/learning-support/BoardParts";
import type { BoardPost } from "@/components/learning-support/boardData";
import { ORG_AREAS, ORG_TOTAL, practiceOrgs } from "./orgData";

const columns: BoardColumn[] = [
  { key: "area", label: "지역", at: "before-title", width: 80 },
  { key: "kind", label: "과정구분", at: "before-title", width: 100 },
];

const scopes = [
  { value: "name", label: "기관명" },
  { value: "address", label: "주소" },
];

/** 바깥 링크 화살표 */
export function ExtArrow() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M6 3.5h6.5V10M12.5 3.5 4 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 실습기관 목록 — 공지사항과 같은 게시판 틀(검색 줄 · 표 · 페이지 번호).
 * 원본은 왼쪽 묶음에 지역 버튼을 펼쳐 두지만, 다른 게시판과 같은 한 단 구성을 지키려고 목록 위에 펼친다.
 */
export default function OrgBoard({ initialArea = "전체" }: { initialArea?: string }) {
  // 상세 화면의 '강원 실습기관 목록' 버튼처럼 ?area= 로 들어오면 그 지역부터
  const [area, setArea] = useState(initialArea);

  // TODO: API — 지역 · 검색어 · 페이지로 목록 조회. 지금은 원본 1페이지 20곳만 있다
  const orgs = area === "전체" ? practiceOrgs : practiceOrgs.filter((o) => o.area === area);
  const href = (no: string) => `/practice-support/organizations/${no}`;
  const posts: BoardPost[] = orgs.map((o) => ({
    number: String(o.number),
    title: o.title,
    date: o.date,
    href: href(o.no),
    cells: { area: o.area, kind: o.kind },
  }));
  const total = area === "전체" ? ORG_TOTAL : orgs.length;
  // 휴대폰은 폭이 좁아 원본 제목("<강원 강릉시> OO 사회복지현장실습 선정기관")에서 기관 이름만 제목으로, 시·군과 선정일은 아래 줄로
  const mobilePosts: BoardPost[] = orgs.map((o) => ({
    number: String(o.number),
    title: o.name,
    date: o.date,
    href: href(o.no),
    meta: `${o.city} · 선정일 ${o.date}`,
  }));

  const areaButtons = (
    <div className="po-areas" role="group" aria-label="지역 선택">
      {["전체", ...ORG_AREAS].map((a) => (
        <button
          key={a}
          type="button"
          className={`po-area-btn${a === area ? " is-active" : ""}`}
          aria-pressed={a === area}
          onClick={() => setArea(a)}
        >
          {a}
        </button>
      ))}
    </div>
  );
  const empty = <p className="cr-empty">이 지역에 등록된 기관이 없습니다.</p>;
  const mobileList =
    mobilePosts.length > 0 ? <MobileBoardList kind="notice" posts={mobilePosts} dateLabel={null} /> : <div className="mobile-only">{empty}</div>;
  const table = posts.length > 0 ? <BoardTable posts={posts} columns={columns} dateLabel="선정일" /> : empty;

  return (
    <>
      {areaButtons}
      {mobileList}
      <div className="desktop-only">
        <SearchBox total={total} scopes={scopes} />
        {table}
      </div>
      <Pagination />
    </>
  );
}
