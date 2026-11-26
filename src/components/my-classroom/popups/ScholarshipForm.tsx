"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { applyScholarship } from "@/app/popup/scholarship/[paymentId]/actions";
import { formatWon } from "@/components/my-classroom/classroomData";
import type { ScholarshipLine } from "@/lib/db/scholarships";
import {
  checkScholarshipFile,
  SCHOLARSHIP_FILE_ACCEPT,
  SCHOLARSHIP_FILES_MAX,
  SCHOLARSHIP_FILES_TOTAL,
  SCHOLARSHIP_REASON_MAX,
  SCHOLARSHIP_TYPES,
} from "@/lib/scholarshipOptions";
import { closePopup } from "../PopupActions";

/**
 * 장학 신청서 — 대상 과목(고르기) · 장학 종류 · 기타 내용 · 증빙 서류(여러 개). 결과는 알림 창 대신 화면 안에 보인다.
 * 파일은 고를 때 바로 검사하고(종류 · 합계 크기), 서버가 파일 앞머리까지 다시 본다.
 */
export default function ScholarshipForm({ paymentId, lines }: { paymentId: number; lines: ScholarshipLine[] }) {
  const eligible = lines.filter((l) => l.eligible);
  const [picked, setPicked] = useState<number[]>(() => eligible.map((l) => l.itemId));
  const [type, setType] = useState("");
  const [etcReason, setEtcReason] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [isSending, startSending] = useTransition();
  const router = useRouter();

  const total = files.reduce((s, f) => s + f.size, 0);
  const toggle = (id: number, on: boolean) => setPicked((prev) => (on ? [...prev, id] : prev.filter((x) => x !== id)));

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = [...files];
    for (const f of Array.from(list)) {
      const err = checkScholarshipFile(f);
      if (err) {
        setMessage({ ok: false, text: `「${f.name}」: ${err}` });
        return;
      }
      next.push(f);
    }
    if (next.length > SCHOLARSHIP_FILES_MAX) {
      setMessage({ ok: false, text: `증빙 서류는 ${SCHOLARSHIP_FILES_MAX}개까지 올릴 수 있어요.` });
      return;
    }
    if (next.reduce((s, f) => s + f.size, 0) > SCHOLARSHIP_FILES_TOTAL) {
      setMessage({ ok: false, text: "증빙 서류는 모두 합쳐 4MB 까지 올릴 수 있어요." });
      return;
    }
    setMessage(null);
    setFiles(next);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (picked.length === 0) return setMessage({ ok: false, text: "장학을 신청할 과목을 골라 주세요." });
    if (!type) return setMessage({ ok: false, text: "장학 종류를 골라 주세요." });
    if (type === "기타" && !etcReason.trim()) return setMessage({ ok: false, text: "기타 장학의 내용을 적어 주세요." });
    if (files.length === 0) return setMessage({ ok: false, text: "증빙 서류를 하나 이상 올려 주세요." });
    const fd = new FormData();
    fd.set("paymentId", String(paymentId));
    for (const id of picked) fd.append("itemIds", String(id));
    fd.set("type", type);
    fd.set("etcReason", etcReason);
    for (const f of files) fd.append("files", f, f.name);
    setMessage(null);
    startSending(async () => {
      const result = await applyScholarship(fd);
      if (result.needLogin) {
        router.push(`/member/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      setMessage({ ok: result.ok, text: result.message });
      // 접수되면 여는 창(결제 내역 · 장학 현황)을 새로 그린다
      if (result.ok) window.opener?.location.reload();
    });
  };

  if (message?.ok) {
    return (
      <div className="pp-box">
        <h2 className="pp-box-title">장학 신청 접수</h2>
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
      <h2 className="pp-box-title">장학 신청</h2>

      <div className="pp-field">
        <span className="ds-label">대상 과목</span>
        <table className="ds-table">
          <thead>
            <tr>
              <th>
                <span className="sr-only">선택</span>
              </th>
              <th className="is-left">과목</th>
              <th>결제 금액</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.itemId}>
                <td>
                  <label className="ds-check">
                    <input
                      type="checkbox"
                      aria-label={`${l.name} 장학 신청`}
                      checked={picked.includes(l.itemId)}
                      disabled={!l.eligible}
                      onChange={(e) => toggle(l.itemId, e.target.checked)}
                    />
                  </label>
                </td>
                <td className="is-left">
                  [{l.semester}] {l.name}
                  {l.note && <span className="pp-note"> · {l.note}</span>}
                </td>
                <td>{formatWon(l.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pp-field">
        <label className="ds-label" htmlFor="sch-type">
          장학 종류
        </label>
        <select id="sch-type" className="ds-select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">골라 주세요</option>
          {SCHOLARSHIP_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      {type === "기타" && (
        <div className="pp-field">
          <textarea
            className="ds-textarea ds-textarea--sm"
            placeholder="어떤 장학인지 적어 주세요."
            aria-label="기타 장학 내용"
            maxLength={SCHOLARSHIP_REASON_MAX}
            value={etcReason}
            onChange={(e) => setEtcReason(e.target.value)}
          />
        </div>
      )}

      <div className="pp-field">
        <label className="ds-label" htmlFor="sch-files">
          증빙 서류
        </label>
        <input
          id="sch-files"
          type="file"
          multiple
          accept={SCHOLARSHIP_FILE_ACCEPT}
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {files.length > 0 && (
          <ul className="pp-list ds-mt-8">
            {files.map((f, i) => (
              <li key={`${i}-${f.name}`}>
                {f.name} ({Math.ceil(f.size / 1024).toLocaleString("ko-KR")}KB){" "}
                <button type="button" className="ds-btn ds-btn--ghost ds-btn--sm" onClick={() => setFiles(files.filter((_, j) => j !== i))}>
                  빼기
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="pp-note ds-mt-8">
          pdf · jpg · png · gif · hwp · hwpx, {SCHOLARSHIP_FILES_MAX}개까지 · 모두 합쳐 4MB (지금 {(total / 1024 / 1024).toFixed(1)}MB)
        </p>
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
        <button type="submit" className="ds-btn ds-btn--primary" disabled={isSending || eligible.length === 0}>
          장학 신청
        </button>
      </div>
    </form>
  );
}
