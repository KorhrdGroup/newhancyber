"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  authLinks,
  gnb,
  GNB_SEPARATOR_BEFORE,
  isVisible,
  utilityLinks,
} from "@/lib/navigation";

/** 이 높이(px) 이상 스크롤하면 GNB 를 상단에 고정한다 (common.js 와 동일) */
const STICKY_THRESHOLD = 100;

export default function Header() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const sticky = window.scrollY > STICKY_THRESHOLD;
      // 고정되기 직전(아직 문서 흐름 안에 있을 때) 높이를 잰다.
      // 모바일 폭으로 열었다가 창을 넓힌 경우에도 자리 채우기 높이가 맞게 된다.
      const nav = navRef.current;
      if (sticky && nav && !nav.classList.contains("sticky")) setNavHeight(nav.offsetHeight);
      setIsSticky(sticky);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="header">
      {/* 상단 유틸리티 바 */}
      <div className="header-top">
        <div className="header-top-container">
          <div className="header-top-left">
            {utilityLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="header-top-right">
            {authLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 로고 영역 */}
      <div className="header-logo">
        <div className="header-logo-container">
          <div className="logo-left">
            <img
              src="/resources/images/header/logo-ministry.png"
              alt="교육부 로고"
              className="logo-ministry"
            />
            <div className="logo-badge-wrap">
              <span className="logo-badge">교육부 정식 평가 인정</span>
              <span className="logo-badge-sub">학점은행제 원격교육기관</span>
            </div>
          </div>
          <div className="logo-center">
            <Link href="/">
              <img
                src="/resources/images/header/logo-main.png"
                alt="한평생원격교육원"
                className="logo-main"
              />
            </Link>
          </div>
          <div className="logo-right"></div>
        </div>
      </div>

      {/* 메인 네비게이션 */}
      {isSticky && (
        <div className="header-nav-placeholder" style={{ height: navHeight }} />
      )}
      <div ref={navRef} className={`header-nav${isSticky ? " sticky" : ""}`}>
        <div className="header-nav-container">
          <nav className="gnb">
            <ul className="gnb-list">
              {gnb.map((item) => {
                const children = item.children?.filter(isVisible) ?? [];
                // 앞부분이 겹치는 메뉴(/my-classroom, /my-classroom/finished)는 가장 길게 맞는 것만 켠다
                const activeHref = children
                  .filter((child) => pathname.startsWith(child.href))
                  .sort((a, b) => b.href.length - a.href.length)[0]?.href;
                const classes = ["gnb-item"];
                if (children.length) classes.push("has-submenu");
                if (item.badge) classes.push("gnb-item-course");

                return (
                  <Fragment key={item.label}>
                    {item.label === GNB_SEPARATOR_BEFORE && (
                      <li className="gnb-separator"></li>
                    )}
                    <li className={classes.join(" ")}>
                      <Link href={item.href} className="gnb-link">
                        {item.badge && (
                          <span className="badge-deadline">{item.badge}</span>
                        )}
                        {item.label}
                      </Link>
                      {children.length > 0 && (
                        <ul className="submenu">
                          {children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={
                                  child.href === activeHref ? "active" : undefined
                                }
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  </Fragment>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
