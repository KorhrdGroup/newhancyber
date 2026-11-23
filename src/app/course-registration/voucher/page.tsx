import type { Metadata } from "next";
import Link from "next/link";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import {
  supportContacts,
  VOUCHER_SITE,
  voucherSteps,
  voucherTypes,
} from "@/components/course-registration/extra/extraData";
import "@/styles/classroom.css";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "평생교육바우처" };

/** 평생교육바우처 안내 (원본 /stdSup/longeduguide.asp) */
export default function CourseVoucherPage() {
  return (
    <>
      {/* 결제하기 · 장바구니와 같은 휴대폰 파란 제목 띠 (course-registration.css 의 mobile-cart-banner) */}
      <MobilePageBanner name="cart" text="평생교육바우처" />
      <main className="wrapper">
        <div className="ex-page ex-voucher">
          <div className="ex-page-head">
            <h1 className="ex-title">평생교육바우처</h1>
            <p className="ex-desc">나라에서 지원하는 평생교육이용권으로 수강료를 낼 수 있어요.</p>
          </div>

          <section className="ex-section">
            <div className="ex-hero">
              <img className="ex-hero-icon" src="/resources/images/credit-bank/cb-icon-hands.png" alt="" aria-hidden />
              <div>
                <p className="ex-hero-label">평생교육이용권</p>
                <p className="ex-hero-title">
                  1인당 연간 <em>35만원</em> 지원
                </p>
                <p className="ex-hero-desc">
                  배우고 싶은 성인 학습자가 평생교육 강좌를 들을 수 있도록 지원해요.
                  <br />
                  우수 이용자는 최대 70만원까지 받을 수 있어요.
                </p>
              </div>
            </div>
          </section>

          <section className="ex-section">
            <h2 className="ex-section-title">지원 대상과 금액</h2>
            <ul className="ex-vtypes">
              {voucherTypes.map((v) => (
                <li key={v.type} className="ex-vtype">
                  <h3 className="ex-vtype-name">{v.type}</h3>
                  <dl className="ex-vtype-info">
                    <div>
                      <dt>지원 대상</dt>
                      <dd>{v.target}</dd>
                    </div>
                    <div>
                      <dt>지원 금액</dt>
                      <dd className="is-amount">{v.amount}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
            <p className="ex-note">유형마다 사는 곳(주민등록등본상 주소지)의 광역 지자체 공고 조건도 함께 맞아야 해요.</p>
          </section>

          <section className="ex-section">
            <h2 className="ex-section-title">쓸 수 있는 곳</h2>
            <ul className="ex-uses">
              <li>
                <img src="/resources/images/credit-bank/cb-icon-tuition.png" alt="" aria-hidden />
                평생교육이용권 사용기관에 등록된 강좌의 수강료
              </li>
              <li>
                <img src="/resources/images/credit-bank/cb-icon-textbook-price.png" alt="" aria-hidden />
                해당 강좌의 교재비
              </li>
            </ul>
          </section>

          <section className="ex-section">
            <h2 className="ex-section-title">이용 방법</h2>
            {/* 무료학습설계 진행 순서처럼 연한 판 하나에 그림 + 점선 칸막이 + 화살표, 아래에 안내 문구 + 버튼 */}
            <div className="ex-vflow-box">
              <ol className="ex-vflow">
                {voucherSteps.map((step, i) => (
                  <li key={step.title}>
                    {i > 0 && <span className="ex-vflow-arrow" aria-hidden />}
                    <img className="ex-vflow-icon" src={step.icon} alt="" aria-hidden />
                    <div>
                      <p className="ex-vflow-title">
                        <span className="ex-vflow-num">{i + 1}</span>
                        {step.title}
                      </p>
                      <p className="ex-vflow-desc">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="ex-cta">
                <p className="ex-note">
                  신청 기간과 필요한 서류는 해마다 달라요.{" "}
                  <a href={VOUCHER_SITE} target="_blank" rel="noopener noreferrer">
                    평생교육이용권 누리집
                  </a>
                  에서 공고를 확인해 주세요.
                </p>
                <div className="ex-actions">
                  <a href={VOUCHER_SITE} target="_blank" rel="noopener noreferrer" className="ds-btn ds-btn--secondary ds-btn--lg">
                    평생교육이용권 신청하기
                  </a>
                  <Link href="/course-registration/register" className="ds-btn ds-btn--primary ds-btn--lg">
                    수강신청 하러 가기
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="ex-section">
            <div className="ex-help">
              <h2 className="ex-help-title">궁금한 점이 있으신가요?</h2>
              <dl className="ex-contacts">
                <div className="ex-contact">
                  <dt>수강신청 문의</dt>
                  <dd>
                    <a href={`tel:${supportContacts.registration}`}>{supportContacts.registration}</a>
                  </dd>
                </div>
                <div className="ex-contact">
                  <dt>학습지원 문의</dt>
                  <dd>
                    <a href={`tel:${supportContacts.learning}`}>{supportContacts.learning}</a>
                  </dd>
                </div>
                <div className="ex-contact">
                  <dt>이메일</dt>
                  <dd>
                    <a href={`mailto:${supportContacts.email}`}>{supportContacts.email}</a>
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
