import type { Metadata } from "next";
import FaqList from "@/components/learning-support/FaqList";
import { practiceFaqs } from "@/components/practice-support/faqData";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "FAQ" };

/** 학습지원 FAQ 와 같은 화면 — 분류가 하나라 위쪽 분류 탭은 없다 */
export default function PracticeFaqPage() {
  return (
    <main className="wrapper">
      <FaqList
        title="실습지원 FAQ"
        desc="실습 일정·시간·기관에 대해 자주 묻는 질문입니다. 찾는 답이 없으면 1:1 문의를 남겨 주세요."
        sections={[{ title: "실습지원", items: practiceFaqs }]}
      />
    </main>
  );
}
