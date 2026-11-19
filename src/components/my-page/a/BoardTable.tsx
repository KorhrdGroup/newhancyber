import Link from "next/link";
import {
  BoardTable as BoardListTable,
  MobileBoardList,
  Pagination,
  SearchBox,
  type BoardColumn,
} from "@/components/learning-support/BoardParts";
import type { BoardPost as ListPost } from "@/components/learning-support/boardData";
import { courseTerm, courseTitle, getBoardPosts, type BoardKind } from "../myPageDataA";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

// 학기 · 과목을 한 칸에 두 줄로 쌓으면 답답해서 칸을 나눠 한 줄씩 가로로 둔다
const columns: BoardColumn[] = [
  { key: "term", label: "학기", at: "before-title", width: 160 },
  { key: "course", label: "과목", at: "before-title", width: 180 },
];
/** 학습 Q&A 만 맨 끝에 답변 상태 칸 (1:1 문의 목록과 같은 배지) */
const qnaColumns: BoardColumn[] = [...columns, { key: "answer", label: "답변", at: "end", width: 120 }];
const scopes = [
  { value: "title", label: "제목" },
  { value: "content", label: "내용" },
];

/**
 * U28 학습 게시판 목록 (학습 공지사항·학습 자료실·학습 Q&A 공통).
 * 원본 /stdMng/stdBbs/bbsList.asp 처럼 칸은 번호 · 학기/과목 · 제목, 검색은 학기 · 과목 · 제목/내용.
 */
export default function BoardTable({ kind }: { kind: BoardKind }) {
  // TODO: API 학습 게시판 목록 조회 (bbs_mng_idx, 학기·과목·검색어, 쪽 번호)
  const posts = getBoardPosts(kind);
  const courseIds = [...new Set(posts.map((post) => post.courseId))];
  const terms = [...new Set(courseIds.map(courseTerm))];

  const answerBadge = (answered: boolean) =>
    answered ? (
      <span className="ds-badge ds-badge--success">답변 완료</span>
    ) : (
      <span className="ds-badge ds-badge--neutral">답변 대기</span>
    );

  const list: ListPost[] = posts.map((post, i) => ({
    number: String(posts.length - i),
    title: post.title,
    date: post.date,
    href: `/my-page/study-board/post/${post.id}`,
    cells: {
      term: courseTerm(post.courseId),
      course: courseTitle(post.courseId),
      answer: answerBadge(Boolean(post.answer)),
    },
    meta: (
      <>
        <span>{courseTitle(post.courseId)}</span>
        {kind === "qna" && answerBadge(Boolean(post.answer))}
      </>
    ),
  }));

  const filters = (
    <>
      <select className="ds-select lx-board-filter" aria-label="학기" defaultValue="">
        <option value="">학기 전체</option>
        {terms.map((term) => (
          <option key={term}>{term}</option>
        ))}
      </select>
      <select className="ds-select lx-board-filter" aria-label="과목" defaultValue="">
        <option value="">과목 전체</option>
        {courseIds.map((id) => (
          <option key={id} value={id}>
            {courseTitle(id)}
          </option>
        ))}
      </select>
    </>
  );

  const ask = kind === "qna" && (
    <div className="lx-board-actions">
      <Link href="/my-page/study-board/qna/write" className="ds-btn ds-btn--primary">
        문의하기
      </Link>
    </div>
  );

  return (
    <>
      <div className="desktop-only">
        <SearchBox total={posts.length} filters={filters} scopes={scopes} />
      </div>
      {posts.length === 0 ? (
        <p className="cr-empty">등록된 글이 없습니다.</p>
      ) : (
        <>
          <MobileBoardList kind="notice" posts={list} dateLabel={null} />
          <div className="desktop-only">
            <BoardListTable posts={list} columns={kind === "qna" ? qnaColumns : columns} dateLabel={null} />
          </div>
        </>
      )}
      {ask}
      {posts.length > 0 && <Pagination pages={1} />}
    </>
  );
}
