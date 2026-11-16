import type { Metadata } from "next";
import MyPageShell from "@/components/my-page/MyPageShell";
import AppealNew from "@/components/my-page/b/AppealNew";

export const metadata: Metadata = { title: "성적 이의신청하기 - 마이페이지" };

/** U34 성적 이의신청 — 신청서 */
export default function NewGradeAppealPage() {
  return (
    <MyPageShell title="성적 이의신청하기" desc="과목과 구분을 고르고 제목과 내용을 적어 주세요.">
      <AppealNew kind="grade" />
    </MyPageShell>
  );
}
