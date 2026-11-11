import type { Metadata } from "next";
import Link from "next/link";
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
    <main className="wrapper">
      <div className="ex-page ex-page--under-header">
        <h1 className="ex-title">평생교육바우처</h1>
        <p className="ex-desc">나라에서 지원하는 평생교육이용권으로 수강료를 낼 수 있어요.</p>

        <section className="ex-section">
          <div className="ex-hero">
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
        </section>

        <section className="ex-section">
          <h2 className="ex-section-title">지원 대상과 금액</h2>
          <table className="ds-table ex-rtable">
            <thead>
              <tr>
                <th>유형</th>
                <th>지원 대상</th>
                <th>지원 금액</th>
              </tr>
            </thead>
            <tbody>
              {voucherTypes.map((v) => (
                <tr key={v.type}>
                  <td className="ex-rtable-head">{v.type}</td>
                  <td className="is-left" data-label="지원 대상">
                    {v.target}
                  </td>
                  <td data-label="지원 금액">{v.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="ex-note">유형마다 사는 곳(주민등록등본상 주소지)의 광역 지자체 공고 조건도 함께 맞아야 해요.</p>
        </section>

        <section className="ex-section">
          <h2 className="ex-section-title">쓸 수 있는 곳</h2>
          <ul className="ex-list">
            <li>평생교육이용권 사용기관에 등록된 강좌의 수강료</li>
            <li>해당 강좌의 교재비</li>
          </ul>
        </section>

        <section className="ex-section">
          <h2 className="ex-section-title">이용 방법</h2>
          <ol className="ex-steps">
            {voucherSteps.map((step) => (
              <li key={step.title} className="ex-step">
                <p className="ex-step-title">{step.title}</p>
                <p className="ex-step-desc">{step.desc}</p>
              </li>
            ))}
          </ol>
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
        </section>

        <section className="ex-section">
          <h2 className="ex-section-title">문의</h2>
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
        </section>
      </div>
    </main>
  );
}
