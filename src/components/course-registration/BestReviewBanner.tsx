import { reviewPerson, titleCourse } from "@/components/course-registration/reviewData";
import "@/styles/best-review-banner.css";

const IMG = "/resources/images/course-registration/best";

/**
 * 베스트 수강후기(장학후기) 상세 맨 위 배너 (피그마 252:693). 학기 · 과정 · 이름은 제목에서 읽는다
 * (「[사회복지사] 2025-1학기 성적우수장학생 김지현 학습자 장학후기」 모양). 사진은 장학후기 썸네일 — 없으면 사진 자리를 뺀다.
 * DB 에 한 줄 소감 칸이 없어서 말풍선에는 과정 · 이름만 보인다.
 */
export default function BestReviewBanner({ title, photoSrc }: { title: string; photoSrc?: string }) {
  const { semester, semesterLabel, name } = reviewPerson(title);
  const course = titleCourse(title);
  const who = [semester, course && `${course} 과정`].filter(Boolean).join(" ");

  return (
    <section className="brb" aria-label="베스트 수강후기">
      <div className="brb-inner">
        <img className="brb-confetti" src={`${IMG}/confetti.webp`} alt="" />
        <div className="brb-content">
          <p className="brb-heading">
            <span className="brb-kicker">한평생원격교육원 {semesterLabel}</span>
            <strong className="brb-title">베스트 수강후기</strong>
          </p>
          <div className="brb-profile">
            {photoSrc && (
              <div className="brb-photo">
                <img className="brb-photo-img" src={photoSrc} alt={name ? `${name} 학습자` : "장학후기 사진"} />
                <img className="brb-laurel" src={`${IMG}/laurel.webp`} alt="" />
              </div>
            )}
            <div className="brb-bubble">
              {photoSrc && <img className="brb-bubble-tail" src={`${IMG}/bubble-tail.svg`} alt="" />}
              <p className="brb-who">
                {who && <span>{who}</span>}
                {/* 제목 모양이 달라 이름을 못 읽으면 제목을 그대로 — 길 수 있어 줄을 바꾼다 */}
                <strong style={name ? undefined : { whiteSpace: "normal" }}>{name ? `${name} 학습자님` : title}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
