import { isDbConfigured } from "@/lib/db/client";
import { getScholarshipThumb, imageTypeOf } from "@/lib/db/boardPosts";

/**
 * 장학후기 썸네일(board_post_files kind 「썸네일」) — 화면에 그림으로 바로 보인다.
 * 지운 글 · 지운 썸네일 · 다른 게시판 파일 · 첨부(kind 「첨부」)는 404.
 * 파일 앞부분이 jpg · png 가 아니면 보내지 않는다(관리자도 jpg · png 만 받는다). 형식은 저장된 content_type 이 아니라
 * 실제 바이트로 정하고 nosniff 를 붙여, 브라우저가 다른 형식(HTML 등)으로 읽지 않게 한다.
 * 관리자가 썸네일을 바꾸면 새 파일 번호가 생기므로 주소가 바뀐다 — 잠깐 캐시해도 된다.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params;
  if (!/^\d{1,9}$/.test(fileId)) return new Response("그림을 찾을 수 없습니다.", { status: 404 });
  if (!isDbConfigured()) return new Response("지금은 그림을 볼 수 없습니다.", { status: 503 });

  let file;
  try {
    file = await getScholarshipThumb(Number(fileId));
  } catch (err) {
    const e = err as { name?: string; number?: number };
    console.error("장학후기 썸네일 읽기 실패", [e?.name, e?.number].filter(Boolean).join(" "));
    return new Response("지금은 그림을 볼 수 없습니다.", { status: 503 });
  }
  const type = file ? imageTypeOf(file.data) : null;
  if (!file || !type) return new Response("그림을 찾을 수 없습니다.", { status: 404 });

  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": type,
      "Content-Length": String(file.data.length),
      "Content-Disposition": "inline",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
