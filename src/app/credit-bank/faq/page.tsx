import type { Metadata } from "next";
import FaqList from "@/components/learning-support/FaqList";
import { creditBankFaqs } from "@/components/credit-bank/faqData";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "관련법령" };

/** 학습지원·실습지원 FAQ 와 같은 화면 — 분류가 하나라 위쪽 분류 탭은 없다 (페이지 제목은 원본 그대로 "관련법령") */
export default function CreditBankFaqPage() {
  return (
    <main className="wrapper">
      <FaqList
        title="학점은행제 FAQ"
        desc="학점은행제 제도와 학위 취득에 대해 자주 묻는 질문입니다. 찾는 답이 없으면 1:1 문의를 남겨 주세요."
        sections={[{ title: "학점은행제", items: creditBankFaqs }]}
      />
    </main>
  );
}
