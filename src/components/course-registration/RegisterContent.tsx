"use client";

import { useEffect, useState, useSyncExternalStore, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useMobileMenu } from "@/components/layout/MobileMenuContext";
import {
  courseCategoryTabs,
  courses,
  formatPrice,
  majorInfo,
  registerDiscount,
  sampleLectureHref,
  semesterSchedules,
  type Course,
  type CourseCategory,
} from "./courseData";
import { openPopup } from "@/components/my-classroom/PopupButton";
import Link from "next/link";
import ButtonTabs from "@/components/common/ButtonTabs";
import "@/styles/classroom.css";
import "@/styles/extra-pages.css";

const noopSubscribe = () => () => {};

interface MajorPopupState {
  course: Course;
  top: number;
  left: number;
}

/** 고른 과목 한 줄: 이름 · 수강료 · 빼기 (PC 요약 상자와 휴대폰 아래 메뉴가 같이 쓴다) */
function PickedItem({ course, onRemove }: { course: Course; onRemove: () => void }) {
  return (
    <li className="rg-picked-item">
      <span className="rg-picked-name">{course.name}</span>
      <span className="rg-picked-price">{formatPrice(course.fee)}원</span>
      <button type="button" className="rg-picked-remove" aria-label={`${course.name} 빼기`} onClick={onRemove}>
        ×
      </button>
    </li>
  );
}

