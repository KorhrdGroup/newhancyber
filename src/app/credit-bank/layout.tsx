import "@/styles/credit-bank.css";
import "@/styles/ds2-pages.css";

/** 학점은행제 화면 — 디자인 시스템 v2(.ds2) 적용. 감싸는 칸은 상자를 만들지 않는다 */
export default function CreditBankLayout({ children }: { children: React.ReactNode }) {
  return <div className="ds2" style={{ display: "contents" }}>{children}</div>;
}
