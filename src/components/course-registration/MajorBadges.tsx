import { findCourseByName } from "./courseData";

/** 장바구니 · 결제하기 과목 옆 전공구분 배지 — 수강신청 과목 표와 같은 기준(과목 이름으로 찾음) */
export default function MajorBadges({ name }: { name: string }) {
  const types = findCourseByName(name)?.majorType ?? [];
  if (types.length === 0) return null;
  return (
    <span className="ex-order-badges">
      {types.map((type) => (
        <span key={type} className="ds-badge ds-badge--neutral">
          {type}
        </span>
      ))}
    </span>
  );
}
