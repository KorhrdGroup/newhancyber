import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PaymentForm from "@/components/course-registration/extra/PaymentForm";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import { getPaymentData, parseClassIdsParam } from "@/lib/courses";
import "@/styles/classroom.css";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "결제하기" };

/**
 * 결제하기 — ?c=4.7 (장바구니 · 수강신청에서 고른 차수 번호). 과목 · 금액은 DB 에서 지금 값으로 다시 읽는다.
 * 로그인하지 않았으면 로그인 화면으로 보냈다가 이 주소로 돌아온다. DB 설정이 없으면 샘플 화면.
 */
export default async function CoursePaymentPage({ searchParams }: { searchParams: Promise<{ c?: string | string[] }> }) {
  const { c } = await searchParams;
  const classIds = parseClassIdsParam(c);
  const data = await getPaymentData(classIds);
  if (data.needLogin) {
    const back = classIds.length ? `/course-registration/payment?c=${classIds.join(".")}` : "/course-registration/payment";
    redirect(`/member/login?next=${encodeURIComponent(back)}`);
  }
  // DB 모드에서 고른 과목이 없으면(주소를 직접 열었을 때) 장바구니에서 고르게 한다
  if (data.source === "db" && classIds.length === 0) redirect("/course-registration/cart");

  return (
    <>
      {/* 장바구니와 같은 파란 제목 띠 모양을 쓴다 (course-registration.css 의 mobile-cart-banner) */}
      <MobilePageBanner name="cart" text="결제하기" />
      <main className="wrapper">
        <div className="ex-page">
          <div className="ex-page-head">
            <h1 className="ex-title">결제하기</h1>
            <p className="ex-desc">수강신청 과목과 결제 금액을 확인하고 결제 수단을 골라 주세요.</p>
          </div>
          <PaymentForm data={data} />
        </div>
      </main>
    </>
  );
}
