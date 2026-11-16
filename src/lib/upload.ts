/**
 * 학습자 첨부 파일 규칙 — 원본 /js/usr_func.js 의 fileSizeUsrExpChk · expExractAllUsr 와 같다.
 * 원본 1:1 문의 글쓰기(/bbs/bbsIn.asp), 공결 신청(/stdMng/absentApply.asp), 성적 이의신청(/stdMng/bbsAppealIn.asp)이 이 검사를 쓴다.
 * 원본 화면 문구(doc, pdf, hwp, ppt, xls, txt, jpg, png, gif)는 실제 검사와 달라, 검사 쪽에 맞춘다.
 */
export const USER_UPLOAD_EXTENSIONS = ["jpg", "jpeg", "png", "pdf", "hwp", "hwpx", "doc", "docx", "xls", "xlsx"];
/** 10MB 이상이면 거부 (원본도 정확히 10MB 는 거부) */
export const USER_UPLOAD_MAX = 10 * 1024 * 1024;
export const USER_UPLOAD_ACCEPT = USER_UPLOAD_EXTENSIONS.map((ext) => `.${ext}`).join(",");
export const USER_UPLOAD_NOTE = `(첨부파일 최대 용량 : 10MB / 확장자 : ${USER_UPLOAD_EXTENSIONS.join(", ")})`;

/** 통과하면 빈 문자열, 걸리면 안내 문구 */
export function checkUserUpload(file: File): string {
  if (file.size >= USER_UPLOAD_MAX) return "파일은 최대 10MB까지 올릴 수 있습니다.";
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!USER_UPLOAD_EXTENSIONS.includes(ext)) return "올릴 수 없는 파일 형식입니다. 아래 확장자의 파일만 올릴 수 있습니다.";
  return "";
}
