/**
 * 장학 신청 — 화면과 서버가 같이 쓰는 규칙. DB 는 scholarships · scholarship_items · scholarship_files (LMS 「장학 관리」 DB 018).
 * 종류 · 상태 이름은 newhancyber-lms src/lib/payments.ts SCHOLARSHIP_TYPES · SCHOLARSHIP_STATUSES 와 같다.
 * 증빙 파일 종류는 LMS 장학 증빙 내려받기(scholarshipList/[id]/files/[fileId])가 그대로 알려 주는 종류와 맞춘다.
 * 크기: 한 번에 보내는 양이 Vercel 요청 한도(4.5MB) 안에 들도록 합계 4MB · 많아야 3개 (next.config.ts serverActions.bodySizeLimit).
 */
export const SCHOLARSHIP_TYPES = ["보훈", "북한이탈주민", "한국장학재단 학자금", "기타"] as const;
export type ScholarshipType = (typeof SCHOLARSHIP_TYPES)[number];

export const SCHOLARSHIP_FILE_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "gif", "hwp", "hwpx"] as const;
export const SCHOLARSHIP_FILE_ACCEPT = SCHOLARSHIP_FILE_EXTENSIONS.map((e) => `.${e}`).join(",");
export const SCHOLARSHIP_FILES_MAX = 3;
export const SCHOLARSHIP_FILES_TOTAL = 4 * 1024 * 1024;
export const SCHOLARSHIP_REASON_MAX = 500;

/** 고를 때 바로 하는 검사 (서버가 파일 앞머리까지 다시 본다) — 통과하면 빈 문자열 */
export function checkScholarshipFile(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!(SCHOLARSHIP_FILE_EXTENSIONS as readonly string[]).includes(ext)) return "pdf · jpg · png · gif · hwp · hwpx 파일만 올릴 수 있어요.";
  if (file.size === 0) return "빈 파일은 올릴 수 없어요.";
  if (file.size > SCHOLARSHIP_FILES_TOTAL) return "파일은 모두 합쳐 4MB 까지 올릴 수 있어요.";
  return "";
}
