import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageTabs from "@/components/common/PageTabs";
import { sampleScholarships } from "@/components/course-registration/extra/extraData";
import PopupButton from "@/components/my-classroom/PopupButton";
import MyPageShell from "@/components/my-page/MyPageShell";
import { isDbConfigured } from "@/lib/db/client";
import { listMemberScholarships } from "@/lib/db/scholarships";
import { getCurrentMember } from "@/lib/memberAuth";
import { myPagePaymentTabs } from "@/lib/navigation";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "장학 현황 - 마이페이지" };

/** 상태 배지 — DB(LMS 장학 관리) 이름과 샘플 이름 모두. 없는 이름은 회색 */
const statusBadge: Record<string, string> = {
  "신청 중": "ds-badge--brand",
  "확인 중": "ds-badge--warning",
  승인: "ds-badge--success",
  미승인: "ds-badge--neutral",
  "지급 완료": "ds-badge--success",
  "지급 예정": "ds-badge--brand",
  "심사 중": "ds-badge--warning",
};

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

interface Row {
  key: string;
  name: string;
  semester: string;
  /** 표의 금액 — DB 는 승인되면 감면 금액, 아니면 신청 대상 금액 */
  amount: number;
  amountNote: string | null;
  method: string;
  status: string;
  note: string | null;
  paymentId: string | null;
}

/**
 * 마이페이지 장학 현황 — 로그인한 회원의 장학 신청(dbo.scholarships, LMS 「장학 관리」가 승인 · 미승인).
 * 신청은 결제 상세 「장학 신청」에서 한다. DB 설정이 없으면 샘플.
 */
export default async function PaymentScholarshipPage() {
  const isDb = isDbConfigured();
  let list: Row[];
  if (isDb) {
    const member = await getCurrentMember();
    if (!member) redirect(`/member/login?next=${encodeURIComponent("/my-page/payments/scholarship")}`);
    list = (await listMemberScholarships(member.memberId)).map((s) => ({
      key: String(s.scholarshipId),
      name: `${s.type} 장학`,
      semester: s.semester,
      amount: s.cutAmount ?? s.beforeAmount,
      amountNote: s.cutAmount === null ? "신청 대상 금액" : "감면 금액",
      method: "수강료 감면",
      status: s.status,
      note: s.rejectReason,
      paymentId: String(s.paymentId),
    }));
  } else {
    list = sampleScholarships.map((s, i) => ({ ...s, key: String(i), amountNote: null, note: null, paymentId: null }));
  }

  const doneStatuses = ["승인", "지급 완료"];
  const waitStatuses = ["신청 중", "확인 중", "지급 예정", "심사 중"];
  const paidTotal = list.filter((s) => doneStatuses.includes(s.status)).reduce((sum, s) => sum + s.amount, 0);
  const pendingCount = list.filter((s) => waitStatuses.includes(s.status)).length;

  return (
    <MyPageShell title="장학 현황" desc="받은 장학금과 지급 상태를 확인할 수 있어요.">
      <PageTabs items={myPagePaymentTabs} />
      <div className="ds-stats ex-summary">
        <div className="ds-stat">
          <p className="ds-stat-label">받은 장학금 합계</p>
          <p className="ds-stat-value">{won(paidTotal)}</p>
        </div>
        <div className="ds-stat">
          <p className="ds-stat-label">장학 내역</p>
          <p className="ds-stat-value">
            {list.length}
            <small>건</small>
          </p>
        </div>
        <div className="ds-stat">
          <p className="ds-stat-label">심사·지급 대기</p>
          <p className="ds-stat-value">
            {pendingCount}
            <small>건</small>
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="cr-empty">{isDb ? "아직 신청한 장학이 없어요." : "아직 받은 장학금이 없어요."}</p>
      ) : (
        <table className="ds-table ds-table--stack">
          <thead>
            <tr>
              <th className="is-left">장학명</th>
              <th>학기</th>
              <th>장학 금액</th>
              <th>지급 방식</th>
              <th>상태</th>
              {isDb && <th>보기</th>}
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.key}>
                <td className="ds-table-stack-head is-left">{s.name}</td>
                <td data-label="학기">{s.semester}</td>
                <td data-label="장학 금액">
                  {won(s.amount)}
                  {s.amountNote && <span className="pp-note"> ({s.amountNote})</span>}
                </td>
                <td data-label="지급 방식">{s.method}</td>
                <td data-label="상태">
                  <span className={`ds-badge ${statusBadge[s.status] ?? "ds-badge--neutral"}`}>{s.status}</span>
                  {s.note && <span className="pp-note"> · {s.note}</span>}
                </td>
                {isDb && (
                  <td data-label="보기">{s.paymentId && <PopupButton href={`/popup/payment/${s.paymentId}`}>결제 상세</PopupButton>}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="pp-note ds-mt-12">
        {isDb
          ? "장학 신청은 결제 내역의 결제 상세에서 할 수 있어요. 승인되면 승인된 금액만큼 그 결제 금액이 줄어요."
          : "수강료 감면 장학금은 해당 학기 결제 금액에서 바로 빠지고, 계좌 입금은 학기 종료 후 한 달 안에 보내 드려요."}
      </p>
    </MyPageShell>
  );
}
