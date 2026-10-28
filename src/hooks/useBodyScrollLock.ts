import { useEffect } from "react";

/** 동시에 잠근 곳의 수. 사이드바와 팝업이 겹쳐 열려도 마지막 하나가 닫힐 때만 푼다. */
let lockCount = 0;

/** locked 인 동안 본문 스크롤을 막는다 (사이드바·팝업용) */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lockCount += 1;
    document.body.style.overflow = "hidden";
    return () => {
      lockCount -= 1;
      if (lockCount === 0) document.body.style.overflow = "";
    };
  }, [locked]);
}
