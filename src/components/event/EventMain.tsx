"use client";

import { importantStyle } from "@/lib/importantStyle";

/** 원본 main 에 style="padding: 0 !important" 가 있어 ref 로 넣는다 (ref 때문에 클라이언트 컴포넌트) */
export default function EventMain({ children }: { children: React.ReactNode }) {
  return (
    <main ref={importantStyle("padding", "0")} className="wrapper">
      {children}
    </main>
  );
}
