import { redirect } from "next/navigation";

/** 결제 내역은 마이페이지로 옮김 — 예전 주소로 들어오면 넘겨준다 */
export default function OldPaymentHistoryPage() {
  redirect("/my-page/payments");
}
