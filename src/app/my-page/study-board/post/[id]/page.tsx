import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MyPageShell from "@/components/my-page/MyPageShell";
import {
  boardLabels,
  boardListHref,
  courseTitle,
  getAdjacentPosts,
  getBoardPost,
} from "@/components/my-page/myPageDataA";
import { myPageBoardTabs } from "@/lib/navigation";

export const metadata: Metadata = { title: "학습 게시판 - 마이페이지" };

/** U28 학습 게시판 — 글 보기 (세 게시판 공통) */
export default async function StudyBoardPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // TODO: API 학습 게시판 글 조회 (조회수 올림 포함)
  const post = getBoardPost(id);
  if (!post) notFound();
  const { prev, next } = getAdjacentPosts(post);
  const listHref = boardListHref[post.kind];

  return (
    <MyPageShell title="학습 게시판" desc="수강 중인 과목의 공지, 질문과 답변, 학습 자료를 모아 볼 수 있습니다.">
      {/* 글 보기 주소는 게시판마다 같아서, 글이 속한 게시판 탭을 직접 켠다 */}
      <nav className="page-tabs">
        {myPageBoardTabs.map((tab) => (
          <Link key={tab.href} href={tab.href} className={`page-tab${tab.href === listHref ? " is-active" : ""}`}>
            {tab.label}
          </Link>
        ))}
      </nav>

      <article className="mp-post">
        <header className="mp-post-head">
          <p className="pp-note">
            {boardLabels[post.kind]} · {courseTitle(post.courseId)}
          </p>
          <h3 className="mp-post-title">{post.title}</h3>
          <p className="mp-post-meta">
            <span>{post.author}</span>
            <span>{post.date}</span>
            <span>조회 {post.views}</span>
          </p>
        </header>
        <div className="mp-post-body">
          {post.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        {post.files && (
          <div className="mp-post-files">
            <span className="ds-label">첨부파일</span>
            <ul>
              {post.files.map((f) => (
                // TODO: API 첨부파일 내려받기 주소
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}
      </article>

      {post.kind === "qna" && (
        <section className={`pp-box ds-mt-20${post.answer ? " mp-answer" : ""}`}>
          <h3 className="pp-box-title">답변</h3>
          {post.answer ? (
            <>
              <p className="mp-post-meta">
                <span>{post.answer.author}</span>
                <span>{post.answer.date}</span>
              </p>
              <div className="mp-post-body mp-post-body--flush">
                {post.answer.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </>
          ) : (
            <p className="pp-text">아직 답변이 없습니다. 답변이 달리면 이 화면에서 볼 수 있습니다.</p>
          )}
        </section>
      )}

      <ul className="mp-post-nav">
        <li>
          <span className="mp-post-nav-label">이전글</span>
          {prev ? <Link href={`/my-page/study-board/post/${prev.id}`}>{prev.title}</Link> : <span className="ds-text-disabled">이전 글이 없습니다.</span>}
        </li>
        <li>
          <span className="mp-post-nav-label">다음글</span>
          {next ? <Link href={`/my-page/study-board/post/${next.id}`}>{next.title}</Link> : <span className="ds-text-disabled">다음 글이 없습니다.</span>}
        </li>
      </ul>

      <div className="pp-actions">
        <Link href={listHref} className="ds-btn ds-btn--secondary">
          목록
        </Link>
      </div>
    </MyPageShell>
  );
}
