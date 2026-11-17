import type { Metadata } from "next";
import PageTabs from "@/components/common/PageTabs";
import { Badge } from "@/components/my-classroom/ClassroomUI";
import PopupButton from "@/components/my-classroom/PopupButton";
import { formatWon } from "@/components/my-classroom/classroomData";
import MyPageShell from "@/components/my-page/MyPageShell";
import Guide from "@/components/my-page/b/Guide";
import { certificateTabs, getTuitionPaymentList, tuitionYears } from "@/components/my-page/myPageDataB";

export const metadata: Metadata = { title: "교육비 납입 증명서 - 증명서 발급 - 마이페이지" };

/** U32 증명서 발급 — 교육비 납입 증명서 (연말정산 교육비 공제용) */
export default function TuitionCertificatePage() {
  const payments = getTuitionPaymentList();

  return (
    <MyPageShell title="증명서 발급" desc="필요한 증명서를 골라 바로 출력할 수 있어요.">
      <PageTabs items={certificateTabs} />
      <Guide
        items={[
          "연말정산 교육비 공제를 신청할 때 쓰는 증명서예요.",
          "결제 완료된 건만 들어가요. 한 해 결제를 한 장에 모아 받거나, 결제 건별로 받을 수 있어요.",
          "환불된 금액은 빠지고, 쿠폰 할인 뒤 실제로 낸 금액으로 표시돼요.",
        ]}
      />
      {tuitionYears.length > 0 && (
        <div className="mq-toolbar">
          {tuitionYears.map((year) => (
            <PopupButton key={year} href={`/popup/print/tuition/${year}`}>
              {year}년 전체 발급받기
            </PopupButton>
          ))}
        </div>
      )}
      {payments.length === 0 ? (
        <p className="cr-empty">결제 완료된 내역이 없어요.</p>
      ) : (
        <table className="ds-table ds-table--stack">
          <thead>
            <tr>
              <th className="is-left">결제명</th>
              <th>결제일</th>
              <th>결제 수단</th>
              <th>납입 금액</th>
              <th>상태</th>
              <th>발급</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="ds-table-stack-head is-left">{p.title}</td>
                <td data-label="결제일">{p.paidAt}</td>
                <td data-label="결제 수단">{p.method}</td>
                <td data-label="납입 금액">{formatWon(p.paid)}</td>
                <td data-label="상태">
                  <Badge>{p.status}</Badge>
                </td>
                <td data-label="발급">
                  <PopupButton href={`/popup/print/tuition/${p.id}`}>발급받기</PopupButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </MyPageShell>
  );
}
