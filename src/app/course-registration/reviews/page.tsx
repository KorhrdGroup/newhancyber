import type { Metadata } from "next";
import ExTabs from "@/components/course-registration/extra/ExTabs";
import { reviewTabs } from "@/components/course-registration/extra/extraData";
import { BoardTable, MobileBoardList, Pagination, SearchBox } from "@/components/learning-support/BoardParts";
import type { BoardPost } from "@/components/learning-support/boardData";
import "@/styles/extra-pages.css";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "수강후기" };

// 추후 오픈 예정 — 메뉴·사이트맵에서 숨김 처리된 페이지

/** 수강후기 가데이터 (원본 표 그대로). 원본에서 링크가 있던 두 글만 href. TODO: API 수강후기 목록·페이지 조회 */
const reviews: { title: string; writer: string; date: string; best?: boolean; href?: string }[] = [
  { best: true, title: "[사회복지사] 2025-1학기 성적우수장학생 김지현 학습자 장학후기", writer: "한*생", date: "25.10.21", href: "/course-registration/reviews/best/1" },
  { best: true, title: "[평생교육사] 2024-2학기 성적우수장학생 최현서 학습자 장학후기", writer: "한*생", date: "25.10.21" },
  { best: true, title: "[사회복지사] 2024-2학기 성적우수장학생 이설희 학습자 장학후기", writer: "한*생", date: "25.10.21" },
  { best: true, title: "[청소년지도사] 2024-2학기 성적우수장학생 맹민영 학습자 장학후기", writer: "한*생", date: "25.10.21" },
  { title: "[사회복지사] 2024-1학기 성적우수장학생 박민수 학습자 장학후기", writer: "김*영", date: "25.10.20", href: "/course-registration/reviews/1" },
  { title: "[보육교사] 2024-2학기 성적우수장학생 이지은 학습자 장학후기", writer: "최*호", date: "25.10.19" },
  { title: "[경영학] 2024-1학기 성적우수장학생 정수진 학습자 장학후기", writer: "박*수", date: "25.10.18" },
  { title: "[심리학] 2024-2학기 성적우수장학생 강민지 학습자 장학후기", writer: "이*희", date: "25.10.17" },
  { title: "[미용] 2024-1학기 성적우수장학생 윤서연 학습자 장학후기", writer: "장*우", date: "25.10.16" },
  { title: "[사회복지사] 2023-2학기 성적우수장학생 황지훈 학습자 장학후기", writer: "오*진", date: "25.10.15" },
  { title: "[평생교육사] 2023-1학기 성적우수장학생 송민규 학습자 장학후기", writer: "신*아", date: "25.10.14" },
  { title: "[청소년지도사] 2023-2학기 성적우수장학생 임다은 학습자 장학후기", writer: "조*현", date: "25.10.13" },
  { title: "[보육교사] 2023-1학기 성적우수장학생 한소희 학습자 장학후기", writer: "배*민", date: "25.10.12" },
  { title: "[경영학] 2023-2학기 성적우수장학생 조현우 학습자 장학후기", writer: "윤*서", date: "25.10.11" },
  { title: "[심리학] 2023-1학기 성적우수장학생 김태영 학습자 장학후기", writer: "강*지", date: "25.10.10" },
  { title: "[미용] 2023-2학기 성적우수장학생 이하늘 학습자 장학후기", writer: "송*규", date: "25.10.09" },
];

const normal = reviews.filter((r) => !r.best);

/** 공지사항과 같은 목록 (번호 자리에 BEST 배지, 학습자명 칸) — 번호는 다른 게시판처럼 최신 글이 큰 번호 */
const posts: BoardPost[] = reviews.map((review) => ({
  number: review.best ? "" : String(normal.length - normal.indexOf(review)),
  badge: review.best ? "BEST" : undefined,
  title: review.title,
  date: review.date,
  href: review.href,
  cells: { writer: review.writer },
}));

export default function CourseReviewsPage() {
  return (
    <>
      <ExTabs items={reviewTabs} underHeader />
      <main className="wrapper">
        <MobileBoardList kind="notice" posts={posts} dateLabel="등록일" />

        <div className="practice-support-notice-list-section desktop-only">
          <div className="container" style={{ backgroundColor: "#fff" }}>
            <SearchBox total={reviews.length} />
            <BoardTable posts={posts} columns={[{ key: "writer", label: "학습자명", width: 104 }]} dateLabel="등록일" />
            <Pagination />
          </div>
        </div>

        <Pagination className="mobile-only" />
      </main>
    </>
  );
}
