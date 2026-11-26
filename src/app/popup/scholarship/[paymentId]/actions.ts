"use server";

import { isDbConfigured } from "@/lib/db/client";
import { createScholarship, type ScholarshipFileInput } from "@/lib/db/scholarships";
import { getCurrentMember } from "@/lib/memberAuth";
import {
  SCHOLARSHIP_FILE_EXTENSIONS,
  SCHOLARSHIP_FILES_MAX,
  SCHOLARSHIP_FILES_TOTAL,
  SCHOLARSHIP_REASON_MAX,
  SCHOLARSHIP_TYPES,
} from "@/lib/scholarshipOptions";

/**
 * 장학 신청 팝업 「장학 신청」 — 로그인한 회원 자신의 결제만. 접수되면 LMS 「장학 관리」에 「신청 중」으로 뜬다.
 * FormData: paymentId, itemIds(여러 개), type, etcReason, files(여러 개).
 * 증빙 파일은 학습자가 올린 것이라 믿지 않는다 — 확장자와 파일 앞머리(매직 바이트)가 맞는 것만 받고, 종류 이름도 서버가 정한다.
 */

export interface ScholarshipApplyResult {
  ok: boolean;
  message: string;
  needLogin?: boolean;
}

/** 확장자 → 저장할 종류 이름과 앞머리 검사 */
const FILE_KINDS: Record<(typeof SCHOLARSHIP_FILE_EXTENSIONS)[number], { type: string; magic: (b: Buffer) => boolean }> = {
  pdf: { type: "application/pdf", magic: (b) => b.subarray(0, 5).toString("latin1") === "%PDF-" },
  jpg: { type: "image/jpeg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  jpeg: { type: "image/jpeg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  png: { type: "image/png", magic: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  gif: { type: "image/gif", magic: (b) => b.subarray(0, 4).toString("latin1") === "GIF8" },
  // hwp(5.0) 은 OLE 복합 문서, hwpx 는 zip
  hwp: { type: "application/x-hwp", magic: (b) => b.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) },
  hwpx: { type: "application/hwp+zip", magic: (b) => b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04 },
};

/** 파일 이름 — 경로 · 제어 문자를 빼고 200자 안 */
const cleanName = (name: string) =>
  (name.split(/[\\/]/).pop() ?? "").replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(-200) || "증빙서류";

function errorSummary(err: unknown): string {
  const e = err as { name?: string; code?: string; number?: number };
  return [e?.name, e?.code, e?.number].filter((v) => v !== undefined && v !== "").join(" ") || "알 수 없는 오류";
}

export async function applyScholarship(formData: FormData): Promise<ScholarshipApplyResult> {
  if (!isDbConfigured()) return { ok: false, message: "지금은 장학을 신청할 수 없어요. 잠시 뒤 다시 시도해 주세요." };

  const paymentId = Number(formData.get("paymentId"));
  if (!Number.isSafeInteger(paymentId) || paymentId <= 0) return { ok: false, message: "결제를 찾을 수 없어요." };
  const itemIds = [...new Set(formData.getAll("itemIds").map(Number))].filter((n) => Number.isSafeInteger(n) && n > 0).slice(0, 50);
  if (itemIds.length === 0) return { ok: false, message: "장학을 신청할 과목을 골라 주세요." };

  const type = String(formData.get("type") ?? "");
  if (!(SCHOLARSHIP_TYPES as readonly string[]).includes(type)) return { ok: false, message: "장학 종류를 골라 주세요." };
  const etcReason = String(formData.get("etcReason") ?? "").replace(/\r\n?/g, "\n").trim().slice(0, SCHOLARSHIP_REASON_MAX);
  if (type === "기타" && !etcReason) return { ok: false, message: "기타 장학의 내용을 적어 주세요." };

  const rawFiles = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (rawFiles.length === 0) return { ok: false, message: "증빙 서류를 하나 이상 올려 주세요." };
  if (rawFiles.length > SCHOLARSHIP_FILES_MAX) return { ok: false, message: `증빙 서류는 ${SCHOLARSHIP_FILES_MAX}개까지 올릴 수 있어요.` };
  if (rawFiles.reduce((s, f) => s + f.size, 0) > SCHOLARSHIP_FILES_TOTAL) return { ok: false, message: "증빙 서류는 모두 합쳐 4MB 까지 올릴 수 있어요." };

  const files: ScholarshipFileInput[] = [];
  for (const f of rawFiles) {
    const name = cleanName(f.name);
    const ext = name.split(".").pop()?.toLowerCase() as keyof typeof FILE_KINDS | undefined;
    const kind = ext ? FILE_KINDS[ext] : undefined;
    const data = Buffer.from(await f.arrayBuffer());
    if (!kind || !kind.magic(data)) return { ok: false, message: `「${name}」은 올릴 수 없는 파일이에요. pdf · jpg · png · gif · hwp · hwpx 만 올려 주세요.` };
    files.push({ name, contentType: kind.type, data });
  }

  try {
    const member = await getCurrentMember();
    if (!member) return { ok: false, needLogin: true, message: "로그인한 뒤 장학을 신청할 수 있어요." };
    const result = await createScholarship({
      memberId: member.memberId,
      paymentId,
      itemIds,
      type,
      etcReason: type === "기타" ? etcReason : null,
      files,
    });
    if (!result.ok) {
      return {
        ok: false,
        message:
          result.reason === "notFound"
            ? "결제를 찾을 수 없어요."
            : "이 결제는 지금 장학을 신청할 수 없어요 (이미 신청했거나 결제 상태가 바뀌었어요). 창을 닫고 다시 열어 확인해 주세요.",
      };
    }
    return { ok: true, message: "장학 신청이 접수되었어요. 담당자가 서류를 확인한 뒤 결과를 알려 드릴게요." };
  } catch (err) {
    console.error("장학 신청 실패", errorSummary(err));
    return { ok: false, message: "장학을 신청하지 못했어요. 잠시 뒤 다시 시도해 주세요." };
  }
}
