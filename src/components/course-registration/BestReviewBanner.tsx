import {
  type CourseReview,
  reviewCourse,
  reviewPerson,
  SAMPLE_BEST_PHOTO,
  SAMPLE_BEST_QUOTE,
} from "@/components/course-registration/reviewData";
import "@/styles/best-review-banner.css";

const IMG = "/resources/images/course-registration/best";

/** 베스트 수강후기 상세 맨 위 배너 (피그마 252:693). 예전 통그림 대신 코드로 그려 학기·과정·이름을 글에 맞춘다 */
export default function BestReviewBanner({ review }: { review: CourseReview }) {
  const { semester, semesterLabel, name } = reviewPerson(review);

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
            <div className="brb-photo">
              <img className="brb-photo-img" src={SAMPLE_BEST_PHOTO} alt={`${name} 학습자`} />
              <img className="brb-laurel" src={`${IMG}/laurel.webp`} alt="" />
            </div>
            <div className="brb-bubble">
              <img className="brb-bubble-tail" src={`${IMG}/bubble-tail.svg`} alt="" />
              <p className="brb-who">
                <span>
                  {semester} {reviewCourse(review)} 과정
                </span>
                <strong>{name} 학습자님</strong>
              </p>
              <p className="brb-quote">{SAMPLE_BEST_QUOTE}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
