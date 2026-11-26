import type { Metadata } from "next";
import PageTabs from "@/components/common/PageTabs";
import MyPageShell from "@/components/my-page/MyPageShell";
import BoardTable from "@/components/my-page/a/BoardTable";
import StudyBoardList from "@/components/my-page/a/StudyBoardList";
import { isDbConfigured } from "@/lib/db/client";
import { myPageBoardTabs } from "@/lib/navigation";

export const metadata: Metadata = { title: "학습 자료실 - 학습 게시판 - 마이페이지" };

/** U28 학습 게시판 — 학습 자료실. DB: LMS · 교강사 사이트 학습 게시판의 내 수강 차수 글 (src/lib/db/studyBoard.ts). 샘플: myPageDataA */
export default async function StudyBoardMaterialsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <MyPageShell title="학습 게시판" desc="수강 중인 과목의 공지와 학습 자료, 내 1:1 문의를 모아 볼 수 있습니다.">
      <PageTabs items={myPageBoardTabs} />
      {isDbConfigured() ? <StudyBoardList kind="materials" basePath="/my-page/study-board/materials" searchParams={await searchParams} /> : <BoardTable kind="materials" />}
    </MyPageShell>
  );
}
