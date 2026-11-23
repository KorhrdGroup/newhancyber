import { notFound } from "next/navigation";
import BestReviewBanner from "@/components/course-registration/BestReviewBanner";
import { REVIEWS_HREF, reviewHref, titleCourse } from "@/components/course-registration/reviewData";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import { kstDate } from "@/components/learning-support/DbBoard";
import { DbPostUnavailable } from "@/components/learning-support/DbPostView";
import PostView from "@/components/learning-support/PostView";
import { boardFileHref, boardThumbHref, loadBoardPost, writerLabel } from "@/lib/publicBoards";
// 글 상세 틀(PostView)·모바일 파란 제목 띠 스타일은 학습지원 CSS 에 있어서 같이 불러온다
import "@/styles/learning-support.css";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

/**
 * 수강후기 · 베스트 수강후기 상세 (같은 글 상세 틀).
 * 수강후기 = board_posts.review, 베스트 = board_posts.scholarship_review(장학후기 — 본문 위에 BEST 배너 · 썸네일 사진 · 첨부).
 * 본문은 글자 그대로(HTML 아님) 줄바꿈만 살린다. 이전글/다음글은 같은 게시판 안에서.
 */
export default async function ReviewDetail({ id, best = false }: { id: string; best?: boolean }) {
  const post = await loadBoardPost(best ? "scholarship_review" : "review", id);
  if (post === "missing") notFound();

  return (
    <>
      <MobilePageBanner name="notice-detail" text="수강후기" />
      <main className="wrapper">
        {post === "failed" ? (
          <DbPostUnavailable basePath={REVIEWS_HREF} />
        ) : (
          <PostView
            title={post.title}
            date={kstDate(post.createdAt)}
            meta={[
              { label: "작성자", value: writerLabel(post.authorType, post.authorName) },
              { label: "작성일", value: kstDate(post.createdAt) },
              { label: "수강 과정", value: post.courseName ?? (titleCourse(post.title) || "-") },
              { label: "조회", value: post.viewCount.toLocaleString("ko-KR") },
              ...(post.files.length > 0
                ? [
                    {
                      label: "첨부파일",
                      value: (
                        <span className="lx-article-files">
                          {post.files.map((f) => (
                            <a key={f.fileId} href={boardFileHref(f.fileId)} className="lx-article-file" download>
                              {f.fileName}
                            </a>
                          ))}
                        </span>
                      ),
                    },
                  ]
                : []),
            ]}
            prev={post.prev ? { title: post.prev.title, href: reviewHref(post.prev.postId, best) } : undefined}
            next={post.next ? { title: post.next.title, href: reviewHref(post.next.postId, best) } : undefined}
            listHref={REVIEWS_HREF}
          >
            {best && <BestReviewBanner title={post.title} photoSrc={post.thumbFileId ? boardThumbHref(post.thumbFileId) : undefined} />}
            <div className="lx-article-text">{post.content ?? ""}</div>
          </PostView>
        )}
      </main>
    </>
  );
}
