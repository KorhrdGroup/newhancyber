import { courseOpenings, currentTerm } from "./homeData";

const MAIN_IMG = "/resources/images/main";
const MOBILE_IMG = "/resources/images/mobile";

/** 모바일 개강반 카드 */
export function MobileCourseCards() {
  return (
    <section className="mobile-course-cards">
      {courseOpenings.map((course) => (
        <div key={course.semester} className="mobile-course-card">
          <div className="mobile-course-card-content">
            <div className="mobile-course-semester">{course.semester}</div>
            <div className="mobile-course-date">
              {course.date ? (
                <>
                  <span className="mobile-course-date-bold">{course.date}</span> 개강
                </>
              ) : (
                <span className="mobile-course-date-muted">준비 중</span>
              )}
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
          <span className="academic-notice-text">한평생 학사알림</span>
        </div>
        <div className="notice-item">
          <span className="academic-notice-text academic-notice-text-bold">{currentTerm.name}</span>
        </div>
        <div className="notice-divider"></div>
        <div className="notice-item">
          <img src={`${MAIN_IMG}/board.png`} alt="클립보드" className="notice-icon" />
          <span className="academic-notice-text">
            <span className="academic-notice-text-bold">수강신청</span> {currentTerm.applyPeriod}
          </span>
        </div>
        <div className="notice-item">
          <img src={`${MAIN_IMG}/pen.png`} alt="연필" className="notice-icon" />
          <span className="academic-notice-text">
            <span className="academic-notice-text-bold">학습기간</span> {currentTerm.studyPeriod}
          </span>
        </div>
      </div>
    </section>
  );
}
