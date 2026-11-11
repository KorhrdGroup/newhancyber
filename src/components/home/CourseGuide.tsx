import Link from "next/link";

const SUPPORT_IMG = "/resources/images/main/support";

const guides = [
  {
    tag: "자격증",
    title: "사회복지사 2급",
    desc: "학점은행제로 전공 과목과 현장실습을 이수하고 국가자격증을 받아요.",
    href: "/social-worker/info",
    icon: "support-tab2-002.png",
  },
  {
    tag: "학위",
    title: "전문학사 · 학사 학위",
    desc: "온라인 수업으로 학점을 모아 학위를 받아요. 학점 인정부터 학위 신청까지 안내해요.",
    href: "/credit-bank/info",
    icon: "support-tab3-006.png",
  },
  {
    tag: "실습",
    title: "현장실습",
    desc: "사회복지 · 보육 · 평생교육 · 한국어교원 실습을 기관 선정부터 서류 제출까지 도와드려요.",
    href: "/practice-support/notice",
    icon: "support-tab3-003.png",
  },
];

/** 과정 안내 — 목표별로 들어갈 곳을 고르게 한다 */
export default function CourseGuide() {
  return (
    <section className="course-guide-section">
      <div className="course-guide-container">
        <h3 className="course-guide-title">어떤 과정을 찾고 계세요?</h3>
        <p className="course-guide-sub">목표에 맞는 과정을 고르고, 1:1 학습설계로 가장 빠른 길을 찾아보세요.</p>
        <div className="course-guide-cards">
          {guides.map((g) => (
            <Link key={g.title} href={g.href} className="course-guide-card">
              <span className="course-guide-tag">{g.tag}</span>
              <strong className="course-guide-name">{g.title}</strong>
              <p className="course-guide-desc">{g.desc}</p>
              <span className="course-guide-more">자세히 보기 →</span>
              <img src={`${SUPPORT_IMG}/${g.icon}`} alt="" className="course-guide-icon" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
