import "server-only";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { unstable_cache } from "next/cache";
import type { NavGroup } from "@/types/navigation";
import { isDbConfigured } from "./db/client";
import {
  readActivePopups,
  readRelatedSites,
  readSiteBanners,
  readSiteInfo,
  readSiteMenus,
  readSiteTerms,
  type SiteInfoRow,
  type TermKind,
} from "./db/site";

/**
 * 홈페이지 관리 6개(DB 027)를 화면이 쓰는 모양으로 — 1분 캐시 · 링크 검사 · 빈 표면 지금 코드 값.
 * DB 가 안 되거나 표가 비면 null / 빈 배열을 돌려주고, 부르는 쪽이 지금 코드 값을 그대로 쓴다(화면이 바뀌지 않게).
 * unstable_cache 는 값을 JSON 으로 저장하므로 날짜는 숫자로 바꿔 둔다.
 */

const CACHE_SECONDS = 60;

function errorSummary(err: unknown): string {
  const e = err as { name?: string; code?: string; number?: number };
  return [e?.name, e?.code, e?.number].filter((v) => v !== undefined && v !== "").join(" ") || "알 수 없는 오류";
}

/** 캐시된 읽기를 부르고, DB 설정이 없거나 실패하면 fallback (실패는 캐시하지 않는다 — 다음 요청에서 다시 읽음) */
async function safely<T>(label: string, read: () => Promise<T>, fallback: T): Promise<T> {
  // 빌드 중에는 DB 를 부르지 않는다 — 화면 100여 개가 잠든 Azure 를 기다리면 빌드가 길어지거나 60초 제한에 걸린다.
  // 빌드 결과는 코드 값으로 만들어지고, 루트 레이아웃의 revalidate(60) 로 다시 만들어진다 — 화면마다 60초가 지난 뒤
  // 첫 방문자는 옛 화면을 보고(그동안 뒤에서 새로 만듦), 그다음 방문자부터 DB 값이 보인다.
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) return fallback;
  if (!isDbConfigured()) return fallback;
  try {
    return await read();
  } catch (err) {
    console.error(`홈페이지 관리 읽기 실패 (${label})`, errorSummary(err));
    return fallback;
  }
}

/**
 * 링크 검사 (안내판 ⑦) — 관리자와 같은 규칙: 「/」로 시작하는 홈페이지 주소(// 는 안 됨) 또는 http(s) 주소, 공백 · 「\」 없이.
 * 맞지 않으면 null (링크 없이 보인다).
 */
export function safeHref(raw: string | null | undefined): string | null {
  const v = (raw ?? "").trim();
  if (!v || /[\s\\]/.test(v)) return null;
  if (v.startsWith("/")) return v.startsWith("//") ? null : v;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:" ? u.href : null;
  } catch {
    return null;
  }
}

// ── 머리말 · 바닥글 (모든 화면) ──────────────────────────

export interface RelatedSite {
  name: string;
  url: string;
}

export interface SiteInfo extends Omit<SiteInfoRow, "bankAccount"> {
  /** 관리자가 아직 안 채운 안내 문구(「(…적어 주세요)」)면 null — 보이지 않는다 (안내판 ⑨) */
  bankAccount: string | null;
}

export interface LayoutSite {
  /** 비어 있으면 코드의 gnb */
  menus: NavGroup[] | null;
  info: SiteInfo | null;
  /** 비어 있으면 코드의 기관 로고 */
  related: RelatedSite[] | null;
}

