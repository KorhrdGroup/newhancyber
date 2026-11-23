import type { Metadata, Viewport } from "next";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HideOnPopup from "@/components/layout/HideOnPopup";
import MobileHeader from "@/components/layout/MobileHeader";
import { MemberProvider } from "@/components/layout/MemberContext";
import { MobileMenuProvider } from "@/components/layout/MobileMenuContext";
import { getLayoutSite } from "@/lib/site";

// 퍼블리싱 공통 CSS — 순서 유지 (common → style → footer)
import "@/styles/common.css";
// 디자인 시스템 토큰 (Figma「한평생원격 디자인 시스템」과 같은 이름)
import "@/styles/tokens.css";
import "@/styles/style.css";
import "@/styles/footer.css";

export const metadata: Metadata = {
  title: {
    default: "한평생원격교육원",
    template: "%s - 한평생원격교육원",
  },
};

// 회원가입 · 로그인 서버 액션이 잠든 Azure DB 를 깨우는 동안(30초~1분) 끊기지 않게
export const maxDuration = 60;

// 탑 메뉴 · 바닥글(관리자 「홈페이지 관리」)을 1분마다 새로 읽어 화면을 다시 만든다 — 빌드 때는 DB 를 부르지 않으므로,
// 배포 뒤 화면마다 60초가 지나 처음 열릴 때 뒤에서 새로 만들고 그다음 방문자부터 DB 값이 보인다
export const revalidate = 60;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // 탑 메뉴 · 바닥글 회사 정보 · 관련 사이트 — 관리자 「홈페이지 관리」(DB 027), 1분 캐시. 비거나 못 읽으면 지금 코드 값
  const site = await getLayoutSite();
  return (
    <html lang="ko">
      <body>
        <MemberProvider>
          <MobileMenuProvider>
            <HideOnPopup>
              <MobileHeader info={site.info} />
              <Header menus={site.menus} />
            </HideOnPopup>
            {children}
            <HideOnPopup>
              <Footer info={site.info} related={site.related} />
            </HideOnPopup>
          </MobileMenuProvider>
        </MemberProvider>
      </body>
    </html>
  );
}
