"use client";

import { useEffect, useState } from "react";
import { currentTerm } from "./homeData";

const MOBILE_IMG = "/resources/images/mobile";
const DEADLINE = new Date(currentTerm.applyDeadline).getTime();

const pad = (n: number) => String(n).padStart(2, "0");

function formatLeft(ms: number) {
  const sec = Math.floor(ms / 1000);
  const days = Math.floor(sec / 86400);
  return {
    days,
    time: `${pad(Math.floor((sec % 86400) / 3600))}:${pad(Math.floor((sec % 3600) / 60))}:${pad(sec % 60)}`,
  };
}

/** 모바일 수강신청 마감 카운트다운 (서버 시각과 어긋나지 않게 화면에 뜬 뒤 계산) */
export default function MobileDeadlineBanner() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(DEADLINE - Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const closed = left !== null && left <= 0;
  const { days, time } = formatLeft(Math.max(left ?? 0, 0));

  return (
    <section className="mobile-deadline-banner">
      <div className="mobile-deadline-content">
        <img src={`${MOBILE_IMG}/mobile-alarm.png`} alt="" className="mobile-deadline-icon" />
        {closed ? (
          <span className="mobile-deadline-text">
            <span className="mobile-deadline-text-bold">{currentTerm.name}</span> 수강신청 마감
          </span>
        ) : (
          <span className="mobile-deadline-text">
            {currentTerm.name} 마감까지{" "}
            <span className="mobile-deadline-text-bold">{left === null ? "--" : `${days}일 ${time}`}</span>
          </span>
        )}
      </div>
    </section>
  );
}
