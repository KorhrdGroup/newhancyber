import type { Metadata } from "next";
import PageTabs from "@/components/common/PageTabs";
import MyPageShell from "@/components/my-page/MyPageShell";
import BoardTable from "@/components/my-page/a/BoardTable";
import { myPageBoardTabs } from "@/lib/navigation";

export const metadata: Metadata = { title: "과목 자료실 - 학습 게시판 - 마이페이지" };

/** U28 학습 게시판 — 과목 자료실 */
export default function StudyBoardMaterialsPage() {
  return (
    <MyPageShell title="학습 게시판" desc="수강 중인 과목의 공지, 질문과 답변, 학습 자료를 모아 볼 수 있습니다.">
      <PageTabs items={myPageBoardTabs} className="mp-subtabs" />
      <BoardTable kind="materials" />
    </MyPageShell>
  );
}
