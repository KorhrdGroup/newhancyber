import type { Metadata } from "next";
import Link from "next/link";
import PracticeTabs from "@/components/practice-support/PracticeTabs";
import { TBD_HREF } from "@/lib/navigation";

export const metadata: Metadata = { title: "한국어교원실습" };

// 추후 오픈 예정 — 메뉴·사이트맵에서 숨김 처리된 페이지
export default function KoreanTeacherPracticePage() {
  return (
    <main className="wrapper">
      <PracticeTabs
        step1Label="한국어교원 실습 선이수과목"
        step1={
          <>
            <div className="container">
              <h1 className="page-title">
                실습 전 필수 확인사항
              </h1>
              <ul className="page-list" style={{ backgroundColor: "#fff", padding: "24px" }}>
                <li className="page-list-plain">
                  - 한국어교원 현장실습 과목은 한국어교원 자격증 이수 교과목 중 한국어학(1영역), 외국어로서의 한국어교육론(3영역) 합해 8과목(24학점) 이상 이수 해야 실습을 진행할 수 있습니다.
                </li>
                <li className="page-list-plain">
                  -실습 = 학교 출석수업 + 실습기관에서의 현장실습
                  <br />
                  {" "}실습도 하나의 과목이기 때문에 실습 과목을 수강신청한 후에 신청한 학교 일정에 맞춰 “학교 출석수업”과 “실습기관에서의 현장실습”을 동시에 진행
                </li>
              </ul>
            </div>
            <div className="container">
              <h1 className="page-title">
                한국어교원 과목
              </h1>
              <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <table className="page-table practice-requirement-table">
                  <thead>
                    <tr>
                      <th colSpan={2} className="practice-requirement-header">
                        영역
                      </th>
                      <th colSpan={1} className="practice-requirement-header">
                        교과목
                      </th>
                      <th colSpan={1} className="practice-requirement-header">
                        필수 이수 학점
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="practice-requirement-category">
                        1영역
                      </td>
                      <td className="practice-requirement-content">
                        한국어학
                      </td>
                      <td className="practice-requirement-content">
                        한국어학개론, 한국어음운론, 한국어문법론, 한국어어휘론, 한국어의미론, 한국어화용론, 한국어사, 한국어어문규범 등
                      </td>
                      <td className="practice-requirement-content">
                        6학점
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-requirement-category">
                        2영역
                      </td>
                      <td className="practice-requirement-content">
                        일반언어학 및 응용언어학
                      </td>
                      <td className="practice-requirement-content">
                        응용언어학, 언어학개론, 대조언어학, 사회언어학, 심리언어학, 외국어습득론
                      </td>
                      <td className="practice-requirement-content">
                        6학점
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-requirement-category">
                        3영역
                      </td>
                      <td className="practice-requirement-content">
                        외국어로서의한국어교육론
                      </td>
                      <td className="practice-requirement-content">
                        한국어교육개론, 한국어표현교육론, 한국어교재론, 한국어이해교육론, 한국어문법교육론, 한국어발음교육론, 한국문화교육론, 한국어어휘교육론, 한국어교육과정 및 교수요목설계, 한국어능력평가론, 언어교수이론, 한국어한자교육론, 한국어교육정책론, 한국어번역론 등
                      </td>
                      <td className="practice-requirement-content">
                        24학점
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-requirement-category">
                        4영역
                      </td>
                      <td className="practice-requirement-content">
                        한국문화
                      </td>
                      <td className="practice-requirement-content">
                        한국문학개론, 현대한국사회, 한국사의이해, 한국의현대문화, 한국민속학, 한국의전통문화, 전통문화현장실습, 한국현대문화비평, 한국문학의이해 등
                      </td>
                      <td className="practice-requirement-content">
                        6학점
                      </td>
                    </tr>
                    <tr>
                      <td className="practice-requirement-category">
                        5영역
                      </td>
                      <td className="practice-requirement-content">
                        한국어교육실습
                      </td>
                      <td className="practice-requirement-content">
                        한국어교육실습
                      </td>
                      <td className="practice-requirement-content">
                        3학점
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="practice-requirement-category" style={{ textAlign: "center", backgroundColor: "#fff", fontWeight: "400", fontSize: "12px" }}>
                        합계
                      </td>
                      <td className="practice-requirement-content" style={{ textAlign: "center" }}>
                        45학점
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ul className="page-list" style={{ marginTop: "10px" }}>
                <li className="page-list-dangu">
                  단, 국립국어원에 자격증 심사 신청을 위해서 외국어로서의 한국어학 학위를 취득해야 하며, 학위취득을 위한 조건은 최소 48학점(대졸 기준)입니다. 따라서 국립국어원에서 제시하는 영역별 필수이수 학점인 45학점 외에도 추가로 3학점을 더 이수해야 한국어교원2급 자격증 심사 신청 및 발급이 가능합니다.
                </li>
                <li className="page-list-dangu">
                  학위취득을 위한 교과목: 교육심리학 또는 1~4영역 1과목 추가 수강해야 함.
                </li>
              </ul>
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
                <a href={TBD_HREF} className="practice-branch-item" style={{ width: "268px" }}>
                  <div className="practice-branch-content">
                    <img src="/resources/images/pratice-support/branch-04.png" alt="한국사회복지시협회 자격관리센터" className="practice-branch-logo" />
                  </div>
                  <img src="/resources/images/pratice-support/ep_arrow-up-bold.png" alt="화살표" className="practice-branch-arrow" />
                </a>
              </div>
              <p className="table-content-note" style={{ color: "#656565", fontWeight: "400", fontSize: "14px" }}>
                * 현재 코로나 19이후, 오프라인 현장실습 대신 온라인 실습으로 대체되었습니다.
              </p>
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
