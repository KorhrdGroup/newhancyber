/** 교육원 소개 본문 (원본 /inc/footer/introduction.asp). 탭 전환은 AboutTabs 가 맡는다. */

import { REGISTRATION_PHONE, SUPPORT_PHONE } from "@/lib/contact";

const IMG = "/resources/images/footer/about";

const ADDRESS = "(08512) 경기도 의정부시 의정부동 486-11, 601호 일부";

/** 교육 이념 네 가지 (데스크톱 탭 · 모바일 화면 함께 씀) */
const philosophies = [
  {
    img: "about-01.png",
    title: "배움의 기회를 누구나에게",
    lines: ["나이, 환경, 경력에 관계없이 모든 사람이 배움을 통해", "새로운 시작을 할 수 있도록 돕습니다."],
  },
  {
    img: "about-02.png",
    title: "실무 중심의 전문교육",
    lines: ["현장의 요구에 맞춘 실질적인 교육과정으로", "지식이 아닌 '역량'을 길러드립니다."],
  },
  {
    img: "about-03.png",
    title: "신뢰 기반의 학습지원",
    lines: ["체계적이고 투명한 학습관리로 처음부터", "자격 취득, 진로 설계까지 전 과정을 함께합니다."],
  },
  {
    img: "about-04.png",
    title: "지속 가능한 성장",
    lines: ["배움이 일회성이 아닌, 삶 속에서 계속 이어질 수 있도록", "평생학습의 문화를 확산시킵니다."],
  },
];

const MISSION =
  "저희 한평생원격교육원은 “배움이 곧 기회가 되는 사회”를 만들어가기 위해 앞으로도 학습자 한 분 한 분의 내일을 응원하며 함께하겠습니다.";

const features = [
  {
    img: "about-05.png",
    title: "교육부 평가인정 학점은행제 교육원",
    desc: "교육부의 신뢰할 수 있는 평가인정을 받아 안정적이고 투명한 학습 환경을 제공합니다. 모든 과정은 국가평생교육진흥원의 기준에 부합합니다.",
  },
  {
    img: "about-06.png",
    title: "1:3 맞춤형 학습설계 시스템",
    desc: "학습자의 경력, 학력, 목표에 맞춘 개인별 학습 로드맵을 제공합니다. 학습설계부터 자격 취득, 학위 완성까지 전 과정을 밀착 관리합니다.",
  },
  {
    img: "about-07.png",
    title: "실무 중심의 커리큘럼 구성",
    desc: "이론적 지식을 넘어 실무 경험이 풍부한 강사진의 실질적인 교육 콘텐츠를 제공합니다. 자격 취득 후에도 경력 확장과 취업에 도움이 되도록 구성되었습니다.",
  },
  {
    img: "about-08.png",
    title: "학습자 친화적 온라인 시스템",
    desc: "시간과 장소의 제약 없이 언제 어디서나 학습할 수 있는 안정적인 온라인 플랫폼을 구축했습니다. 학습 진행 상황을 직관적으로 확인할 수 있어 편리하게 관리할 수 있습니다.",
  },
];

/** 주소 · 전화번호 */
function DirectionsInfo() {
  return (
    <dl className="about-info">
      <div className="about-info-row">
        <dt>주소</dt>
        <dd>{ADDRESS}</dd>
      </div>
      <div className="about-info-row">
        <dt>전화번호</dt>
        <dd>
          수강신청 문의 {REGISTRATION_PHONE} / 학습지원 문의 {SUPPORT_PHONE}
        </dd>
      </div>
    </dl>
  );
}

const MapImage = () => <img src={`${IMG}/about-map-uijeongbu.png`} alt="한평생원격교육원 위치 지도" className="about-map" />;

