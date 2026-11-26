import { redirect } from "next/navigation";
import { BoardTable as BoardListTable, MobileBoardList, Pagination, SearchBox, type BoardColumn } from "@/components/learning-support/BoardParts";
import type { BoardPost as ListPost } from "@/components/learning-support/boardData";
import { listMyStudyClasses, listStudyPosts, STUDY_PAGE_SIZE, type StudyBoardKind } from "@/lib/db/studyBoard";
import { getCurrentMember } from "@/lib/memberAuth";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

const columns: BoardColumn[] = [
  { key: "term", label: "학기", at: "before-title", width: 160 },
  { key: "course", label: "과목", at: "before-title", width: 180 },
];
const scopes = [
  { value: "title", label: "제목" },
  { value: "content", label: "내용" },
];

type SearchParams = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const idOf = (v: string) => (/^\d{1,9}$/.test(v) ? Number(v) : null);

/**
 * 학습 게시판 목록 (DB) — 로그인한 회원이 수강하는 차수의 글만 (src/lib/db/studyBoard.ts).
 * 학기 · 과목 · 제목/내용 검색과 쪽 번호는 주소(?sem= &c= &scope= &q= &page=)로 움직인다.
 */
export default async function StudyBoardList({ kind, basePath, searchParams }: { kind: StudyBoardKind; basePath: string; searchParams: SearchParams }) {
  const member = await getCurrentMember();
  if (!member) redirect(`/member/login?next=${encodeURIComponent(basePath)}`);

  const page = Math.min(10000, Math.max(1, Number.parseInt(one(searchParams.page), 10) || 1));
  const q = one(searchParams.q).trim().slice(0, 100);
  const scope = one(searchParams.scope) === "content" ? "content" : "title";
  const classes = await listMyStudyClasses(member.memberId);
  const semesters = [...new Map(classes.map((c) => [c.semesterId, c.semester])).entries()];
  const semesterId = idOf(one(searchParams.sem));
  const sem = semesters.some(([id]) => id === semesterId) ? semesterId : null;
  const classId = idOf(one(searchParams.c));
  const cls = classes.some((c) => c.classId === classId && (sem === null || c.semesterId === sem)) ? classId : null;

  const { rows, total } = await listStudyPosts({ memberId: member.memberId, kind, semesterId: sem, classId: cls, q, scope, page });
  const pages = Math.max(1, Math.ceil(total / STUDY_PAGE_SIZE));
  const href = (p: number) => {
    const qs = new URLSearchParams();
    if (sem) qs.set("sem", String(sem));
    if (cls) qs.set("c", String(cls));
    if (q) {
      qs.set("q", q);
      if (scope !== "title") qs.set("scope", scope);
    }
    if (p > 1) qs.set("page", String(p));
    const s = qs.toString();
    return s ? `${basePath}?${s}` : basePath;
  };
  if (page > pages && total > 0) redirect(href(pages));

  const list: ListPost[] = rows.map((r, i) => ({
    number: String(total - (page - 1) * STUDY_PAGE_SIZE - i),
    isNotice: r.isPinned,
    title: r.fileCount > 0 ? `${r.title} (첨부 ${r.fileCount})` : r.title,
    date: r.createdAt,
    href: `/my-page/study-board/post/${r.postId}`,
    cells: { term: r.semester ?? "전체", course: r.course ?? "전체" },
    meta: <span>{r.course ?? "전체"}</span>,
  }));

  const filters = (
    <>
      <select className="ds-select lx-board-filter" aria-label="학기" name="sem" defaultValue={sem ? String(sem) : ""}>
        <option value="">학기 전체</option>
        {semesters.map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      <select className="ds-select lx-board-filter" aria-label="과목" name="c" defaultValue={cls ? String(cls) : ""}>
        <option value="">과목 전체</option>
        {classes
          .filter((c) => sem === null || c.semesterId === sem)
          .map((c) => (
            <option key={c.classId} value={c.classId}>
              {c.label}
            </option>
          ))}
      </select>
    </>
  );

  return (
    <>
      <div className="desktop-only">
        <SearchBox total={total} filters={filters} scopes={scopes} search={{ action: basePath, q, scope }} />
      </div>
      {classes.length === 0 ? (
        <p className="cr-empty">수강 중인 과목이 없어 볼 글이 없어요.</p>
      ) : rows.length === 0 ? (
        <p className="cr-empty">{q || sem || cls ? "찾는 글이 없어요." : "등록된 글이 없습니다."}</p>
      ) : (
        <>
          <MobileBoardList kind="notice" posts={list} dateLabel={null} />
          <div className="desktop-only">
            <BoardListTable posts={list} columns={columns} dateLabel={null} />
          </div>
        </>
      )}
      {total > 0 && <Pagination pages={pages} current={page} hrefFor={href} />}
    </>
  );
}
