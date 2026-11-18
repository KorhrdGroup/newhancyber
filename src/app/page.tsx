import FloatingMenu from "@/components/home/FloatingMenu";
import MobileSocialFooter from "@/components/home/MobileSocialFooter";
import SampleHome from "@/components/home-sample/SampleHome";
/* 떠 있는 메뉴가 배너를 가리지 않게 하는 규칙이 기존 메인 스타일에 있어 같이 불러온다 */
import "@/styles/home.css";

/** 메인 — 메인 시안 화면 (예전 /sample) */
export default function HomePage() {
  return (
    <>
      <SampleHome />
      {/* 모바일 맨 아래 SNS · 사업자 정보 (기존 메인과 같은 부품) */}
      <MobileSocialFooter />
      <FloatingMenu />
    </>
  );
}
