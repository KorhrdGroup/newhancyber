import "@/styles/about.css";
import type { Metadata } from "next";
import AboutTabs from "@/components/footer/AboutTabs";
import MobilePageBanner from "@/components/layout/MobilePageBanner";

export const metadata: Metadata = { title: "교육원 소개" };

export default function AboutPage() {
  return (
    <>
      <MobilePageBanner name="about" text="교육원소개" />
      <main className="wrapper ft-page">
        <AboutTabs />
      </main>
    </>
  );
}
