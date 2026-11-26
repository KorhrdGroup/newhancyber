import type { Metadata } from "next";
import CartContent from "@/components/course-registration/CartContent";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import { getCartData } from "@/lib/courses";
import "@/styles/classroom.css";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "장바구니" };

/** 장바구니 — 이 브라우저에 담은 차수를 DB 에서 지금 값(가격 · 마감 · 신청 기간)으로 다시 읽는다. DB 설정이 없으면 샘플 */
export default async function CourseCartPage() {
  const data = await getCartData();
  return (
    <>
      <MobilePageBanner name="cart" text="장바구니" />
      <CartContent data={data} />
    </>
  );
}
