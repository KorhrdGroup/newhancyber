"use client";

import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

/**
 * 한 화면 안에서 내용을 바꾸는 탭 (주소는 그대로).
 * - variant "line": 2단계 하위메뉴 — PageTabs 와 같은 왼쪽 정렬 밑줄 탭, 본문 폭(.lx-tabs)에 맞춤
 * - variant "box":  3단계 내용 전환 — 디자인 시스템 세그먼트(ds-tabs-box)
 */
export interface ButtonTabItem {
  key: string;
  label: React.ReactNode;
}

export default function ButtonTabs({
  items,
  active,
  onSelect,
  variant = "box",
  className,
  ariaLabel,
}: {
  items: ButtonTabItem[];
  active: string;
  onSelect: (key: string) => void;
  variant?: "line" | "box";
  className?: string;
  ariaLabel?: string;
}) {
  const buttons = items.map((item) => (
    <button
      key={item.key}
      type="button"
      role="tab"
      aria-selected={item.key === active}
      className={`${variant === "line" ? "page-tab" : "ds-tab-box"}${item.key === active ? " is-active" : ""}`}
      onClick={() => onSelect(item.key)}
    >
      {item.label}
    </button>
  ));

  if (variant === "line") {
    return (
      <div className={["lx-tabs", className].filter(Boolean).join(" ")}>
        <div className="page-tabs" role="tablist" aria-label={ariaLabel}>
          {buttons}
        </div>
      </div>
    );
  }
  return (
    <div className={["ds-tabs-box", className].filter(Boolean).join(" ")} role="tablist" aria-label={ariaLabel}>
      {buttons}
    </div>
  );
}
