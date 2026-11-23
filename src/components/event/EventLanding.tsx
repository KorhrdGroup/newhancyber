import "@/styles/event-landing.css";

const IMG = "/resources/images/event";

const notes = [
  <>한평생을 추천하는 사람: 한평생에서 현재 수강중이거나, 수강 이력이 있는 모든 학습자라면 누구나</>,
  <>한평생을 추천 받은 친구: 한평생에서 이전에 수강한 적이 없는 신규 학습자 (재등록 학습자 제외)</>,
  <>
    추천받은 친구가 <b>최소 5과목 이상</b> 수강신청 후 <b>중간고사 응시를 완료</b>해야 이벤트 혜택이 제공됩니다.
  </>,
  <>
    상품권은 추천받은 친구가 <b>중간고사 응시를 완료</b>하면 회원가입 시 기재한 휴대폰 번호로 발송됩니다.
  </>,
  <>상품권 유효기간 만료 시 재발송 및 환불이 불가합니다.</>,
  <>부정한 방법으로 이벤트 참여 시 혜택이 취소될 수 있습니다.</>,
];

const agents = [
  { key: "학습설계", role: "담당자", desc: ["개인별 맞춤 커리큘럼 설계 및", "자격증/학위취득 상담"], img: "agent-design" },
  { key: "기술지원", role: "전문가", desc: ["학습 중 불편사항 원격 해결 및", "한평생교육원 전반 기술지원"], img: "agent-tech" },
  { key: "학습관리", role: "담당자", desc: ["수강/학사 관련 문의 응대 및 학습 진행 상황", "지속 관리, 학사일정 알림 서비스"], img: "agent-manage" },
];

const cares = [
  { key: "알리미", role: "서비스", sub: "일정 놓칠 걱정 없는 스마트 알림", items: ["중요 학사 일정 사전알림", "출석 독려 알림 발송", "카카오톡/문자 이중알림"], img: "icon-alarm" },
  { key: "개별 밀착", role: "관리", sub: "1:1 맞춤형 학습 관리 시스템", items: ["학습 진도율 실시간 모니터링", "학습 애로사항 상담지원", "성적 향상 맞춤 코칭"], img: "icon-person" },
];

const devices = [
  { title: "PC 환경 지원", desc: ["다양한 웹 브라우저(웨일·크롬·엣지)에서", "최적화된 학습 환경"], img: "device-pc" },
  { title: "모바일 환경 지원", desc: ["모바일 최적화 인터페이스로", "언제 어디서든 편리하게 스마트폰으로 수강"], img: "device-mobile" },
];

const guides = [
  { title: "한평생 OT 가이드", desc: "한평생에서 학습자들을 위한 강의 수강, 과제 제출 등 기본적인 학습방법 안내", img: "guide-ot" },
  { title: "진행과정별 가이드", desc: "수강 신청부터 학위 취득까지, 단계별 필요한 절차와 주의사항를 상세하게", img: "guide-process" },
  { title: "실습 가이드", desc: "실습이 필요한 과목의 경우, 단계별 실습 방법을 하나씩 따라가기 쉽게", img: "guide-practice" },
  { title: "학습자등록 가이드", desc: "서류 준비부터 온라인 제출까지 복잡한 학습자 등록 절차를 편리하고 빠르게", img: "guide-register" },
  { title: "학점인정 신청 가이드", desc: "이수한 과목의 학점 인정 절차를 기간, 서류, 방법 안내를 통해 원활하게 진행", img: "guide-credit" },
  { title: "학위신청 가이드", desc: "학위 취득을 위한 최종 신청까지 단계별로, 성공적인 학위 취득을 지원", img: "guide-degree" },
];

function Reason({ n, sub, title }: { n: number; sub: string; title: string }) {
  return (
    <>
      <span className="evl-reason">Reason {n}</span>
      <div className="evl-reason-head">
        <p className="evl-reason-sub">{sub}</p>
        <h2 className="evl-reason-title">{title}</h2>
      </div>
    </>
  );
}

/**
 * 친구 추천 이벤트 상세 — Figma 1791:5834 (1080 폭) 배치, 글은 예전 이벤트 통이미지(한평생판) 그대로.
 * 크기는 디자인 폭 기준 단위 --u (PC 폭/1080, 휴대폰 폭/480) 라서 화면 폭에 맞춰 비율 그대로 줄어든다.
 */
