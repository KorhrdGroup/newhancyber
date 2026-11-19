import { BoardTable, MobileBoardList, Pagination, SearchBox } from "./BoardParts";
import { schedulePosts } from "./boardData";

/**
 * 학사일정 목록: 공지사항과 같은 목록 부품(검색 줄 · 표 · 페이지 번호).
 * 운영 사이트처럼 이론/실습을 탭으로 나누지 않고 한 목록에 두고, 실습 글은 제목 앞 배지로 구분한다.
 */
export default function ScheduleBoard() {
  // TODO: API — 학사일정 목록 조회
  const posts = schedulePosts;

  return (
    <>
      <MobileBoardList kind="schedule" posts={posts} />

      <div className="practice-support-notice-list-section desktop-only">
        <div className="container" style={{ backgroundColor: "#fff" }}>
          <SearchBox total={posts.length} />
          <BoardTable posts={posts} />
          <Pagination className="desktop-only" pages={1} />
        </div>
      </div>

      <Pagination className="mobile-only" pages={1} />
    </>
  );
}
