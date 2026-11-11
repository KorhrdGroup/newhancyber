import type { Metadata } from "next";
import Link from "next/link";
import ExTabs from "@/components/course-registration/extra/ExTabs";
import { reviewTabs, scholarshipReviews } from "@/components/course-registration/extra/extraData";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "장학후기" };

export default function ScholarshipReviewsPage() {
  // TODO: API 장학후기 목록·페이지 조회
  const reviews = scholarshipReviews;
  const normal = reviews.filter((r) => !r.best);

  return (
    <>
      <ExTabs items={reviewTabs} underHeader />
      <main className="wrapper">
        <div className="practice-support-notice-list-section">
          <div className="container" style={{ backgroundColor: "#fff" }}>
            <p className="ex-board-count">
              전체 <strong>{reviews.length}</strong>건
            </p>
            <table className="practice-support-notice-table ex-board">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th className="ex-hide-m">작성자</th>
                  <th className="ex-hide-m">첨부</th>
                  <th>등록일</th>
                  <th className="ex-hide-m">조회</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td>{review.best ? <span className="review-best-badge">BEST</span> : normal.length - normal.indexOf(review)}</td>
                    <td className="practice-support-notice-title">
                      {/* 상세는 베스트 수강후기 상세 화면을 같이 쓴다 */}
                      <Link
                        href={`/course-registration/reviews/best/${review.id}`}
                        className="practice-support-notice-link"
                      >
                        {review.title}
                      </Link>
                    </td>
                    <td className="ex-hide-m">{review.writer}</td>
                    <td className="ex-hide-m">{review.hasFile ? <span className="ex-file">첨부</span> : "-"}</td>
                    <td>{review.date}</td>
                    <td className="ex-hide-m">{review.views.toLocaleString("ko-KR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="practice-support-pagination">
              <button className="practice-support-pagination-btn active">1</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
