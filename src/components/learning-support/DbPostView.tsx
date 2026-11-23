import type { BoardPostDetail } from "@/lib/db/boardPosts";
import { boardFileHref } from "@/lib/publicBoards";
import { kstDate } from "./DbBoard";
import PostView from "./PostView";

/** DB 게시판 글 상세 — 본문은 글자 그대로(HTML 아님) 줄바꿈만 살려 보여 준다 */
export default function DbPostView({
  post,
  basePath,
  title,
}: {
  post: BoardPostDetail;
  basePath: string;
  /** 제목을 바꿔 보일 때 (예: 공지 구분 말머리) */
  title?: string;
}) {
  return (
    <PostView
      title={title ?? post.title}
      date={kstDate(post.createdAt)}
      files={post.files.map((f) => ({ name: f.fileName, href: boardFileHref(f.fileId) }))}
      prev={post.prev ? { title: post.prev.title, href: `${basePath}/${post.prev.postId}` } : undefined}
      next={post.next ? { title: post.next.title, href: `${basePath}/${post.next.postId}` } : undefined}
      listHref={basePath}
    >
      <div className="lx-article-text">{post.content ?? ""}</div>
    </PostView>
  );
}

/** DB 를 읽지 못했을 때 상세 자리 */
export function DbPostUnavailable({ basePath }: { basePath: string }) {
  return (
    <div className="container lx-page">
      <p className="cr-empty">지금은 글을 불러올 수 없어요. 잠시 뒤 다시 시도해 주세요.</p>
      <p className="ds-text-center">
        <a href={basePath} className="ds-btn ds-btn--secondary">
          목록으로
        </a>
      </p>
    </div>
  );
}
