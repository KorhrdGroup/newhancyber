"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useMobileMenu } from "@/components/layout/MobileMenuContext";
import { TBD_HREF } from "@/lib/navigation";
import { phones, quickMenuLinks, socialLinks } from "./homeData";

/** 이 높이(px) 이상 스크롤하면 TOP 버튼을 보인다 */
const TOP_BUTTON_THRESHOLD = 300;

/**
 * 데스크톱 플로팅 메뉴(빠른 메뉴·빠른 상담·소셜·TOP) + 모바일 하단 플로팅 메뉴.
 * 모바일 사이드바가 열려 있으면 둘 다 숨긴다.
 */
export default function FloatingMenu() {
  const { isOpen: isSidebarOpen } = useMobileMenu();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > TOP_BUTTON_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hidden = isSidebarOpen ? " hidden" : "";

  return (
    <>
      <div className={`floating-menu${hidden}`}>
        <div className="floating-quick-menu">
          <div className="quick-menu-header">빠른 메뉴</div>
          <ul className="quick-menu-list">
            {quickMenuLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={link.active ? "active" : undefined}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="floating-consultation">
          <div className="consultation-content">
            <div className="consultation-subtitle">처음 오셨나요?</div>
            <div className="consultation-title">빠른 상담</div>
            {/* 원본처럼 줄을 나눠 크게 보여 준다 (하이픈 뒤에서 줄바꿈) */}
            <a href={`tel:${phones.registration}`} className="consultation-phone">
              {phones.registration.split(/(?<=-)/).map((part) => (
                <div key={part} className="phone-number">
                  {part}
                </div>
              ))}
            </a>
          </div>
          <a href={TBD_HREF} className="consultation-kakao-btn">
            <img src="/resources/images/main/kakaotalkFloting.png" alt="카카오톡" className="kakao-icon" />
            <span>카톡 상담</span>
          </a>
        </div>

        <div className="floating-social">
          {socialLinks.map((social) => (
            <a key={social.label} href={social.href} className="social-item">
              <img src={social.icon} alt={social.label} className="social-icon" />
              <span>{social.label}</span>
            </a>
          ))}
        </div>

        <button
          type="button"
          className={`floating-top-btn${showTop ? " show" : ""}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img src="/resources/images/main/button_top.png" alt="TOP" className="top-btn-img" />
        </button>
      </div>

      <div className={`mobile-bottom-floating-menu${hidden}`}>
        <a href={`tel:${phones.registration}`} className="mobile-floating-btn mobile-floating-btn-phone">
          <img src="/resources/images/mobile/mobile-phone.png" alt="전화상담" className="mobile-floating-icon" />
          <span className="mobile-floating-text">전화상담</span>
        </a>
        <a href={TBD_HREF} className="mobile-floating-btn mobile-floating-btn-kakao">
          <img src="/resources/images/mobile/mobile-kakaotalk.png" alt="카톡상담" className="mobile-floating-icon" />
          <span className="mobile-floating-text">카톡상담</span>
        </a>
        {/* 원본은 href="#" — 장바구니 페이지가 있어 연결 */}
        <Link href="/course-registration/cart" className="mobile-floating-btn mobile-floating-btn-cart">
          <img src="/resources/images/mobile/mobile-cart.png" alt="장바구니" className="mobile-floating-icon" />
          <span className="mobile-floating-text">장바구니</span>
        </Link>
      </div>
    </>
  );
}
