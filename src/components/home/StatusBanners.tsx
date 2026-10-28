import { courseOpenings } from "./homeData";

const MAIN_IMG = "/resources/images/main";
const MOBILE_IMG = "/resources/images/mobile";

/** 모바일 마감 배너 */
export function MobileDeadlineBanner() {
  return (
    <section className="mobile-deadline-banner">
      <div className="mobile-deadline-content">
        <img src={`${MOBILE_IMG}/mobile-alarm.png`} alt="알람" className="mobile-deadline-icon" />
        {/* TODO: 수강신청 마감일 기준 카운트다운 (원본도 고정 문구) */}
        <span className="mobile-deadline-text">
          <span className="mobile-deadline-text-bold">마감까지 남은시간 3</span>일 07:24:36:28
        </span>
      </div>
    </section>
  );
}

/** 모바일 개강반 카드 */
export function MobileCourseCards() {
  return (
    <section className="mobile-course-cards">
      {courseOpenings.map((course) => (
        <div key={course.date} className="mobile-course-card">
          <div className="mobile-course-card-content">
            <div className="mobile-course-semester">{course.semester}</div>
            <div className="mobile-course-date">
              <span className="mobile-course-date-bold">{course.date}</span> 개강반
            </div>
          </div>
          <div className="mobile-course-arrow">
            <img
              src={`${MOBILE_IMG}/mobile-arrow-right.png`}
              alt="화살표"
              className="mobile-course-arrow-img"
            />
          </div>
        </div>
      ))}
    </section>
  );
}

/** 학사 알림 배너 */
export function AcademicNotice() {
  return (
    <section className="academic-notice">
      <div className="academic-notice-container">
        <div className="notice-item">
          <img src={`${MAIN_IMG}/time.png`} alt="알람" className="notice-icon" />
          <span className="academic-notice-text">덧셈 학사알림</span>
        </div>
        <div className="notice-item">
          <span className="academic-notice-text academic-notice-text-bold">2025년 2학기 10기</span>
        </div>
        <div className="notice-divider"></div>
        <div className="notice-item">
          <img src={`${MAIN_IMG}/board.png`} alt="클립보드" className="notice-icon" />
          <span className="academic-notice-text">
            <span className="academic-notice-text-bold">수강신청</span> ~ 2025.10.14
          </span>
        </div>
        <div className="notice-item">
          <img src={`${MAIN_IMG}/pen.png`} alt="연필" className="notice-icon" />
          <span className="academic-notice-text">
            <span className="academic-notice-text-bold">학습기간</span> 2025.10.15 ~ 2026.01.27
          </span>
        </div>
      </div>
    </section>
  );
}
