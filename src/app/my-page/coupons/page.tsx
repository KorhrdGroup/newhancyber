import type { Metadata } from "next";
import MyPageShell from "@/components/my-page/MyPageShell";
import CouponHistory from "@/components/my-page/a/CouponHistory";
import { coupons } from "@/components/my-page/myPageDataA";

export const metadata: Metadata = { title: "쿠폰 사용내역 - 마이페이지" };

/** U29 쿠폰 사용내역 */
export default function CouponsPage() {
  // TODO: API 쿠폰 목록 조회
  return (
    <MyPageShell title="쿠폰 사용내역" desc="받은 쿠폰을 등록하고, 가진 쿠폰과 사용한 쿠폰을 확인할 수 있습니다.">
      <CouponHistory coupons={coupons} />
    </MyPageShell>
  );
}
