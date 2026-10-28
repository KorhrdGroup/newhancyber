import type { Metadata } from "next";
import FaqAccordion from "@/components/credit-bank/FaqAccordion";
import { creditBankFaq } from "@/components/credit-bank/faqItems";

export const metadata: Metadata = { title: "관련법령" };

/** 원본 credit-bank/faq.html (페이지 제목은 원본 그대로 "관련법령") */
export default function CreditBankFaqPage() {
  return (
    <main className="wrapper">
      <section className="faq-section">
        <div className="container">
          <FaqAccordion title="학점은행제 FAQ" items={creditBankFaq} />
        </div>
      </section>
    </main>
  );
}
