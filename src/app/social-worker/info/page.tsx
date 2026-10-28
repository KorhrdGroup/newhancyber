import type { Metadata } from "next";
import ConsultationFloatingBar from "@/components/social-worker/ConsultationFloatingBar";
import ConsultationOptions from "@/components/social-worker/ConsultationOptions";
import PaddinglessMain from "@/components/social-worker/PaddinglessMain";

export const metadata: Metadata = { title: "사회복지사란?" };

const SW_IMG = "/resources/images/social-worker";

/** 원본 social-worker/info.html — 모바일 배너는 원본처럼 main 밖(헤더 바로 아래)에 둔다 */
export default function SocialWorkerInfoPage() {
  return (
    <>
      <div className="mobile-social-worker-banner mobile-only" style={{ position: "relative" }}>
        <div className="mobile-social-worker-title-banner">
          <span className="mobile-social-worker-title-text">사회복지사란?</span>
        </div>
        <img src={`${SW_IMG}/social-mobile.png`} alt="사회복지사란?" className="mobile-social-worker-banner-img" />
        <ConsultationOptions variant="mobile" />
      </div>

      <PaddinglessMain>
        <section className="page-header-banner desktop-only" style={{ position: "relative" }}>
          <img src={`${SW_IMG}/social-desktop.png`} alt="사회복지사란?" className="page-image" />
          <ConsultationOptions variant="desktop" />
        </section>
      </PaddinglessMain>

      <ConsultationFloatingBar />
    </>
  );
}
