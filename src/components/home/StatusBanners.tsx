import { courseOpenings, currentTerm } from "./homeData";

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

/** 학사 알림 줄 라인 아이콘 — 세 개 모두 같은 굵기 · 크기 · 색(글자색 currentColor) */
const NOTICE_ICONS = {
  alarm: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2" />
      <path d="M5 3 2 6" />
      <path d="m22 6-3-3" />
      <path d="M6.4 18.7 4 21" />
      <path d="M17.6 18.7 20 21" />
    </>
  ),
  clipboard: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </>
  ),
  pencil: (
    <>
      <path d="M21.2 6.8a2.8 2.8 0 0 0-4-4L3.8 16.2a2 2 0 0 0-.5.8L2 21.4a.5.5 0 0 0 .6.6L7 20.7a2 2 0 0 0 .8-.5z" />
      <path d="m15 5 4 4" />
    </>
  ),
};

function NoticeIcon({ name }: { name: keyof typeof NOTICE_ICONS }) {
  return (
    <svg
      className="notice-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {NOTICE_ICONS[name]}
    </svg>
  );
}

/** 학사 알림 배너 */
export function AcademicNotice() {
  return (
    <section className="academic-notice">
      <div className="academic-notice-container">
        <div className="notice-item">
          <NoticeIcon name="alarm" />
          <span className="academic-notice-text">한평생 학사알림</span>
        </div>
        <div className="notice-item">
          <span className="academic-notice-text academic-notice-text-bold">{currentTerm.name}</span>
        </div>
        <div className="notice-divider"></div>
        <div className="notice-item">
          <NoticeIcon name="clipboard" />
          <span className="academic-notice-text">
            <span className="academic-notice-text-bold">수강신청</span> {currentTerm.applyPeriod}
          </span>
        </div>
        <div className="notice-item">
          <NoticeIcon name="pencil" />
          <span className="academic-notice-text">
            <span className="academic-notice-text-bold">학습기간</span> {currentTerm.studyPeriod}
          </span>
        </div>
      </div>
    </section>
  );
}
