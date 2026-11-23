import type { Metadata } from "next";
import Link from "next/link";
import { CbIconFlow } from "@/components/credit-bank/CbFlow";
import { Notes, PracticeSection, RefNotes } from "@/components/practice-support/PracticeParts";
import { DataTable } from "@/components/social-worker/SwParts";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";
import "@/styles/credit-bank.css";

export const metadata: Metadata = { title: "학습비 반환규정" };

/** 반환 사유 발생 시점별 반환 금액 (제 4조 제 2항 제 2~4호) */
const refundSteps: [string, string][] = [
  ["수업 시작일 전까지", "학습비 전액"],
  ["수업 시작일부터 총 수업시간의 1/6 경과 전", "학습비의 6분의 5에 해당하는 금액"],
  ["총 수업시간의 1/6 이상부터 1/3 미만까지의 기간동안", "학습비의 3분의 2에 해당하는 금액"],
  ["총 수업시간의 1/3 이상부터 1/2 미만까지의 기간동안", "학습비의 2분의 1에 해당하는 금액"],
  ["총 수업시간의 1/2 이상 경과", "반환하지 않음"],
];

/** 학습비 반환규정 — 수강규정과 같은 흰 바탕 틀: 환불 절차 그림 + 안내 목록 + 반환 기준 표 */
export default function CourseRefundPage() {
  return (
    <main className="wrapper">
      <div className="container lx-page lx-page--top lx-page--plain cr-rules">
        <h1 className="page-title">학습비 반환규정</h1>
        <p className="lx-desc">환불 절차와 환불/취소 안내, 평가인정 학습과정 운영 규정에 따른 학습비 반환 기준입니다.</p>

        <PracticeSection title="환불 절차">
          <div className="cr-step-panel">
            <CbIconFlow
              items={[
                { icon: "scroll-pen", label: "환불신청서" },
                { icon: "coin-cycle", label: "환불금 산정" },
                { icon: "receipt-check", label: "환불완료" },
              ]}
              joins={["arrow", "arrow"]}
            />
          </div>
          <RefNotes
            items={[
              "「평가인정 학습과정 운영에 관한 규정」 <별표> 학습비 반환 기준 [제 4조 제2항 관련]에 의거하여 중간고사 이후 환불은 진행불가합니다.",
            ]}
          />
        </PracticeSection>

        <PracticeSection title="환불 규정 (환불/취소 안내)">
          <Notes
            items={[
              "수강료 반환은 교육부 [평가인정 학습과정 운영에 관한 규정] <별표> 학습비 반환 기준(제4조제2항관련)에 따릅니다.",
              "본 환불/취소 신청 건은 환불 요청 당일 기준 금액으로 환불이 진행됩니다.",
              "환불요청일이 포함된 주차의 학습범위까지 학습을 하지 않았어도 해당 주차까지 학습한 것으로 간주하여 수강료에서 감안 후 환불됩니다.",
              "신용카드 결제의 경우 청구기간 이전이면 결제되지 않으며, 청구기간 이후면 익월 결제내역에서 차감됩니다.",
              "실시간 계좌이체, 무통장 입금의 경우 지정한 계좌로 입금되며, 환불/취소일자 및 금액이 노출됩니다.",
              "환불완료 시 안내문자를 발송드리며, 관련하여 추가 문의사항이 있으신 학습자님께서는 한평생원격교육원 수강신청 문의(1661-7769)로 연락주시기 바랍니다.",
            ]}
          />
        </PracticeSection>

        <PracticeSection title="학습비 반환 기준 (평가인정 학습과정 운영에 관한 규정 제 4조 제 2항 관련)">
          <ol className="cr-rule-list">
            <li>
              <span>1)</span>반환금은 학습자가 실제 납부한 금액을 기준으로 반환한다.
            </li>
            <li>
              <span>2)</span>학습자의 학습포기 의사 표시일로부터 5일 이내에 학습비를 반환한다.
            </li>
            <li>
              <span>3)</span>반환기일 종료일이 토요일 또는 공휴일인 경우 공휴일이 끝나는 익일을 반환기간 만료일로 한다.
              <small>
                *민법 제 161조 공휴일 등과 기간의 만료점에 의거 / 기간의 말일이 토요일 또는 공휴일에 해당하는 때에는 기간은 그 익일로
                만료한다.
              </small>
            </li>
          </ol>
          <DataTable head={["반환사유", "반환 사유 발생 시점", "반환 금액"]}>
            <tr>
              <td>제 4조 제 2항 제 1호에 해당하는 경우</td>
              <td>-</td>
              <td>과오납된 금액 전액</td>
            </tr>
            {refundSteps.map(([when, amount], i) => (
              <tr key={when}>
                {i === 0 && (
                  <td rowSpan={refundSteps.length}>
                    제 4조 제 2항 제 1호에 해당하는 경우
                    <br />
                    제 4조 제 2항 제 2호부터 제 4호까지의 규정에 해당하는 경우
                  </td>
                )}
                <td>{when}</td>
                <td>{amount}</td>
              </tr>
            ))}
          </DataTable>
        </PracticeSection>

        <div className="lx-actions">
          <Link href="/my-page/payments/refund" className="ds-btn ds-btn--primary ds-btn--lg">
            환불하러 가기
          </Link>
        </div>
      </div>
    </main>
  );
}
