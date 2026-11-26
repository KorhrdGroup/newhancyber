import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageTabs from "@/components/common/PageTabs";
import MyPageShell from "@/components/my-page/MyPageShell";
import ProfileEditForm, { type ProfileFormMember } from "@/components/my-page/b/ProfileEditForm";
import { sampleMember } from "@/components/my-page/myPageDataB";
import { isDbConfigured } from "@/lib/db/client";
import { readMemberProfile } from "@/lib/db/members";
import { getCurrentMember } from "@/lib/memberAuth";
import { myPageAccountTabs } from "@/lib/navigation";
import { hasProfileAccess } from "@/lib/profileAccess";
import { EDUCATION_LEVELS, PHONE_PREFIXES } from "@/lib/signupOptions";

export const metadata: Metadata = { title: "내 정보 수정 - 마이페이지" };

/** 저장된 회원 정보 → 화면 칸 (전화 「010-1234-5678」, 이메일 「a@b.com」, 학력은 보기 글 → 값) */
async function loadMember(): Promise<ProfileFormMember> {
  if (!isDbConfigured()) return { ...sampleMember, schoolName: "", major: "" };
  const member = await getCurrentMember();
  if (!member) redirect(`/member/login?next=${encodeURIComponent("/my-page/profile")}`);
  // 1단계 비밀번호 확인(10분)을 거치지 않았으면 1단계로
  if (!(await hasProfileAccess(member))) redirect("/my-page/profile");
  const p = await readMemberProfile(member.memberId);
  if (!p) redirect("/member/login");
  const [a = "010", b = "", c = ""] = (p.phone ?? "").split("-");
  const at = (p.email ?? "").lastIndexOf("@");
  return {
    userId: p.loginId,
    name: p.name,
    birth: p.birthDate ?? "",
    phone: [(PHONE_PREFIXES as readonly string[]).includes(a) ? a : "010", b, c],
    emailId: at > 0 ? p.email!.slice(0, at) : (p.email ?? ""),
    emailDomain: at > 0 ? p.email!.slice(at + 1) : "",
    postalCode: p.postalCode ?? "",
    address: p.address ?? "",
    addressDetail: p.addressDetail ?? "",
    education: EDUCATION_LEVELS.find((e) => e.label === p.educationLevel)?.value ?? "",
    schoolName: p.schoolName ?? "",
    major: p.major ?? "",
    smsConsent: p.smsAgree,
    emailConsent: p.emailAgree,
  };
}

/** U35 내 정보 수정 — 2단계 회원 정보 수정 (dbo.members — LMS 회원 관리와 같은 표) */
export default async function ProfileEditPage() {
  const member = await loadMember();
  return (
    <MyPageShell title="내 정보 수정" desc="바뀐 연락처와 주소를 고쳐 두면 학습 안내를 놓치지 않아요.">
      <PageTabs items={myPageAccountTabs} />
      <ProfileEditForm member={member} />
    </MyPageShell>
  );
}
