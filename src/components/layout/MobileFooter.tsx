import Link from "next/link";
import { TBD_HREF } from "@/lib/navigation";
import { CONTACT_EMAIL, REGISTRATION_PHONE, SUPPORT_PHONE } from "@/lib/contact";
import type { SiteInfo } from "@/lib/site";

/**
 * 모바일 푸터 (회사 정보). 데스크톱 푸터는 480px 이하에서 숨겨진다.
 * info: 관리자 「기본정보 관리」(site_info) — 없으면(null) 지금 코드 값.
 */
export default function MobileFooter({ className, info = null }: { className?: string; info?: SiteInfo | null }) {
  const v = {
    address: info?.address ?? "경기도 의정부시 의정부동 486-11, 601호 일부",
    enrollPhone: info?.enrollPhone ?? REGISTRATION_PHONE,
    supportPhone: info?.supportPhone ?? SUPPORT_PHONE,
    email: info?.email ?? CONTACT_EMAIL,
    companyName: info?.companyName ?? "(주)한평생그룹",
    ceoName: info?.ceoName ?? "양병웅",
    privacyOfficer: info?.privacyOfficer ?? "양병웅",
    businessNo: info?.businessNo ?? "227-88-03196",
    mailOrderNo: info?.mailOrderNo ?? "제2024-서울도봉-0983호",
  };
  return (
    <div className={["mobile-footer-section", className].filter(Boolean).join(" ")}>
      <div className="mobile-footer-content">
        <div className="mobile-footer-logo">
          <img
            src="/resources/images/mobile/mobile-footer-logo.png"
            alt="한평생원격교육원"
            className="mobile-footer-logo-img"
          />
        </div>
        {/* 회사 정보는 한사이버 푸터 내용 (데스크톱 푸터와 같음) */}
        <p className="mobile-footer-address">주소: {v.address}</p>
        <p className="mobile-footer-contact">
          수강신청 문의: {v.enrollPhone} / 학습지원 문의: {v.supportPhone}
          <br />
          이메일: <a href={`mailto:${v.email}`}>{v.email}</a>
        </p>
        {/* 항목마다 span 으로 묶어 번호가 하이픈에서 끊기지 않게 한다 */}
        <p className="mobile-footer-business">
          <span>사업자명: {v.companyName}</span> / <span>대표자: {v.ceoName}</span> /{" "}
          <span>개인정보보호책임자: {v.privacyOfficer}</span> / <span>사업자등록번호: {v.businessNo}</span> /{" "}
          <span>통신판매신고: {v.mailOrderNo}</span>
        </p>
        <p className="mobile-footer-copyright">COPYRIGHT 한평생원격교육원 ALL RIGHT RESERVED</p>
      </div>
      <div className="mobile-footer-links">
        <a href={TBD_HREF} className="mobile-footer-link">
          PC버전
        </a>
        <Link href="/footer/privacy" className="mobile-footer-link">
          개인정보처리방침
        </Link>
        <Link href="/footer/terms" className="mobile-footer-link">
          이용약관
        </Link>
      </div>
    </div>
  );
}
