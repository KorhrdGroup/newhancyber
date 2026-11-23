import type { Metadata } from "next";
import { connection } from "next/server";
import FaqList from "@/components/learning-support/FaqList";
import { faqSections, type FaqSection } from "@/components/learning-support/faqData";
import { loadFaqs } from "@/lib/publicBoards";

export const metadata: Metadata = { title: "자주 묻는 질문" };

/**
 * 자주 묻는 질문 — 관리자 「게시판 관리 › 자주 묻는 질문」(board_posts.faq, 질문 = title · 답 = content).
 * 예전 FAQ 20개는 11/23 board_posts 로 옮겼다(분류는 category 칸에). 분류 탭은 category 로 묶는다 —
 * 예전 분류 순서(faqData)대로, 그 밖의 분류는 나온 순서대로, 분류가 없는 글(관리자 화면에 아직 분류 칸이 없음)은 「기타」.
 * DB 에 FAQ 가 하나도 없으면 예전 화면 FAQ(faqData)를 그대로 보인다.
 */
const OTHER = "기타";

function toSections(rows: { title: string; content: string | null; category: string | null }[]): FaqSection[] {
  const groups = new Map<string, FaqSection["items"]>();
  for (const r of rows) {
    const key = r.category?.trim() || OTHER;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push({ question: r.title, answer: (r.content ?? "").replace(/\r\n?/g, "\n").split("\n") });
  }
  const order = [...faqSections.map((s) => s.title), ...groups.keys()].filter((t, i, a) => a.indexOf(t) === i && t !== OTHER);
  const sections = [...order, OTHER].filter((t) => groups.has(t)).map((title) => ({ title, items: groups.get(title)! }));
  // 분류가 하나뿐이면 탭 없이 한 목록
  return sections.length === 1 ? [{ title: "전체", items: sections[0].items }] : sections;
}
export default async function LearningFaqPage() {
  await connection(); // 빌드 때 한 번 읽어 굳히지 않고, 요청마다 DB 에서 읽는다
  const { rows, failed } = await loadFaqs();
  const sections: FaqSection[] = rows.length > 0 ? toSections(rows) : faqSections;

  return (
    <main className="wrapper">
      <FaqList sections={failed ? [] : sections} unavailable={failed ? "지금은 질문을 불러올 수 없어요. 잠시 뒤 다시 시도해 주세요." : undefined} />
    </main>
  );
}
