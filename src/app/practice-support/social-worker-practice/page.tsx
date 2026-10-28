import type { Metadata } from "next";
import Link from "next/link";
import PracticeTabs from "@/components/practice-support/PracticeTabs";
import { TBD_HREF } from "@/lib/navigation";

export const metadata: Metadata = { title: "사회복지사실습" };

export default function SocialWorkerPracticePage() {
  return (
    <main className="wrapper">
      <PracticeTabs
        step1Label="실습과목 신청 전 선이수과목"
        step1={
          <>
            <div className="container">
              <h1 className="page-title">
                실습 전 필수 확인사항
              </h1>
              <ul className="page-list" style={{ backgroundColor: "#fff", padding: "24px" }}>
                <li className="page-list-plain">
                  - 사회복지사 현장실습 과목은 사회복지사 2급 자격증 이수 교과목 중 필수 4과목, 선택 2과목 이상의 선이수과목이 충족되어야 수강과 실습을 진행할 수 있습니다.
                </li>
                <li className="page-list-plain">
                  - 실습 = 교육원 출석수업 + 실습기관에서의 현장실습 실습도 하나의 과목이기 때문에 실습 과목을 수강신청한 후에 신청한 학교 일정에 맞춰 &quot;교육원 출석수업&quot;과 &quot;실습기관에서의 현장실습&quot;을 동시에 진행
                </li>
              </ul>
            </div>
            <div className="container">
              <h1 className="page-title">
                실습과목 신청 전 선이수과목
              </h1>
              <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <table className="page-table prerequisite-table">
                  <tbody>
                    <tr>
                      <td className="prerequisite-category">
                        필수과목(4과목) 이상 이수
                      </td>
                      <td className="prerequisite-courses">
                        사회복지개론, 사회복지법제, 사회복지실천기술론, 사회복지실천론, 사회복지정책론, 사회복지조사론, 사회복지행정론, 인간행동과사회환경, 지역사회복지론
                      </td>
                    </tr>
                    <tr>
                      <td className="prerequisite-category">
                        선택과목(2과목) 이상 이수
                      </td>
                      <td className="prerequisite-courses">
                        가족복지론, 가족상담및가족치료, 교정복지론, 국제사회복지론, 노인복지론, 복지국가론, 빈곤론, 사례관리론, 사회문제론, 사회보장론, 사회복지역사, 사회복지와문화다양성, 사회복지와인권, 사회복지윤리와철학, 사회복지자료분석론, 사회복지지도가독론, 산업복지론, 아동복지론, 여성복지론, 의료사회복지론, 자원봉사론, 장애인복지론, 정신건강론, 정신건강사회복지론, 청소년복지론, 프로그램개발과평가, 학교사회복지론
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="practice-law-info-box">
              <div className="practice-law-info-character">
                <img src="/resources/images/pratice-support/pratice-support-04.png" alt="캐릭터" className="practice-law-character-img" />
              </div>
              <div className="practice-law-info-content">
                <h2 className="practice-law-info-title">
                  구법? 신법? 나는 어디에 해당할까?
                </h2>
                <ul className="practice-law-info-list">
                  <li className="practice-law-info-item">
                    법령의 시행일인 2020년 1월 1일 이전에 사회복지학 전공교과목 및 사회복지관련 교과목을 1과목이라도
                    <br />
                    {" "}수강(개강)을 시작했다면 →{" "}
                    <strong>
                      구법 대상자
                    </strong>
                  </li>
                  <li className="practice-law-info-item">
                    2020년 1월 1일 이후에 수강(개강)을 시작했다면 →{" "}
                    <strong>
                      개정법 대상자
                    </strong>
                  </li>
                </ul>
                <p className="practice-law-info-note">
                  *자세한 내용은 &apos;한국사회복지사협회 자격관리센터&apos; 사이트에서 공지사항을 확인하시기 바랍니다.
                </p>
              </div>
            </div>
            <div className="container">
              <h1 className="page-title">
                개정법(신법) - 2020년 1월 1일 이후에 사회복지 과정을 시작한 학습자
              </h1>
              {/* 사회복지현장실습 이수조건 테이블 */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <table className="page-table practice-requirement-table">
                  <thead>
                    <tr>
                      <th colSpan={2} className="practice-requirement-header">
                        사회복지현장실습 이수조건
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="practice-requirement-category">
                        실습시간
                      </td>
                      <td className="practice-requirement-content">
                        160시간 이상
                        <br />
                        {" "}하루 4시간 이상 8시간 이하
                        <br />
                        {" "}주중, 주말, 야간 가능
                        <br />
                        {" "}(단, 야간이나 주말실습일 경우 프로그램이 운영중이여야 하며 실습 지도자가 상근해야 함)
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-requirement-category">
                        실습세미나
                      </td>
                      <td className="practice-requirement-content">
                        총 30시간
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-requirement-category">
                        실습기관
                      </td>
                      <td className="practice-requirement-content">
                        보건복지부장관으로부터 선정된 사회복지사업을 수행하는, 평가인증을 받은 사회복지 기관, 법인, 시설 또는 단체로 실습기관
                        <br />
                        {" "}지도자가 2명 이상 상근해야 함
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-requirement-category">
                        실습지도자
                      </td>
                      <td className="practice-requirement-content">
                        1급 사회복지사 자격증을 취득한 이후, 3년 이상의 사회복지사업 실무경험 보유
                        <br />
                        {" "}2급 사회복지사 자격증을 취득한 이후, 5년 이상의 사회복지사업 실무경험 보유
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* 구법/신법 안내 박스 */}
            </div>
            <div className="container">
              <h1 className="page-title">
                개정법(신법) - 2020년 1월 1일 이후에 사회복지 과정을 시작한 학습자
              </h1>
              {/* 사회복지현장실습 이수조건 테이블 */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <table className="page-table practice-requirement-table">
                  <thead>
                    <tr>
                      <th colSpan={2} className="practice-requirement-header">
                        사회복지현장실습 이수조건
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="practice-requirement-category">
                        실습시간
                      </td>
                      <td className="practice-requirement-content">
                        120시간 이상
                        <br />
                        {" "}하루 4시간 이상 8시간 이하
                        <br />
                        {" "}주중, 주말, 야간 가능
                        <br />
                        {" "}(단, 야간이나 주말실습일 경우 프로그램이 운영중이여야 하며 실습 지도자가 상근해야 함)
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-requirement-category">
                        실습세미나
                      </td>
                      <td className="practice-requirement-content">
                        각 운영기관마다 상이함
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-requirement-category">
                        실습기관
                      </td>
                      <td className="practice-requirement-content">
                        보건복지부장관으로부터 선정된 사회복지사업을 수행하는, 평가인증을 받은 사회복지 기관, 법인, 시설 또는 단체로 실습기관
                        <br />
                        {" "}지도자가 2명 이상 상근해야 함
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-requirement-category">
                        실습지도자
                      </td>
                      <td className="practice-requirement-content">
                        1급 사회복지사 자격증을 취득한 이후, 3년 이상의 사회복지사업 실무경험 보유
                        <br />
                        {" "}2급 사회복지사 자격증을 취득한 이후, 5년 이상의 사회복지사업 실무경험 보유
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* 구법/신법 안내 박스 */}
            </div>
          </>
        }
        step2={
          <>
            <div className="container">
              <h1 className="page-title">
                실습과목 접수 / 실습기관 섭외
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
                사회복지현장실습 기관섭외
              </h1>
              <div className="practice-branch-list">
                <a href={TBD_HREF} className="practice-branch-item">
                  <div className="practice-branch-content">
                    <img src="/resources/images/pratice-support/branch-01.png" alt="한국사회복지시협회 자격관리센터" className="practice-branch-logo" />
                  </div>
                  <img src="/resources/images/pratice-support/ep_arrow-up-bold.png" alt="화살표" className="practice-branch-arrow" />
                </a>
                {" "}
                <a href={TBD_HREF} className="practice-branch-item">
                  <div className="practice-branch-content">
                    <img src="/resources/images/pratice-support/branch-02.png" alt="사회복지포털 복지넷" className="practice-branch-logo" />
                  </div>
                  <img src="/resources/images/pratice-support/ep_arrow-up-bold.png" alt="화살표" className="practice-branch-arrow" />
                </a>
                {" "}
                <a href={TBD_HREF} className="practice-branch-item">
                  <div className="practice-branch-content">
                    <div className="practice-branch-text practice-branch-text-only">
                      <span className="practice-branch-text-top">
                        사회복지현장실습기관
                      </span>
                      {" "}
                      <span className="practice-branch-text-bottom">
                        선정 현황
                      </span>
                    </div>
                  </div>
                  <img src="/resources/images/pratice-support/ep_arrow-up-bold.png" alt="화살표" className="practice-branch-arrow" />
                </a>
              </div>
              <div style={{ marginTop: "30px" }}>
                <table className="page-table practice-outreach-table">
                  <thead>
                    <tr>
                      <th colSpan={2}>
                        사회복지현장실습 기관 섭외
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="practice-outreach-category">
                        실습기관섭외
                      </td>
                      <td className="practice-outreach-content">
                        - 사회복지법인 및 사회복지시설(이용시설, 거주시설 등)
                        <br />
                        {" "}- 공공기관(지방자치단체 등)
                        <br />
                        {" "}- 사회복지서비스를 제공하는 병원, 학교, 교정시설, 시민사회단체 등
                        <br />
                        {" "}※ 위 기관 예시는 참고용이며, 실습기관 선정은 한국사회복지사협회 등록 여부를 확인하여 결정해야 합니다.
                        <br />
                        {" "}※ 현재 근무하는 기관 및 동일 법인, 재단에서 실습 불가능
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-outreach-category">
                        실습지도자요건
                      </td>
                      <td className="practice-outreach-content">
                        - 1급 사회복지사자격증을 취득한 이후 3년 이상의 사회복지사업의 실무 경험이 있는 자
                        <br />
                        {" "}- 2급 사회복지사자격증을 취득한 이후 5년 이상의 사회복지사업의 실무 경험이 있는자
                        <br />
                        {" "}- 기관실습이 실시되는 연도의 전년도에 8시간 이상의 보수교육 이수한 자
                        <br />
                        {" "}- 기관실습 지도자 1명이 동시에 지도할 수 있는 학생 수는 5명 이내
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-outreach-category">
                        실습의뢰
                      </td>
                      <td className="practice-outreach-content">
                        - 실습 담당자 통해 실습 진행할 기관에 실습 요청
                        <br />
                        {" "}- 실습 수강료 이외에 실습 기관에 지불하는 실습비용 별도로 발생됨
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-outreach-category">
                        실습시간
                      </td>
                      <td className="practice-outreach-content">
                        - 총 160시간(야간/주말 가능)
                        <br />
                        {" "}단, 2019년 12월 31일까지 일부 교과목을 수강한 경우는 120시간 적용 대상이나 규정에 따라야 함
                        <br />
                        {" "}- 하루 최소 4시간 이상, 최대 8시간 이하
                        <br />
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-outreach-category">
                        실습평가
                      </td>
                      <td className="practice-outreach-content">
                        - 오프라인 대학: 총 5회 이상 오프라인 출석 / 사이버대학교: 학교별 상이
                        <br />
                        {" "}- 실습 세미나
                        <br />
                        {" "}- 실습일지와 실습 평가서 작성
                        <br />
                        {" "}- 평가점수 60점 이상
                        <br />
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
