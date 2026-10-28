import type { Metadata } from "next";
import FaqList from "@/components/learning-support/FaqList";

export const metadata: Metadata = { title: "FAQ" };

export default function LearningFaqPage() {
  return (
    <main className="wrapper">
      <FaqList />
    </main>
  );
}
