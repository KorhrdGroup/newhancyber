"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { currentMember, logout } from "@/app/member/actions";

export interface CurrentMember {
  name: string;
  loginId: string;
}

interface MemberState {
  /** 아직 모르면 undefined, 로그아웃 상태면 null */
  member: CurrentMember | null | undefined;
  /** 로그아웃하고 첫 화면으로 */
  signOut: () => Promise<void>;
}

const MemberContext = createContext<MemberState | null>(null);

/**
 * 지금 로그인한 회원 — 머리말(PC · 모바일)이 같이 쓴다. 서버에는 화면을 옮길 때마다 한 번만 묻는다.
 * 홈페이지 화면은 미리 만들어 둔 정적 화면이라 화면 안에서 쿠키를 읽지 않고 여기서 따로 묻는다.
 * 로그인은 화면 이동(로그인 → 첫 화면)으로 끝나서 이동 때 다시 묻고, 로그아웃은 여기서 바로 상태를 바꾼다
 * (첫 화면에서 로그아웃하면 주소가 안 바뀌어 다시 묻지 않기 때문).
 */
export function MemberProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [member, setMember] = useState<CurrentMember | null | undefined>(undefined);

  useEffect(() => {
    let stale = false;
    currentMember()
      .then((m) => !stale && setMember(m))
      .catch(() => !stale && setMember(null));
    // 화면을 빨리 옮기면 늦게 온 옛 대답이 새 대답을 덮지 않게 한다
    return () => {
      stale = true;
    };
  }, [pathname]);

  const signOut = useCallback(async () => {
    try {
      await logout();
    } catch {
      // 쿠키가 그대로라 상태를 바꾸면 다음 화면에서 다시 로그인된 것처럼 보인다 — 바꾸지 않고 알린다
      alert("로그아웃하지 못했어요. 잠시 뒤 다시 시도해 주세요.");
      return;
    }
    setMember(null);
    router.push("/");
    router.refresh();
  }, [router]);

  const value = useMemo(() => ({ member, signOut }), [member, signOut]);
  return <MemberContext.Provider value={value}>{children}</MemberContext.Provider>;
}

export function useMember(): MemberState {
  const context = useContext(MemberContext);
  if (!context) throw new Error("useMember 는 MemberProvider 안에서만 쓸 수 있습니다.");
  return context;
}
