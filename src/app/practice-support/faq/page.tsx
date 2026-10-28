import type { Metadata } from "next";
import { practiceFaqs } from "@/components/practice-support/faqData";
import FaqList from "@/components/practice-support/FaqList";

export const metadata: Metadata = { title: "FAQ" };

export default function PracticeFaqPage() {
  return (
    <main className="wrapper">
      <section className="faq-section">
        <div className="container">
          <FaqList title="실습지원 FAQ" items={practiceFaqs} />
        </div>
      </section>
    </main>
  );
}
