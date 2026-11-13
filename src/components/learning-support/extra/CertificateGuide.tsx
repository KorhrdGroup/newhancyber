"use client";

import { useState } from "react";
import ButtonTabs from "@/components/common/ButtonTabs";

type TabKey = "info" | "copy" | "login";

const tabs: { key: TabKey; label: string }[] = [
  { key: "info", label: "공동인증서 안내" },
  { key: "copy", label: "인증서 이동(복사하기)" },
  { key: "login", label: "공동인증서 로그인 방법" },
];

/** 원본 공인인증기관 표 그대로 */
const agencies = [
  { name: "한국전자인증(주)", site: "www.crosscert.com", phone: "1566-0566" },
  { name: "한국정보인증(주)", site: "www.signgate.com", phone: "1577-8787" },
  { name: "금융결제원", site: "www.yessign.or.kr", phone: "1577-5500" },
  { name: "(주)코스콤(증권전산)", site: "www.signkorea.com", phone: "1577-7337" },
  { name: "한국무역정보통신", site: "www.tradesign.net", phone: "1566-2119" },
];

/*
 * 인증서 이동(복사하기): 원본은 "준비 중" 그림만 있어 일반적인 은행 인증센터 절차로 새로 썼다.
 * TODO: 교육원에서 쓰는 인증서 관리 프로그램이 정해지면 문구를 맞춘다.
 */
const copyToDiskSteps = [
  "인증서를 발급받은 은행(또는 인증기관) 홈페이지에 접속해 [인증센터] > [인증서 관리]로 들어갑니다.",
  "[인증서 복사] 메뉴에서 옮길 인증서를 고르고 인증서 비밀번호를 입력합니다.",
  "저장할 위치로 이동식디스크(USB) 또는 다른 하드디스크를 선택하면 복사가 끝납니다.",
  "다른 PC에서는 이동식디스크를 꽂은 뒤, 공동인증서 로그인 화면에서 인증서 위치를 [이동식디스크]로 선택합니다.",
];

const copyToPhoneSteps = [
  "스마트폰에서 은행 앱을 실행해 [인증센터] > [인증서 가져오기(PC → 스마트폰)]를 누르면 인증번호가 표시됩니다.",
  "PC에서 같은 은행 홈페이지의 [인증센터] > [인증서 내보내기(PC → 스마트폰)]로 들어갑니다.",
  "옮길 인증서를 고르고 인증서 비밀번호를 입력한 뒤, 스마트폰에 표시된 인증번호를 입력합니다.",
  "스마트폰에서 가져오기 완료 메시지를 확인합니다.",
];

/** 원본 로그인 방법 (단계 그림은 옮기지 않고 글로만) */
const loginFlow = ["[공동인증서 로그인] 버튼 클릭", "공동인증서 위치 찾기", "인증서 클릭 후 비밀번호 입력", "나의 강의실 이동"];
const loginSteps = [
  "아이디를 입력한 후 \"공동인증서 로그인\" 버튼을 클릭한다.",
  "개인(공동) 공동인증서가 저장되어 있는 위치를 클릭하여 인증서를 찾고, 본인의 인증서를 클릭한 후 인증서 비밀번호를 입력하고 확인 버튼을 클릭한다.",
  "나의 강의실로 이동",
];

function Steps({ steps }: { steps: string[] }) {
  return (
    <ol className="lx-steps">
      {steps.map((step, i) => (
        <li key={i} className="lx-step">
          <span className="lx-step-num">{i + 1}</span>
          <p>{step}</p>
        </li>
      ))}
    </ol>
  );
}

