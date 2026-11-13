import Link from "next/link";
import StatusBadge from "./StatusBadge";
import {
  BoardTable as BoardListTable,
  MobileBoardList,
  Pagination,
  SearchBox,
  type BoardColumn,
} from "@/components/learning-support/BoardParts";
import type { BoardPost as ListPost } from "@/components/learning-support/boardData";
import { courseTitle, getBoardPosts, type BoardKind } from "../myPageDataA";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

/**
 * U28 학습 게시판 목록 (과목 공지·학습 Q&A·과목 자료실 공통).
 * 공지사항과 같은 목록 부품(검색 줄 · 표 · 페이지 번호, 모바일은 목록)에 과목·작성자·조회 칸을 더한다.
 */
export default function BoardTable({ kind }: { kind: BoardKind }) {
  // TODO: API 학습 게시판 목록 조회 (bbs_mng_idx, 쪽 번호)
  const posts = getBoardPosts(kind);
  const isQna = kind === "qna";
  const hasFiles = posts.some((post) => post.files?.length);

  const columns: BoardColumn[] = [
    { key: "course", label: "과목", at: "before-title" },
    { key: "author", label: "작성자" },
    ...(hasFiles ? [{ key: "files", label: "첨부" }] : []),
    { key: "views", label: "조회", at: "end" as const, width: 72 },
    ...(isQna ? [{ key: "answer", label: "답변 상태", at: "end" as const, width: 104 }] : []),
  ];

  const list: ListPost[] = posts.map((post, i) => {
    const answer = <StatusBadge>{post.answer ? "답변 완료" : "답변 대기"}</StatusBadge>;
    return {
      number: String(posts.length - i),
      title: post.title,
      date: post.date,
      href: `/my-page/study-board/post/${post.id}`,
      cells: {
        course: courseTitle(post.courseId),
        author: post.author,
        files: post.files?.length ? `${post.files.length}개` : "-",
        views: post.views,
        answer,
      },
      meta: (
        <>
          <span>{courseTitle(post.courseId)}</span>
          {isQna && answer}
        </>
      ),
    };
  });

  if (posts.length === 0) {
    return <p className="cr-empty">등록된 글이 없습니다.</p>;
  }

  const write = isQna && (
    <div className="lx-board-actions">
      <Link href="/my-page/study-board/qna/write" className="ds-btn ds-btn--primary">
        글쓰기
      </Link>
    </div>
  );

  return (
    <>
      <MobileBoardList kind="notice" posts={list} dateLabel="등록일" />
      <div className="mobile-only">{write}</div>

      <div className="desktop-only">
        <SearchBox total={posts.length} />
        <BoardListTable posts={list} columns={columns} dateLabel="등록일" />
        {write}
      </div>

      <Pagination pages={1} />
    </>
  );
}
