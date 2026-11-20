import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import { InfoTable, RefNotes } from "@/components/practice-support/PracticeParts";
import { findOrg, ORG_BASE_DATE, practiceOrgs } from "@/components/practice-support/orgData";
import "@/styles/learning-support.css";
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "실습기관 상세" };

/**
 * 원본 /stdSup/practiceOrgView.asp — 실습기관 한 곳의 정보 + 같은 시·군의 다른 기관.
 * TODO: API — 관리번호로 상세와 같은 시·군 기관을 조회 (지금은 목록 샘플 20곳 안에서 찾는다)
 */
export default async function PracticeOrganizationDetailPage({ params }: { params: Promise<{ no: string }> }) {
  const { no } = await params;
  const org = findOrg(no);
  if (!org) notFound();

  const near = practiceOrgs.filter((o) => o.city === org.city && o.no !== org.no);
  const mapHref = `https://map.naver.com/p/search/${encodeURIComponent(org.address)}`;

  return (
    <>
      <MobilePageBanner name="notice-detail" text="실습기관 안내" />
      <main className="wrapper">
        <div className="container lx-page lx-page--plain po-page po-view">
          <p className="po-view-cat">{org.city} · 사회복지현장실습 선정기관</p>
          <h1 className="page-title">{org.name}</h1>

          <InfoTable
            rows={[
              { label: "지역", lines: [org.city] },
              { label: "기관유형", lines: [org.orgType] },
              {
                label: "주소",
                lines: [
                  <span key="addr" className="po-addr">
                    {org.address}
                    <a className="ds-btn ds-btn--secondary ds-btn--sm" href={mapHref} target="_blank" rel="noopener noreferrer nofollow">
                      지도 보기
                    </a>
                  </span>,
                ],
              },
              { label: "연락처", lines: [<a key="tel" className="po-tel" href={`tel:${org.phone.replace(/-/g, "")}`}>{org.phone}</a>] },
              { label: "실습비", lines: [org.fee] },
              { label: "실습지도자", lines: [org.supervisors] },
              { label: "선정 유효기간", lines: [org.period] },
              { label: "선정 관리번호", lines: [org.no] },
            ]}
          />
          <RefNotes
            items={[
              `보건복지부 사회복지현장실습 선정기관 현황(기준일 ${ORG_BASE_DATE})을 바탕으로 한 안내입니다.`,
              <>
                실습 가능 여부·모집 시기·실습비는 바뀔 수 있으니 신청 전에 기관에 직접 확인해 주세요. 최신 선정 여부는{" "}
                <a href="https://www.welfare.net/lic/" target="_blank" rel="noopener noreferrer">
                  사회복지사 자격관리센터
                </a>
                에서 확인할 수 있습니다.
              </>,
            ]}
          />

          <div className="po-view-btns">
            <Link href={`/practice-support/organizations?area=${encodeURIComponent(org.area)}`} className="ds-btn ds-btn--primary">
              {org.area} 실습기관 목록
            </Link>
            <Link href="/practice-support/organizations" className="ds-btn ds-btn--secondary">
              전체 목록
            </Link>
          </div>

          {near.length > 0 && (
            <section className="lx-panel po-near">
              <h2 className="lx-section-title">{org.city}의 다른 실습기관</h2>
              <ul>
                {near.map((o) => (
                  <li key={o.no}>
                    <Link href={`/practice-support/organizations/${o.no}`}>{o.name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