function InfoTab() {
  return (
    <>
      <section className="lx-block">
        <h2 className="lx-section-title">공동인증서 안내</h2>
        <div className="lx-table-scroll">
          <table className="ds-table lx-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>
                  공동인증서 범용,
                  <br />
                  무료(은행/신용카드/보험용)
                </th>
                <th>금융인증서, 용도제한인증서, 일반로그인</th>
              </tr>
            </thead>
            <tbody>
              {/* "발급 수수료 — 가능/없음" 은 원본 표기 그대로 */}
              <tr>
                <th>발급 수수료</th>
                <td>가능</td>
                <td>없음</td>
              </tr>
              <tr>
                <th>출석, 과제, 생각나눔, 탐구활동</th>
                <td>가능</td>
                <td>불가능</td>
              </tr>
              <tr>
                <th>시험</th>
                <td className="ds-text-danger">PC만 가능</td>
                <td>불가능</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lx-block">
        <h2 className="lx-section-title">공동인증서 신청 및 발급 절차 간략 안내</h2>
        <div className="lx-table-scroll">
          <table className="ds-table ds-table--info lx-table">
            <tbody>
              <tr>
                <th>공동인증서가 있는 경우</th>
                <td>그대로 이용 가능하며, 갱신의 경우 은행 방문 없이 주거래 은행 홈페이지에서 발급 가능</td>
              </tr>
              <tr>
                <th>공동인증서가 없는 경우</th>
                <td>
                  <p>
                    1) 가까운 거래은행에 방문하여(신분증, 통장, 도장 지참) 인터넷 뱅킹 신청서 작성 후 pc로 거래은행
                    홈페이지에서 개인공동인증서 발급하여 하드디스크 또는 이동식디스크에 저장하여 사용하세요.
                  </p>
                  <p className="lx-mt-8">
                    2) 공동(공인)인증기관을 통한 발급 - 인증기관 홈페이지 방문하여 방문한 홈페이지에서 개인 공동
                    인증서 신청 후 수수료납부(4,400원/년) 신청서 출력하고, 발급 신청 서류는 방문 제출(신청서, 신분증
                    지참, 본인 대면확인, 미성년자 포함) 후 이메일 또는 공동인증서 발급 기관 홈페이지에서
                    다운로드하여 하드디스크 또는 이동식디스크에 저장하여 사용하세요.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lx-block">
        <h2 className="lx-section-title">공인인증기관이란?</h2>
        <p className="lx-text">
          전자서명법에 의거하여 공인인증기관으로 지정 받은 기관으로 전문성과 공신력을 갖추고 공인인증업무를 하는
          기관을 말합니다. (예 : 5개의 공인인증기관)
        </p>
        <div className="lx-table-scroll">
          <table className="ds-table lx-table">
            <thead>
              <tr>
                <th>인증기관</th>
                <th>홈페이지 주소</th>
                <th>고객센터</th>
              </tr>
            </thead>
            <tbody>
              {agencies.map((agency) => (
                <tr key={agency.name}>
                  <td>{agency.name}</td>
                  <td>
                    <a href={`https://${agency.site}`} target="_blank" rel="noopener noreferrer" className="lx-link">
                      {agency.site}
                    </a>
                  </td>
                  <td>{agency.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function CopyTab() {
  return (
    <>
      <section className="lx-block">
        <h2 className="lx-section-title">PC → 이동식디스크(USB)·다른 PC로 복사하기</h2>
        <Steps steps={copyToDiskSteps} />
      </section>
      <section className="lx-block">
        <h2 className="lx-section-title">PC → 스마트폰으로 복사하기</h2>
        <Steps steps={copyToPhoneSteps} />
      </section>
      <p className="lx-callout">시험은 PC에서만 볼 수 있습니다. 시험을 볼 PC에 공동인증서를 꼭 옮겨 두세요.</p>
    </>
  );
}

function LoginTab() {
  return (
    <section className="lx-block">
      <h2 className="lx-section-title">공동인증서 로그인 방법</h2>
      <ol className="lx-flow">
        {loginFlow.map((item, i) => (
          <li key={item} className="lx-flow-item">
            <span className="lx-flow-num">STEP {i + 1}</span>
            {item}
          </li>
        ))}
      </ol>
      <Steps steps={loginSteps} />
    </section>
  );
}

/** 공동인증서 안내 — 원본 화면의 탭 3개 (주소는 그대로, 화면 안에서만 바뀐다) */
export default function CertificateGuide() {
  const [active, setActive] = useState<TabKey>("info");

  return (
    <>
      <ButtonTabs items={tabs} active={active} onSelect={(key) => setActive(key as typeof active)} className="lx-subtabs" ariaLabel="공동인증서 안내 구분" />
      <div role="tabpanel">
        {active === "info" && <InfoTab />}
        {active === "copy" && <CopyTab />}
        {active === "login" && <LoginTab />}
      </div>
    </>
  );
}
