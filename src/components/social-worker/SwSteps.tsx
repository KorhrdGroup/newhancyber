import type { CSSProperties, ReactNode } from "react";

/* 사회복지사 안내 화면의 단계·흐름 그림 (Figma wrapper_graphic) — 예전 통째 그림(social-wooker0N.png)을 코드로 옮김.
   3D 아이콘만 그림 파일이고, 글자·점선·화살표(mark)·말풍선은 코드로 그린다.
   PC: 가로 흐름 / 폰(480px 이하): 세로로 쌓고 점선·화살표를 아래 방향으로 돌린다 */

const iconBase = "/resources/images/social-worker/steps/";

type FlowSize = "lg" | "md" | "sm";

/** 흰 바탕 상자 — size: 아이콘 100(lg) · 80(md) · 64(sm, 글자 14) */
function Flow({ size = "sm", label, className = "", children }: { size?: FlowSize; label: string; className?: string; children: ReactNode }) {
  return (
    <div className={`sw-flow sw-flow--${size} ${className}`} role="group" aria-label={label}>
      {children}
    </div>
  );
}

/** 단계 하나: 3D 아이콘 + 이름 (+ 설명) */
function Step({ icon, title, sub }: { icon: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <div className="sw-step">
      <img className="sw-step-icon" src={iconBase + icon} alt="" />
      <p className="sw-step-title">{title}</p>
      {sub && <p className="sw-step-sub">{sub}</p>}
    </div>
  );
}

/** 학점·과목 수: 구분 + 파란 숫자 */
function Credit({ label, value }: { label: string; value: string }) {
  return (
    <p className="sw-credit">
      <span className="sw-credit-label">{label}</span>
      <strong className="sw-credit-value">{value}</strong>
    </p>
  );
}

const Chevron = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="m8.5 6 4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 연한 파랑 동그라미 표시 — next(›, 다음 단계) · plus(+, 함께 필요) */
function Mark({ kind }: { kind: "next" | "plus" }) {
  return (
    <span className={`sw-mark sw-mark--${kind}`} aria-hidden="true">
      {kind === "next" ? (
        <Chevron />
      ) : (
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M10 5.5v9M5.5 10h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

/** 다음 단계로 넘어가는 칸막이: 세로 점선 + › 표시 (+ 아래 글) */
function Divider({ caption }: { caption?: string }) {
  return (
    <div className="sw-flow-divider">
      <Mark kind="next" />
      {caption && <span className="sw-flow-divider-caption">{caption}</span>}
    </div>
  );
}

/** 여러 칸을 한 줄로 묶음 — 폰에서도 가로 줄을 유지한다. grow = 묶은 칸 수 (PC에서 다른 칸과 너비를 맞춤) */
function Group({ grow, total, children }: { grow: number; total?: string; children: ReactNode }) {
  return (
    <div className="sw-flow-group" style={{ "--grow": grow } as CSSProperties}>
      <div className="sw-flow-row">{children}</div>
      {total && <p className="sw-pill sw-pill--block">{total}</p>}
    </div>
  );
}

/** 사회복지사자격증 신청절차 (급수별 자격요건 · 사회복지사 자격 탭) */
export function ApplyFlow() {
  return (
    <Flow size="md" label="사회복지사자격증 신청절차" className="sw-flow--bracket">
      <div className="sw-flow-bracket">
        <span className="sw-pill">자격심사, 자격증 발급</span>
      </div>
      <Step
        icon="apply-form.png"
        title={
          <>
            신청자 발급신청
            <br />
            (온라인 신청서 작성)
          </>
        }
      />
      <Divider />
      <Step
        icon="doc-tray.png"
        title={
          <>
            지방사회복지사협회
            <br />
            서류 접수 (전국 17개소)
          </>
        }
      />
      <Divider />
      <Step icon="association.png" title="한국사회복지사협회" />
    </Flow>
  );
}

/** 사회복지사 2급 취득 절차 */
export function Level2Flow() {
  return (
    <Flow size="lg" label="사회복지사 2급 취득 절차">
      <Step icon="online-apply.png" title="덧셈수강신청" />
      <Divider />
      <Group grow={2}>
        <Step icon="course-book.png" title="과목이수" />
        <Mark kind="plus" />
        <Step icon="practice-heart.png" title="실습" />
      </Group>
    </Flow>
  );
}

/** 사회복지사 1급 응시자격: 2급 → (전문학사 → 경력 1년 | 학사 → 학사학위) → 국가고시 응시가능 */
export function Level1Flow() {
  const route = (degree: string, icon: string, title: string, dir: "up" | "down") => (
    <div className={`sw-route sw-route--${dir}`}>
      <span className="sw-route-path">
        <span className="sw-pill">{degree}</span>
        <span className="sw-route-arrow">
          <Chevron />
        </span>
      </span>
      <Step icon={icon} title={title} />
    </div>
  );
  return (
    <Flow size="lg" label="사회복지사 1급 응시자격" className="sw-flow--level1">
      <div className="sw-route-from">
        <Step icon="certificate-2.png" title="사회복지사 2급" />
      </div>
      <div className="sw-routes">
        {route("전문학사", "briefcase.png", "경력 1년", "up")}
        {route("학사", "grad-cap.png", "학사학위", "down")}
      </div>
      <Divider caption="응시가능" />
      <Step icon="exam-doc.png" title="국가고시" />
    </Flow>
  );
}

/** 대상별 학습설계: 학점(과목) 더하기 → 학위·자격증 */
export function CreditFlow({
  label,
  credits,
  total,
  results,
}: {
  label: string;
  credits: { label: string; value: string }[];
  total?: string;
  results: { icon: string; title: string }[];
}) {
  const join = <T,>(items: T[], render: (item: T) => ReactNode) =>
    items.flatMap((item, i) => (i === 0 ? [render(item)] : [<Mark key={`m${i}`} kind="plus" />, render(item)]));
  return (
    <Flow label={label} className="sw-flow--credit">
      <Group grow={credits.length} total={total}>
        {join(credits, (c) => (
          <Credit key={c.label} {...c} />
        ))}
      </Group>
      <Divider />
      <Group grow={results.length}>
        {join(results, (r) => (
          <Step key={r.title} {...r} />
        ))}
      </Group>
    </Flow>
  );
}

/** 자격증 교부 신청절차 */
export function IssueFlow() {
  const steps = [
    { icon: "bank.png", title: "협회 선정", sub: ["본인의 지역에 따라", "지방협회 선정"] },
    { icon: "doc-stack.png", title: "서류 제출", sub: ["구비서류를 우편 발송", "혹은 방문 제출"] },
    { icon: "bank-card.png", title: "수수료 입금", sub: ["해당 지방협회 계좌입금", "(수수료 1만원)"] },
    { icon: "certificate-2.png", title: "자격증 수령", sub: ["신청 시 기입한 주소로", "등기 발송된 자격증 수령"] },
  ];
  return (
    <Flow label="사회복지사자격증 교부 신청절차" className="sw-flow--issue">
      {steps.flatMap((s, i) => [
        ...(i > 0 ? [<Divider key={`d${i}`} />] : []),
        <Step
          key={s.title}
          icon={s.icon}
          title={s.title}
          sub={
            <>
              {s.sub[0]}
              <br />
              {s.sub[1]}
            </>
          }
        />,
      ])}
    </Flow>
  );
}
