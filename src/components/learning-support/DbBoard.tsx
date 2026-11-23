import Link from "next/link";
import { redirect } from "next/navigation";
import { BOARD_PAGE_SIZE, isSearchScope, type BoardListRow, type SearchScope } from "@/lib/db/boardPosts";
import { BoardTable, MobileBoardList, Pagination, SearchBox } from "./BoardParts";
import type { BoardPost } from "./boardData";

/**
 * DB 게시판(공지사항 · 학사일정 · 실습공지사항) 목록 화면 — 서버에서 그린다.
 * 구분 세그먼트 · 검색 · 페이지 번호는 모두 주소(?tag= &q= &scope= &page=)로 움직인다.
 * 모양은 예전 TagFilterBoard(샘플 데이터용)와 같다.
 */

/** 한국 시간 「26.11.23」 */
export function kstDate(d: Date): string {
  const parts = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "2-digit", month: "2-digit", day: "2-digit" })
    .formatToParts(d)
    .reduce<Record<string, string>>((acc, p) => ({ ...acc, [p.type]: p.value }), {});
  return `${parts.year}.${parts.month}.${parts.day}`;
}

export interface ListParams {
  page: number;
  q: string;
  scope: SearchScope;
  tag: string | null;
}

type SearchParams = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/** 주소의 ?page · q · scope · tag 를 읽는다. tag 는 tags 안의 값만 받는다 */
export function readListParams(sp: SearchParams, tags: readonly string[] = []): ListParams {
  const page = Number.parseInt(one(sp.page), 10);
  const scope = one(sp.scope);
  const tag = one(sp.tag);
  return {
    page: Number.isFinite(page) && page >= 1 && page <= 10000 ? page : 1,
    q: one(sp.q).trim().slice(0, 100),
    scope: isSearchScope(scope) ? scope : "title",
    tag: tags.includes(tag) ? tag : null,
  };
}

/** 같은 목록의 다른 쪽 · 다른 구분 주소 (빈 값은 빼서 짧게) */
export function listHref(basePath: string, p: Partial<ListParams>): string {
  const qs = new URLSearchParams();
  if (p.tag) qs.set("tag", p.tag);
  if (p.q) {
    qs.set("q", p.q);
    if (p.scope && p.scope !== "title") qs.set("scope", p.scope);
  }
  if (p.page && p.page > 1) qs.set("page", String(p.page));
  const s = qs.toString();
  return s ? `${basePath}?${s}` : basePath;
}

/**
 * 글 수보다 뒤쪽 쪽 번호(오래된 주소 · 북마크, 글이 지워져 쪽이 줄었을 때)면 마지막 쪽으로 보낸다.
 * 목록을 읽은 뒤 부른다 — 글이 하나도 없거나 DB 를 못 읽었으면 그대로 둔다.
 */
export function redirectIfPastEnd(basePath: string, params: ListParams, total: number): void {
  const last = Math.max(1, Math.ceil(total / BOARD_PAGE_SIZE));
  if (total > 0 && params.page > last) redirect(listHref(basePath, { ...params, page: last }));
}

/** 제목 맨 앞 말머리 「[사회복지현장실습] …」를 떼어 배지로 — tags 에 있는 말머리만 */
export function splitTitleTag(title: string, tags: readonly string[]): { tag?: string; title: string } {
  const m = /^\[([^\]]+)\]\s*/.exec(title);
  return m && tags.includes(m[1]) ? { tag: m[1], title: title.slice(m[0].length) } : { title };
}

/** DB 줄 → 목록 부품(BoardPost) 모양. 번호는 전체 글 수에서 거꾸로 센다 */
export function toBoardPosts(
  rows: BoardListRow[],
  o: { basePath: string; total: number; page: number; tagOf: (row: BoardListRow) => { tag?: string; title: string } },
): BoardPost[] {
  return rows.map((row, i) => {
    const { tag, title } = o.tagOf(row);
    return {
      number: String(o.total - (o.page - 1) * BOARD_PAGE_SIZE - i),
      title,
      tag,
      date: kstDate(row.createdAt),
      isNotice: row.isPinned,
      emphasized: row.isPinned,
      href: `${o.basePath}/${row.postId}`,
    };
  });
}

export default function DbBoardList({
  kind,
  basePath,
  posts,
  total,
  params,
  tags,
  label,
  failed,
}: {
  kind: "notice" | "schedule";
  basePath: string;
  posts: BoardPost[];
  total: number;
  params: ListParams;
  /** 구분 세그먼트 (없으면 세그먼트 없이) */
  tags?: readonly string[];
  /** 세그먼트 묶음의 읽기 이름 (예: "공지 구분") */
  label?: string;
  /** DB 를 읽지 못했을 때 — 빈 목록 대신 안내 */
  failed?: boolean;
}) {
  const pages = Math.max(1, Math.ceil(total / BOARD_PAGE_SIZE));
  // 세그먼트 칸은 다른 주소로 가는 링크라서 탭(role=tab)이 아니라 이동 메뉴(nav)로 읽히게 하고, 지금 칸은 aria-current
  const segment = tags ? (
    <nav className="ds-tabs-box ds-tabs-box--segment" aria-label={label}>
      {[null, ...tags].map((t) => {
        const active = t === params.tag;
        return (
          <Link
            key={t ?? "전체"}
            href={listHref(basePath, { ...params, tag: t, page: 1 })}
            aria-current={active ? "page" : undefined}
            className={`ds-tab-box${active ? " is-active" : ""}`}
          >
            {t ?? "전체"}
          </Link>
        );
      })}
    </nav>
  ) : null;
  const empty = (
    <p className="cr-empty">
      {failed ? "지금은 글을 불러올 수 없어요. 잠시 뒤 다시 시도해 주세요." : params.q ? "검색 결과가 없습니다." : "등록된 글이 없습니다."}
    </p>
  );
  const hrefFor = (page: number) => listHref(basePath, { ...params, page });
  const search = {
    action: basePath,
    q: params.q,
    scope: params.scope,
    hidden: params.tag ? { tag: params.tag } : undefined,
  };

  return (
    <>
      {segment && <div className="lx-board-segment mobile-only">{segment}</div>}
      {posts.length > 0 ? <MobileBoardList kind={kind} posts={posts} /> : <div className="mobile-only">{empty}</div>}

      <div className="practice-support-notice-list-section desktop-only">
        <div className="container" style={{ backgroundColor: "#fff" }}>
          <SearchBox total={total} lead={segment ?? undefined} search={search} />
          {posts.length > 0 ? <BoardTable posts={posts} /> : empty}
          <Pagination className="desktop-only" pages={pages} current={params.page} hrefFor={hrefFor} />
        </div>
      </div>

      <Pagination className="mobile-only" pages={pages} current={params.page} hrefFor={hrefFor} />
    </>
  );
}
