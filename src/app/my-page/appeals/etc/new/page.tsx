import type { Metadata } from "next";
import MyPageShell from "@/components/my-page/MyPageShell";
import AppealNew from "@/components/my-page/b/AppealNew";

export const metadata: Metadata = { title: "기타 이의신청하기 - 마이페이지" };

/** U34 성적 이의신청 — 기타 이의신청 신청서 */
export default function NewEtcAppealPage() {
  return (
    <MyPageShell title="기타 이의신청하기" desc="과목과 신청 구분을 고르고 신청 사유를 적어 주세요.">
      <AppealNew kind="etc" />
    </MyPageShell>
  );
}
