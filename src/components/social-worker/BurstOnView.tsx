"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/** 화면에 들어오면 양쪽 아래에서 꽃가루가 터지는 섹션 (한 번만) */

const COLORS = ["#69ffac", "#ffffff", "#8db4ff", "#ffc93c", "#c6ffe0"];
const SHAPES = ["rect", "rect", "ribbon", "star", "dot"];

// 서버·브라우저가 같은 값을 내도록 정해진 의사 난수 (정수로 반올림)
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const span = (i: number, k: number, a: number, b: number) => Math.round(a + (b - a) * rnd(i, k));

const PIECES = Array.from({ length: 60 }, (_, i) => {
  const left = i % 2 === 0; // 짝수: 왼쪽 폭죽, 홀수: 오른쪽 폭죽
  const dx = span(i, 1, 120, 560);
  return {
    left,
    shape: SHAPES[i % SHAPES.length],
    style: {
      "--dx": left ? dx : -dx,
      "--dy": span(i, 2, -560, -240),
      "--drift": span(i, 3, -60, 60),
      "--fall": span(i, 4, 160, 320),
      "--r": span(i, 5, -360, 360),
      "--d": `${span(i, 6, 0, 260)}ms`,
      "--c": COLORS[span(i, 7, 0, COLORS.length - 1)],
    } as CSSProperties,
  };
});

export default function BurstOnView({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("is-armed");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.classList.add("is-in");
        io.disconnect();
      },
      { rootMargin: "0px 0px -35% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={className}>
      <div className="swl-burst" aria-hidden="true">
        {PIECES.map((p, i) => (
          <i key={i} className={`swl-burst--${p.left ? "l" : "r"} swl-burst--${p.shape}`} style={p.style} />
        ))}
      </div>
      {children}
    </section>
  );
}
