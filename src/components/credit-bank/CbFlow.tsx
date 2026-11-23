/**
 * 학점은행제 안내의 단계 그림을 코드로 그린다 (Figma 시안 '학점은행제' 섹션의 wrapper_graphic).
 * 3D 아이콘만 그림 파일(cb-icon-*.png)이고, 글자·구분 점선·동그라미 표시는 모두 코드.
 */

const ICON = "/resources/images/credit-bank";

/** 연한 파랑 동그라미 표시 (+ · 오른쪽 화살표 · 아래 화살표) */
export function CbMark({ kind }: { kind: "plus" | "right" | "down" }) {
  return (
    <span className={`cb-mark cb-mark--${kind}`} aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill="currentColor" />
        {kind === "plus" ? (
          <path d="M10 5.5v9M5.5 10h9" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M8.2 6.2 12 10l-3.8 3.8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </span>
  );
}

export interface CbFlowItem {
  /** 아이콘 이름 (cb-icon-{icon}.png) */
  icon: string;
  label: string;
}

/**
 * 아이콘 + 이름이 옆으로 이어지는 흐름 (예: 학교에서의 학습경험 + 다양한 형태의 학습과 자격 › 학점 인정 › 학위 수여).
 * joins[i] 는 i번째와 i+1번째 사이: "plus" 는 + 표시만, "arrow" 는 점선 위에 › 표시.
 * 폰에서는 한 줄에 하나씩 쌓고 사이 표시를 아래 방향으로 돌린다.
 */
export function CbIconFlow({ items, joins, size = "md" }: { items: CbFlowItem[]; joins: ("plus" | "arrow")[]; size?: "md" | "lg" }) {
  return (
    <ol className={`cb-flow cb-flow--${size}`}>
      {items.map((item, i) => (
        <li key={item.label} className="cb-flow-item">
          {i > 0 && (
            <span className={`cb-flow-join cb-flow-join--${joins[i - 1]}`}>
              <CbMark kind={joins[i - 1] === "plus" ? "plus" : "right"} />
            </span>
          )}
          <div className="cb-flow-card">
            <img src={`${ICON}/cb-icon-${item.icon}.png`} alt="" className="cb-flow-icon" />
            <span className="cb-flow-label">{item.label}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** 아이콘 + 두 줄 설명 격자 (이용대상). 넓은 화면 4열, 폰 2열, 칸 사이는 점선 */
export function CbIconGrid({ items }: { items: { icon: string; lines: [string, string] }[] }) {
  return (
    <ul className="cb-grid">
      {items.map((item) => (
        <li key={item.icon} className="cb-grid-item">
          <img src={`${ICON}/cb-icon-${item.icon}.png`} alt="" className="cb-grid-icon" />
          <span className="cb-grid-label">
            {item.lines[0]}
            <br />
            {item.lines[1]}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** 학점은행제 흐름도: STEP 1~4 글자 흐름 → 아래 표시 → STEP 5 (학위 / 자격증 / 시험 응시 자격 중 하나) */
export function CbStepFlow({
  steps,
  finals,
}: {
  steps: CbFlowItem[];
  finals: CbFlowItem[];
}) {
  return (
    <div className="cb-steps">
      <ol className="cb-steps-row">
        {steps.map((item, i) => (
          <li key={item.label} className="cb-steps-col">
            <span className="cb-steps-seg">STEP {i + 1}</span>
            <div className="cb-steps-card">
              <img src={`${ICON}/cb-icon-${item.icon}.png`} alt="" className="cb-steps-icon" />
              <span className="cb-steps-label">{item.label}</span>
            </div>
          </li>
        ))}
        {/* 마지막 단계: 셋 중 하나 */}
        <li className="cb-steps-col cb-steps-col--final">
          <span className="cb-steps-seg">STEP {steps.length + 1}</span>
          <ul className="cb-steps-final">
            {finals.map((item, i) => (
              <li key={item.label} className="cb-steps-choice">
                {i > 0 && <span className="cb-steps-or">or</span>}
                <span className="cb-steps-choice-row">
                  <img src={`${ICON}/cb-icon-${item.icon}.png`} alt="" className="cb-steps-choice-icon" />
                  <span className="cb-steps-choice-label">{item.label}</span>
                </span>
              </li>
            ))}
          </ul>
        </li>
      </ol>
    </div>
  );
}