export default function EventLanding() {
  return (
    <div className="evl">
      <div className="evl-inner">
        {/* 친구 추천 */}
        <section className="evl-hero">
          <div className="evl-hero-bg" aria-hidden>
            <img src={`${IMG}/hero-gifts.webp`} alt="" />
          </div>
          <h1 className="evl-hero-title">
            <span className="evl-hero-line1">
              친구에게 <b>한평생 추천</b>하면
            </span>
            <span className="evl-hero-line2">
              <em>상품권</em> 쏜다!
            </span>
          </h1>
          <ul className="evl-coupons">
            <li className="evl-coupon evl-coupon--me">
              <span className="evl-coupon-label">한평생을 추천하는 나</span>
              <p className="evl-coupon-text">
                추천할 때마다
                <br />
                상품권 1만원!
              </p>
              <img src={`${IMG}/coupon-purple.webp`} alt="" />
            </li>
            <li className="evl-coupon evl-coupon--friend">
              <span className="evl-coupon-label">한평생을 추천받은 친구</span>
              <p className="evl-coupon-text">
                추천 받은 친구도
                <br />
                상품권 1만원!
              </p>
              <img src={`${IMG}/coupon-yellow.webp`} alt="" />
            </li>
          </ul>
          <div className="evl-notes">
            <h2 className="evl-notes-label">이벤트 유의사항</h2>
            <ol className="evl-notes-list">
              {notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ol>
          </div>
        </section>

        {/* 띠 제목 */}
        <section className="evl-band">
          <p>
            <span>지금</span>
            <b>한평생에서 시작해야</b>
            <span>하는 이유</span>
          </p>
        </section>

        {/* Reason 1 */}
        <section className="evl-r1">
          <img className="evl-r1-wave" src={`${IMG}/reason1-wave.svg`} alt="" aria-hidden />
          <Reason n={1} sub="한명의 학습자를 세명의 전문가가 관리하는 맞춤형 학습지원" title="1:3 체계적 관리 시스템" />
          <ul className="evl-agents">
            {agents.map((a) => (
              <li key={a.key} className="evl-agent">
                <p className="evl-card-title">
                  <em>{a.key}</em> {a.role}
                </p>
                <p className="evl-agent-desc">
                  {a.desc[0]}
                  <br />
                  {a.desc[1]}
                </p>
                <img src={`${IMG}/${a.img}.webp`} alt="" />
              </li>
            ))}
          </ul>
          <img className="evl-learner" src={`${IMG}/learner-book.webp`} alt="" aria-hidden />
          <p className="evl-closing">
            <em>세 분야 전문가의 협업</em>으로 <br className="evl-mo-br" />
            <em>학습자의 성공적인 학습 완수</em>를 지원합니다.
          </p>
        </section>

        {/* Reason 2 */}
        <section className="evl-r2">
          <Reason n={2} sub="개인 맞춤형 학습 관리로 성공적인 학습 완료 지원" title="학습자별 밀착 관리" />
          <ul className="evl-cares">
            {cares.map((c) => (
              <li key={c.key} className="evl-care">
                <p className="evl-card-title">
                  <em>{c.key}</em> {c.role}
                </p>
                <img src={`${IMG}/${c.img}.webp`} alt="" />
                <p className="evl-care-sub">{c.sub}</p>
                <ul className="evl-care-list">
                  {c.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
            <li className="evl-care-plus" aria-hidden>
              <img src={`${IMG}/mark-plus.svg`} alt="" />
            </li>
          </ul>
          <p className="evl-closing">
            한평생의 <em>밀착 관리 시스템</em>으로
            <br className="evl-pc-br" /> 바쁜 일상 속에서도 <br className="evl-mo-br" />
            <em>학습 일정을 놓치지 않고 목표를 달성</em>할 수 있습니다.
          </p>
        </section>

        {/* Reason 3 */}
        <section className="evl-r3">
          <Reason n={3} sub="언제 어디서나 편리하게 학습할 수 있는 멀티 디바이스 지원 시스템" title="PC와 모바일 수강 지원" />
          <ul className="evl-devices">
            {devices.map((d) => (
              <li key={d.title} className="evl-device">
                <img src={`${IMG}/${d.img}.webp`} alt="" />
                <div>
                  <p className="evl-device-title">{d.title}</p>
                  <p className="evl-device-desc">
                    {d.desc[0]}
                    <br />
                    {d.desc[1]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="evl-r3-note">*단, 안정적인 응시 환경을 위해 PC에서만 시험 · 퀴즈에 응시할 수 있습니다.</p>
        </section>

        {/* Reason 4 */}
        <section className="evl-r4">
          <img className="evl-r4-bg" src={`${IMG}/guide-bg.webp`} alt="" aria-hidden />
          <span className="evl-reason">Reason 4</span>
          <h2 className="evl-r4-title">학습자 만족을 위한 가이드</h2>
          <p className="evl-r4-sub">처음부터 끝까지, 단계별로 안내하는 상세한 학습 가이드를 제공합니다.</p>
          <ol className="evl-guides">
            {guides.map((g) => (
              <li key={g.title} className="evl-guide">
                <img src={`${IMG}/${g.img}.webp`} alt="" />
                <div>
                  <p className="evl-guide-title">{g.title}</p>
                  <p className="evl-guide-desc">{g.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="evl-r4-closing">
            <b>체계적인 가이드 시스템</b>으로 학습의 시작부터 학위 취득까지
            <br />
            <b>모든 과정을 안심하고 진행</b>할 수 있습니다.
          </p>
        </section>
      </div>
    </div>
  );
}
