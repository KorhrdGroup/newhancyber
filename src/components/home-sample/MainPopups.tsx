"use client";

import { useEffect, useState } from "react";
import type { SitePopup } from "@/lib/site";
import "@/styles/main-popups.css";

/**
 * 메인 팝업 — 관리자 「팝업 관리」(site_popups)에서 사용 중이고 오늘이 기간 안인 것만 (서버가 거른다).
 * 「오늘 하루 보지 않기」는 이 브라우저에만 기억한다(한국 날짜 기준). 기억을 못 하는 브라우저면 그냥 다시 뜬다.
 */
const KEY = "hc_popup_hide";

const todayKst = () => new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);

function readHidden(): Record<string, string> {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

export default function MainPopups({ popups }: { popups: SitePopup[] }) {
  // 처음 그릴 때는 아무것도 띄우지 않고, 브라우저에서 「오늘 하루 보지 않기」를 확인한 뒤 띄운다 (서버 · 브라우저 화면이 어긋나지 않게)
  const [open, setOpen] = useState<number[]>([]);

  useEffect(() => {
    const hidden = readHidden();
    const today = todayKst();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 브라우저 저장소를 읽은 뒤 한 번만 정한다
    setOpen(
      popups
        .filter((p) => p.startDate <= today && today <= p.endDate && hidden[p.popupId] !== today)
        .map((p) => p.popupId),
    );
  }, [popups]);

  const close = (id: number, forToday: boolean) => {
    if (forToday) {
      try {
        const hidden = readHidden();
        const today = todayKst();
        // 지난 날짜 기록은 지워 둔다
        const kept = Object.fromEntries(Object.entries(hidden).filter(([, d]) => d === today));
        localStorage.setItem(KEY, JSON.stringify({ ...kept, [id]: today }));
      } catch {
        // 저장을 못 해도 이번에는 닫는다
      }
    }
    setOpen((ids) => ids.filter((x) => x !== id));
  };

  const shown = popups.filter((p) => open.includes(p.popupId));
  if (shown.length === 0) return null;

  return (
    <div className="mp-popups" role="region" aria-label="알림 팝업">
      {shown.map((p) => {
        const img = <img src={p.image} alt={p.title} className="mp-popup-img" />;
        return (
          <section key={p.popupId} className="mp-popup" role="dialog" aria-label={p.title}>
            {p.href ? (
              <a
                href={p.href}
                className="mp-popup-link"
                {...(p.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {img}
              </a>
            ) : (
              img
            )}
            <div className="mp-popup-foot">
              <button type="button" className="mp-popup-btn" aria-label={`${p.title} 오늘 하루 보지 않기`} onClick={() => close(p.popupId, true)}>
                오늘 하루 보지 않기
              </button>
              <button type="button" className="mp-popup-btn mp-popup-btn--close" aria-label={`${p.title} 닫기`} onClick={() => close(p.popupId, false)}>
                닫기
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
