import type { Metadata } from "next";
import MyPageShell from "@/components/my-page/MyPageShell";
import AppealList from "@/components/my-page/b/AppealList";

export const metadata: Metadata = { title: "기타 이의신청 - 마이페이지" };

/** U34 성적 이의신청 — 기타 이의신청 목록 */
export default function EtcAppealsPage() {
  return (
    <MyPageShell title="성적 이의신청" desc="출석·수료 판정 같은 학사 처리에 이의가 있으면 신청해 주세요.">
      <AppealList kind="etc" />
    </MyPageShell>
  );
}
