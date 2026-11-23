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
  /** 아이콘·이름 대신 넣을 내용 (예: 셋 중 하나 목록) */
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

const Body = ({ item }: { item: StepTile }) => (
  <>
    {item.icon && <img className="st-icon" src={item.icon} alt="" />}
    <span className="st-text">
      {item.title && <span className="st-title">{item.title}</span>}
      {item.desc && <span className="st-desc">{item.desc}</span>}
    </span>
  </>
);

export default function StepTiles({
  items,
  joins,
  label,
  plain = false,
  wideLast = false,
}: {
  items: StepTile[];
  /** joins[i] = i번째와 i+1번째 사이. 기본은 모두 "arrow". "plus" 는 같은 단계로 묶음 */
  joins?: ("arrow" | "plus")[];
  label?: string;
  /** 바깥 회색 판 없이 (이미 판 안에 넣을 때) */
  plain?: boolean;
  /** 마지막 타일을 조금 넓게 (안에 목록을 넣을 때) */
  wideLast?: boolean;
}) {
  // "plus" 로 이어진 항목끼리 한 단계로 묶는다
  const steps: StepTile[][] = [];
  items.forEach((item, i) => {
    if (i > 0 && joins?.[i - 1] === "plus") steps[steps.length - 1].push(item);
    else steps.push([item]);
  });
  const grouped = steps.some((s) => s.length > 1);

  return (
    <ol
      className={`st-flow${plain ? " st-flow--plain" : ""}${wideLast ? " st-flow--wide-last" : ""}`}
      style={
        {
          "--st-n": steps.length,
          // 묶인 단계는 항목 수만큼 넓게
          ...(grouped && { "--st-cols": steps.map((s) => `minmax(0, ${s.length}fr)`).join(" ") }),
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
          <span className="st-no">STEP {String(i + 1).padStart(2, "0")}</span>
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
            step[0].content ?? <Body item={step[0]} />
          )}
        </li>
      ))}
    </ol>
  );
}
