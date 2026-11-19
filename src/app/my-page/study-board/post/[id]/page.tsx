import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostView from "@/components/learning-support/PostView";
import MyPageShell from "@/components/my-page/MyPageShell";
import {
  boardLabels,
  boardListHref,
  courseTitle,
  getAdjacentPosts,
  getBoardPost,
} from "@/components/my-page/myPageDataA";
import { myPageBoardTabs, TBD_HREF } from "@/lib/navigation";
// 글 상세 틀(PostView) 스타일
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "학습 게시판 - 마이페이지" };

const postHref = (id: string) => `/my-page/study-board/post/${id}`;

/** U28 학습 게시판 — 글 보기 (두 게시판 공통). 공지사항 상세와 같은 글 상세 틀(PostView) */
export default async function StudyBoardPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // TODO: API 학습 게시판 글 조회 (조회수 올림 포함)
  const post = getBoardPost(id);
  if (!post) notFound();
  const { prev, next } = getAdjacentPosts(post);
  const listHref = boardListHref[post.kind];

  return (
    <MyPageShell title="학습 게시판" desc="수강 중인 과목의 공지와 학습 자료, 내 1:1 문의를 모아 볼 수 있습니다.">
      {/* 글 보기 주소는 게시판마다 같아서, 글이 속한 게시판 탭을 직접 켠다 */}
      <nav className="page-tabs">
        {myPageBoardTabs.map((tab) => (
          <Link key={tab.href} href={tab.href} className={`page-tab${tab.href === listHref ? " is-active" : ""}`}>
            {tab.label}
          </Link>
        ))}
      </nav>

      <PostView
        framed={false}
        className="ds-mt-20"
        title={post.title}
        date={post.date}
        meta={[
          { label: "게시판", value: boardLabels[post.kind] },
          { label: "과목", value: courseTitle(post.courseId) },
          { label: "작성자", value: post.author },
          { label: "작성일", value: post.date },
          { label: "조회", value: post.views },
          ...(post.files
            ? [
                {
                  label: "첨부파일",
                  value: post.files.map((f, i) => (
                    <span key={f}>
                      {i > 0 && ", "}
                      {/* TODO: API 첨부파일 내려받기 주소 */}
                      <a href={TBD_HREF} className="lx-article-file">
                        {f}
                      </a>
                    </span>
                  )),
                },
              ]
            : []),
        ]}
        prev={prev && { title: prev.title, href: postHref(prev.id) }}
        next={next && { title: next.title, href: postHref(next.id) }}
        listHref={listHref}
      >
        {post.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </PostView>
    </MyPageShell>
  );
}
