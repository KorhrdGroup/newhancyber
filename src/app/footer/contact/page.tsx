import type { Metadata } from "next";
import ContactForm from "@/components/footer/ContactForm";

export const metadata: Metadata = { title: "불편사항 접수" };

export default function ContactPage() {
  return (
    <main className="wrapper">
      <div className="container">
        <div className="contact-form-container">
          <h1 className="contact-form-title">불편사항 접수</h1>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
