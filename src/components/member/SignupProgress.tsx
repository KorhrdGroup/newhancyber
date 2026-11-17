const steps = ["약관 동의", "정보 입력", "가입 완료"];

/** 회원가입 진행 단계 표시 (1 약관 동의 → 2 정보 입력 → 3 가입 완료) */
export default function SignupProgress({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="signup-steps">
      {steps.map((label, i) => {
        const step = i + 1;
        const state = step < current ? " is-done" : step === current ? " is-current" : "";
        return (
          <li key={label} className={`signup-step${state}`} aria-current={step === current ? "step" : undefined}>
            <span className="signup-step-num">{step}</span>
            <span className="signup-step-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
