import Link from "next/link";
import { TBD_HREF } from "@/lib/navigation";
import { CONTACT_EMAIL, REGISTRATION_PHONE, SUPPORT_PHONE } from "@/lib/contact";

/** 모바일 푸터 (회사 정보). 데스크톱 푸터는 480px 이하에서 숨겨진다. */
export default function MobileFooter({ className }: { className?: string }) {
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
        <p className="mobile-footer-address">주소: 경기도 의정부시 의정부동 486-11, 601호 일부</p>
        <p className="mobile-footer-contact">
          수강신청 문의: {REGISTRATION_PHONE} / 학습지원 문의: {SUPPORT_PHONE}
          <br />
          이메일: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        {/* 항목마다 span 으로 묶어 번호가 하이픈에서 끊기지 않게 한다 */}
        <p className="mobile-footer-business">
          <span>사업자명: (주)한평생그룹</span> / <span>대표자: 양병웅</span> /{" "}
          <span>개인정보보호책임자: 양병웅</span> / <span>사업자등록번호: 227-88-03196</span> /{" "}
          <span>통신판매신고: 제2024-서울도봉-0983호</span>
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
