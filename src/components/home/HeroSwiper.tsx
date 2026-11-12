"use client";

import Link from "next/link";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { heroSlides, type HeroSlide } from "./homeData";

function SlideContent({ slide }: { slide: HeroSlide }) {
  return (
    <div className="hero-content">
      <div className="hero-text">
        <div className="hero-subtitle">교육부 평가인정 학점은행제 기관</div>
        <div className="hero-title">한평생원격교육원</div>
      </div>
      <div className="hero-image">
        <img src={slide.desktopImage} alt="히어로 배너" className="hero-image-desktop" />
        <img src={slide.mobileImage} alt="모바일 배너" className="hero-image-mobile" />
      </div>
    </div>
  );
}

/** 히어로 슬라이더 (common.js initSwiper 와 같은 옵션) */
export default function HeroSwiper() {
  return (
    <section className="hero">
      <div className="hero-container">
        <Swiper
          className="hero-swiper"
          modules={[Autoplay, Pagination]}
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, type: "bullets" }}
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.desktopImage}>
              {slide.href ? (
                <Link href={slide.href} className="hero-slide-link">
                  <SlideContent slide={slide} />
                </Link>
              ) : (
                <SlideContent slide={slide} />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
