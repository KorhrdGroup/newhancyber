import Link from "next/link";
import { learningSchedule } from "./homeData";
import NoticeBoard from "./NoticeBoard";

/** 학습일정 안내 + 공지사항 탭 */
export default function ScheduleNotice() {
  return (
    <section className="schedule-notice-section">
      <div className="schedule-notice-container">
        <div className="schedule-guide">
          <h3 className="schedule-title">
            <span className="schedule-title-sub">{learningSchedule.cohort}</span>
            <span className="schedule-title-main">학습일정 안내</span>
          </h3>
          <div className="schedule-list">
            {learningSchedule.items.map((item) =>
              item.highlight ? (
                <div key={item.label} className="schedule-item schedule-item-highlight">
                  <div className="schedule-item-content">
                    <span className="schedule-label">{item.label}</span>
                  </div>
                  <span className="schedule-date">{item.date}</span>
                </div>
              ) : (
                <div key={item.label} className="schedule-item">
                  <span className="schedule-label">{item.label}</span>
                  <span className="schedule-date">{item.date}</span>
                </div>
              ),
            )}
          </div>
          <Link href="/course-registration/register" className="schedule-btn">
            수강신청 바로가기
          </Link>
        </div>
        <NoticeBoard />
      </div>
    </section>
  );
}
