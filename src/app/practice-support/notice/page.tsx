import type { Metadata } from "next";
import Link from "next/link";
import { practiceNotices } from "@/components/practice-support/noticeData";

export const metadata: Metadata = { title: "실습공지사항" };

const IMG = "/resources/images/pratice-support";

export default function PracticeNoticePage() {
  return (
    <main className="wrapper">
      <div className="practice-support-notice-list-section">
        <div className="container" style={{ backgroundColor: "#fff" }}>
          {/* TODO: 검색 API 연동 (원본도 동작 없음) */}
          <div className="search-box">
            <div className="search-select-wrapper">
              <select className="search-select">
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="all">제목+내용</option>
              </select>
            </div>
            <input type="text" className="search-input" placeholder="검색어를 입력하세요" />
            <button type="button" className="search-button">
              <img src={`${IMG}/search.png`} alt="검색" />
            </button>
          </div>
          <table className="practice-support-notice-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              {practiceNotices.map((notice) => (
                <tr key={notice.id} className={notice.pinned ? "practice-support-notice-row" : undefined}>
                  <td>
                    {notice.pinned ? (
                      <span className="practice-support-notice-badge">공지</span>
                    ) : (
                      notice.number
                    )}
                  </td>
                  <td className="practice-support-notice-title">
                    <Link href={`/practice-support/notice/${notice.id}`} className="practice-support-notice-link">
                      {notice.title}
                    </Link>
                  </td>
                  <td>{notice.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TODO: 페이지네이션 (원본도 동작 없음) */}
          <div className="practice-support-pagination">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                type="button"
                className={`practice-support-pagination-btn${page === 1 ? " active" : ""}`}
              >
                {page}
              </button>
            ))}
            <button type="button" className="practice-support-pagination-btn practice-support-pagination-arrow">
              <img src={`${IMG}/page-right.png`} alt="다음" />
            </button>
            <button type="button" className="practice-support-pagination-btn practice-support-pagination-arrow">
              <img src={`${IMG}/page-right-plus.png`} alt="마지막" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
