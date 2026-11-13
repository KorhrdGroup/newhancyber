"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { hasMobileNav, mobileMenu, mobileQuickLinks } from "@/lib/navigation";
import { REGISTRATION_PHONE, SUPPORT_PHONE } from "@/lib/contact";
import { useMember } from "./MemberContext";
import { useMobileMenu } from "./MobileMenuContext";

const MOBILE_IMG = "/resources/images/mobile";

/** 모바일 헤더 + 햄버거 사이드바 (데스크톱에서는 CSS 로 숨김) */
export default function MobileHeader() {
  const pathname = usePathname();
  const { member, signOut } = useMember();
  const { isOpen, open, close } = useMobileMenu();
  const [expanded, setExpanded] = useState<string | null>(null);

  // 사이드바가 열려 있는 동안 본문 스크롤 막기
  useBodyScrollLock(isOpen);

  return (
    <>
      <header className="mobile-header">
        <div className="mobile-header-top">
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={open}
          >
            <img
              src={`${MOBILE_IMG}/mobile-hambuger-btn.png`}
              alt="메뉴"
              className="mobile-menu-toggle-img"
            />
          </button>
          <Link href="/" className="mobile-logo">
            <img
              src={`${MOBILE_IMG}/mobile-logo.png`}
              alt="한평생원격교육원"
              className="mobile-logo-img"
            />
          </Link>
          {member === undefined ? (
            <span className="mobile-login-btn" aria-hidden />
          ) : member ? (
            <button type="button" className="mobile-login-btn" onClick={() => void signOut()}>
              로그아웃
            </button>
          ) : (
            <Link href="/member/login" className="mobile-login-btn">
              로그인
            </Link>
          )}
        </div>
        {hasMobileNav(pathname) && (
          <div className="mobile-nav">
            {!member && (
              <Link href="/member/signup" className="mobile-nav-item">
                회원가입
              </Link>
            )}
            <Link href="/course-registration/register" className="mobile-nav-item">
              수강신청
            </Link>
            <Link href="/my-classroom" className="mobile-nav-item">
              나의 강의실
            </Link>
          </div>
        )}
      </header>

      <div
        className={`mobile-sidebar-overlay${isOpen ? " active" : ""}`}
        onClick={close}
      />

      {/* 사이드바 안의 링크를 누르면(페이지 이동) 닫는다 */}
      <div
        className={`mobile-sidebar${isOpen ? " active" : ""}`}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) close();
        }}
      >
        <div className="mobile-sidebar-header">
          <div className="mobile-sidebar-login">
            {member ? (
              <>
                <h3>{member.name}님, 반가워요</h3>
                <div className="mobile-sidebar-buttons">
                  <button
                    type="button"
                    className="mobile-sidebar-login-btn"
                    onClick={() => {
                      close();
                      void signOut();
                    }}
                  >
                    로그아웃
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>로그인을 해주세요</h3>
                <div className="mobile-sidebar-buttons">
                  <Link href="/member/login" className="mobile-sidebar-login-btn">
                    로그인
                  </Link>
                  <Link href="/member/signup" className="mobile-sidebar-signup-btn">
                    회원가입
                  </Link>
                </div>
              </>
            )}
          </div>
          <button type="button" className="mobile-sidebar-close" onClick={close}>
            <img
              src={`${MOBILE_IMG}/mobile-close-btn.png`}
              alt="닫기"
              className="mobile-sidebar-close-img"
            />
          </button>
        </div>

        <div className="mobile-sidebar-quick">
          {mobileQuickLinks.map((link) => (
            <Link key={link.label} href={link.href} className="mobile-sidebar-quick-item">
              <div className="mobile-sidebar-quick-icon">
                <img
                  src={`${MOBILE_IMG}/${link.icon}`}
                  alt={link.label}
                  className="mobile-sidebar-quick-icon-img"
                />
              </div>
              <span className="mobile-sidebar-quick-item-text">{link.label}</span>
            </Link>
          ))}
        </div>

        <nav className="mobile-sidebar-nav">
          {mobileMenu.map((item) => {
            const icon = (
              <span className="mobile-sidebar-nav-icon">
                <img
                  src={`${MOBILE_IMG}/${item.icon}`}
                  alt=""
                  className="mobile-sidebar-nav-icon-img"
                />
              </span>
            );

            if (!item.children) {
              return (
                <Link key={item.label} href={item.href} className="mobile-sidebar-nav-item">
                  {icon}
                  <span>{item.label}</span>
                </Link>
              );
            }

            const isExpanded = expanded === item.label;
            return (
              <div key={item.label}>
                <div
                  className={`mobile-sidebar-nav-item mobile-sidebar-nav-item-expandable${
                    isExpanded ? " active" : ""
                  }`}
                  onClick={() => setExpanded(isExpanded ? null : item.label)}
                >
                  <div className="mobile-sidebar-nav-left">
                    {icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="mobile-sidebar-nav-arrow">
                    <img
                      src={`${MOBILE_IMG}/arrow-up.png`}
                      alt=""
                      className="mobile-sidebar-nav-arrow-img"
                    />
                  </span>
                </div>
                <div className={`mobile-sidebar-nav-submenu${isExpanded ? " active" : ""}`}>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="mobile-sidebar-nav-item mobile-sidebar-nav-subitem"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="mobile-sidebar-footer">
          <div className="mobile-sidebar-contact">
            <div>수강신청 문의 : {REGISTRATION_PHONE}</div>
            <div>학습지원 문의 : {SUPPORT_PHONE}</div>
          </div>
        </div>
      </div>
    </>
  );
}
