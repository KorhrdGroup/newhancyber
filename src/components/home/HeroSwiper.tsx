"use client";

import Link from "next/link";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { heroSlides, type HeroSlide } from "./homeData";
import "@/styles/hero.css";

function SlideContent({ slide }: { slide: HeroSlide }) {
  return (
    <div className={`hb-slide hb-slide--${slide.theme}`}>
      <div className="hb-inner">
        <div className="hb-text">
          <p className="hb-eyebrow">{slide.eyebrow}</p>
          <h2 className="hb-title">{slide.title}</h2>
          <p className="hb-desc">{slide.desc}</p>
          {slide.href && <span className="hb-more">자세히보기</span>}
        </div>
        <img src={slide.art} alt="" className="hb-art" />
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
            <SwiperSlide key={slide.title}>
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
