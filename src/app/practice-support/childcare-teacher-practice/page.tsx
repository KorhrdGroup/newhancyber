import type { Metadata } from "next";
import Link from "next/link";
import PracticeTabs from "@/components/practice-support/PracticeTabs";
import { TBD_HREF } from "@/lib/navigation";

export const metadata: Metadata = { title: "보육교사실습" };

// 추후 오픈 예정 — 메뉴·사이트맵에서 숨김 처리된 페이지
export default function ChildcareTeacherPracticePage() {
  return (
    <main className="wrapper">
      <PracticeTabs
        step1Label="보육실습 선이수과목"
        step1={
          <>
            <div className="container">
              <h1 className="page-title">
                실습 전 필수 확인사항
              </h1>
              <ul className="page-list" style={{ backgroundColor: "#fff", padding: "24px" }}>
                <li className="page-list-plain">
                  보육실습 과목 운영 교육기관마다{" "}
                  <strong>
                    선이수과목이 다르므로
                  </strong>
                  {" "}실습과목 수강신청 전 해당 기관의 선이수과목을 반드시 확인하시기 바랍니다.
                </li>
              </ul>
            </div>
            <div className="container">
              <h1 className="page-title">
                보육교사2급 과목
              </h1>
              <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <table className="page-table practice-requirement-table">
                  <thead>
                    <tr>
                      <th colSpan={1} className="practice-requirement-header">
                        구분
                      </th>
                      <th colSpan={1} className="practice-requirement-header">
                        교과목
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="practice-requirement-category">
                        교과인성
                      </td>
                      <td className="practice-requirement-content">
                        <span className="text-red">
                          보육교사(인성)론, 아동권리와복지, 보육교사 역할과 책임
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-requirement-category">
                        보육지식과기술
                      </td>
                      <td className="practice-requirement-content">
                        <span className="text-red">
                          놀이지도, 언어지도, 아동음악(아동동작 or 아동미술), 아동수학지도(아동과학지도), 아동안전관리(아동생활지도),
                        </span>
                        {" "}보육학개론, 보육과정, 영유아발달, 영유아교수방법론, 아동건강교육, 영유아사회정서지도, 아동문학교육, 아동상담론, 장애아지도, 특수아동이해, 어린이집운영관리, 영유아보육프로그램개발과평가, 보육정책론, 정신건강론, 아동간호학, 인간행동과사회환경, 아동영양학, 부모교육론, 가족복지론, 가족관계론, 지역사회복지론
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-requirement-category">
                        보육실무
                      </td>
                      <td className="practice-requirement-content">
                        <span className="text-red">
                          아동관찰및행동연구
                        </span>
                        , 보육실습
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="table-content-note">
                *{" "}
                <span className="text-red" style={{ fontWeight: "400" }}>
                  붉은색
                </span>
                은 프라인 출석이 1회 있는 대면 교과목
              </p>
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
                보육교사 실습 기관섭외
              </h1>
              <div className="practice-branch-list">
                <a href={TBD_HREF} className="practice-branch-item" style={{ width: "268px" }}>
                  <div className="practice-branch-content">
                    <div className="practice-branch-text practice-branch-text-only">
                      <span className="practice-branch-text-bottom">
                        통합정보공시홈페이지
                        <br />
                        {" "}바로가기
                      </span>
                    </div>
                  </div>
                  <img src="/resources/images/pratice-support/ep_arrow-up-bold.png" alt="화살표" className="practice-branch-arrow" />
                </a>
                {" "}
                <a href={TBD_HREF} className="practice-branch-item" style={{ width: "268px" }}>
                  <div className="practice-branch-content">
                    <img src="/resources/images/pratice-support/branch-03.png" alt="사회복지포털 복지넷" className="practice-branch-logo" />
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
                        공통사항: 보육 정원 15인 이상
                        <br />
                        {" "}선택사항(3가지 중 반드시 1가지에 해당해야 함)
                        <br />
                        {" "}① 의무평가제 결과: A, B등급을 받은 어린이집(2019.6 이후)
                        <br />
                        {" "}② 평가인증제 결과: 인증상태를 유지하고 있는 어린이집(2017.1.1 이후)
                        <br />
                        {" "}③ 교육부 신고 기준, 방과 후 과정 운영하는 종일제 유치원
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-outreach-category">
                        실습지도자요건
                      </td>
                      <td className="practice-outreach-content">
                        - 보육교사&nbsp;1급 또는 유치원 정교사 1급 자격을 가진 사람{" "}
                        <br />
                        {" "}- 실습지도교사 1명 당 실습생 3명 이내{" "}
                        <br />
                        {" "}- 인가 정원 20인 이하인 가정 어린이집에 한하여 원장이 1급을 소지하고 반을 담당하고 있다면 어린이집 원장도 실습 지도 가능
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
                        실습시간
                      </td>
                      <td className="practice-outreach-content">
                        - 총 240시간 (6주, 평일만 가능)
                        <br />
                        {" "}- 하루 8시간, 평일 오전 9시부터 오후 7시 사이에 한 경우에만 인정 (점심시간 제외)
                        <br />
                        {" "}- 공휴일 또는 어린이집이 방학인 경우 실습 미진행 기간이 1일 이상인 경우 6주 실습에 이어서 연속으로 진행
                        <br />
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-outreach-category">
                        실습평가
                      </td>
                      <td className="practice-outreach-content">
                        - 오프라인 대학: 총 5회 이상 오프라인 출석 / 사이버대학: 학교별 상이
                        <br />
                        {" "}- 실습일지와 실습평가서 작성
                        <br />
                        {" "}- 평가점수 80점 이상
                        <br />
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-outreach-category">
                        참고 사이트
                      </td>
                      <td className="practice-outreach-content">
                        한국보육진흥원 보육인력개발국 홈페이지 (https://chrd.childcare.go.kr)
                        <br />
                        {" "}[자격증 종류 및 자격기준 → 보육관련 교과목/실습기준]
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
