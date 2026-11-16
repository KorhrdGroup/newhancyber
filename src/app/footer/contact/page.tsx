import type { Metadata } from "next";
import ContactForm from "@/components/footer/ContactForm";

export const metadata: Metadata = { title: "불편사항 접수" };

export default function ContactPage() {
  return (
    <main className="wrapper ft-page">
      <ContactForm />
    </main>
  );
}