const readLayout = unstable_cache(
  async () => {
    const [menuRows, info, related] = await Promise.all([readSiteMenus(), readSiteInfo(), readRelatedSites()]);

    // 1차 메뉴(사용 중) 아래 2차(사용 중) — 1차가 미사용이면 2차도 숨긴다 (안내판 ①)
    const tops = menuRows.filter((m) => m.parentId === null && m.isActive);
    const menus: NavGroup[] = [];
    for (const top of tops) {
      const href = safeHref(top.href);
      if (!href) continue;
      const children = menuRows
        .filter((m) => m.parentId === top.menuId && m.isActive)
        .map((m) => ({ label: m.name, href: safeHref(m.href) }))
        .filter((c): c is { label: string; href: string } => c.href !== null);
      menus.push({ label: top.name, href, badge: top.badge?.trim() || undefined, children });
    }

    const bank = info?.bankAccount?.trim() ?? "";
    // 관리자가 아직 안 채운 첫 안내 문구(「(입금 계좌를 적어 주세요)」)만 숨긴다 — 「(국민은행) 123-…」 같은 진짜 값은 보인다
    const placeholder = !bank || bank.includes("적어 주세요");
    return {
      menus: menus.length ? menus : null,
      info: info ? { ...info, bankAccount: placeholder ? null : bank } : null,
      related: related
        .map((r) => ({ name: r.name, url: safeHref(r.url) }))
        .filter((r): r is RelatedSite => r.url !== null && /^https?:/.test(r.url)),
    } satisfies LayoutSite;
  },
  ["site-layout-v1"],
  { revalidate: CACHE_SECONDS, tags: ["site"] },
);

export async function getLayoutSite(): Promise<LayoutSite> {
  const r = await safely("머리말 · 바닥글", readLayout, null);
  if (!r) return { menus: null, info: null, related: null };
  return { ...r, related: r.related.length ? r.related : null };
}

// ── 메인 배너 · 팝업 ─────────────────────────────────────

export interface SiteBanner {
  bannerId: number;
  title: string;
  /** 설명 첫 줄 — 지금 배너의 윗줄 작은 문구 자리 (줄바꿈이 없으면 없음) */
  eyebrow: string | null;
  desc: string;
  href: string | null;
  /** 그림 주소 (?v= 로 길게 캐시) */
  image: string;
}

export interface SitePopup {
  popupId: number;
  title: string;
  href: string | null;
  image: string;
  /** 한국 날짜 YYYY-MM-DD — 메인은 1분마다 새로 만들어 오래된 화면이 나갈 수 있어 브라우저에서 한 번 더 거른다 */
  startDate: string;
  endDate: string;
}

const readMain = unstable_cache(
  async () => {
    const [banners, popups] = await Promise.all([readSiteBanners(), readActivePopups()]);
    return {
      banners: banners.map((b): SiteBanner => {
        const lines = (b.description ?? "").replace(/\r\n?/g, "\n").split("\n").map((l) => l.trim()).filter(Boolean);
        const [eyebrow, ...rest] = lines.length > 1 ? lines : [null, ...lines];
        return {
          bannerId: b.bannerId,
          title: b.title,
          eyebrow,
          desc: rest.join(" "),
          href: safeHref(b.linkUrl),
          image: `/site/images/banner/${b.bannerId}?v=${new Date(b.version).getTime()}`,
        };
      }),
      popups: popups.map(
        (p): SitePopup => ({
          popupId: p.popupId,
          title: p.title,
          href: safeHref(p.linkUrl),
          image: `/site/images/popup/${p.popupId}?v=${new Date(p.version).getTime()}`,
          // DATE 칸은 UTC 자정으로 읽히므로 날짜 부분만
          startDate: new Date(p.startDate).toISOString().slice(0, 10),
          endDate: new Date(p.endDate).toISOString().slice(0, 10),
        }),
      ),
    };
  },
  ["site-main-v2"],
  { revalidate: CACHE_SECONDS, tags: ["site"] },
);

/** 메인 배너(비면 null → 코드의 heroSlides) · 지금 띄울 팝업 */
export async function getMainSite(): Promise<{ banners: SiteBanner[] | null; popups: SitePopup[] }> {
  const r = await safely("메인 배너 · 팝업", readMain, null);
  return { banners: r?.banners.length ? r.banners : null, popups: r?.popups ?? [] };
}

// ── 약관 ─────────────────────────────────────────────────

export interface SiteTerm {
  title: string;
  content: string;
}

const readTerms = unstable_cache(
  async () => {
    const rows = await readSiteTerms();
    return Object.fromEntries(rows.filter((r) => r.content.trim()).map((r) => [r.kind, { title: r.title, content: r.content }]));
  },
  ["site-terms-v1"],
  { revalidate: CACHE_SECONDS, tags: ["site"] },
);

/** 종류별 최신 약관 — 없는 종류는 빠진다(그 화면은 지금 코드 안 문서를 그대로) */
export async function getSiteTerms(): Promise<Partial<Record<TermKind, SiteTerm>>> {
  return safely("약관", readTerms, {});
}
