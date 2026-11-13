import type { Metadata } from "next";
import PageTabs from "@/components/common/PageTabs";
import MyPageShell from "@/components/my-page/MyPageShell";
import ProfileEditForm from "@/components/my-page/b/ProfileEditForm";
import { sampleMember } from "@/components/my-page/myPageDataB";
import { myPageAccountTabs } from "@/lib/navigation";

export const metadata: Metadata = { title: "내 정보 수정 - 마이페이지" };

/** U35 내 정보 수정 — 2단계 회원 정보 수정 */
export default function ProfileEditPage() {
  // TODO: API 비밀번호 확인을 거치지 않고 들어오면 /my-page/profile 로 돌려보냄
  // TODO: API 회원 정보 조회
  return (
    <MyPageShell title="내 정보 수정" desc="바뀐 연락처와 주소를 고쳐 두면 학습 안내를 놓치지 않아요.">
      <PageTabs items={myPageAccountTabs} />
      <ProfileEditForm member={sampleMember} />
    </MyPageShell>
  );
}
