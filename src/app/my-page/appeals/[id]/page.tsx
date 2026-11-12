import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MyPageShell from "@/components/my-page/MyPageShell";
import AppealDetail from "@/components/my-page/b/AppealDetail";
import { getAppeal } from "@/components/my-page/myPageDataB";

export const metadata: Metadata = { title: "성적 이의신청 상세 - 마이페이지" };

/** U34 성적 이의신청 — 상세 */
export default async function GradeAppealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const appeal = getAppeal(id, "grade");
  if (!appeal) notFound();

  return (
    <MyPageShell title="성적 이의신청 상세">
      <AppealDetail appeal={appeal} backHref="/my-page/appeals" />
    </MyPageShell>
  );
}
