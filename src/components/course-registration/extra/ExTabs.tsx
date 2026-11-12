import PageTabs from "@/components/common/PageTabs";
import type { NavLink } from "@/types/navigation";

/**
 * 본문(<main>) 바로 위에 두는 화면 안 탭 줄.
 * underHeader: 모바일에 파란 제목 띠(MobilePageBanner)가 없는 화면이면 고정 헤더 아래로 내린다.
 */
export default function ExTabs({ items, underHeader }: { items: NavLink[]; underHeader?: boolean }) {
  return (
    <div className={`ex-tabs${underHeader ? " ex-tabs--under-header" : ""}`}>
      <PageTabs items={items} />
    </div>
  );
}
