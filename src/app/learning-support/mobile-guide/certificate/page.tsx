import type { Metadata } from "next";
import CertificateGuide from "@/components/learning-support/extra/CertificateGuide";
import SectionTabs, { mobileGuideTabs } from "@/components/learning-support/extra/SectionTabs";

export const metadata: Metadata = { title: "공동인증서 안내" };

export default function LearningCertificatePage() {
  return (
    <main className="wrapper">
      <SectionTabs items={mobileGuideTabs} underHeader />
      <div className="container lx-page lx-page--plain">
        <h1 className="page-title">공동인증서 안내</h1>
        <CertificateGuide />
      </div>
    </main>
  );
}
