"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { requestRefund } from "@/app/popup/refund/[paymentId]/actions";
import { formatWon } from "@/components/my-classroom/classroomData";
import type { RefundLine } from "@/lib/db/refunds";
import { REFUND_REASONS } from "@/lib/refundReasons";
import { closePopup } from "../PopupActions";

interface DbRefund {
  paymentId: number;
  lines: RefundLine[];
  /** 회원가입 때 적은 환불 계좌 · 이름으로 미리 채운다 */
  defaults: { bank: string; account: string; holder: string };
}

/**
 * 환불 신청서. needAccount: 카드 결제가 아니라 돌려받을 계좌가 필요한 경우.
 * db 가 있으면 과목을 골라 실제로 「환불 접수」를 남긴다 (LMS 환불 관리가 처리). 없으면 샘플(저장하지 않음).
 * 확인 창(confirm) · 알림 창(alert)은 쓰지 않는다 — 앱 안 브라우저가 막기도 해서, 안내는 화면 안에 보인다.
 */
export default function RefundForm({ needAccount, db }: { needAccount: boolean; db?: DbRefund }) {
  const refundable = db?.lines.filter((l) => l.refundable) ?? [];
  const [agreed, setAgreed] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonEtc, setReasonEtc] = useState("");
  const [picked, setPicked] = useState<number[]>(() => refundable.map((l) => l.itemId));
  const [bank, setBank] = useState(db?.defaults.bank ?? "");
  const [account, setAccount] = useState(db?.defaults.account ?? "");
  const [holder, setHolder] = useState(db?.defaults.holder ?? "");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [isSending, startSending] = useTransition();
  const router = useRouter();

  const pickedLines = refundable.filter((l) => picked.includes(l.itemId));
  const expected = pickedLines.reduce((sum, l) => sum + l.amount, 0);
  const toggle = (itemId: number, on: boolean) => setPicked((prev) => (on ? [...prev, itemId] : prev.filter((id) => id !== itemId)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setMessage({ ok: false, text: "환불 사유를 골라 주세요." });
      return;
    }
    if (!db) {
      setMessage({ ok: false, text: "샘플 화면이라 신청하지 않아요." });
      return;
    }
    if (pickedLines.length === 0) {
      setMessage({ ok: false, text: "환불할 과목을 골라 주세요." });
      return;
    }
    setMessage(null);
    startSending(async () => {
      const result = await requestRefund({
        paymentId: db.paymentId,
        itemIds: pickedLines.map((l) => l.itemId),
        reason,
        reasonEtc,
        bank,
        account,
        holder,
      });
      if (result.needLogin) {
        router.push(`/member/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      setMessage({ ok: result.ok, text: result.message });
      // 접수되면 여는 창(결제 내역)을 새로 그려 상태를 「환불 접수」로
      if (result.ok) window.opener?.location.reload();
    });
  };

  if (message?.ok) {
    return (
      <div className="pp-box">
        <h2 className="pp-box-title">환불 신청 접수</h2>
        <p role="status">{message.text}</p>
        <div className="pp-actions">
          <button type="button" className="ds-btn ds-btn--primary" onClick={closePopup}>
            닫기
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="pp-box">
      <h2 className="pp-box-title">환불 신청</h2>

      {db && (
        <div className="pp-field">
          <span className="ds-label">환불할 과목</span>
          <table className="ds-table">
            <thead>
              <tr>
                <th>
                  <span className="sr-only">선택</span>
                </th>
                <th className="is-left">과목</th>
                <th>결제 금액</th>
                <th>오늘 신청하면</th>
              </tr>
            </thead>
            <tbody>
              {db.lines.map((l) => (
                <tr key={l.itemId}>
                  <td>
                    <label className="ds-check">
                      <input
                        type="checkbox"
                        aria-label={`${l.name} 환불`}
                        checked={picked.includes(l.itemId)}
                        disabled={!l.refundable}
                        onChange={(e) => toggle(l.itemId, e.target.checked)}
                      />
                    </label>
                  </td>
                  <td className="is-left">
                    [{l.semester}] {l.name}
                    <br />
                    <span className="pp-note">수강 기간 {l.studyPeriod}</span>
                  </td>
                  <td>{formatWon(l.paid)}</td>
                  <td>{l.refundable ? `${formatWon(l.amount)} (${l.grade})` : l.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="pp-note ds-mt-12">
            예상 환불 금액 <strong>{formatWon(expected)}</strong> · 신청일 기준이며, 담당자가 확인한 뒤 확정돼요.
          </p>
        </div>
      )}

      <div className="pp-field">
        <label className="ds-label" htmlFor="refund-reason">
          환불 사유
        </label>
        <select id="refund-reason" className="ds-select" value={reason} onChange={(e) => setReason(e.target.value)}>
          <option value="">골라 주세요</option>
          {REFUND_REASONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      {reason === "기타" && (
        <div className="pp-field">
          <textarea
            className="ds-textarea ds-textarea--sm"
            placeholder="사유를 적어 주세요."
            aria-label="기타 사유"
            maxLength={500}
            value={reasonEtc}
            onChange={(e) => setReasonEtc(e.target.value)}
          />
        </div>
      )}
      {needAccount && (
        <div className="pp-field">
          <span className="ds-label">돌려받을 계좌</span>
          <div className="pp-row">
            <input className="ds-input pp-input-bank" placeholder="은행" aria-label="은행" maxLength={30} value={bank} onChange={(e) => setBank(e.target.value)} />
            <input
              className="ds-input"
              placeholder="계좌번호 (- 없이)"
              aria-label="계좌번호"
              inputMode="numeric"
              maxLength={50}
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            />
            <input className="ds-input pp-input-holder" placeholder="예금주" aria-label="예금주" maxLength={50} value={holder} onChange={(e) => setHolder(e.target.value)} />
          </div>
        </div>
      )}
      <div className="pp-field">
        <label className="ds-check">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          환불 규정과 유의사항을 모두 읽었고, 이에 동의합니다. 환불이 끝나면 그 과목은 더 수강할 수 없어요.
        </label>
      </div>
      {message && !message.ok && (
        <p className="ds-text-danger" role="alert">
          {message.text}
        </p>
      )}
      <div className="pp-actions">
        <button type="button" className="ds-btn ds-btn--secondary" onClick={closePopup}>
          취소
        </button>
        <button type="submit" className="ds-btn ds-btn--danger" disabled={!agreed || isSending || (db !== undefined && refundable.length === 0)}>
          환불 신청
        </button>
      </div>
    </form>
  );
}
