import type { Metadata } from "next";
import CartContent from "@/components/course-registration/CartContent";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import "@/styles/classroom.css";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "장바구니" };

export default function CourseCartPage() {
  return (
    <>
      <MobilePageBanner name="cart" text="장바구니" />
      <CartContent />
    </>
  );
}
