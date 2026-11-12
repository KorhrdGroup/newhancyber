import Link from "next/link";
import type { BoardPost } from "./boardData";

const DS_IMG = "/resources/images/ds";

/**
 * 학습지원 게시판 공통 부품 — 공지사항·관련기관 소식·학사일정·서식자료실이 함께 쓴다.
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

/** 데스크톱 게시판 표 (Figma Table: 제목은 Link 칸, 공지는 Brand 배지) */
export function BoardTable({ posts }: { posts: BoardPost[] }) {
  return (
    <table className="ds-table lx-board-table">
      <colgroup>
        <col className="lx-board-col-num" />
        <col />
        <col className="lx-board-col-date" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">번호</th>
          <th scope="col">제목</th>
          <th scope="col">작성일</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post, i) => (
          <tr key={i} className={post.emphasized ? "is-notice" : undefined}>
            <td>{post.isNotice ? <span className="ds-badge ds-badge--brand">공지</span> : post.number}</td>
            <td className="is-left">
              {post.href ? (
                <Link href={post.href} className="ds-table-link">
                  {post.title}
                </Link>
              ) : (
                post.title
              )}
            </td>
            <td>{post.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** 페이지 번호 (Figma Pagination). 원본도 1페이지 고정, 동작 없음. TODO: 목록 API 의 페이지 정보로 */
export function Pagination({ className }: { className?: string }) {
  return (
    <nav className={["ds-pagination", className].filter(Boolean).join(" ")} aria-label="페이지 번호">
      <button type="button" className="ds-page-btn" disabled aria-label="이전 페이지">
        <img src={`${DS_IMG}/arrow-left.svg`} alt="" />
      </button>
      {[1, 2, 3, 4, 5].map((page) => (
        <button
          key={page}
          type="button"
          className={`ds-page-btn${page === 1 ? " is-current" : ""}`}
          aria-current={page === 1 ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      <button type="button" className="ds-page-btn" aria-label="다음 페이지">
        <img src={`${DS_IMG}/arrow-right.svg`} alt="" />
      </button>
    </nav>
  );
}

/** 원본 스크립트가 a 태그에 직접 넣던 인라인 스타일 */
const plainLink = { textDecoration: "none", color: "inherit" };

/** 모바일 게시판 목록 (원본은 jQuery 로 그리던 부분). kind 에 따라 클래스 이름만 다르다 */
export function MobileBoardList({ kind, posts }: { kind: "notice" | "schedule"; posts: BoardPost[] }) {
  const c = (name: string) => `mobile-${kind}-${name}`;
  return (
    <div className={`${c("list")} mobile-only`}>
      <div className={c("header")}>
        <div className={c("header-number")}>번호</div>
        <div className={c("header-title")}>제목</div>
        <div className={c("header-date")}>작성일</div>
      </div>
      {posts.map((post, i) => (
        <Link key={i} href={post.href ?? "#"} className={c("item")} style={plainLink}>
          <div className={c("item-header")}>
            <div className={c("number")}>
              {post.isNotice ? <span className={c("badge")}>공지</span> : post.number}
            </div>
            <div className={c("title")}>{post.title}</div>
            <div className={c("date")}>{post.date}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
