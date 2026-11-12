"use client";

/** 팝업 크기: 경로 앞부분으로 고른다 */
const sizes: [prefix: string, width: number, height: number][] = [
  ["/popup/lesson", 1280, 860],
  ["/popup/exam", 1100, 900],
  ["/popup/print", 900, 1000],
  ["/popup/sample-lecture", 960, 760],
];

export function openPopup(href: string) {
  const [, width, height] = sizes.find(([prefix]) => href.startsWith(prefix)) ?? ["", 860, 860];
  const win = window.open(href, href.replace(/\W/g, "_"), `width=${width},height=${height},scrollbars=yes,resizable=yes`);
  // 팝업 차단 시 같은 창에서 연다
  if (!win) window.location.href = href;
  else win.focus();
}

/** 누르면 학습·결제 팝업 창을 여는 버튼 */
export default function PopupButton({
  href,
  className = "ds-btn ds-btn--secondary ds-btn--sm",
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className={className} onClick={() => openPopup(href)}>
      {children}
    </button>
  );
}
