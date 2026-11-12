import type { Metadata } from "next";
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
        <img
          src="/resources/images/main/friends-event-mobile.webp"
          alt="친구 추천 이벤트"
          className="mobile-event-banner-img"
        />
      </div>
      <EventMain>
        <div className="container">
          {/* 데스크톱 이미지 — 모바일은 위의 mobile-event-banner */}
          <div className="event-page desktop-only">
            <div className="event-image-container">
              <img
                src="/resources/images/main/friends-event.webp"
                alt="친구 추천 이벤트"
                className="event-page-image"
              />
            </div>
          </div>
        </div>
      </EventMain>
    </>
  );
}
