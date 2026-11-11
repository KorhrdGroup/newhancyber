import type { Metadata } from "next";
import Link from "next/link";
import ExTabs from "@/components/course-registration/extra/ExTabs";
import { reviewTabs } from "@/components/course-registration/extra/extraData";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "수강후기" };

// 추후 오픈 예정 — 메뉴·사이트맵에서 숨김 처리된 페이지

export default function CourseReviewsPage() {
  return (
    <>
    <ExTabs items={reviewTabs} underHeader />
    <main className="wrapper">
      <div className="practice-support-notice-list-section">
        <div className="container" style={{ backgroundColor: "#fff" }}>
          <table className="practice-support-notice-table">
            <thead>
              <tr>
                <th>
                  번호
                </th>
                <th>
                  제목
                </th>
                <th>
                  학습자명
                </th>
                <th>
                  등록일
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="review-best-badge">
                    BEST
                  </span>
                </td>
                <td className="practice-support-notice-title">
                  <Link href="/course-registration/reviews/best/1" className="practice-support-notice-link">
                    [사회복지사] 2025-1학기 성적우수장학생 김지현 학습자 장학후기
                  </Link>
                </td>
                <td>
                  한*생
                </td>
                <td>
                  25.10.21
                </td>
              </tr>
              <tr>
                <td>
                  <span className="review-best-badge">
                    BEST
                  </span>
                </td>
                <td className="practice-support-notice-title">
                  [평생교육사] 2024-2학기 성적우수장학생 최현서 학습자 장학후기
                </td>
                <td>
                  한*생
                </td>
                <td>
                  25.10.21
                </td>
              </tr>
              <tr className="review-selected">
                <td>
                  <span className="review-best-badge">
                    BEST
                  </span>
                </td>
                <td className="practice-support-notice-title">
                  [사회복지사] 2024-2학기 성적우수장학생 이설희 학습자 장학후기
                </td>
                <td>
                  한*생
                </td>
                <td>
                  25.10.21
                </td>
              </tr>
              <tr>
                <td>
                  <span className="review-best-badge">
                    BEST
                  </span>
                </td>
                <td className="practice-support-notice-title">
                  [청소년지도사] 2024-2학기 성적우수장학생 맹민영 학습자 장학후기
                </td>
                <td>
                  한*생
                </td>
                <td>
                  25.10.21
                </td>
              </tr>
              <tr>
                <td>
                  1
                </td>
                <td className="practice-support-notice-title">
                  <Link href="/course-registration/reviews/1" className="practice-support-notice-link">
                    [사회복지사] 2024-1학기 성적우수장학생 박민수 학습자 장학후기
                  </Link>
                </td>
                <td>
                  김*영
                </td>
                <td>
                  25.10.20
                </td>
              </tr>
              <tr>
                <td>
                  2
                </td>
                <td className="practice-support-notice-title">
                  [보육교사] 2024-2학기 성적우수장학생 이지은 학습자 장학후기
                </td>
                <td>
                  최*호
                </td>
                <td>
                  25.10.19
                </td>
              </tr>
              <tr>
                <td>
                  3
                </td>
                <td className="practice-support-notice-title">
                  [경영학] 2024-1학기 성적우수장학생 정수진 학습자 장학후기
                </td>
                <td>
                  박*수
                </td>
                <td>
                  25.10.18
                </td>
              </tr>
              <tr>
                <td>
                  4
                </td>
                <td className="practice-support-notice-title">
                  [심리학] 2024-2학기 성적우수장학생 강민지 학습자 장학후기
                </td>
                <td>
                  이*희
                </td>
                <td>
                  25.10.17
                </td>
              </tr>
              <tr>
                <td>
                  5
                </td>
                <td className="practice-support-notice-title">
                  [미용] 2024-1학기 성적우수장학생 윤서연 학습자 장학후기
                </td>
                <td>
                  장*우
                </td>
                <td>
                  25.10.16
                </td>
              </tr>
              <tr>
                <td>
                  6
                </td>
                <td className="practice-support-notice-title">
                  [사회복지사] 2023-2학기 성적우수장학생 황지훈 학습자 장학후기
                </td>
                <td>
                  오*진
                </td>
                <td>
                  25.10.15
                </td>
              </tr>
              <tr>
                <td>
                  7
                </td>
                <td className="practice-support-notice-title">
                  [평생교육사] 2023-1학기 성적우수장학생 송민규 학습자 장학후기
                </td>
                <td>
                  신*아
                </td>
                <td>
                  25.10.14
                </td>
              </tr>
              <tr>
                <td>
                  8
                </td>
                <td className="practice-support-notice-title">
                  [청소년지도사] 2023-2학기 성적우수장학생 임다은 학습자 장학후기
                </td>
                <td>
                  조*현
                </td>
                <td>
                  25.10.13
                </td>
              </tr>
              <tr>
                <td>
                  9
                </td>
                <td className="practice-support-notice-title">
                  [보육교사] 2023-1학기 성적우수장학생 한소희 학습자 장학후기
                </td>
                <td>
                  배*민
                </td>
                <td>
                  25.10.12
                </td>
              </tr>
              <tr>
                <td>
                  10
                </td>
                <td className="practice-support-notice-title">
                  [경영학] 2023-2학기 성적우수장학생 조현우 학습자 장학후기
                </td>
                <td>
                  윤*서
                </td>
                <td>
                  25.10.11
                </td>
              </tr>
              <tr>
                <td>
                  11
                </td>
                <td className="practice-support-notice-title">
                  [심리학] 2023-1학기 성적우수장학생 김태영 학습자 장학후기
                </td>
                <td>
                  강*지
                </td>
                <td>
                  25.10.10
                </td>
              </tr>
              <tr>
                <td>
                  12
                </td>
                <td className="practice-support-notice-title">
                  [미용] 2023-2학기 성적우수장학생 이하늘 학습자 장학후기
                </td>
                <td>
                  송*규
                </td>
                <td>
                  25.10.09
                </td>
              </tr>
            </tbody>
          </table>
          {/* 페이지네이션 */}
          <div className="practice-support-pagination">
            <button className="practice-support-pagination-btn active">
              1
            </button>
            {" "}
            <button className="practice-support-pagination-btn">
              2
            </button>
            {" "}
            <button className="practice-support-pagination-btn">
              3
            </button>
            {" "}
            <button className="practice-support-pagination-btn">
              4
            </button>
            {" "}
            <button className="practice-support-pagination-btn">
              5
            </button>
            {" "}
            <button className="practice-support-pagination-btn practice-support-pagination-arrow">
              <img src="/resources/images/pratice-support/page-right.png" alt="다음" />
            </button>
            {" "}
            <button className="practice-support-pagination-btn practice-support-pagination-arrow">
              <img src="/resources/images/pratice-support/page-right-plus.png" alt="마지막" />
            </button>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
