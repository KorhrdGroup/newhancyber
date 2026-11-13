/**
 * STEP 사이 연결선 — 점선 가운데 파란 동그라미 아래 화살표 (원본 wrapper_divider.png 를 코드로).
 * 원격지원 · 학습자 OT · 수강신청 절차가 함께 쓴다. 모양은 learning-extra.css 의 .lx-step-divider
 */
export default function StepDivider() {
  return (
    <div className="lx-step-divider" aria-hidden="true">
      <span className="lx-step-divider-icon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4.5 6.25 8 9.75l3.5-3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}
