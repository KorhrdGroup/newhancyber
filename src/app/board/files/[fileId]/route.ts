import { isDbConfigured } from "@/lib/db/client";
import { getPublicBoardFile } from "@/lib/db/boardPosts";

/**
 * 공개 게시판(공지사항 · 학사일정 · 실습공지사항) 첨부 받기 — 관리자 사이트의 /board/files/{번호} 와 같은 모양.
 * 지운 글 · 지운 첨부 · 다른 게시판(1:1 문의 · 학습 게시판 등)의 첨부는 404.
 * 브라우저가 열어 보지 않고 늘 내려받게 한다(올린 파일 종류와 상관없이) — 첨부 안 스크립트가 이 사이트에서 돌지 않게.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params;
  if (!/^\d{1,9}$/.test(fileId)) return new Response("파일을 찾을 수 없습니다.", { status: 404 });
  if (!isDbConfigured()) return new Response("지금은 파일을 받을 수 없습니다.", { status: 503 });

  let file;
  try {
    file = await getPublicBoardFile(Number(fileId));
  } catch (err) {
    const e = err as { name?: string; number?: number };
    console.error("게시판 첨부 읽기 실패", [e?.name, e?.number].filter(Boolean).join(" "));
    return new Response("지금은 파일을 받을 수 없습니다.", { status: 503 });
  }
  if (!file) return new Response("파일을 찾을 수 없습니다.", { status: 404 });

  // 한글 파일 이름: filename* (RFC 5987) + 옛 브라우저용 ASCII 이름
  const asciiName = file.fileName.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_") || "file";
  // encodeURIComponent 는 ' ( ) * 를 그대로 두는데 RFC 5987 에서는 안 되는 글자라 따로 바꾼다
  const utf8Name = encodeURIComponent(file.fileName).replace(/['()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(file.data.length),
      "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${utf8Name}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, max-age=300",
    },
  });
}
