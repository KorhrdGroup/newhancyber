import Link from "next/link";
import { footerLinks } from "@/lib/navigation";
import { CONTACT_EMAIL, REGISTRATION_PHONE, SUPPORT_PHONE } from "@/lib/contact";
import type { RelatedSite, SiteInfo } from "@/lib/site";
import PageMobileFooter from "./PageMobileFooter";

const FOOTER_IMG = "/resources/images/footer";

/** 인증·관련 기관 로고 (한사이버 푸터와 같음) */
const authLogos = [
  { href: "https://www.moe.go.kr", alt: "교육부", src: "auth-logo-01.png" },
  { href: "https://www.nile.or.kr", alt: "국가평생교육진흥원", src: "auth-logo-02.png" },
  { href: "https://www.cb.or.kr", alt: "학점은행제", src: "auth-logo-03.png" },
  { href: "https://www.lllcard.kr", alt: "평생교육이용권", src: "auth-logo-04.png" },
  { href: "https://www.kosaf.go.kr", alt: "한국장학재단", src: "auth-logo-05.png" },
];

/** 관련 사이트 주소에 맞는 지금 로고 (호스트가 같으면) — 없으면 null */
function logoFor(url: string): string | null {
  const host = (u: string) => {
    try {
      return new URL(u).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  };
  return authLogos.find((l) => host(l.href) === host(url))?.src ?? null;
}

/** 회사 정보 — 관리자 「기본정보 관리」(site_info)가 없을 때 쓰는 지금 값 (한사이버 푸터 내용) */
const CODE_INFO = {
  ceoName: "양병웅",
  privacyOfficer: "양병웅",
  companyName: "(주)한평생그룹",
  businessNo: "227-88-03196",
  mailOrderNo: "제2024-서울도봉-0983호",
  address: "경기도 의정부시 의정부동 486-11, 601호 일부",
  enrollPhone: REGISTRATION_PHONE,
  supportPhone: SUPPORT_PHONE,
  email: CONTACT_EMAIL,
  accountHolder: "",
  bankAccount: null as string | null,
};

/** 회사 정보를 한 줄씩 끊어 보여준다. 입금계좌는 관리자가 채웠을 때만 (안내판 ⑨) */
function infoRows(info: Pick<SiteInfo, keyof typeof CODE_INFO>): [string, React.ReactNode][][] {
  return [
    [
      ["대표자", info.ceoName],
      ["개인정보보호책임자", info.privacyOfficer],
      ["사업자명", info.companyName],
      ["사업자등록번호", info.businessNo],
    ],
    [
      ["통신판매신고", info.mailOrderNo],
      ["주소", info.address],
    ],
    [
      ["수강신청 문의", info.enrollPhone],
      ["학습지원 문의", info.supportPhone],
      ["이메일", <a key="email" href={`mailto:${info.email}`}>{info.email}</a>],
    ],
    ...(info.bankAccount
      ? [[["입금계좌", info.accountHolder ? `${info.bankAccount} (예금주 ${info.accountHolder})` : info.bankAccount]] as [string, React.ReactNode][]]
      : []),
  ];
}

/** 한사이버 푸터 틀: 기관 로고 줄 + 링크 띠 + 로고·회사 정보 */
/**
 * info · related: 관리자 「기본정보 관리」 · 「관련 사이트 관리」(DB 027) — 비어 있으면(null) 지금 코드 값.
 * 관련 사이트는 주소가 같은 기관이면 지금 로고를, 로고가 없는 새 기관은 글자로 보인다 (안내판 ⑧).
 */
export default function Footer({ info, related }: { info: SiteInfo | null; related: RelatedSite[] | null }) {
  const rows = infoRows(info ?? CODE_INFO);
  const sites = related
    ? related.map((r) => ({ href: r.url, alt: r.name, src: logoFor(r.url) }))
    : authLogos;
  return (
    <>
      <footer className="footer">
        <div className="footer-auth">
          <div className="footer-container">
            <ul className="footer-auth-list">
              {sites.map((logo, i) => (
                <li key={`${i}-${logo.href}`}>
                  <a href={logo.href} target="_blank" rel="noopener noreferrer">
                    {logo.src ? (
                      <img src={`${FOOTER_IMG}/${logo.src}`} alt={logo.alt} />
                    ) : (
                      <span className="footer-auth-text">{logo.alt}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-menu">
          <div className="footer-container">
            <ul className="footer-links">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={link.href === "/footer/privacy" ? "is-strong" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-info">
          <div className="footer-container">
            <img src="/resources/images/header/logo-main.png" alt="한평생원격교육원" className="footer-logo" />
            {rows.map((line, i) => (
              <ul key={i} className="footer-info-list">
                {line.map(([label, value]) => (
                  <li key={label}>
                    {label} : {value}
                  </li>
                ))}
              </ul>
            ))}
            <p className="footer-copyright">COPYRIGHT 한평생원격교육원 ALL RIGHT RESERVED</p>
          </div>
        </div>
      </footer>
      <PageMobileFooter info={info} />
    </>
  );
}
