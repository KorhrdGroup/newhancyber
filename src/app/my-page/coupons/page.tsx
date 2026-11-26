import type { Metadata } from "next";
import { redirect } from "next/navigation";
import MyPageShell from "@/components/my-page/MyPageShell";
import CouponHistory from "@/components/my-page/a/CouponHistory";
import { coupons as sampleCoupons } from "@/components/my-page/myPageDataA";
import { isDbConfigured } from "@/lib/db/client";
import { listMemberCoupons } from "@/lib/db/coupons";
import { getCurrentMember } from "@/lib/memberAuth";

export const metadata: Metadata = { title: "쿠폰 사용내역 - 마이페이지" };

/**
 * U29 쿠폰 사용내역 — 로그인한 회원의 쿠폰(dbo.coupons, LMS 「쿠폰 발행 관리」가 발급 · 홈페이지 쿠폰 번호 등록).
 * 로그인하지 않았으면 로그인 화면으로 보냈다가 돌아온다. DB 설정이 없으면 샘플.
 */
export default async function CouponsPage() {
  const isDb = isDbConfigured();
  let list;
  if (isDb) {
    const member = await getCurrentMember();
    if (!member) redirect(`/member/login?next=${encodeURIComponent("/my-page/coupons")}`);
    list = await listMemberCoupons(member.memberId);
  } else {
    list = sampleCoupons;
  }
  return (
    <MyPageShell title="쿠폰 사용내역" desc="받은 쿠폰을 등록하고, 가진 쿠폰과 사용한 쿠폰을 확인할 수 있습니다.">
      <CouponHistory coupons={list} canRegister={isDb} />
    </MyPageShell>
  );
}
