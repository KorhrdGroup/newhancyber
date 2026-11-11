import { redirect } from "next/navigation";

/** 헤더 '마이페이지' 링크 → 첫 탭(증명서 발급)으로 보냄 */
export default function MyPagePage() {
  redirect("/my-page/certificates");
}
