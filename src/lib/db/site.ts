import "server-only";
import { getPool, sql } from "./client";

/**
 * 홈페이지 관리 6개 표 (DB 027 — 관리자 「홈페이지 관리」가 고친다, 홈페이지는 읽기만).
 * 규칙은 newhancyber-db/sql/schema/027_portal.sql 맨 위 주석과 안내판 9장 11/23 요청 ①~⑪.
 * 이 파일은 DB 그대로 읽기만 하고, 검사 · 빈 표일 때 코드 값 쓰기 · 캐시는 src/lib/site.ts 가 한다.
 */

export interface SiteMenuRow {
  menuId: number;
  parentId: number | null;
  name: string;
  href: string;
  badge: string | null;
  isActive: boolean;
}

export async function readSiteMenus(): Promise<SiteMenuRow[]> {
  const pool = await getPool();
  const r = await pool.request().query<SiteMenuRow>(`
    SELECT menu_id AS menuId, parent_id AS parentId, name, href, badge, is_active AS isActive
    FROM dbo.site_menus ORDER BY sort_order, menu_id`);
  return r.recordset;
}

export interface SiteBannerRow {
  bannerId: number;
  title: string;
  description: string | null;
  linkUrl: string | null;
  /** 이미지 주소 ?v= 에 붙일 바뀐 때 (없으면 만든 때) */
  version: Date;
}

export async function readSiteBanners(): Promise<SiteBannerRow[]> {
  const pool = await getPool();
  const r = await pool.request().query<SiteBannerRow>(`
    SELECT banner_id AS bannerId, title, description, link_url AS linkUrl, COALESCE(updated_at, created_at) AS version
    FROM dbo.site_banners WHERE is_active = 1 ORDER BY sort_order, banner_id`);
  return r.recordset;
}

export const TERM_KINDS = ["이용약관", "개인정보 처리 방침", "개인정보 수집 및 이용 동의", "마케팅 수신 정보", "운영규칙"] as const;
export type TermKind = (typeof TERM_KINDS)[number];

export interface SiteTermRow {
  kind: TermKind;
  title: string;
  content: string;
}

/** 종류마다 사용 중인 것 가운데 가장 최근(term_id 큰 것) 하나 */
export async function readSiteTerms(): Promise<SiteTermRow[]> {
  const pool = await getPool();
  const r = await pool.request().query<SiteTermRow>(`
    SELECT kind, title, content FROM (
      SELECT kind, title, content, ROW_NUMBER() OVER (PARTITION BY kind ORDER BY term_id DESC) AS rn
      FROM dbo.site_terms WHERE is_active = 1
    ) t WHERE rn = 1`);
  return r.recordset;
}

export interface SiteRelatedRow {
  name: string;
  url: string;
}

export async function readRelatedSites(): Promise<SiteRelatedRow[]> {
  const pool = await getPool();
  const r = await pool.request().query<SiteRelatedRow>(`
    SELECT name, url FROM dbo.site_related_sites WHERE is_active = 1 ORDER BY sort_order, site_id`);
  return r.recordset;
}

export interface SiteInfoRow {
  ceoName: string;
  privacyOfficer: string;
  companyName: string;
  businessNo: string;
  mailOrderNo: string;
  address: string;
  enrollPhone: string;
  consultHours: string;
  lunchHours: string;
  supportPhone: string;
  supportHours: string;
  email: string;
  accountHolder: string;
  bankAccount: string;
}

export async function readSiteInfo(): Promise<SiteInfoRow | null> {
  const pool = await getPool();
  const r = await pool.request().query<SiteInfoRow>(`
    SELECT ceo_name AS ceoName, privacy_officer AS privacyOfficer, company_name AS companyName, business_no AS businessNo,
      mail_order_no AS mailOrderNo, address, enroll_phone AS enrollPhone, consult_hours AS consultHours, lunch_hours AS lunchHours,
      support_phone AS supportPhone, support_hours AS supportHours, email, account_holder AS accountHolder, bank_account AS bankAccount
    FROM dbo.site_info WHERE site_info_id = 1`);
  return r.recordset[0] ?? null;
}

export interface SitePopupRow {
  popupId: number;
  title: string;
  linkUrl: string | null;
  version: Date;
  startDate: Date;
  endDate: Date;
}

/** 사용 중이고 한국 날짜 오늘이 기간 안인 팝업 */
export async function readActivePopups(): Promise<SitePopupRow[]> {
  const pool = await getPool();
  const r = await pool.request().query<SitePopupRow>(`
    DECLARE @today DATE = CONVERT(DATE, DATEADD(HOUR, 9, SYSUTCDATETIME()));
    SELECT popup_id AS popupId, title, link_url AS linkUrl, COALESCE(updated_at, created_at) AS version,
      start_date AS startDate, end_date AS endDate
    FROM dbo.site_popups
    WHERE is_active = 1 AND start_date <= @today AND end_date >= @today
    ORDER BY sort_order, popup_id`);
  return r.recordset;
}

export interface SiteImage {
  data: Buffer;
  type: string;
}

/** 배너 · 팝업 그림 — 사용 중인 것만 */
export async function readSiteImage(kind: "banner" | "popup", id: number): Promise<SiteImage | null> {
  const pool = await getPool();
  const q =
    kind === "banner"
      ? `SELECT image AS data, image_type AS type FROM dbo.site_banners WHERE banner_id = @id AND is_active = 1`
      : `SELECT image AS data, image_type AS type FROM dbo.site_popups WHERE popup_id = @id AND is_active = 1`;
  const r = await pool.request().input("id", sql.Int, id).query<SiteImage>(q);
  return r.recordset[0] ?? null;
}
