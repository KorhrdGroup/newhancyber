import StepTiles from "@/components/common/StepTiles";

/* 사회복지사 안내 화면의 단계·흐름 그림 — 공통 흐름도(타일 + 연결 배지, StepTiles)로 그린다.
   3D 아이콘만 그림 파일이고 글자·배지는 코드. PC 가로 / 폰(768px 이하) 세로 */

const iconBase = "/resources/images/social-worker/steps/";

/** 사회복지사자격증 신청절차 (급수별 자격요건 · 사회복지사 자격 탭). 자격심사·발급은 마지막 협회 단계 */
export function ApplyFlow() {
  return (
    <StepTiles
      label="사회복지사자격증 신청절차"
      items={[
        { icon: iconBase + "apply-form.png", title: "신청자 발급신청", desc: "온라인 신청서 작성" },
        { icon: iconBase + "doc-tray.png", title: "지방사회복지사협회 서류 접수", desc: "전국 17개소" },
        { icon: iconBase + "association.png", title: "한국사회복지사협회", desc: "자격심사, 자격증 발급" },
      ]}
    />
  );
}

/** 사회복지사 2급 취득 절차: 수강신청 → 과목이수 + 실습 */
export function Level2Flow() {
  return (
    <StepTiles
      label="사회복지사 2급 취득 절차"
      items={[
        { icon: iconBase + "online-apply.png", title: "수강신청" },
        { icon: iconBase + "course-book.png", title: "과목이수" },
        { icon: iconBase + "practice-heart.png", title: "실습" },
      ]}
      joins={["arrow", "plus"]}
    />
  );
}

/** 사회복지사 1급 응시자격: 2급 → (전문학사 → 경력 1년 | 학사 → 학사학위) → 국가고시 응시가능 */
export function Level1Flow() {
  return (
    <StepTiles
      label="사회복지사 1급 응시자격"
      items={[
        { icon: iconBase + "certificate-2.png", title: "사회복지사 2급" },
        {
          choices: [
            { icon: iconBase + "briefcase.png", label: "전문학사", title: "경력 1년" },
            { icon: iconBase + "grad-cap.png", label: "학사", title: "학사학위" },
          ],
        },
        { icon: iconBase + "exam-doc.png", title: "국가고시", desc: "응시가능" },
      ]}
    />
  );
}

/** 대상별 학습설계: 학점(과목) 더하기 → 학위·자격증 (결과가 둘이면 + 로 한 단계) */
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
  return (
    <StepTiles
      label={label}
      items={[{ figures: credits, total }, ...results.map((r) => ({ icon: iconBase + r.icon, title: r.title }))]}
      joins={["arrow", ...results.slice(1).map(() => "plus" as const)]}
      // 학습설계 카드 4개의 배지 위치를 맞춘다: 학점 칸 3 : 결과 칸 2
      weights={[3, 2]}
    />
  );
}

/** 자격증 교부 신청절차 — 공통 흐름도(타일 + 연결 배지) */
export function IssueFlow() {
  const steps = [
    { icon: "bank.png", title: "협회 선정", sub: ["본인의 지역에 따라", "지방협회 선정"] },
    { icon: "doc-stack.png", title: "서류 제출", sub: ["구비서류를 우편 발송", "혹은 방문 제출"] },
    { icon: "bank-card.png", title: "수수료 입금", sub: ["해당 지방협회 계좌입금", "(수수료 1만원)"] },
    { icon: "certificate-2.png", title: "자격증 수령", sub: ["신청 시 기입한 주소로", "등기 발송된 자격증 수령"] },
  ];
  return (
    <StepTiles
      label="사회복지사자격증 교부 신청절차"
      items={steps.map((s) => ({
        icon: iconBase + s.icon,
        title: s.title,
        desc: (
          <>
            {s.sub[0]}
            <br />
            {s.sub[1]}
          </>
        ),
      }))}
    />
  );
}
