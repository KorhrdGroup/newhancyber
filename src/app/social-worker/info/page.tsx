import type { Metadata } from "next";
import ConsultationFloatingBar from "@/components/social-worker/ConsultationFloatingBar";
import ConsultationOptions from "@/components/social-worker/ConsultationOptions";
import PaddinglessMain from "@/components/social-worker/PaddinglessMain";

export const metadata: Metadata = { title: "사회복지사란?" };

const SW_IMG = "/resources/images/social-worker";

/** 원본 social-worker/info.html — 그림은 hancyber.co.kr 사회복지사 랜딩(landing/hpsedu_landing.asp)과 같은 것.
 *  모바일 배너는 원본처럼 main 밖(헤더 바로 아래)에 둔다 */
export default function SocialWorkerInfoPage() {
  return (
    <>
      <div className="mobile-social-worker-banner mobile-only" style={{ position: "relative" }}>
        <div className="mobile-social-worker-title-banner">
          <span className="mobile-social-worker-title-text">사회복지사란?</span>
        </div>
        <img src={`${SW_IMG}/landing-socialworker-mo.jpg`} alt="사회복지사란?" className="mobile-social-worker-banner-img" />
        <ConsultationOptions variant="mobile" />
      </div>

      <PaddinglessMain>
        <section className="page-header-banner desktop-only" style={{ position: "relative" }}>
          <img src={`${SW_IMG}/landing-socialworker-pc.jpg`} alt="사회복지사란?" className="page-image" />
          <ConsultationOptions variant="desktop" />
        </section>
      </PaddinglessMain>

      <ConsultationFloatingBar />
    </>
  );
}
