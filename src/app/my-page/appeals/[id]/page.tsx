import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageTabs from "@/components/common/PageTabs";
import MyPageShell from "@/components/my-page/MyPageShell";
import AppealDetail from "@/components/my-page/b/AppealDetail";
import { getAppeal } from "@/components/my-page/myPageDataB";
import { myPageRequestTabs } from "@/lib/navigation";

export const metadata: Metadata = { title: "성적 이의신청 상세 - 마이페이지" };

/** U34 성적 이의신청 — 상세 */
export default async function GradeAppealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const appeal = getAppeal(id, "grade");
  if (!appeal) notFound();

  return (
    <MyPageShell title="성적 이의신청">
      <PageTabs items={myPageRequestTabs} />
      <AppealDetail appeal={appeal} />
      <div className="lx-actions">
        <Link href="/my-page/appeals" className="ds-btn ds-btn--secondary ds-btn--lg">
          목록
        </Link>
      </div>
    </MyPageShell>
  );
}
