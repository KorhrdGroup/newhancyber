import type { Metadata } from "next";
import FloatingMenu from "@/components/home/FloatingMenu";
import SampleHome from "@/components/home-sample/SampleHome";

export const metadata: Metadata = { title: "메인 시안" };

/** 메인페이지 두 번째 시안 (기존 메인은 / 그대로) */
export default function SamplePage() {
  return (
    <>
      <SampleHome />
      <FloatingMenu />
    </>
  );
}