/** 수강신청 (원본 register.html 본문 + 인라인 스크립트) — 디자인 시스템 표 · 탭 · 버튼 */
export default function RegisterContent() {
  const [activeSemester, setActiveSemester] = useState(semesterSchedules[0].key);
  const [category, setCategory] = useState<CourseCategory | "all">("all");
  /** 고른 순서대로 쌓이는 과목 이름 (요약·플로팅 메뉴 순서) */
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [majorPopup, setMajorPopup] = useState<MajorPopupState | null>(null);
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const { isOpen: isSidebarOpen } = useMobileMenu();
  const router = useRouter();
  // TODO: 고른 과목(selectedCourses)을 장바구니에 담는 API
  const goCart = () => router.push("/course-registration/cart");

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
      if (!(e.target as Element).closest(".rg-major, .rg-major-btn")) setMajorPopup(null);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [majorPopup]);

  const major = majorPopup ? majorInfo[majorPopup.course.category] : null;
  const activeSchedule = semesterSchedules.find((semester) => semester.key === activeSemester) ?? semesterSchedules[0];
  const scheduleRows = [
    { label: "개강일", value: activeSchedule.openingDate },
    { label: "학점인정신청기간", value: activeSchedule.creditPeriod },
    { label: "학습기간", value: activeSchedule.learningPeriod },
    { label: "학위신청기간", value: activeSchedule.degreePeriod },
    { label: "학위취득시기", value: activeSchedule.degreeDate },
  ];

  return (
    <>
      <main className="wrapper">
        <div className="ex-page rg-page">
          <div className="ex-page-head">
            <h1 className="ex-title">수강신청</h1>
            <p className="ex-desc">개강 차수와 일정을 확인한 뒤 들을 과목을 골라 주세요.</p>
          </div>

          <div className="rg-banner">
            <p className="rg-banner-text">
              <strong>잠깐! 전문 플래너의 무료 학습설계</strong>를 받으신 후 수강신청 하세요!
            </p>
            <Link href="/course-registration/learning-design" className="ds-btn ds-btn--primary">
              무료 학습설계 신청하기
            </Link>
          </div>

          {/* 개강 차수 · 학사일정 */}
          <section className="ex-section rg-semester">
            <ButtonTabs
              items={semesterSchedules.map((semester) => ({
                key: semester.key,
                label: (
                  <>
                    <span className="ds-tab-title">{semester.title}</span>
                    <span className="ds-tab-sub">{semester.openingNote.replace(/[()]/g, "")}</span>
                  </>
                ),
              }))}
              active={activeSemester}
              onSelect={setActiveSemester}
              className="ds-tabs-box--2line"
              ariaLabel="개강 차수"
            />
            <dl className="rg-schedule" id={`tab-${activeSchedule.key}`}>
              {scheduleRows.map((row) => (
                <div key={row.label} className="rg-schedule-item">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <ul className="rg-notes">
              <li>수강신청 전 해당 일정을 반드시 확인하시기 바랍니다.</li>
              <li>학사일정은 교육원 사정에 따라 변경될 수 있습니다.</li>
            </ul>
          </section>

          {/* 과목 선택 */}
          <section className="ex-section">
            <h2 className="ex-section-title">과목 선택</h2>
            <ButtonTabs
              items={courseCategoryTabs}
              active={category}
              onSelect={(key) => changeCategory(key as CourseCategory | "all")}
              className="rg-category-tabs"
              ariaLabel="과목 구분"
            />

            <div className="ex-pay rg-layout">
              <div className="rg-main">
                {/* PC 과목 표 */}
                <table className="ds-table rg-table">
                  <thead>
                    <tr>
                      <th className="rg-col-check">
                        <label className="ds-check">
                          <input
                            type="checkbox"
                            aria-label="보이는 과목 모두 선택"
                            checked={allFilteredSelected}
                            onChange={(e) => setFilteredSelected(e.target.checked)}
                          />
                        </label>
                      </th>
                      <th className="is-left">과목명</th>
                      <th>전공구분</th>
                      <th>해당전공</th>
                      <th>수강료</th>
                      <th>샘플강의</th>
                      <th>강의계획서</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course.name} className={isSelected(course) ? "is-current" : undefined}>
                        <td className="rg-col-check">
                          <label className="ds-check">
                            <input
                              type="checkbox"
                              aria-label={`${course.name} 선택`}
                              checked={isSelected(course)}
                              onChange={(e) => setCourseSelected(course, e.target.checked)}
                            />
                          </label>
                        </td>
                        <td className="is-left rg-name">{course.name}</td>
                        <td>
                          <span className="rg-badges">
                            {course.majorType.map((type) => (
                              <span key={type} className="ds-badge ds-badge--neutral">
                                {type}
                              </span>
                            ))}
                          </span>
                        </td>
                        <td>
                          <button type="button" className="ds-btn ds-btn--secondary ds-btn--sm rg-major-btn" onClick={(e) => toggleMajorPopup(e, course)}>
                            전공보기
                          </button>
                        </td>
                        <td className="rg-fee">{formatPrice(course.fee)}원</td>
                        <td>
                          <button type="button" className="ds-btn ds-btn--secondary ds-btn--sm" onClick={() => openPopup(sampleLectureHref(course.name))}>
                            샘플강의
                          </button>
                        </td>
                        <td>
                          {/* TODO: 강의계획서 팝업 연결 */}
                          <button type="button" className="ds-btn ds-btn--secondary ds-btn--sm">
                            강의계획서
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* 휴대폰 과목 카드 */}
                <ul className="rg-cards">
                  {filteredCourses.map((course) => (
                    <li key={course.name} className={`rg-card${isSelected(course) ? " is-selected" : ""}`}>
                      <div className="rg-card-head">
                        <label className="ds-check rg-card-check">
                          <input
                            type="checkbox"
                            checked={isSelected(course)}
                            onChange={(e) => setCourseSelected(course, e.target.checked)}
                          />
                          <span className="rg-card-name">{course.name}</span>
                        </label>
                        <span className="rg-card-fee">{formatPrice(course.fee)}원</span>
                      </div>
                      <div className="rg-card-foot">
                        <span className="rg-badges">
                          {course.majorType.map((type) => (
                            <span key={type} className="ds-badge ds-badge--neutral">
                              {type}
                            </span>
                          ))}
                        </span>
                        <span className="rg-card-btns">
                          <button type="button" className="ds-btn ds-btn--secondary ds-btn--sm" onClick={() => openPopup(sampleLectureHref(course.name))}>
                            샘플강의
                          </button>
                          <button type="button" className="ds-btn ds-btn--secondary ds-btn--sm">
                            강의계획서
                          </button>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 고른 과목 요약 (휴대폰은 금액만, 목록·버튼은 아래 메뉴) */}
              <aside className="ex-pay-side ex-box rg-side" aria-label="고른 과목">
                <h3 className="ex-section-title rg-side-title">고른 과목</h3>
                {selectedCourses.length > 0 ? (
                  <ul className="rg-picked">
                    {selectedCourses.map((course) => (
                      <PickedItem key={course.name} course={course} onRemove={() => removeCourse(course)} />
                    ))}
                  </ul>
                ) : (
                  <p className="rg-picked-empty">과목을 고르면 여기에 담겨요.</p>
                )}
                <div className="ex-sum">
                  <div className="ex-sum-row">
                    <span>총 수강료 ({selectedCourses.length}과목)</span>
                    <strong>{formatPrice(totalPrice)}원</strong>
                  </div>
                  <div className="ex-sum-row">
                    <span>총 할인액</span>
                    <strong className={discount > 0 ? "is-discount" : undefined}>-{formatPrice(discount)}원</strong>
                  </div>
                  <div className="ex-sum-total">
                    <span>총 결제 예정 금액</span>
                    <strong>{formatPrice(totalPrice - discount)}원</strong>
                  </div>
                </div>
                {/* TODO: 장바구니 담기·수강신청 API — 지금은 담지 않고 장바구니 화면으로만 넘어감 */}
                <div className="rg-side-btns">
                  <button type="button" className="ds-btn ds-btn--secondary ds-btn--lg" onClick={goCart}>
                    장바구니
                  </button>
                  <button type="button" className="ds-btn ds-btn--primary ds-btn--lg">
                    수강신청
                  </button>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </main>

      {/* 휴대폰 아래 고정 메뉴 — 과목을 담으면 목록·합계까지, 사이드바가 열리면 숨김 */}
      <div className="rg-float" hidden={isSidebarOpen}>
        {selectedCourses.length > 0 && (
          <div className="rg-float-summary">
            <ul className="rg-picked">
              {selectedCourses.map((course) => (
                <PickedItem key={course.name} course={course} onRemove={() => removeCourse(course)} />
              ))}
            </ul>
            <div className="rg-float-total">
              <span>
                총 <strong>{selectedCourses.length}</strong>과목
              </span>
              <strong>{formatPrice(totalPrice)}원</strong>
            </div>
          </div>
        )}
        <div className="rg-float-btns">
          <button type="button" className="ds-btn ds-btn--secondary ds-btn--lg" onClick={goCart}>
            장바구니
          </button>
          <button type="button" className="ds-btn ds-btn--primary ds-btn--lg">
            수강신청
          </button>
        </div>
      </div>

      {/* 전공보기 팝업 — 원본처럼 body 에 붙여 버튼 위치 기준으로 띄운다 */}
      {isClient &&
        majorPopup &&
        major &&
        createPortal(
          <div className="rg-major" role="dialog" aria-label={`${majorPopup.course.name} 관련 전공영역`} style={{ top: `${majorPopup.top}px`, left: `${majorPopup.left}px` }}>
            <p className="rg-major-title">관련 전공영역</p>
            <table className="ds-table ds-table--info">
              <tbody>
                <tr>
                  <th scope="row">학사</th>
                  <td>{major.bachelor}</td>
                </tr>
                <tr>
                  <th scope="row">전문 학사</th>
                  <td>{major.associate}</td>
                </tr>
              </tbody>
            </table>
          </div>,
          document.body,
        )}
    </>
  );
}
