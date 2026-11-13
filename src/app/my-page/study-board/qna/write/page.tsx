import type { Metadata } from "next";
import PageTabs from "@/components/common/PageTabs";
import MyPageShell from "@/components/my-page/MyPageShell";
import QnaWriteForm from "@/components/my-page/a/QnaWriteForm";
import { getOngoingCourses } from "@/components/my-classroom/classroomData";
import { myPageBoardTabs } from "@/lib/navigation";

export const metadata: Metadata = { title: "학습 Q&A 글쓰기 - 마이페이지" };

/** U28 학습 게시판 — 학습 Q&A 글쓰기 */
export default function QnaWritePage() {
  // TODO: API 수강 중인 과목 조회
  const courses = getOngoingCourses().map(({ id, title }) => ({ id, title }));
  return (
    <MyPageShell title="학습 게시판" desc="과목 공부 중 궁금한 점을 남기면 교수님이나 운영팀이 답해 드립니다.">
      <PageTabs items={myPageBoardTabs} />
      <QnaWriteForm courses={courses} />
    </MyPageShell>
  );
}
