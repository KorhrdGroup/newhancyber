"use client";

import { useState } from "react";
import { BoardTable, MobileBoardList, Pagination, SearchBox, type BoardColumn } from "@/components/learning-support/BoardParts";
import type { BoardPost } from "@/components/learning-support/boardData";
import { ORG_AREAS, ORG_TOTAL, practiceOrgs } from "./orgData";

const columns: BoardColumn[] = [
  { key: "area", label: "지역", at: "before-title", width: 80 },
  { key: "kind", label: "과정구분", at: "before-title", width: 100 },
];

/**
 * 실습기관 목록 — 공지사항과 같은 게시판 틀(검색 줄 · 표 · 페이지 번호).
 * 지역이 17곳이라 세그먼트 대신 검색 줄 왼쪽의 지역 고르기 칸으로 거른다.
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

  const areaSelect = (
    <select className="ds-select po-area" aria-label="지역" value={area} onChange={(e) => setArea(e.target.value)}>
      {["전체", ...ORG_AREAS].map((a) => (
        <option key={a} value={a}>
          {a === "전체" ? "전체 지역" : a}
        </option>
      ))}
    </select>
  );
  const scopes = [
    { value: "name", label: "기관명" },
    { value: "address", label: "주소" },
  ];
  const empty = <p className="cr-empty">이 지역에 등록된 기관이 없습니다.</p>;

  return (
    <>
      <div className="po-mobile-filter mobile-only">{areaSelect}</div>
      {mobilePosts.length > 0 ? <MobileBoardList kind="notice" posts={mobilePosts} dateLabel={null} /> : <div className="mobile-only">{empty}</div>}

      <div className="desktop-only">
        <SearchBox total={total} filters={areaSelect} scopes={scopes} />
        {posts.length > 0 ? <BoardTable posts={posts} columns={columns} dateLabel="선정일" /> : empty}
        <Pagination />
      </div>

      <Pagination className="mobile-only" />
    </>
  );
}
