import { Fragment } from "react";

const steps = ["약관 동의", "정보 입력", "가입 완료"];

/** 회원가입 진행 단계 표시 (1 약관 동의 → 2 정보 입력 → 3 가입 완료) */
export default function SignupProgress({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="signup-progress">
      {steps.map((label, i) => {
        const step = i + 1;
        return (
          <Fragment key={label}>
            {i > 0 && (
              // 원본: 1단계 화면에서도 첫 번째 선은 active
              <div className={`progress-line${step <= Math.max(current, 2) ? " active" : ""}`}></div>
            )}
            <div className={`progress-step${step <= current ? " active" : ""}`}>
              <div className="step-number">{step}</div>
              <div className="step-label">{label}</div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
