/**
 * 학점은행제 안내의 단계 그림을 코드로 그린다 (Figma 시안 '학점은행제' 섹션의 wrapper_graphic).
 * 3D 아이콘만 그림 파일(cb-icon-*.png)이고, 글자·구분 점선·동그라미 표시는 모두 코드.
 */

import StepTiles from "@/components/common/StepTiles";

const ICON = "/resources/images/credit-bank";

export interface CbFlowItem {
  /** 아이콘 이름 (cb-icon-{icon}.png) */
  icon: string;
  label: string;
}

/**
 * 아이콘 + 이름이 옆으로 이어지는 흐름 (예: 학교에서의 학습경험 + 다양한 형태의 학습과 자격 › 학점 인정 › 학위 수여).
 * 공통 흐름도(타일 + 연결 배지)로 그린다. joins[i] 는 i번째와 i+1번째 사이: "plus" 는 +, "arrow" 는 ›.
 */
export function CbIconFlow({
  items,
  joins,
  highlightLast = false,
}: {
  items: CbFlowItem[];
  joins: ("plus" | "arrow")[];
  /** 마지막이 얻는 결과(학위 수여 등)면 연파랑 */
  highlightLast?: boolean;
}) {
  return (
    <StepTiles
      items={items.map((item) => ({ icon: `${ICON}/cb-icon-${item.icon}.png`, title: item.label }))}
      joins={joins}
      highlightLast={highlightLast}
    />
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

/** 학점은행제 흐름도: STEP 1~4 → STEP 5 (학위 / 자격증 / 시험 응시 자격 중 하나). 공통 흐름도의 마지막 타일에 셋을 쌓는다 */
export function CbStepFlow({
  steps,
  finals,
}: {
  steps: CbFlowItem[];
  finals: CbFlowItem[];
}) {
  return (
    <StepTiles
      items={[
        ...steps.map((item) => ({ icon: `${ICON}/cb-icon-${item.icon}.png`, title: item.label })),
        { choices: finals.map((item) => ({ icon: `${ICON}/cb-icon-${item.icon}.png`, title: item.label })) },
      ]}
      wideLast
      highlightLast
      numbered
    />
  );
}
