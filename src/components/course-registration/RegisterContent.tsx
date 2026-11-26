"use client";

import { useEffect, useState, useSyncExternalStore, useTransition, type MouseEvent } from "react";
import { addToCart } from "@/app/course-registration/cart/actions";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useMobileMenu } from "@/components/layout/MobileMenuContext";
import { formatPrice, registerDiscount, sampleLectureHref, type RegisterCourse, type RegisterData } from "./courseData";
import { openPopup } from "@/components/my-classroom/PopupButton";
import Link from "next/link";
import ButtonTabs from "@/components/common/ButtonTabs";
import "@/styles/classroom.css";
import "@/styles/extra-pages.css";

const noopSubscribe = () => () => {};

type Course = RegisterCourse;

interface MajorPopupState {
  course: Course;
  top: number;
  left: number;
}

/** 전공구분 배지 · 마감 표시 — DB 과목은 전공구분 칸이 없어 마감 표시만, 둘 다 없으면 「-」 */
function CourseBadges({ course }: { course: Course }) {
  if (course.majorType.length === 0 && !course.statusLabel) return <span className="rg-badges">-</span>;
  return (
    <span className="rg-badges">
      {course.statusLabel && <span className="ds-badge ds-badge--neutral">{course.statusLabel}</span>}
      {course.majorType.map((type) => (
        <span key={type} className="ds-badge ds-badge--neutral">
          {type}
        </span>
      ))}
    </span>
  );
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

/**
 * 수강신청 (원본 register.html 본문 + 인라인 스크립트) — 디자인 시스템 표 · 탭 · 버튼.
 * 학기 · 과목은 data(LMS 학사일정 · 차수 · 과목, DB 가 없으면 샘플). 고르는 열쇠는 차수(class_id) — 장바구니 · 결제가 그대로 쓴다.
 */
export default function RegisterContent({ data }: { data: RegisterData }) {
  const { semesters, categoryTabs } = data;
  const [activeSemester, setActiveSemester] = useState(semesters[0]?.key ?? "");
  const [category, setCategory] = useState<string>("all");
  /** 고른 순서대로 쌓이는 과목 열쇠 (요약·플로팅 메뉴 순서) */
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [majorPopup, setMajorPopup] = useState<MajorPopupState | null>(null);
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const { isOpen: isSidebarOpen } = useMobileMenu();
  const router = useRouter();
  const [isAdding, startAdding] = useTransition();
  /**
   * 「장바구니」 — 고른 차수를 장바구니(회원별 DB)에 담고 장바구니 화면으로. 고른 게 없으면 그냥 장바구니로 간다.
   * 샘플(DB 없음)은 담지 않고 넘어가기만 한다.
   */
  const goCart = () => {
    const classIds = selectedCourses.map((c) => c.classId).filter((id): id is number => id !== null);
    if (classIds.length === 0) {
      router.push("/course-registration/cart");
      return;
    }
    startAdding(async () => {
      const result = await addToCart(classIds);
      // 장바구니는 회원별(DB) — 로그인하고 수강신청 화면으로 돌아와 다시 담는다
      if (result.needLogin) {
        alert(result.message);
        router.push(`/member/login?next=${encodeURIComponent("/course-registration/register")}`);
        return;
      }
      // 다 담았으면 조용히 넘어가고, 일부만 담았거나 못 담았으면 까닭을 알린다
      if (!result.ok || result.message !== "장바구니에 담았어요.") alert(result.message);
      if (result.ok) router.push("/course-registration/cart");
    });
  };

  /**
   * 「수강신청」 — 장바구니를 거치지 않고 고른 차수로 바로 결제하기 화면. 로그인 · 금액 확인은 결제하기 화면이 한다.
   * 샘플(DB 없음)은 결제하기 샘플 화면으로 넘어가기만 한다.
   */
  const goPayment = () => {
    if (data.source === "sample") {
      router.push("/course-registration/payment");
      return;
    }
    const classIds = selectedCourses.map((c) => c.classId).filter((id): id is number => id !== null);
    if (classIds.length === 0) {
      alert("수강신청할 과목을 골라 주세요.");
      return;
    }
    router.push(`/course-registration/payment?c=${classIds.join(".")}`);
  };

  // 이 학기에 열리는 과목 (샘플은 모든 학기 "*")
  const semesterCourses = data.courses.filter((c) => c.semesterKey === "*" || c.semesterKey === activeSemester);
  // 과목 구분 탭은 이 학기에 과목이 있는 것만
  const visibleTabs = categoryTabs.filter((t) => t.key === "all" || semesterCourses.some((c) => c.category === t.key));
  const filteredCourses = category === "all" ? semesterCourses : semesterCourses.filter((course) => course.category === category);
  const selectedCourses = selectedIds
    .map((id) => semesterCourses.find((course) => course.id === id))
    .filter((course): course is Course => course !== undefined);
  // 표에는 정가 합계, 할인액은 차수 할인가(DB sale_price) 차이 — 샘플은 원본 예시 규칙(3과목 30%)
  const totalPrice = selectedCourses.reduce((sum, course) => sum + (data.source === "db" ? course.listPrice : course.fee), 0);
  const discount =
    data.source === "db"
      ? selectedCourses.reduce((sum, course) => sum + (course.listPrice - course.fee), 0)
      : registerDiscount(selectedCourses.length, totalPrice);
  const isSelected = (course: Course) => selectedIds.includes(course.id);
  const selectable = filteredCourses.filter((course) => !course.closed);
  const allFilteredSelected = selectable.length > 0 && selectable.every(isSelected);

  const setCourseSelected = (course: Course, selected: boolean) =>
    setSelectedIds((prev) =>
      selected
        ? prev.includes(course.id) || course.closed
          ? prev
          : [...prev, course.id]
        : prev.filter((id) => id !== course.id),
    );

  // 원본: 강의계획서 전체선택은 지금 보이는 과목만 담거나 뺀다 (마감 과목은 담지 않는다)
  const setFilteredSelected = (selected: boolean) =>
    setSelectedIds((prev) => {
      const ids = selectable.map((course) => course.id);
      return selected ? [...prev, ...ids.filter((id) => !prev.includes(id))] : prev.filter((id) => !ids.includes(id));
    });

  // 학기를 바꾸면 고른 과목을 비운다 — 한 번에 한 학기만 신청
  const changeSemester = (key: string) => {
    setActiveSemester(key);
    setSelectedIds([]);
    setCategory("all");
    setMajorPopup(null);
  };

  const removeCourse = (course: Course) => {
    setCourseSelected(course, false);
    setMajorPopup(null); // 원본: 목록을 다시 그리면서 팝업도 닫힌다
  };

  const changeCategory = (next: string) => {
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

  const major = majorPopup?.course.majors ?? null;
  const activeSchedule = semesters.find((semester) => semester.key === activeSemester) ?? semesters[0];

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

          {/* 받는 학기가 없으면(관리자가 다음 학기를 아직 열지 않았으면) 안내만 */}
          {!activeSchedule ? (
            <section className="ex-section">
              <p className="ex-empty">
                지금은 수강신청을 받는 차수가 없어요.
                <br />
                다음 개강 일정은 학습지원센터 학사일정에서 확인해 주세요.
              </p>
            </section>
          ) : (
            <>
          {/* 개강 차수 · 학사일정 */}
          <section className="ex-section rg-semester">
            <ButtonTabs
              items={semesters.map((semester) => ({
                key: semester.key,
                label: (
                  <>
                    <span className="ds-tab-title">{semester.title}</span>
                    <span className="ds-tab-sub">{semester.openingNote}</span>
                  </>
                ),
              }))}
              active={activeSchedule.key}
              onSelect={changeSemester}
              className="ds-tabs-box--2line rg-semester-tabs"
              ariaLabel="개강 차수"
            />
            <dl className="rg-schedule" id={`tab-${activeSchedule.key}`}>
              {activeSchedule.rows.map((row) => (
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
            {/* 메인 공지사항 · 학사일정 · 실습공지와 같은 세그먼트 */}
            <ButtonTabs
              items={visibleTabs}
              active={category}
              onSelect={(key) => changeCategory(key)}
              className="ds-tabs-box--segment rg-category-tabs"
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
                    {filteredCourses.length === 0 && (
                      <tr>
                        <td colSpan={7} className="ex-empty">
                          이 차수에 열린 과목이 없어요.
                        </td>
                      </tr>
                    )}
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className={isSelected(course) ? "is-current" : undefined}>
                        <td className="rg-col-check">
                          <label className="ds-check">
                            <input
                              type="checkbox"
                              aria-label={course.closed ? `${course.name} 마감` : `${course.name} 선택`}
                              checked={isSelected(course)}
                              disabled={course.closed}
                              onChange={(e) => setCourseSelected(course, e.target.checked)}
                            />
                          </label>
                        </td>
                        <td className="is-left rg-name">{course.name}</td>
                        <td>
                          <CourseBadges course={course} />
                        </td>
                        <td>
                          {course.majors ? (
                            <button type="button" className="ds-btn ds-btn--secondary ds-btn--sm rg-major-btn" onClick={(e) => toggleMajorPopup(e, course)}>
                              전공보기
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="rg-fee">
                          {course.fee < course.listPrice && <del>{formatPrice(course.listPrice)}원</del>} {formatPrice(course.fee)}원
                        </td>
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
                  {filteredCourses.length === 0 && <li className="ex-empty">이 차수에 열린 과목이 없어요.</li>}
                  {filteredCourses.map((course) => (
                    <li key={course.id} className={`rg-card${isSelected(course) ? " is-selected" : ""}`}>
                      <div className="rg-card-head">
                        <label className="ds-check rg-card-check">
                          <input
                            type="checkbox"
                            checked={isSelected(course)}
                            disabled={course.closed}
                            onChange={(e) => setCourseSelected(course, e.target.checked)}
                          />
                          <span className="rg-card-name">{course.name}</span>
                        </label>
                        <span className="rg-card-fee">{formatPrice(course.fee)}원</span>
                      </div>
                      <div className="rg-card-foot">
                        <CourseBadges course={course} />
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
                      <PickedItem key={course.id} course={course} onRemove={() => removeCourse(course)} />
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
                {/* 「장바구니」는 고른 차수를 담고, 「수강신청」은 고른 차수로 바로 결제하기 화면 */}
                <div className="rg-side-btns">
                  <button type="button" className="ds-btn ds-btn--secondary ds-btn--lg" onClick={goCart} disabled={isAdding}>
                    장바구니
                  </button>
                  <button type="button" className="ds-btn ds-btn--primary ds-btn--lg" onClick={goPayment} disabled={isAdding}>
                    수강신청
                  </button>
                </div>
              </aside>
            </div>
          </section>
            </>
          )}
        </div>
      </main>

      {/* 휴대폰 아래 고정 메뉴 — 과목을 담으면 목록·합계까지, 사이드바가 열리면 숨김 */}
      <div className="rg-float" hidden={isSidebarOpen}>
        {selectedCourses.length > 0 && (
          <div className="rg-float-summary">
            <ul className="rg-picked">
              {selectedCourses.map((course) => (
                <PickedItem key={course.id} course={course} onRemove={() => removeCourse(course)} />
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
          <button type="button" className="ds-btn ds-btn--secondary ds-btn--lg" onClick={goCart} disabled={isAdding}>
            장바구니
          </button>
          <button type="button" className="ds-btn ds-btn--primary ds-btn--lg" onClick={goPayment} disabled={isAdding}>
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
