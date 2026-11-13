"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/types/navigation";

/**
 * 페이지 안 탭 메뉴 (Figma 디자인 시스템 '탭' 부품 모양).
 * 주소가 다른 화면끼리 묶을 때 쓴다. 지금 주소와 가장 길게 맞는 탭을 켠다.
 */
/** 지금 주소와 가장 길게 맞는 항목의 href (item.match 주소도 같이 본다) */
export function activeNavHref(items: NavLink[], pathname: string) {
  const matchLength = (item: NavLink) =>
    Math.max(
      0,
      ...[item.href, ...(item.match ?? [])]
        .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
        .map((href) => href.length),
    );
  return items
    .filter((item) => matchLength(item) > 0)
    .sort((a, b) => matchLength(b) - matchLength(a))[0]?.href;
}

export default function PageTabs({ items, className }: { items: NavLink[]; className?: string }) {
  const pathname = usePathname();
  const activeHref = activeNavHref(items, pathname);

  return (
    <nav className={["page-tabs", className].filter(Boolean).join(" ")}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`page-tab${item.href === activeHref ? " is-active" : ""}`}
          aria-current={item.href === activeHref ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
