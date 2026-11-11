import PageTabs from "@/components/common/PageTabs";
import type { NavLink } from "@/types/navigation";

/** 학습지원 화면끼리 묶는 탭 줄 (주소가 다른 화면을 오간다) */
export const noticeTabs: NavLink[] = [
  { label: "공지사항", href: "/learning-support/notice" },
  { label: "관련기관 소식", href: "/learning-support/notice/news" },
];

export const scheduleTabs: NavLink[] = [
  { label: "학사일정", href: "/learning-support/schedule" },
  { label: "연간 학사일정", href: "/learning-support/schedule/annual" },
];

export const mobileGuideTabs: NavLink[] = [
  { label: "모바일 학습 가이드", href: "/learning-support/mobile-guide" },
  { label: "공동인증서 안내", href: "/learning-support/mobile-guide/certificate" },
];

export const programTabs: NavLink[] = [
  { label: "수강지원프로그램", href: "/learning-support/program" },
  { label: "학습자 OT", href: "/learning-support/program/ot" },
];

/**
 * 탭 줄을 본문 폭(1080px)에 맞춰 둔다.
 * underHeader: 모바일 파란 제목 띠가 없는 페이지 — 모바일 고정 헤더(70px) 아래로 내린다.
 */
export default function SectionTabs({ items, underHeader }: { items: NavLink[]; underHeader?: boolean }) {
  return (
    <div className={`lx-tabs${underHeader ? " lx-tabs--under-header" : ""}`}>
      <PageTabs items={items} />
    </div>
  );
}
