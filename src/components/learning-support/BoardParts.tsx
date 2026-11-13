import Link from "next/link";
import type { BoardPost } from "./boardData";

const DS_IMG = "/resources/images/ds";

/**
 * 게시판 목록 공통 부품 — 공지사항·관련기관 소식·학사일정·서식자료실·실습공지사항,
 * 마이페이지 학습 게시판, 수강후기·장학후기가 함께 쓴다.
 * 모양은 Figma 디자인 시스템 부품(입력 칸·버튼·표·배지·페이지 번호)을 따른다.
 */

/** 목록 위 검색 줄: 왼쪽 글 수, 오른쪽 검색 (원본도 동작 없음) */
export function SearchBox({ total }: { total?: number }) {
  return (
    <form className="lx-board-bar" role="search">
      {total !== undefined && (
        <p className="lx-board-count">
          총 <strong>{total}</strong>건
        </p>
      )}
      <div className="lx-board-search">
        <select className="ds-select" aria-label="검색 범위">
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="all">제목+내용</option>
        </select>
        <input type="search" className="ds-input" placeholder="검색어를 입력하세요" aria-label="검색어" />
        {/* TODO: 검색 API */}
        <button type="button" className="ds-btn ds-btn--primary">
          검색
        </button>
      </div>
    </form>
  );
}

/**
 * 번호·제목·작성일 말고 더 붙는 칸. at 으로 자리를 정한다
 * (before-title: 번호 다음, before-date: 작성일 앞(기본), end: 맨 끝)
 */
export interface BoardColumn {
  key: string;
  label: string;
  at?: "before-title" | "before-date" | "end";
  /** 칸 너비(px). 없으면 글자 길이만큼 */
  width?: number;
}

/** 데스크톱 게시판 표 (Figma Table: 제목은 Link 칸, 공지는 Brand 배지) */
export function BoardTable({
  posts,
  columns = [],
  dateLabel = "작성일",
}: {
  posts: BoardPost[];
  columns?: BoardColumn[];
  dateLabel?: string;
}) {
  const at = (where: NonNullable<BoardColumn["at"]>) => columns.filter((c) => (c.at ?? "before-date") === where);
  const cols = (list: BoardColumn[]) =>
    list.map((c) => <col key={c.key} className="lx-board-col-extra" style={c.width ? { width: c.width } : undefined} />);
  const heads = (list: BoardColumn[]) =>
    list.map((c) => (
      <th key={c.key} scope="col">
        {c.label}
      </th>
    ));
  const cells = (list: BoardColumn[], post: BoardPost) =>
    list.map((c) => (
      <td key={c.key} className="lx-board-cell">
        {post.cells?.[c.key] ?? "-"}
      </td>
    ));
  const [beforeTitle, beforeDate, end] = [at("before-title"), at("before-date"), at("end")];

  return (
    <table className="ds-table lx-board-table">
      <colgroup>
        <col className="lx-board-col-num" />
        {cols(beforeTitle)}
        <col />
        {cols(beforeDate)}
        <col className="lx-board-col-date" />
        {cols(end)}
      </colgroup>
      <thead>
        <tr>
          <th scope="col">번호</th>
          {heads(beforeTitle)}
          <th scope="col">제목</th>
          {heads(beforeDate)}
          <th scope="col">{dateLabel}</th>
          {heads(end)}
        </tr>
      </thead>
      <tbody>
        {posts.map((post, i) => (
          <tr key={i} className={post.emphasized ? "is-notice" : undefined}>
            <td>
              {post.isNotice || post.badge ? (
                <span className="ds-badge ds-badge--brand">{post.isNotice ? "공지" : post.badge}</span>
              ) : (
                post.number
              )}
            </td>
            {cells(beforeTitle, post)}
            <td className="is-left">
              {post.href ? (
                <Link href={post.href} className="ds-table-link">
                  {post.title}
                </Link>
              ) : (
                post.title
              )}
            </td>
            {cells(beforeDate, post)}
            <td>{post.date}</td>
            {cells(end, post)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** 페이지 번호 (Figma Pagination). 원본도 1페이지 고정, 동작 없음. TODO: 목록 API 의 페이지 정보로 */
export function Pagination({ className, pages = 5 }: { className?: string; pages?: number }) {
  return (
    <nav className={["ds-pagination", className].filter(Boolean).join(" ")} aria-label="페이지 번호">
      <button type="button" className="ds-page-btn" disabled aria-label="이전 페이지">
        <img src={`${DS_IMG}/arrow-left.svg`} alt="" />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          type="button"
          className={`ds-page-btn${page === 1 ? " is-current" : ""}`}
          aria-current={page === 1 ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      <button type="button" className="ds-page-btn" disabled={pages === 1} aria-label="다음 페이지">
        <img src={`${DS_IMG}/arrow-right.svg`} alt="" />
      </button>
    </nav>
  );
}

/** 원본 스크립트가 a 태그에 직접 넣던 인라인 스타일 */
const plainLink = { textDecoration: "none", color: "inherit" };

/** 모바일 게시판 목록 (원본은 jQuery 로 그리던 부분). kind 에 따라 클래스 이름만 다르다 */
export function MobileBoardList({
  kind,
  posts,
  dateLabel = "작성일",
}: {
  kind: "notice" | "schedule";
  posts: BoardPost[];
  dateLabel?: string;
}) {
  const c = (name: string) => `mobile-${kind}-${name}`;
  return (
    <div className={`${c("list")} mobile-only`}>
      <div className={c("header")}>
        <div className={c("header-number")}>번호</div>
        <div className={c("header-title")}>제목</div>
        <div className={c("header-date")}>{dateLabel}</div>
      </div>
      {posts.map((post, i) => (
        <Link key={i} href={post.href ?? "#"} className={c("item")} style={plainLink}>
          <div className={c("item-header")}>
            <div className={c("number")}>
              {post.isNotice || post.badge ? (
                <span className={c("badge")}>{post.isNotice ? "공지" : post.badge}</span>
              ) : (
                post.number
              )}
            </div>
            <div className={c("title")}>
              {post.title}
              {post.meta && <span className="mobile-board-meta">{post.meta}</span>}
            </div>
            <div className={c("date")}>{post.date}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
