import type { Metadata } from "next";
import EventLanding from "@/components/event/EventLanding";
import EventMain from "@/components/event/EventMain";

export const metadata: Metadata = { title: "친구 추천 이벤트" };

export default function EventPage() {
  return (
    <>
      {/* 모바일 배너 (원본도 main 바깥). style.css 의 body:has(.mobile-event-banner) 규칙이 이걸 본다 */}
      <div className="mobile-event-banner mobile-only">
        <div className="mobile-event-title-banner">
          <span className="mobile-event-title-text">친구추천 이벤트</span>
        </div>
        <EventLanding />
      </div>
      <EventMain>
        <div className="container event-container">
          {/* 데스크톱 — 모바일은 위의 mobile-event-banner. 예전 통이미지를 코드로 (Figma 1791:5834) */}
          <div className="event-page desktop-only">
            <EventLanding />
          </div>
        </div>
      </EventMain>
    </>
  );
}
