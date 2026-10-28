"use client";

import { importantStyle } from "@/lib/importantStyle";

/** 원본: <main class="wrapper" style="padding: 0 !important"> */
export default function PaddinglessMain({ children }: { children: React.ReactNode }) {
  return (
    <main ref={importantStyle("padding", "0")} className="wrapper">
      {children}
    </main>
  );
}
