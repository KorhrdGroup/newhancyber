import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { courseTitle, getBoardPosts, type BoardKind } from "../myPageDataA";

/** U28 학습 게시판 목록 (과목 공지·학습 Q&A·과목 자료실 공통) */
export default function BoardTable({ kind }: { kind: BoardKind }) {
  // TODO: API 학습 게시판 목록 조회 (bbs_mng_idx, 쪽 번호)
  const posts = getBoardPosts(kind);
  const isQna = kind === "qna";

  return (
    <>
      <div className="pp-row pp-row--between ds-mb-16">
        <p className="pp-note">
          전체 <strong className="ds-text-brand">{posts.length}</strong>건
        </p>
        {isQna && (
          <Link href="/my-page/study-board/qna/write" className="ds-btn ds-btn--primary ds-btn--sm">
            글쓰기
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <p className="cr-empty">등록된 글이 없습니다.</p>
      ) : (
        <div className="cr-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>과목</th>
                <th>제목</th>
                <th>작성자</th>
                <th>등록일</th>
                <th>조회</th>
                {isQna && <th>답변 상태</th>}
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr key={post.id}>
                  <td>{posts.length - i}</td>
                  <td className="mp-nowrap">{courseTitle(post.courseId)}</td>
                  <td className="is-left">
                    <Link href={`/my-page/study-board/post/${post.id}`} className="mp-title-link">
                      {post.title}
                    </Link>
                    {post.files && <span className="pp-note"> · 첨부 {post.files.length}</span>}
                  </td>
                  <td className="mp-nowrap">{post.author}</td>
                  <td>{post.date}</td>
                  <td>{post.views}</td>
                  {isQna && (
                    <td>
                      <StatusBadge>{post.answer ? "답변 완료" : "답변 대기"}</StatusBadge>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
