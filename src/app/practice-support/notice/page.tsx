import type { Metadata } from "next";
import { BoardTable, MobileBoardList, Pagination, SearchBox } from "@/components/learning-support/BoardParts";
import type { BoardPost } from "@/components/learning-support/boardData";
import { practiceNotices } from "@/components/practice-support/noticeData";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
// 모바일 목록 · 파란 제목 띠 스타일은 학습지원 CSS 에만 있어서 같이 불러온다 (실습지원 CSS 엔 모바일 스타일이 없음)
import "@/styles/learning-support.css";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "실습공지사항" };

/** 실습공지사항 전체 글 수 (가데이터) — 가장 큰 글 번호와 같다 */
const PRACTICE_NOTICE_TOTAL = 87;

/** 학습지원 공지사항과 같은 목록 부품으로 그리도록 글 모양을 맞춘다 */
const posts: BoardPost[] = practiceNotices.map((notice) => ({
  number: notice.pinned ? "공지" : String(notice.number),
  title: notice.title,
  date: notice.date,
  isNotice: notice.pinned,
  emphasized: notice.pinned,
  href: `/practice-support/notice/${notice.id}`,
}));

/** 학습지원 공지사항과 같은 화면 (검색 줄 · 표 · 페이지 번호, 모바일은 파란 제목 띠 + 목록) */
export default function PracticeNoticePage() {
  return (
    <>
      <MobilePageBanner name="notice" text="실습공지사항" />
      <main className="wrapper">
        <MobileBoardList kind="notice" posts={posts} />

        <div className="practice-support-notice-list-section desktop-only">
          <div className="container" style={{ backgroundColor: "#fff" }}>
            <SearchBox total={PRACTICE_NOTICE_TOTAL} />
            <BoardTable posts={posts} />
            <Pagination />
          </div>
        </div>

        <Pagination className="mobile-only" />
      </main>
    </>
  );
}
