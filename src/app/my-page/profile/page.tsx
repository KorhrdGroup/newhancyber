import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageTabs from "@/components/common/PageTabs";
import MyPageShell from "@/components/my-page/MyPageShell";
import PasswordConfirmForm from "@/components/my-page/b/PasswordConfirmForm";
import { sampleMember } from "@/components/my-page/myPageDataB";
import { isDbConfigured } from "@/lib/db/client";
import { getCurrentMember } from "@/lib/memberAuth";
import { myPageAccountTabs } from "@/lib/navigation";

export const metadata: Metadata = { title: "내 정보 수정 - 마이페이지" };

/** U35 내 정보 수정 — 1단계 비밀번호 확인. DB: 로그인한 회원만 (아니면 로그인 화면으로) */
export default async function ProfileConfirmPage() {
  let userId = sampleMember.userId;
  if (isDbConfigured()) {
    const member = await getCurrentMember();
    if (!member) redirect(`/member/login?next=${encodeURIComponent("/my-page/profile")}`);
    userId = member.loginId;
  }
  return (
    <MyPageShell title="내 정보 수정">
      <PageTabs items={myPageAccountTabs} />
      <PasswordConfirmForm userId={userId} />
    </MyPageShell>
  );
}
