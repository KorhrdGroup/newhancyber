import Link from "next/link";
import { TBD_HREF } from "@/lib/navigation";

export const CONTACT_PHONE = "02-2135-5126";

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
        <p className="mobile-footer-address">
          주소: 경기도 부천시 원미구 길주로 347, 2층 201호, 2023호 (중동)
        </p>
        <p className="mobile-footer-contact">
          대표전화: {CONTACT_PHONE} / 팩스: 00-0000-0000
          <br />
          평일: 09:00 ~ 18:00 / 점심시간 12:00~13:00 / 주말, 공휴일: 휴무
        </p>
        <p className="mobile-footer-business">
          (주)티엔글로벌 한평생원격교육원 / 대표자: 박미영, 김선종 / 사업자번호: 459-85-02930 /
          통신판매번호: 제2025-부천원미-1459호
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
