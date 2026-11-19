import type { Metadata } from "next";
import ContactForm from "@/components/footer/ContactForm";
import LegalDoc from "@/components/footer/LegalDoc";

export const metadata: Metadata = { title: "불편사항 접수" };

/** 다른 바닥글 화면(약관 · 사이트맵)과 같은 틀: 가운데 본문 폭 + 제목 · 설명, 모바일은 제목 띠 */
export default function ContactPage() {
  return (
    <LegalDoc title="불편사항 접수" desc="사이트를 이용하면서 불편했던 점을 남겨 주세요.">
      <ContactForm />
    </LegalDoc>
  );
}
