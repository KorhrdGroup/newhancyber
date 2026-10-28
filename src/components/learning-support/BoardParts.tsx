import Link from "next/link";
import type { BoardPost } from "./boardData";

const IMG = "/resources/images/pratice-support";

/** 검색 영역 (원본도 동작 없음) */
export function SearchBox() {
  return (
    <div className="search-box">
      <div className="search-select-wrapper">
        <select className="search-select">
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="all">제목+내용</option>
        </select>
      </div>
      <input type="text" className="search-input" placeholder="검색어를 입력하세요" />
      {/* TODO: 검색 API */}
      <button type="button" className="search-button">
        <img src={`${IMG}/search.png`} alt="검색" />
      </button>
    </div>
  );
}

/** 데스크톱 게시판 표 */
export function BoardTable({ posts }: { posts: BoardPost[] }) {
  return (
    <table className="practice-support-notice-table">
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성일</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post, i) => (
          <tr key={i} className={post.emphasized ? "practice-support-notice-row" : undefined}>
            <td>{post.isNotice ? <span className="practice-support-notice-badge">공지</span> : post.number}</td>
            <td className="practice-support-notice-title">
              {post.href ? (
                <Link href={post.href} className="practice-support-notice-link">
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

interface PaginationProps {
  /** 버튼 클래스 앞부분: practice-support-pagination / mobile-notice-pagination / mobile-schedule-pagination */
  prefix: string;
  className?: string;
}

/** 페이지 번호 (원본도 1페이지 고정, 동작 없음). TODO: 목록 API 의 페이지 정보로 */
export function Pagination({ prefix, className }: PaginationProps) {
  return (
    <div className={[prefix, className].filter(Boolean).join(" ")}>
      {[1, 2, 3, 4, 5].map((page) => (
        <button key={page} type="button" className={`${prefix}-btn${page === 1 ? " active" : ""}`}>
          {page}
        </button>
      ))}
      <button type="button" className={`${prefix}-btn ${prefix}-arrow`}>
        <img src={`${IMG}/page-right.png`} alt="다음" />
      </button>
      <button type="button" className={`${prefix}-btn ${prefix}-arrow`}>
        <img src={`${IMG}/page-right-plus.png`} alt="마지막" />
      </button>
    </div>
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
