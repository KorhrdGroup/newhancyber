"use client";

import { usePathname } from "next/navigation";
import { hasMobileFooter } from "@/lib/navigation";
import type { SiteInfo } from "@/lib/site";
import MobileFooter from "./MobileFooter";

/** 원본에서 모바일 푸터가 있던 페이지에만 그린다 */
export default function PageMobileFooter({ info }: { info: SiteInfo | null }) {
  const pathname = usePathname();
  return hasMobileFooter(pathname) ? <MobileFooter className="mobile-only" info={info} /> : null;
}
