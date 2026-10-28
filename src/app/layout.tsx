import type { Metadata, Viewport } from "next";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MobileHeader from "@/components/layout/MobileHeader";
import { MobileMenuProvider } from "@/components/layout/MobileMenuContext";

// 퍼블리싱 공통 CSS — 순서 유지 (common → style → footer)
import "@/styles/common.css";
import "@/styles/style.css";
import "@/styles/footer.css";

export const metadata: Metadata = {
  title: {
    default: "덧셈원격평생교육원",
    template: "%s - 덧셈원격평생교육원",
  },
};

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
        <MobileMenuProvider>
          <MobileHeader />
          <Header />
          {children}
          <Footer />
        </MobileMenuProvider>
      </body>
    </html>
  );
}
