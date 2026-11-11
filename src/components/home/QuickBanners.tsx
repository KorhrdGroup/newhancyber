import Link from "next/link";
import { Fragment } from "react";
import { TBD_HREF } from "@/lib/navigation";
import { CONTACT_PHONE } from "./homeData";

const MAIN_IMG = "/resources/images/main";

/** 배너 화살표 (그림 대신 SVG) */
function BannerArrow() {
  return (
    <svg className="banner-card-arrow" width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
      <path d="M2 2l8 8-8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 수강신청·결제 배너 */
export function BannerSection() {
  return (
    <section className="banner-section">
      <div className="banner-container">
        <div className="banner-item">
          <Link href="/course-registration/register" className="banner-card banner-card--practice">
            <span className="banner-card-text">
              <span className="banner-card-label">실습반 모집</span>
              <span className="banner-card-title">
                사회복지사 실습 수강 신청
                <BannerArrow />
              </span>
            </span>
            <img src={`${MAIN_IMG}/banner-practice-illust.png`} alt="" className="banner-card-illust banner-card-illust--practice" />
          </Link>
        </div>
        {/* 결제 페이지 (데스크톱만) — 원본 주소 /payment 는 아직 없는 페이지 */}
        <div className="banner-item banner-item-payment">
          <Link href={TBD_HREF} className="banner-card banner-card--pay">
            <span className="banner-card-text">
              <span className="banner-card-label">장바구니</span>
              <span className="banner-card-title">
                수강료 결제하기
                <BannerArrow />
              </span>
            </span>
            <img src={`${MAIN_IMG}/banner-pay-illust.png`} alt="" className="banner-card-illust banner-card-illust--pay" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const contacts = [
  { title: "수강신청 / 학습상담", phone: CONTACT_PHONE },
  { title: "학습지원", phone: CONTACT_PHONE },
  { title: "시험오류 / 학습장애", phone: CONTACT_PHONE },
];

/** 운영시간·연락처 */
export function ContactInfo() {
  return (
    <section className="contact-info">
      <div className="contact-container">
        <div className="contact-item">
          <div className="contact-title contact-title-large">운영시간 평일 09:00 ~ 18:00</div>
          <div className="contact-subtitle">점심시간 12:00~13:00 제외, 주말/공휴일 휴무</div>
        </div>
        {contacts.map((contact) => (
          <Fragment key={contact.title}>
            <div className="contact-divider"></div>
            <div className="contact-item">
              <div className="contact-title">{contact.title}</div>
              <div className="contact-phone">{contact.phone}</div>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
