import { deleteMemberSession } from "@/lib/memberAuth";

/**
 * 로그아웃 — 쿠키만 지운다. 머리말(MemberProvider)이 fetch 로 부르고, 상태를 바꾼 뒤 첫 화면으로 보낸다.
 * 서버 액션으로 하면 Next 가 쿠키를 바꾼 그 화면(메인 등)을 그 자리에서 다시 그려 함께 보내는데,
 * 그때 메인 공지(DB)를 읽다 실패하면 오류 화면이 나갈 수 있어서 화면을 그리지 않는 주소로 뺐다.
 * 다른 사이트가 몰래 부르지 못하게 같은 사이트에서 온 요청만 받는다.
 */
export async function POST(req: Request) {
  const site = req.headers.get("sec-fetch-site");
  const origin = req.headers.get("origin");
  const sameSite = site ? site === "same-origin" : origin === null || origin === new URL(req.url).origin;
  if (!sameSite) return new Response(null, { status: 403 });
  await deleteMemberSession();
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
