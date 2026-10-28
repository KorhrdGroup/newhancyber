"use client";

import { createContext, useContext, useMemo, useState } from "react";

interface MobileMenuState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const MobileMenuContext = createContext<MobileMenuState | null>(null);

/**
 * 모바일 사이드바 열림 상태.
 * 사이드바가 열리면 메인 페이지의 플로팅 메뉴도 숨겨야 해서 레이아웃 전체에 공유한다.
 */
export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo(
    () => ({ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }),
    [isOpen],
  );
  return <MobileMenuContext.Provider value={value}>{children}</MobileMenuContext.Provider>;
}

export function useMobileMenu() {
  const context = useContext(MobileMenuContext);
  if (!context) throw new Error("useMobileMenu 는 MobileMenuProvider 안에서만 쓸 수 있습니다.");
  return context;
}
