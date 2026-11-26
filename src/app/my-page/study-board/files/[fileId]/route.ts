import { isDbConfigured } from "@/lib/db/client";
import { readStudyFile } from "@/lib/db/studyBoard";
import { getCurrentMember } from "@/lib/memberAuth";

/**
 * 학습 게시판 첨부 받기 — 로그인한 회원에게 보이는 글(자기 수강 차수 · 대상 모두/학습자)의 첨부만 (src/lib/db/studyBoard.ts).
 * 공개 게시판 받기(/board/files)와 같이 늘 내려받게 한다.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params;
  if (!/^\d{1,9}$/.test(fileId)) return new Response("파일을 찾을 수 없습니다.", { status: 404 });
  if (!isDbConfigured()) return new Response("지금은 파일을 받을 수 없습니다.", { status: 503 });

  let file;
  try {
    const member = await getCurrentMember();
    if (!member) return new Response("로그인한 뒤 받을 수 있습니다.", { status: 401 });
    file = await readStudyFile(member.memberId, Number(fileId));
  } catch (err) {
    const e = err as { name?: string; number?: number };
    console.error("학습 게시판 첨부 읽기 실패", [e?.name, e?.number].filter(Boolean).join(" "));
    return new Response("지금은 파일을 받을 수 없습니다.", { status: 503 });
  }
  if (!file) return new Response("파일을 찾을 수 없습니다.", { status: 404 });

  const asciiName = file.fileName.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_") || "file";
  const utf8Name = encodeURIComponent(file.fileName).replace(/['()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(file.data.length),
      "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${utf8Name}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
