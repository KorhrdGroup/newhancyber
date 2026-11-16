import type { Metadata } from "next";
import ConsultationFloatingBar from "@/components/social-worker/ConsultationFloatingBar";
import ConsultationOptions from "@/components/social-worker/ConsultationOptions";
import PaddinglessMain from "@/components/social-worker/PaddinglessMain";
import SocialWorkerLanding from "@/components/social-worker/SocialWorkerLanding";

export const metadata: Metadata = { title: "사회복지사란?" };

export default function SocialWorkerInfoPage() {
  return (
    <>
      <div className="mobile-social-worker-banner mobile-only" style={{ position: "relative" }}>
        <div className="mobile-social-worker-title-banner">
          <span className="mobile-social-worker-title-text">사회복지사란?</span>
        </div>
        <SocialWorkerLanding />
        <ConsultationOptions variant="mobile" />
      </div>
      <PaddinglessMain>
        <section className="page-header-banner desktop-only" style={{ position: "relative" }}>
          <SocialWorkerLanding />
          <ConsultationOptions variant="desktop" />
        </section>
      </PaddinglessMain>
      <ConsultationFloatingBar />
    </>
  );
}
