import type { Metadata } from "next";
import PageTabs from "@/components/common/PageTabs";
import MyPageShell from "@/components/my-page/MyPageShell";
import PasswordConfirmForm from "@/components/my-page/b/PasswordConfirmForm";
import { sampleMember } from "@/components/my-page/myPageDataB";
import { myPageAccountTabs } from "@/lib/navigation";

export const metadata: Metadata = { title: "내 정보 수정 - 마이페이지" };

/** U35 내 정보 수정 — 1단계 비밀번호 확인 */
export default function ProfileConfirmPage() {
  // TODO: API 로그인한 회원 아이디 조회
  return (
    <MyPageShell title="내 정보 수정">
      <PageTabs items={myPageAccountTabs} />
      <PasswordConfirmForm userId={sampleMember.userId} />
    </MyPageShell>
  );
}
