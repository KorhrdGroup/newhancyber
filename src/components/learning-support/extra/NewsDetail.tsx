import Link from "next/link";
import type { NewsPost } from "./newsData";

interface SiblingLink {
  title: string;
  href: string;
}

interface NewsDetailProps {
  post: NewsPost;
  prev?: SiblingLink;
  next?: SiblingLink;
}

const LIST_HREF = "/learning-support/notice/news";

/**
 * 관련기관 소식 상세. 공지사항 상세(PostDetail)와 같은 클래스로 그린다.
 * PostDetail 은 본문 샘플이 고정이라 본문·이전글/다음글을 받을 수 있게 따로 만들었다.
 */
export default function NewsDetail({ post, prev, next }: NewsDetailProps) {
  // TODO: 첨부파일 다운로드 링크
  const infoRows = (
    <tbody>
      <tr>
        <th>제목</th>
        <td>{post.title}</td>
      </tr>
      <tr>
        <th>작성일</th>
        <td>{post.date}</td>
      </tr>
      <tr>
        <th>다운로드</th>
        <td>{post.fileName ?? "없음"}</td>
      </tr>
    </tbody>
  );

  const body = post.body.map((line, i) => <p key={i}>{line}</p>);

  const navCell = (link: SiblingLink | undefined, className: string) =>
    link ? (
      <Link href={link.href} className={className}>
        {link.title}
      </Link>
    ) : (
      "없음"
    );

  return (
    <>
      <div className="mobile-notice-detail-info mobile-only">
        <table className="mobile-notice-detail-table">{infoRows}</table>
      </div>

      <div className="mobile-notice-detail-content mobile-only">
        <h1 className="mobile-notice-detail-title">{post.title}</h1>
        <div className="mobile-notice-detail-body">
          <div className="mobile-notice-detail-text">{body}</div>
        </div>

        <div className="mobile-notice-detail-navigation">
          <table className="mobile-notice-detail-nav-table">
            <tbody>
              <tr>
                <th>이전글</th>
                <td>{navCell(prev, "mobile-notice-detail-nav-link")}</td>
              </tr>
              <tr>
                <th>다음글</th>
                <td>{navCell(next, "mobile-notice-detail-nav-link")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mobile-notice-detail-actions">
          <Link href={LIST_HREF} className="mobile-notice-detail-list-btn">
            목록으로
          </Link>
        </div>
      </div>

      <div className="container desktop-only" style={{ backgroundColor: "#fff" }}>
        <table className="schedule-detail-info-table">{infoRows}</table>

        <div className="schedule-detail-title-container">
          <h1 className="schedule-detail-title">{post.title}</h1>

          <div className="schedule-detail-content">
            <div className="schedule-detail-text">{body}</div>
          </div>

          <table className="schedule-detail-navigation-table">
            <tbody>
              <tr>
                <th>이전글</th>
                <td>{navCell(prev, "schedule-detail-nav-link")}</td>
              </tr>
              <tr>
                <th>다음글</th>
                <td>{navCell(next, "schedule-detail-nav-link")}</td>
              </tr>
            </tbody>
          </table>

          <div className="schedule-detail-actions">
            <Link href={LIST_HREF} className="schedule-detail-list-btn">
              목록으로
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
