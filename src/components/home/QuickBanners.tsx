import Link from "next/link";
import { Fragment } from "react";
import { TBD_HREF } from "@/lib/navigation";
import { CONTACT_PHONE } from "./homeData";

const MAIN_IMG = "/resources/images/main";
const MOBILE_IMG = "/resources/images/mobile";

/** 수강신청·결제 배너 */
export function BannerSection() {
  return (
    <section className="banner-section">
      <div className="banner-container">
        <div className="banner-item">
          <Link href="/course-registration/register" className="banner-link">
            <img
              src={`${MAIN_IMG}/banner_classform.png`}
              alt="실습반 모집"
              className="banner-image banner-image-desktop"
            />
            <img
              src={`${MOBILE_IMG}/mobile-banner-practice.png`}
              alt="사회복지사 실습수강신청"
              className="banner-image banner-image-mobile"
            />
          </Link>
        </div>
        {/* 결제 페이지 (데스크톱만) — 원본 주소 /payment 는 아직 없는 페이지 */}
        <div className="banner-item banner-item-payment">
          <Link href={TBD_HREF} className="banner-link">
            <img src={`${MAIN_IMG}/banner_pay.png`} alt="수강료 결제하기" className="banner-image" />
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
