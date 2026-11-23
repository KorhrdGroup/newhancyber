import type { CSSProperties, ReactNode } from "react";
import "@/styles/step-tiles.css";

/**
 * 공통 흐름도 — 타일 + 연결 배지 (2026-11-23 새 공통 모양).
 * 단계마다 흰 타일(STEP 꼬리표 · 3D 아이콘 · 이름 · 설명), 타일 사이 경계에 회색 동그라미 배지(› 다음).
 * "plus" 로 이어진 항목은 한 단계라서 한 타일 안에 + 로 나란히 둔다.
 * 마지막 타일은 연파랑으로 도착점 표시. PC 가로 · 폰(768px 이하) 세로로 쌓고 배지는 아래 방향.
 */
export interface StepTile {
  /** 아이콘 그림 주소 */
  icon?: string;
  title?: ReactNode;
  desc?: ReactNode;
  /** 여럿 중 하나: 아이콘 + 이름 줄을 "or" 로 쌓는다 (label 은 이름 위 작은 글) */
  choices?: { icon: string; title: ReactNode; label?: ReactNode }[];
  /** 더해지는 숫자: 구분 + 값을 + 로 잇고, total 은 아래 합계 띠 */
  figures?: { label: string; value: string }[];
  total?: string;
  /** 아이콘·이름 대신 넣을 내용 */
  content?: ReactNode;
}

const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Plus = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

function Body({ item }: { item: StepTile }) {
  if (item.content) return <>{item.content}</>;
  if (item.choices)
    return (
      <ul className="st-choices">
        {item.choices.map((choice, i) => (
          <li key={i} className="st-choice">
            {i > 0 && <span className="st-or">or</span>}
            <span className="st-choice-row">
              <img className="st-choice-icon" src={choice.icon} alt="" />
              <span className="st-choice-text">
                {choice.label && <span className="st-choice-label">{choice.label}</span>}
                <span className="st-choice-title">{choice.title}</span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    );
  if (item.figures)
    return (
      <span className="st-figures">
        <span className="st-figure-row">
          {item.figures.map((f, i) => (
            <span key={f.label} className="st-figure">
              {i > 0 && (
                <span className="st-plus" aria-hidden="true">
                  <Plus />
                </span>
              )}
              <span className="st-figure-label">{f.label}</span>
              <strong className="st-figure-value">{f.value}</strong>
            </span>
          ))}
        </span>
        {item.total && <span className="st-total">{item.total}</span>}
      </span>
    );
  return (
    <>
      {item.icon && <img className="st-icon" src={item.icon} alt="" />}
      <span className="st-text">
        {item.title && <span className="st-title">{item.title}</span>}
        {item.desc && <span className="st-desc">{item.desc}</span>}
      </span>
    </>
  );
}

export default function StepTiles({
  items,
  joins,
  label,
  plain = false,
  wideLast = false,
  weights,
  numbered = true,
}: {
  items: StepTile[];
  /** joins[i] = i번째와 i+1번째 사이. 기본은 모두 "arrow". "plus" 는 같은 단계로 묶음 */
  joins?: ("arrow" | "plus")[];
  label?: string;
  /** 바깥 회색 판 없이 (이미 판 안에 넣을 때) */
  plain?: boolean;
  /** 마지막 타일을 조금 넓게 (안에 목록을 넣을 때) */
  wideLast?: boolean;
  /** 단계별 너비 비율 (여러 흐름도의 배지 위치를 맞출 때). 없으면 묶인 항목 수만큼 */
  weights?: number[];
  /** STEP 01… 꼬리표. 차례로 밟는 절차가 아닌 그림(개념·조건·학점 합계)은 false */
  numbered?: boolean;
}) {
  // "plus" 로 이어진 항목끼리 한 단계로 묶는다
  const steps: StepTile[][] = [];
  items.forEach((item, i) => {
    if (i > 0 && joins?.[i - 1] === "plus") steps[steps.length - 1].push(item);
    else steps.push([item]);
  });
  const cols = weights ?? (steps.some((s) => s.length > 1) ? steps.map((s) => s.length) : undefined);

  return (
    <ol
      className={`st-flow${plain ? " st-flow--plain" : ""}${numbered ? "" : " st-flow--unnumbered"}${wideLast ? " st-flow--wide-last" : ""}`}
      style={
        {
          "--st-n": steps.length,
          ...(cols && { "--st-cols": cols.map((w) => `minmax(0, ${w}fr)`).join(" ") }),
        } as CSSProperties
      }
      aria-label={label}
    >
      {steps.map((step, i) => (
        <li key={i} className="st-tile">
          {i > 0 && (
            <span className="st-join" aria-hidden="true">
              <Chevron />
            </span>
          )}
          {numbered && <span className="st-no">STEP {String(i + 1).padStart(2, "0")}</span>}
          {step.length > 1 ? (
            <span className="st-pair">
              {step.map((part, j) => (
                <span key={j} className="st-part">
                  {j > 0 && (
                    <span className="st-plus" aria-hidden="true">
                      <Plus />
                    </span>
                  )}
                  <Body item={part} />
                </span>
              ))}
            </span>
          ) : (
            <Body item={step[0]} />
          )}
        </li>
      ))}
    </ol>
  );
}
