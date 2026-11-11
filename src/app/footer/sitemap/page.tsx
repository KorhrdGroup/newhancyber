import type { Metadata } from "next";
import Link from "next/link";
import { isVisible } from "@/lib/navigation";
import type { NavLink } from "@/types/navigation";

export const metadata: Metadata = { title: "사이트맵" };

/**
 * 사이트맵 (원본 footer/sitemap.html 기준).
 * GNB 와 항목·문구가 조금 달라(나의 강의, 회원서비스 등) 따로 둔다.
 */
/** tight: 원본에서 <li><a> 를 한 줄로 써서 점과 글자 사이 공백이 없던 항목 */
type SitemapLink = NavLink & { tight?: boolean };

const sections: { title: string; links: SitemapLink[] }[] = [
  {
    title: "학점은행제",
    links: [
      { label: "학점은행제란", href: "/credit-bank/info" },
      { label: "행정절차 가이드", href: "/credit-bank/guide" },
      { label: "FAQ", href: "/credit-bank/faq" },
      { label: "주의사항", href: "/credit-bank/precautions" },
    ],
  },
  {
    title: "사회복지사",
    links: [
      { label: "사회복지사란?", href: "/social-worker/info" },
      { label: "급수별 자격요건", href: "/social-worker/requirements" },
      { label: "대상별 학습설계", href: "/social-worker/learning-design" },
      { label: "자격증 발급 안내", href: "/social-worker/certificate" },
    ],
  },
  {
    title: "실습지원",
    links: [
      { label: "실습공지사항", href: "/practice-support/notice" },
      { label: "서류제출", href: "/practice-support/documents" },
      { label: "FAQ", href: "/practice-support/faq" },
      { label: "사회복지사실습", href: "/practice-support/social-worker-practice" },
      { label: "보육교사실습", href: "/practice-support/childcare-teacher-practice" },
      { label: "한국어교원실습", href: "/practice-support/korean-teacher-practice" },
      { label: "평생교육 실습", href: "/practice-support/lifelong-educator-practice" },
    ],
  },
  {
    title: "학습지원",
    links: [
      { label: "공지사항", href: "/learning-support/notice" },
      { label: "관련기관 소식", href: "/learning-support/notice/news" },
      { label: "학사일정", href: "/learning-support/schedule" },
      { label: "연간 학사일정", href: "/learning-support/schedule/annual" },
      { label: "FAQ", href: "/learning-support/faq" },
      { label: "1:1 문의", href: "/learning-support/inquiry" },
      { label: "수강지원프로그램", href: "/learning-support/program" },
      { label: "학습자 OT", href: "/learning-support/program/ot" },
      { label: "모바일학습가이드", href: "/learning-support/mobile-guide" },
      { label: "공동인증서 안내", href: "/learning-support/mobile-guide/certificate" },
      { label: "원격지원", href: "/learning-support/remote-support" },
      { label: "서식자료실", href: "/learning-support/forms-data-room" },
    ],
  },
  {
    title: "나의 강의",
    links: [
      { label: "나의 강의실", tight: true, href: "/my-classroom" },
      { label: "나의 결제정보", tight: true, href: "/my-page/payments" },
      // 원본은 "#" — 페이지가 있어 연결
      { label: "장바구니", tight: true, href: "/course-registration/cart" },
      { label: "결제내역/환불요청", tight: true, href: "/my-page/payments/refund" },
      { label: "개인정보", tight: true, href: "/my-page/profile" },
      { label: "증명서발급", tight: true, href: "/my-page/certificates" },
      { label: "공결신청", tight: true, href: "/my-page/exceptions/absence" },
    ],
  },
  {
    title: "마이페이지",
    links: [
      { label: "증명서 발급", href: "/my-page/certificates" },
      { label: "쿠폰 사용내역", href: "/my-page/coupons" },
      { label: "문의 내역", href: "/my-page/inquiries" },
      { label: "학습 게시판", href: "/my-page/study-board" },
      { label: "설문조사", href: "/my-page/surveys" },
      { label: "각종 예외 신청", href: "/my-page/exceptions" },
      { label: "성적 이의신청", href: "/my-page/appeals" },
      { label: "학습자 PC 등록", href: "/my-page/pc" },
      { label: "내 정보 수정", href: "/my-page/profile" },
    ],
  },
  {
    title: "수강신청",
    links: [
      { label: "수강신청", href: "/course-registration/register" },
      { label: "수강신청 절차", href: "/course-registration/process" },
      { label: "수강후기", href: "/course-registration/reviews" },
      { label: "장학후기", href: "/course-registration/reviews/scholarship" },
      { label: "학습비 반환규정", href: "/course-registration/refund" },
      { label: "수강규정", href: "/course-registration/regulations" },
      { label: "무료학습설계", href: "/course-registration/learning-design" },
      { label: "평생교육바우처", href: "/course-registration/voucher" },
      { label: "이벤트", href: "/event" },
    ],
  },
  {
    title: "회원서비스",
    links: [
      // 원본은 "#" — 페이지가 있어 연결
      { label: "회원가입", tight: true, href: "/member/signup" },
      { label: "로그인", tight: true, href: "/member/login" },
      { label: "아이디/비밀번호찾기", tight: true, href: "/member/find-user" },
      { label: "개인정보처리방침", href: "/footer/privacy" },
      { label: "이용약관", tight: true, href: "/footer/terms" },
      { label: "운영규칙", href: "/footer/operating-rules" },
      { label: "이메일무단수집거부", href: "/footer/email-refusal" },
      { label: "불편사항접수", tight: true, href: "/footer/contact" },
    ],
  },
  {
    title: "교육원 소개",
    links: [
      { label: "인사말", href: "/footer/about#tab-greeting" },
      { label: "교육 이념", href: "/footer/about#tab-philosophy" },
      { label: "교육원 특징", href: "/footer/about#tab-features" },
      { label: "장학제도", href: "/footer/about#tab-scholarship" },
      { label: "오시는 길", href: "/footer/about#tab-directions" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <main className="wrapper">
      <div className="container">
        <div className="sitemap-grid">
          {sections.map((section) => (
            <div key={section.title} className="sitemap-card">
              <h2 className="sitemap-card-title">{section.title}</h2>
              <ul className="sitemap-card-list">
                {section.links.filter(isVisible).map((link) => (
                  <li key={link.label}>
                    {/* 원본 li 안 줄바꿈이 만들던 공백 — 점과 글자 사이 간격 */}
                    {!link.tight && " "}
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
