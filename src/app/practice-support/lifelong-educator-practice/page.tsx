import type { Metadata } from "next";
import Link from "next/link";
import PracticeTabs from "@/components/practice-support/PracticeTabs";
import { TBD_HREF } from "@/lib/navigation";

export const metadata: Metadata = { title: "평생교육사실습" };

// 추후 오픈 예정 — 메뉴·사이트맵에서 숨김 처리된 페이지
export default function LifelongEducatorPracticePage() {
  return (
    <main className="wrapper">
      <PracticeTabs
        step1Label="평생교육사 실습 선이수과목"
        step1={
          <>
            <div className="container">
              <h1 className="page-title">
                실습 전 필수 확인사항
              </h1>
              <ul className="page-list" style={{ backgroundColor: "#fff", padding: "24px" }}>
                <li className="page-list-plain">
                  평생교육사 현장실습 과목은 평생교육사 자격증 이수 교과목 중 필수 4과목 이상의 선이수과목이 충족되어야 수강과 실습을 진행할 수 있습니다.
                </li>
                <li className="page-list-plain">
                  - 실습 = 학교 출석수업 + 실습기관에서의 현장실습
                  <br />
                  {" "}실습도 하나의 과목이기 때문에 실습 과목을 수강신청한 후에 신청한 학교 일정에 맞춰 “학교 출석수업”과 “실습기관에서의 현장실습”을 동시에 진행
                </li>
              </ul>
            </div>
            <div className="container">
              <h1 className="page-title">
                평생교육사 과목
              </h1>
              <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <table className="page-table practice-requirement-table lifelong-educator-subject-table">
                  <thead>
                    <tr>
                      <th colSpan={1} className="practice-requirement-header">
                        구분
                      </th>
                      <th colSpan={2} className="practice-requirement-header">
                        교과목
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={1} className="practice-requirement-category">
                        필수과목
                      </td>
                      <td colSpan={2} className="practice-requirement-content">
                        평생교육론, 평생교육방법론, 평생교육경영론, 평생교육프로그램개발론, 평생교육실습(4주, 160시간 이상)
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-requirement-category" rowSpan={2}>
                        선택과목
                      </td>
                      <td className="practice-requirement-category" style={{ backgroundColor: "#fff", fontWeight: "400", fontSize: "12px" }}>
                        실천영역
                      </td>
                      <td className="practice-requirement-content">
                        아동교육론, 청소년교육론, 여성교육론, 노인교육론, 시민교육론, 문자해득교육론, 성인학습및상담, 특수교육론
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-requirement-category" style={{ backgroundColor: "#fff", fontWeight: "400", fontSize: "12px" }}>
                        방법영역
                      </td>
                      <td className="practice-requirement-content">
                        교수설계, 교육공학, 교육복지론, 교육사회학, 교육조사방법론, 기업교육론, 문화예술교육론, 상담심리학, 원격(이러닝, 사이버)교육론, 인적자원개발론, 지역사회교육론, 직업·진로설계, 환경교육론
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ul className="page-list" style={{ marginTop: "10px" }}>
                <li className="page-list-dangu">
                  평생교육사 2급은 선택과목 5과목, 3급은 2과목을 이수하여야 함.
                </li>
                <li className="page-list-dangu">
                  선택과목은 실천영역과 방법영역에서 각각 1과목 이상을 반드시 포함하여 이수하여야 함.
                </li>
                <li className="page-list-dangu">
                  이수과목의 백분위 성적은 100점을 만점으로 하여, 전체 이수과목 성적 총합의 평균이 80점 이상이어야 함.
                </li>
              </ul>
            </div>
          </>
        }
        step2={
          <>
            <div className="container">
              <h1 className="page-title">
                실습 전 필수 확인사항
              </h1>
              <div className="practice-register-container" style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px" }}>
                <ul className="page-list" style={{ margin: "0", padding: "0" }}>
                  <li className="page-list-plain">
                    실습과목을 신청할 수 있는 교육기관(대학부설평생교육원, 사이버대학교시간제, 직업학교, 원격평생교육원)에 따라 모집요강이 다르므로 실습 담당자의 안내를 받아 접수 진행
                  </li>
                </ul>
                <Link href="/course-registration/register" className="practice-register-btn">
                  실습과목 접수{" "}
                  <img src="/resources/images/pratice-support/arrow-right.png" alt="화살표" className="practice-register-btn-arrow" />
                </Link>
              </div>
            </div>
            <div className="container">
              <h1 className="page-title">
                평생교육사 현장실습 기관섭외
              </h1>
              <div className="practice-branch-list">
                <a href={TBD_HREF} className="practice-branch-item" style={{ width: "268px" }}>
                  <div className="practice-branch-content">
                    <img src="/resources/images/pratice-support/branch-05.png" alt="한국사회복지시협회 자격관리센터" className="practice-branch-logo" style={{ width: "200px" }} />
                  </div>
                  <img src="/resources/images/pratice-support/ep_arrow-up-bold.png" alt="화살표" className="practice-branch-arrow" />
                </a>
                {" "}
                <a href={TBD_HREF} className="practice-branch-item" style={{ width: "268px" }}>
                  <div className="practice-branch-content">
                    <img src="/resources/images/pratice-support/branch-06.png" alt="사회복지포털 복지넷" className="practice-branch-logo" style={{ width: "200px" }} />
                  </div>
                  <img src="/resources/images/pratice-support/ep_arrow-up-bold.png" alt="화살표" className="practice-branch-arrow" />
                </a>
              </div>
              <div style={{ marginTop: "30px" }}>
                <table className="page-table practice-outreach-table">
                  <thead>
                    <tr>
                      <th colSpan={2}>
                        평생교육사 실습 기관 섭외
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="practice-outreach-category">
                        실습기관섭외
                      </td>
                      <td className="practice-outreach-content">
                        국가평생교육진흥원, 시•도 평생교육진흥원, 시•군•구 평생학습관, 문자해득교육프로그램 지정기관, 성인문해교육 지원사업 선정기관, 평생학습도시, 국가•지자체 평생학습 추진기구, 평생교육 관련사업 수행학교, 평생교육시설 신고•인가 기관, 평생직업교육학원, 기관형 교육기관, 훈련•연수형 교육기관, 시민사회 단체형 교육기관 &nbsp;
                        <br />
                        * 그 밖의 다른 법령에 의한 기관의 경우 반드시 해당 설치 및 운영 법적 근거 및 평생교육 사업 수행 여부 확인
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-outreach-category">
                        실습지도자요건
                      </td>
                      <td className="practice-outreach-content">
                        - 평생교육사 1급 자격증 소지자
                        <br />
                        {" "}- 평생교육사 2급 자격증을 보유하고 관련 업무 2년 이상 종사한 자
                        <br />
                        {" "}- 평생교육사 3급 자격증을 보유하고 관련 업무 3년 이상 종사한 자
                        <br />
                        {" "}- 동일 시간대를 기준으로 하여 실습 지도자 1인ㄷ 당 실습생은 가능한 5명의 범위 내에서 지도 및 관리
                        <br />
                        {" "}- 실습 지도자는 실습생이 제출한 실습일지를 검토하고, 주 1회(1주: 40시간), 총 4회에 걸쳐 실습생의 실습수행에 대한 의견을 실습지도 기록서에 기록
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-outreach-category">
                        실습의뢰
                      </td>
                      <td className="practice-outreach-content">
                        - 실습 수강료 이외에 실습 기관에 지불하는 실습비용 별도로 있음
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-outreach-category">
                        실습기간
                      </td>
                      <td className="practice-outreach-content">
                        수강 등록한 평생교육실습 과목 운영기관에서 정하는 실습인정 기간 내 160시간 이수
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-outreach-category">
                        실습시간
                      </td>
                      <td className="practice-outreach-content">
                        - 최소 4주간(최소 20일 이상) 총 160시간 이상 실시
                        <br />
                        {" "}- 하루 4시간 이상 8시간 이하
                        <br />
                        {" "}- 주중, 주말, 야간 가능(단, 야간이나 주말 실습일 경우 프로그램이 운영중이여야 하며 실습지도자가 상근해야 함)
                        <br />
                        {" "}- 점심 및 저녁 등의 식사시간은 총 160시간의 실습시간에서 제외
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-outreach-category">
                        참고 사이트
                      </td>
                      <td className="practice-outreach-content">
                        평생교육사 자격관리 사이트(https://lledu.nile.ork.kr)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        }
        step3={
          <>
            <div className="container">
              <h1 className="page-title">
                실습진행
              </h1>
              <div className="practice-register-container" style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px" }}>
                <ul className="page-list" style={{ margin: "0", padding: "0" }}>
                  <li className="page-list-plain">
                    실습과목을 신청할 수 있는 교육기관(대학부설평생교육원, 사이버대학교시간제, 직업학교, 원격평생교육원)에 따라 모집요강이 다르므로 실습 담당자의 안내를 받아 접수 진행
                  </li>
                  <li className="page-list-item">
                    세미나 출석일정에 맞춰 출석 + 실습인정 기간 내에 실습기관에서 실습 진행하며 실습일지 작성
                  </li>
                  <li className="page-list-item">
                    실습 관련 문의 사항은 실습 담당자에게 문의
                  </li>
                </ul>
              </div>
            </div>
          </>
        }
      />
    </main>
  );
}
