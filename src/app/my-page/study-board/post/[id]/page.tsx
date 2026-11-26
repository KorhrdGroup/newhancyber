import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PostView from "@/components/learning-support/PostView";
import MyPageShell from "@/components/my-page/MyPageShell";
import {
  boardLabels,
  boardListHref,
  courseTitle,
  getAdjacentPosts,
  getBoardPost,
} from "@/components/my-page/myPageDataA";
import { isDbConfigured } from "@/lib/db/client";
import { readStudyPost } from "@/lib/db/studyBoard";
import { getCurrentMember } from "@/lib/memberAuth";
import { myPageBoardTabs, TBD_HREF } from "@/lib/navigation";
// 글 상세 틀(PostView) 스타일
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "학습 게시판 - 마이페이지" };

const postHref = (id: string | number) => `/my-page/study-board/post/${id}`;
const DESC = "수강 중인 과목의 공지와 학습 자료, 내 1:1 문의를 모아 볼 수 있습니다.";

/** 글 보기 주소는 게시판마다 같아서, 글이 속한 게시판 탭을 직접 켠다 */
function BoardTabs({ listHref }: { listHref: string }) {
  return (
    <nav className="page-tabs">
      {myPageBoardTabs.map((tab) => (
        <Link key={tab.href} href={tab.href} className={`page-tab${tab.href === listHref ? " is-active" : ""}`}>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

/**
 * U28 학습 게시판 — 글 보기 (두 게시판 공통). DB: 내 수강 차수 · 대상 모두/학습자 글만 (아니면 404), 볼 때 조회수 +1,
 * 첨부는 /my-page/study-board/files/{번호}. 본문은 글자 그대로(줄바꿈만 살림). 샘플: myPageDataA.
 */
export default async function StudyBoardPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (isDbConfigured()) {
    if (!/^\d{1,9}$/.test(id)) notFound();
    const member = await getCurrentMember();
    if (!member) redirect(`/member/login?next=${encodeURIComponent(postHref(id))}`);
    const post = await readStudyPost(member.memberId, Number(id));
    if (!post) notFound();
    const listHref = boardListHref[post.kind];
    return (
      <MyPageShell title="학습 게시판" desc={DESC}>
        <BoardTabs listHref={listHref} />
        <PostView
          framed={false}
          className="ds-mt-20"
          title={post.title}
          date={post.createdAt}
          meta={[
            { label: "게시판", value: boardLabels[post.kind] },
            { label: "과목", value: post.semester ? `${post.semester} · ${post.course ?? ""}` : (post.course ?? "전체") },
            { label: "작성자", value: post.author },
            { label: "작성일", value: post.createdAt },
            { label: "조회", value: post.viewCount },
            ...(post.files.length
              ? [
                  {
                    label: "첨부파일",
                    value: post.files.map((f, i) => (
                      <span key={f.fileId}>
                        {i > 0 && ", "}
                        <a href={`/my-page/study-board/files/${f.fileId}`} className="lx-article-file" download>
                          {f.fileName}
                        </a>
                      </span>
                    )),
                  },
                ]
              : []),
          ]}
          prev={post.prev ? { title: post.prev.title, href: postHref(post.prev.postId) } : undefined}
          next={post.next ? { title: post.next.title, href: postHref(post.next.postId) } : undefined}
          listHref={listHref}
        >
          <p className="lx-article-text" style={{ whiteSpace: "pre-line" }}>
            {post.content ?? ""}
          </p>
        </PostView>
      </MyPageShell>
    );
  }

  const post = getBoardPost(id);
  if (!post) notFound();
  const { prev, next } = getAdjacentPosts(post);
  const listHref = boardListHref[post.kind];

  return (
    <MyPageShell title="학습 게시판" desc={DESC}>
      <BoardTabs listHref={listHref} />
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
