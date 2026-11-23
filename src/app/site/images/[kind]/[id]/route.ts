import { isDbConfigured } from "@/lib/db/client";
import { readSiteImage } from "@/lib/db/site";

/**
 * 메인 배너 · 팝업 그림 — /site/images/banner/{번호}?v={바뀐 때} · /site/images/popup/{번호}?v=…
 * 주소에 ?v= 가 있으면 그림이 바뀔 때 주소도 바뀌므로 1년 동안 캐시한다(안내판 ⑩ — 매번 DB 에서 2MB 를 읽지 않게).
 * 사용 중인 것만, 형식은 jpg · png 만(관리자가 올릴 때 파일 앞머리로 확인함).
 */
const TYPES = new Set(["image/jpeg", "image/png"]);

export async function GET(req: Request, { params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  if ((kind !== "banner" && kind !== "popup") || !/^\d{1,9}$/.test(id)) return new Response(null, { status: 404 });
  if (!isDbConfigured()) return new Response(null, { status: 503 });

  let img;
  try {
    img = await readSiteImage(kind, Number(id));
  } catch (err) {
    const e = err as { name?: string; number?: number };
    console.error("배너 · 팝업 그림 읽기 실패", [e?.name, e?.number].filter(Boolean).join(" "));
    return new Response(null, { status: 503 });
  }
  if (!img || !TYPES.has(img.type)) return new Response(null, { status: 404 });

  const versioned = new URL(req.url).searchParams.has("v");
  return new Response(new Uint8Array(img.data), {
    headers: {
      "Content-Type": img.type,
      "Content-Length": String(img.data.length),
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": versioned ? "public, max-age=31536000, s-maxage=31536000, immutable" : "public, max-age=300",
    },
  });
}
