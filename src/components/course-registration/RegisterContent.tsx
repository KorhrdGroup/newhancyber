"use client";

import { useEffect, useState, useSyncExternalStore, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useMobileMenu } from "@/components/layout/MobileMenuContext";
import {
  courseCategoryTabs,
  courses,
  formatPrice,
  majorInfo,
  registerDiscount,
  semesterSchedules,
  type Course,
  type CourseCategory,
} from "./courseData";
import MobilePaymentSummary from "./MobilePaymentSummary";

const noopSubscribe = () => () => {};

interface MajorPopupState {
  course: Course;
  top: number;
  left: number;
}

function ScheduleNote({ className }: { className: string }) {
  return (
    <div className={`register-schedule-note ${className}`}>
      <p>*수강신청 전 해당일정을 반드시 확인하시기 바랍니다.</p>
      <p>*학사일정은 교육원 사정에 따라 변경될 수 있습니다.</p>
    </div>
  );
}

/** 수강신청 (원본 register.html 본문 + 인라인 스크립트) */
export default function RegisterContent() {
  const [activeSemester, setActiveSemester] = useState(semesterSchedules[0].key);
  const [category, setCategory] = useState<CourseCategory | "all">("all");
  /** 고른 순서대로 쌓이는 과목 이름 (요약·플로팅 메뉴 순서) */
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [majorPopup, setMajorPopup] = useState<MajorPopupState | null>(null);
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const { isOpen: isSidebarOpen } = useMobileMenu();

  const filteredCourses = category === "all" ? courses : courses.filter((course) => course.category === category);
  const selectedCourses = selectedNames
    .map((name) => courses.find((course) => course.name === name))
    .filter((course): course is Course => course !== undefined);
  const totalPrice = selectedCourses.reduce((sum, course) => sum + course.fee, 0);
  const discount = registerDiscount(selectedCourses.length, totalPrice);
  const isSelected = (course: Course) => selectedNames.includes(course.name);
  const allFilteredSelected = filteredCourses.length > 0 && filteredCourses.every(isSelected);

  const setCourseSelected = (course: Course, selected: boolean) =>
    setSelectedNames((prev) =>
      selected
        ? prev.includes(course.name)
          ? prev
          : [...prev, course.name]
        : prev.filter((name) => name !== course.name),
    );

  // 원본: 강의계획서 전체선택은 지금 보이는 과목만 담거나 뺀다
  const setFilteredSelected = (selected: boolean) =>
    setSelectedNames((prev) => {
      const filteredNames = filteredCourses.map((course) => course.name);
      return selected
        ? [...prev, ...filteredNames.filter((name) => !prev.includes(name))]
        : prev.filter((name) => !filteredNames.includes(name));
    });

  const removeCourse = (course: Course) => {
    setCourseSelected(course, false);
    setMajorPopup(null); // 원본: 목록을 다시 그리면서 팝업도 닫힌다
  };

  const changeCategory = (next: CourseCategory | "all") => {
    setCategory(next);
    setMajorPopup(null);
  };

  // 전공보기: 열려 있으면 (어느 버튼이든) 닫고, 닫혀 있으면 버튼 오른쪽에 연다
  const toggleMajorPopup = (e: MouseEvent<HTMLButtonElement>, course: Course) => {
    e.stopPropagation();
    if (majorPopup) {
      setMajorPopup(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setMajorPopup({
      course,
      top: rect.top + window.scrollY + rect.height / 2,
      left: rect.left + window.scrollX + rect.width + 20,
    });
  };

  // 팝업 바깥을 누르면 닫기
  useEffect(() => {
    if (!majorPopup) return;
    const onClick = (e: globalThis.MouseEvent) => {
      if (!(e.target as Element).closest(".major-popup, .course-major-view-btn")) setMajorPopup(null);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [majorPopup]);

  const major = majorPopup ? majorInfo[majorPopup.course.category] : null;

  return (
    <>
      <main className="wrapper">
        <div className="mobile-register-title-banner">
          <h1 className="mobile-register-title">수강신청</h1>
        </div>

        <div className="container" style={{ backgroundColor: "#fff" }}>
          <div className="consultation-banner">
            <div className="consultation-banner-content">
              <p className="consultation-banner-title">
                잠깐! 전문 플래너의 무료 학습설계 받으신 후<br />
                수강신청 하세요!
              </p>
              {/* 원본도 동작 없음 — 무료학습설계(/course-registration/learning-design) 연결 여부 확인 필요 */}
              <button className="consultation-banner-button">
                상담신청 하러가기{" "}
                <span className="consultation-banner-arrow">
                  <img src="/resources/images/social-worker/mark.png" alt="arrow" />
                </span>
              </button>
            </div>
          </div>

          {/* 학사일정 탭 */}
          <div className="register-tabs-wrapper">
            <div className="register-tabs">
              <div className="register-tabs-nav">
                {semesterSchedules.map((semester) => (
                  <button
                    key={semester.key}
                    className={`register-tab-btn${semester.key === activeSemester ? " active" : ""}`}
                    onClick={() => setActiveSemester(semester.key)}
                  >
                    <span>{semester.title}</span>
                    <span>{semester.openingNote}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="register-tab-content">
              {semesterSchedules.map((semester) => (
                <div
                  key={semester.key}
                  id={`tab-${semester.key}`}
                  className={`register-tab-panel${semester.key === activeSemester ? " active" : ""}`}
                >
                  <div className="register-schedule-info">
                    <div className="register-schedule-row">
                      <div className="register-schedule-item">
                        <div className="register-schedule-label">개강일</div>
                        <div className="register-schedule-value">{semester.openingDate}</div>
                      </div>
                      <div className="register-schedule-item">
                        <div className="register-schedule-label">학점인정신청기간</div>
                        <div className="register-schedule-value">{semester.creditPeriod}</div>
                      </div>
                    </div>
                    <div className="register-schedule-row">
                      <div className="register-schedule-item">
                        <div className="register-schedule-label">학습기간</div>
                        <div className="register-schedule-value">{semester.learningPeriod}</div>
                      </div>
                      <div className="register-schedule-item">
                        <div className="register-schedule-label">학위신청기간</div>
                        <div className="register-schedule-value">{semester.degreePeriod}</div>
                      </div>
                    </div>
                    <div className="register-schedule-row">
                      <div className="register-schedule-item">
                        <div className="register-schedule-label">학위취득시기</div>
                        <div className="register-schedule-value">{semester.degreeDate}</div>
                      </div>
                      <ScheduleNote className="desktop-only" />
                    </div>
                  </div>
                  <ScheduleNote className="mobile-only" />
                </div>
              ))}
            </div>
          </div>

          {/* 과목 선택 */}
          <div className="course-selection-section">
            <div className="course-category-tabs">
              <div className="course-category-tabs-nav">
                {courseCategoryTabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`course-category-tab-btn${tab.key === category ? " active" : ""}`}
                    onClick={() => changeCategory(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 모바일 강의 카드 */}
            <div className="mobile-course-list">
              {filteredCourses.map((course) => (
                <div key={course.name} className="mobile-course-card">
                  <div className="mobile-course-card-header">
                    <div className="mobile-course-card-header-top">
                      <div className="mobile-course-icon">사</div>
                      <div className="mobile-course-title">{course.name}</div>
                    </div>
                    <div className="mobile-course-buttons">
                      <button className="mobile-course-sample-btn">샘플강의</button>
                      <button className="mobile-course-syllabus-btn">강의계획서</button>
                    </div>
                  </div>
                  <div className="mobile-course-footer">
                    <div className="mobile-course-price">
                      <span className="mobile-course-price-original">{formatPrice(course.fee)}원</span>
                      <span className="mobile-course-price-current">{formatPrice(course.fee)}원</span>
                    </div>
                    <input
                      type="checkbox"
                      className="mobile-course-checkbox"
                      checked={isSelected(course)}
                      onChange={(e) => setCourseSelected(course, e.target.checked)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <MobilePaymentSummary
              totalFee={`${formatPrice(totalPrice)}원`}
              discount={`-${formatPrice(discount)}원`}
              finalAmount={`${formatPrice(totalPrice - discount)}원`}
            />

            <div className="course-table-summary-wrapper">
              <div className="course-table-wrapper">
                <table className="course-table">
                  <thead>
                    <tr>
                      <th>과목명</th>
                      <th>전공구분</th>
                      <th>해당전공</th>
                      <th>수강료</th>
                      <th>샘플강의</th>
                      <th>
                        강의 계획서{" "}
                        <input
                          type="checkbox"
                          id="select-all-syllabus"
                          className="select-all-syllabus-checkbox"
                          checked={allFilteredSelected}
                          onChange={(e) => setFilteredSelected(e.target.checked)}
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course.name}>
                        <td className="course-name">{course.name}</td>
                        <td className="course-major-type">
                          {course.majorType.map((type) => (
                            <span key={type} className="course-major-badge">
                              {type}
                            </span>
                          ))}
                        </td>
                        <td style={{ position: "relative" }}>
                          <button className="course-major-view-btn" onClick={(e) => toggleMajorPopup(e, course)}>
                            전공보기
                          </button>
                        </td>
                        <td className="course-fee">{formatPrice(course.fee)}원</td>
                        <td>
                          <button className="course-sample-btn">샘플강의</button>
                        </td>
                        <td className="course-syllabus-cell">
                          <button className="course-syllabus-btn">강의계획서</button>
                          <input
                            type="checkbox"
                            className="course-syllabus-checkbox"
                            checked={isSelected(course)}
                            onChange={(e) => setCourseSelected(course, e.target.checked)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 선택된 과목 요약 */}
              <div className="course-summary">
                <div className="course-summary-list">
                  {selectedCourses.map((course) => (
                    <div key={course.name} className="course-summary-item">
                      <span className="course-summary-item-name">{course.name}</span>
                      <span className="course-summary-item-price">{formatPrice(course.fee)}원</span>
                      <button className="course-summary-item-remove" onClick={() => removeCourse(course)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="course-summary-footer">
                  <div className="course-summary-total">
                    <span className="course-summary-total-text">
                      총 <span className="course-count">{selectedCourses.length}</span> 과목
                    </span>
                    <span className="course-total-price">{formatPrice(totalPrice)}원</span>
                  </div>
                  {/* TODO: 장바구니 담기·수강신청 API */}
                  <div className="course-summary-buttons">
                    <button className="course-cart-btn">장바구니</button>
                    <button className="course-register-btn">수강신청</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 모바일 하단 플로팅 메뉴 — 과목을 담으면 요약까지(has-items), 사이드바가 열리면 숨김 */}
      <div
        className={`mobile-register-floating-menu active${selectedCourses.length > 0 ? " has-items" : ""}`}
        id="mobileRegisterFloatingMenu"
        style={isSidebarOpen ? { display: "none" } : undefined}
      >
        <div className="mobile-register-floating-summary">
          <div className="mobile-register-floating-courses">
            <div className="mobile-register-floating-courses-list">
              {selectedCourses.map((course) => (
                <div key={course.name} className="mobile-register-floating-course-item">
                  <span className="mobile-register-floating-course-name">{course.name}</span>
                  <span className="mobile-register-floating-course-price">{formatPrice(course.fee)}원</span>
                  <button className="mobile-register-floating-course-remove" onClick={() => removeCourse(course)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="mobile-register-floating-total">
              <span className="mobile-register-floating-count">
                총 <span className="mobile-course-count">{selectedCourses.length}</span> 과목
              </span>
              <span className="mobile-register-floating-price">{formatPrice(totalPrice)}원</span>
            </div>
          </div>
        </div>
        <div className="mobile-register-floating-buttons">
          <button className="mobile-register-cart-btn">장바구니</button>
          <button className="mobile-register-register-btn">수강신청</button>
        </div>
      </div>

      {/* 전공보기 팝업 — 원본처럼 body 에 붙여 버튼 위치 기준으로 띄운다 */}
      {isClient &&
        createPortal(
          <div
            className={`major-popup${majorPopup ? " show" : ""}`}
            id="major-popup"
            style={
              majorPopup
                ? { top: `${majorPopup.top}px`, left: `${majorPopup.left}px`, transform: "translateY(-50%)" }
                : undefined
            }
          >
            <div className="major-popup-content">
              <table className="major-popup-table">
                {major && (
                  <tbody>
                    <tr>
                      <td className="major-popup-title" rowSpan={2}>
                        관련
                        <br />
                        전공영역
                      </td>
                      <td className="major-popup-label" style={{ fontSize: "12px" }}>
                        학사
                      </td>
                      <td className="major-popup-value" style={{ fontSize: "12px" }}>
                        {major.bachelor}
                      </td>
                    </tr>
                    <tr>
                      <td className="major-popup-label" style={{ fontSize: "12px" }}>
                        전문 학사
                      </td>
                      <td className="major-popup-value" style={{ fontSize: "12px" }}>
                        {major.associate}
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
