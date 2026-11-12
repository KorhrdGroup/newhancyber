import type { Metadata } from "next";
import FaqList from "@/components/learning-support/FaqList";

export const metadata: Metadata = { title: "자주 묻는 질문" };

export default function LearningFaqPage() {
  return (
    <main className="wrapper">
      <FaqList />
    </main>
  );
}