/** 모바일 전용: 비전·교육 이념·미션·오시는 길을 한 화면에 */
export function MobileAboutContent() {
  return (
    <div className="mobile-about-content mobile-only">
      <section className="about-m-section">
        <h2 className="about-m-title">비전</h2>
        <p className="about-lead-box">
          모든 배움이 기회가 되고,
          <br />그 기회가 한 사람의 인생을 변화시키는 교육원
        </p>
      </section>
      <section className="about-m-section">
        <h2 className="about-m-title">교육 이념</h2>
        <ul className="about-philosophy-list">
          {philosophies.map((p) => (
            <li key={p.title} className="about-philosophy-item">
              <img src={`${IMG}/${p.img}`} alt="" className="about-philosophy-img" />
              <h3 className="about-item-title">{p.title}</h3>
              <p className="about-item-desc">{p.lines.join(" ")}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="about-m-section">
        <p className="about-lead-box">{MISSION}</p>
      </section>
      <section className="about-m-section">
        <h2 className="about-m-title">한평생원격교육원 오시는 길</h2>
        <DirectionsInfo />
        <MapImage />
      </section>
    </div>
  );
}

/** 인사말 탭 */
export function GreetingTab() {
  return (
    <section className="about-section">
      <img src={`${IMG}/about-main-banner.png`} alt="" className="about-banner" />
      <div className="about-body">
        <p>
          저희 교육원은 학점은행제를 중심으로 한 평생교육 전문기관으로, 누구나 배움을 통해 새로운 기회를 얻을 수 있도록 돕는 것을 사명으로 하고 있습니다.
          <br />
          학습자의 상황과 목표는 모두 다르지만, 그 안에서 &quot;조금 더 나은 내일을 향한 열망&quot;이라는 공통된 마음이 있다고 믿습니다.
        </p>
        <p>
          저희는 그 마음을 가장 가까이에서 이해하고, 체계적이고 신뢰할 수 있는 학습관리로 각자의 여정에 함께하고자 합니다.
          <br />
          단순히 학점을 이수하는 과정이 아니라, 배움을 통해 진로를 설계하고, 경력을 확장하며, 자신만의 전문성을 쌓아갈 수 있도록 실질적이고 현장감 있는 교육을 제공하고 있습니다.
        </p>
        <p>
          또한, 학습자 한 분 한 분이 학습 과정 전반에서 혼자 고민하지 않도록 전문 학습담당자가 맞춤 학습설계와 지속적인 학습관리를 지원하고 있습니다.
          <br />
          이를 통해 &quot;배움의 시작부터 자격취득, 그리고 진로의 완성까지&quot; 끊김 없는 성장의 여정을 함께 만들어가고자 합니다.
        </p>
        <p>앞으로도 저희 교육원은 더 많은 분들이 배움을 통해 새로운 길을 열어갈 수 있도록 혁신을 멈추지 않고, 신뢰와 진정성을 바탕으로 교육의 본질을 지켜가겠습니다.</p>
        <p>감사합니다.</p>
      </div>
    </section>
  );
}

/** 교육 이념 탭 */
export function PhilosophyTab() {
  return (
    <section className="about-section">
      <h2 className="lx-section-title">교육 이념</h2>
      <p className="about-lead">배움의 즐거움으로, 삶의 변화를 이끌다</p>
      <div className="about-body">
        <p>
          한평생원격교육원은 누구나 자신의 속도와 방식으로 배울 수 있는 “평생학습의 장(場)”을 만들어가고 있습니다.
          <br />
          교육은 단지 지식을 쌓는 과정이 아니라, 삶을 새롭게 설계하고 스스로의 가능성을 확장해 나가는 여정이라 믿습니다.
        </p>
        <p>
          급격하게 변화하는 시대 속에서 오늘의 배움은 내일의 경쟁력이 됩니다.
          <br />
          저희 교육원은 학점은행제를 기반으로, 단순히 학위취득을 넘어 실질적인 경력 설계와 전문성 향상을 지원합니다.
        </p>
        <p>모든 학습자가 각자의 자리에서 성장의 결실을 맺을 수 있도록 저희는 다음의 가치를 중심으로 교육이념을 세워 나갑니다.</p>
      </div>
      <ul className="about-philosophy-grid">
        {philosophies.map((p) => (
          <li key={p.title} className="about-philosophy-item">
            <img src={`${IMG}/${p.img}`} alt="" className="about-philosophy-img" />
            <h3 className="about-item-title">{p.title}</h3>
            <p className="about-item-desc">
              {p.lines[0]}
              <br />
              {p.lines[1]}
            </p>
          </li>
        ))}
      </ul>
      <p className="about-lead-box">{MISSION}</p>
    </section>
  );
}

/** 교육원 특징 탭 */
export function FeaturesTab() {
  return (
    <section className="about-section">
      <h2 className="lx-section-title">한평생원격교육원의 특징</h2>
      <p className="lx-text">배움의 기회가 곧 삶의 기회가 될 수 있도록, 한평생원격교육원은 학습자 한 분 한 분의 여정을 세심하게 함께합니다.</p>
      <ul className="about-feature-list">
        {features.map((f) => (
          <li key={f.title} className="about-feature">
            <img src={`${IMG}/${f.img}`} alt="" className="about-feature-icon" />
            <div>
              <h3 className="about-item-title">{f.title}</h3>
              <p className="about-item-desc">{f.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 장학제도 탭 */
export function ScholarshipTab() {
  return (
    <section className="about-section">
      <h2 className="lx-section-title">장학제도</h2>
      <div className="lx-table-scroll">
        <table className="ds-table lx-table about-scholarship-table">
          <colgroup>
            <col className="about-col-item" />
            <col className="about-col-grade" />
            <col className="about-col-benefit" />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th colSpan={2}>장학 항목</th>
              <th>혜택</th>
              <th>조건 및 제출서류</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="rowgroup" rowSpan={3}>
                성적장학금
              </th>
              <td>최우수(1명)</td>
              <td>30만원</td>
              <td rowSpan={3} className="is-left">
                <ul className="about-cell-list">
                  <li>한 학기 5과목 이상 수강자</li>
                  <li>과락이 없으며, 전 과목 평점 3.0 이상자</li>
                  <li>제출서류 : 수강후기</li>
                </ul>
                <p className="about-cell-note">※ 동점자 장학금 지급 우선순위</p>
                <p className="about-cell-note">1) 정기평가 고득점자</p>
                <p className="about-cell-note">2) 다수 과목 수강자</p>
              </td>
            </tr>
            <tr>
              <td>우수(1명)</td>
              <td>20만원</td>
            </tr>
            <tr>
              <td>장려(1명)</td>
              <td>10만원</td>
            </tr>
            <tr>
              <th scope="row" colSpan={2}>
                국가유공자 본인 및 자녀
              </th>
              <td>전액면제</td>
              <td className="is-left">
                대학수업료 면제자 등 증명서 원본
                <br />
                (자녀는 가족관계증명서 추가)
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={2}>
                기초생활수급자
              </th>
              <td>50%</td>
              <td className="is-left">
                기초생활수급자 증명서 원본
                <br />
                (최근 1개월 내 발급본)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** 오시는길 탭 */
export function DirectionsTab() {
  return (
    <section className="about-section">
      <h2 className="lx-section-title">한평생원격교육원 오시는 길</h2>
      <DirectionsInfo />
      <MapImage />
    </section>
  );
}
