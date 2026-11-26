import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import PopupShell from "@/components/my-classroom/PopupShell";
import ScholarshipForm from "@/components/my-classroom/popups/ScholarshipForm";
import { isDbConfigured } from "@/lib/db/client";
import { readScholarshipForm } from "@/lib/db/scholarships";
import { getCurrentMember } from "@/lib/memberAuth";

export const metadata: Metadata = { title: "장학 신청" };

/**
 * 장학 신청 팝업 (결제 상세 「장학 신청」) — 로그인한 회원 자신의 결제만 (다른 번호면 404).
 * 장학 종류 · 대상 과목 · 증빙 서류를 받아 「신청 중」으로 남긴다. LMS 「장학 관리」가 확인해 승인하면 결제 금액이 깎인다.
 * 샘플 화면은 없다 — DB 설정이 없으면 404.
 */
export default async function ScholarshipPopup({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;
  if (!isDbConfigured()) notFound();
  const id = Number(paymentId);
  if (!Number.isSafeInteger(id) || id <= 0) notFound();
  const member = await getCurrentMember();
  if (!member) redirect(`/member/login?next=${encodeURIComponent(`/popup/scholarship/${id}`)}`);
  const form = await readScholarshipForm(member.memberId, id);
  if (!form) notFound();

  return (
    <PopupShell title="장학 신청" sub={form.title} footer={null}>
      <div className="pp-box">
        <h2 className="pp-box-title">안내</h2>
        <ul className="pp-list">
          <li>보훈 · 북한이탈주민 · 한국장학재단 학자금 등 대상이면 증빙 서류와 함께 신청해 주세요.</li>
          <li>담당자가 서류를 확인해 승인하면, 승인된 금액만큼 결제 금액이 줄어요. 이미 결제했다면 차액은 담당자가 안내해 드려요.</li>
          <li>한 결제에 장학은 한 번만 신청할 수 있어요.</li>
        </ul>
      </div>
      <div className="ds-mt-16">
        {form.canApply ? (
          <ScholarshipForm paymentId={form.paymentId} lines={form.lines} />
        ) : (
          <div className="pp-box">
            <p>{form.blockedReason}</p>
          </div>
        )}
      </div>
    </PopupShell>
  );
}
