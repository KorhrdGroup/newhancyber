import Link from "next/link";
import { footerLinks } from "@/lib/navigation";
import { CONTACT_EMAIL, REGISTRATION_PHONE, SUPPORT_PHONE } from "@/lib/contact";
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

/** 회사 정보 — 한사이버 푸터 내용. 한 줄씩 끊어 보여준다 */
const infoRows: [string, React.ReactNode][][] = [
  [
    ["대표자", "양병웅"],
    ["개인정보보호책임자", "양병웅"],
    ["사업자명", "(주)한평생그룹"],
    ["사업자등록번호", "227-88-03196"],
  ],
  [
    ["통신판매신고", "제2024-서울도봉-0983호"],
    ["주소", "경기도 의정부시 의정부동 486-11, 601호 일부"],
  ],
  [
    ["수강신청 문의", REGISTRATION_PHONE],
    ["학습지원 문의", SUPPORT_PHONE],
    ["이메일", <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>],
  ],
];

/** 한사이버 푸터 틀: 기관 로고 줄 + 링크 띠 + 로고·회사 정보 */
export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-auth">
          <div className="footer-container">
            <ul className="footer-auth-list">
              {authLogos.map((logo) => (
                <li key={logo.href}>
                  <a href={logo.href} target="_blank" rel="noopener noreferrer">
                    <img src={`${FOOTER_IMG}/${logo.src}`} alt={logo.alt} />
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
            {infoRows.map((rows, i) => (
              <ul key={i} className="footer-info-list">
                {rows.map(([label, value]) => (
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
      <PageMobileFooter />
    </>
  );
}
