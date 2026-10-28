import EssentialCheck from "@/components/home/EssentialCheck";
import EventConsultation from "@/components/home/EventConsultation";
import FloatingMenu from "@/components/home/FloatingMenu";
import HeroSwiper from "@/components/home/HeroSwiper";
import MobileSocialFooter from "@/components/home/MobileSocialFooter";
import { BannerSection, ContactInfo } from "@/components/home/QuickBanners";
import ScheduleNotice from "@/components/home/ScheduleNotice";
import { AcademicNotice, MobileCourseCards, MobileDeadlineBanner } from "@/components/home/StatusBanners";
import WhyChoose from "@/components/home/WhyChoose";

export default function HomePage() {
  return (
    <>
      <main>
        <MobileDeadlineBanner />
        <HeroSwiper />
        <MobileCourseCards />
        <AcademicNotice />
        <BannerSection />
        <ContactInfo />
        <EventConsultation />
        <MobileSocialFooter />
        <ScheduleNotice />
        <EssentialCheck />
        {/* 학습자 후기 섹션(reviews-section)은 원본에서도 주석 처리 — 오픈 시 index.html 1333행부터 옮긴다 */}
        <WhyChoose />
      </main>
      <FloatingMenu />
    </>
  );
}
