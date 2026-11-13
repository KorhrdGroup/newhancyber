import type { Metadata, Viewport } from "next";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HideOnPopup from "@/components/layout/HideOnPopup";
import MobileHeader from "@/components/layout/MobileHeader";
import { MemberProvider } from "@/components/layout/MemberContext";
import { MobileMenuProvider } from "@/components/layout/MobileMenuContext";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <MemberProvider>
          <MobileMenuProvider>
            <HideOnPopup>
              <MobileHeader />
              <Header />
            </HideOnPopup>
            {children}
            <HideOnPopup>
              <Footer />
            </HideOnPopup>
          </MobileMenuProvider>
        </MemberProvider>
      </body>
    </html>
  );
}
