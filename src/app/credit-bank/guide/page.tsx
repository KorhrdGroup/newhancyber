import type { Metadata } from "next";
import GuideTabs from "@/components/credit-bank/GuideTabs";

export const metadata: Metadata = { title: "행정절차 가이드" };

const procedure = (
  <>
    <div className="container">
      <h1 className="page-title">
        신청절차 안내
      </h1>
      <p className="page-sub-title">
        학점은행제에서는 학습자등록, 학점인정 신청, 학위신청을 완료하고 학위수여 요건을 충족한 자에게 학위를 수여하고 있습니다.
      </p>
      <img src="/resources/images/guide/guide-1.png" alt="신청절차 안내" className="page-image" />
      <table className="page-table schedule-table">
        <thead>
          <tr>
            <th>
              12월
            </th>
            <th>
              1월
            </th>
            <th>
              2월
            </th>
            <th>
              3월
            </th>
            <th>
              4월
            </th>
            <th>
              5월
            </th>
            <th>
              6월
            </th>
            <th>
              7월
            </th>
            <th>
              8월
            </th>
            <th>
              9월
            </th>
            <th>
              10월
            </th>
            <th>
              11월
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2} className="schedule-cell">
              학습자 등록
              <br />
              {" "}학점인정신청
              <br />
              {" "}학위신청
            </td>
            <td colSpan={2} className="schedule-cell empty"></td>
            <td className="schedule-cell">
              학습자 등록
              <br />
              {" "}학점인정신청
            </td>
            <td className="schedule-cell empty"></td>
            <td colSpan={2} className="schedule-cell">
              학습자 등록
              <br />
              {" "}학점인정신청
              <br />
              {" "}학위신청
            </td>
            <td colSpan={2} className="schedule-cell empty"></td>
            <td className="schedule-cell">
              학습자 등록
              <br />
              {" "}학점인정신청
            </td>
            <td className="schedule-cell empty"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="container">
      <h1 className="page-title">
        학습자 등록
      </h1>
      <ul className="page-list">
        <li className="page-list-item">
          학위과정 및 전공 선택
        </li>
        <li className="page-list-item">
          최소 1번 신청
        </li>
        <li className="page-list-item">
          학위신청 마감일 75일 이전에 학습자등록 신청할 것(60일 이상 처리기간 들어감)
        </li>
        <li className="page-list-dangu">
          신청기간 및 방법 분기별 신청안내 참조
        </li>
      </ul>
    </div>
    <div className="container">
      <h1 className="page-title">
        학점인정 신청
      </h1>
      <ul className="page-list">
        <li className="page-list-item">
          수업 이수 등은 각 교육훈련기관에서 이루어지며, 학점을 취득한 이후 국가평생교육진흥원으로 학점인정 신청을 해야함
        </li>
        <li className="page-list-item">
          취득 학점이 있을 때마다 수시로 학점인정 신청 하는 것이 좋음
        </li>
        <li className="page-list-item">
          다양한 전공의 학위를 취득할 수 있습니다.
        </li>
        <li className="page-list-dangu">
          신청기간 및 방법 분기별 신청안내 참조
        </li>
      </ul>
    </div>
    <div className="container">
      <h1 className="page-title">
        학위 수여(2월,8월)
      </h1>
      <ul className="page-list">
        <li className="page-list-item">
          매년 2월, 8월 학위수여 실시 (단, 학위수여식은 매년 2월에 한 번만 개최)
        </li>
      </ul>
    </div>
  </>
);

const registration = (
  <>
    <div className="container container-positive">
      <h1 className="page-title">
        학습자 등록이란?
      </h1>
      <img src="/resources/images/guide/guide-2.png" alt="학습자 등록이란" className="page-absolute-image" />
      <ul className="page-list">
        <li className="page-list-item">
          학습자 학점을 인정받아 학위를 취득하기 위하여 학점은행제 학습자로 등록하는 것으로, 희망 학위 과정 및 전공을 선택하여
          <br />
          {" "}접수기간 중에 신청하여야 합니다.
          <br />
          {" "}※ 최초 한 번 등록, 학점인정 신청과 동시에 신청 가능함.
        </li>
        <li className="page-list-item">
          신청기간 내에만 신청이 가능합니다. (학습 전-후 등의 학습 진행상태와 관계없이 신청 가능합니다.
        </li>
        <li className="page-list-item">
          학습자 등록 수수료는 4,000원입니다. (필수)
        </li>
        <li className="page-list-dangu">
          학위신청 마감일을 기준으로 75일 전의 등록기간 중에는 학습자등록을 해야합니다.
          <br />
          {" "}※ 근거 기준: [학점인정 등에 관한 운영규정] 제 18조 제 6항
          <br />
          {" "}Ex). 2025년 2월 (전기) 학위수여 예정자의 경우, 늦어도 2024년 4분기 신청기간 중에 학습자 등록을 하여야 함.
        </li>
      </ul>
      <table className="page-table schedule-table">
        <thead>
          <tr>
            <th className="active">
              12월
            </th>
            <th className="active">
              1월
            </th>
            <th>
              2월
            </th>
            <th>
              3월
            </th>
            <th className="active">
              4월
            </th>
            <th>
              5월
            </th>
            <th className="active">
              6월
            </th>
            <th className="active">
              7월
            </th>
            <th>
              8월
            </th>
            <th>
              9월
            </th>
            <th className="active">
              10월
            </th>
            <th>
              11월
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2} className="schedule-cell">
              <span className="text-primary">
                학습자 등록
              </span>
              <br />
              {" "}학점인정신청
              <br />
              {" "}학위신청
            </td>
            <td colSpan={2} className="schedule-cell empty"></td>
            <td className="schedule-cell">
              <span className="text-primary">
                학습자 등록
              </span>
              <br />
              {" "}학점인정신청
            </td>
            <td className="schedule-cell empty"></td>
            <td colSpan={2} className="schedule-cell">
              <span className="text-primary">
                학습자 등록
              </span>
              <br />
              {" "}학점인정신청
              <br />
              {" "}학위신청
            </td>
            <td colSpan={2} className="schedule-cell empty"></td>
            <td className="schedule-cell">
              <span className="text-primary">
                학습자 등록
              </span>
              <br />
              {" "}학점인정신청
            </td>
            <td className="schedule-cell empty"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="container">
      <h1 className="page-title">
        학위 수여(2월,8월)
      </h1>
      <table className="page-table quarter-table">
        <thead>
          <tr>
            <th>
              1분기
            </th>
            <th>
              2분기
            </th>
            <th>
              3분기
            </th>
            <th>
              4분기
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              12월 중순 - 1월 중
              <br />
              (홈페이지 참고)
            </td>
            <td>
              4월 중
              <br />
              (홈페이지 참고)
            </td>
            <td>
              6월 중순 - 7월 중
              <br />
              (홈페이지 참고)
            </td>
            <td>
              10월 중
              <br />
              (홈페이지 참고)
            </td>
          </tr>
        </tbody>
      </table>
      <ul className="page-list" style={{ marginTop: "10px" }}>
        <li className="page-list-dangu">
          단, 접수기간은 추후 변동 가능하니 자세한 사항은 연간 주요 학사일정을 참조하십시오.
        </li>
        <li className="page-list-dangu">
          평일 (월~금) 09:00~17:00까지 접수 가능합니다.
        </li>
        <li className="page-list-dangu">
          교육청 접수시간: 오전 09:00~12:00, 오후 13:00~16:00 (해당 교육청의 접수 마감 시간을 확인하시기 바랍니다.)
        </li>
        <li className="page-list-dangu">
          현재 학습자 등록 및 학점인정 신청은 방문접수 (대리인 접수 가능) 외에 온라인 접수 (분기별 일정 기간)도 시행되고 있습니다.
        </li>
        <li className="page-list-dangu">
          방문접수의 경우, 토,&nbsp;일,&nbsp;공휴일&nbsp;제외
        </li>
      </ul>
    </div>
    <div className="container">
      <h1 className="page-title">
        학습자 등록 해야 하는 이유
      </h1>
      <ul className="page-list">
        <li className="page-list-number">
          매년 2월, 8월 학위수여 실시 (단, 학위수여식은 매년 2월에 한 번만 개최)
          <ul style={{ marginTop: "8px", marginBottom: "8px" }}>
            <li className="page-list-dangu" style={{ marginLeft: "0" }}>
              단, 학습자 등록을 하지 않아도 학습 과목을 먼저 이수할 수 있습니다.
            </li>
          </ul>
        </li>
        <li className="page-list-number">
          학점은행제 홈페이지(www.cb.or.kr) &apos;마이페이지 - 학습자 정보검색&apos;을 통한 본인의 학점인정 사항을 조회할 수 있습니다.
        </li>
        <li className="page-list-number">
          [학점인정 등에 관한 운영규정] 제 18조에 근거하여 ‘학습자 등록’은 최소 학위신청 마감일 75일 (1분기) 이전에 신청하여야 당해 학위신청 및 학위 취득이 가능합니다.
          <br />
          {" "}이와 동시에 ‘학위수여 예정증명서’ [학점인정 등에 관한 운영규정] 제 33조에 근거하여 ‘학습자 등록’ 완료 후 학사 100점, 전문학사 40학점 이상 인정되어 있는 경우에만 발급 받을 수 있습니다.
          <br />
          {" "}※ 학습자 등록과 학점인정 신청은 되도록 빠른 시기에 신청하여 수시로 결과 확인 후 학습계획을 세우시기 바랍니다.
        </li>
        <li className="page-list-number">
          ‘학습자 등록’ 선행 후 ‘학점인정’이 완료된 경우, 본인의 학점인정 사항 확인 및 진학, 타 기관 제출 등을 위한 학점은행제 각 종 증명서를 발급 받을 수 있습니다.
        </li>
        <li className="page-list-number">
          ‘학습자 등록’이 되어 있는 학습자가 학점은행제 각 종 상담 시, 상담원이 본인의 학적상태 및 학점인정 사항 등을 바로 확인할 수 있어 더욱 정확한 상담 내용을 제공 받을 수 있습니다.
        </li>
      </ul>
    </div>
    <div className="container">
      <h1 className="page-title">
        학습자 등록 신청 시 제출서류
      </h1>
      <table className="page-table document-table">
        <thead>
          <tr>
            <th>
              구분
            </th>
            <th>
              제출서류
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={2} style={{ height: "100px" }}>
              고등학교 졸업
            </td>
            <td>
              검정고시 합격 증명서
            </td>
          </tr>
          <tr>
            <td>
              고등학교 졸업 증명서
            </td>
          </tr>
          <tr>
            <td>
              전문대학, 대학 재(휴)학
            </td>
            <td>
              재학(휴학) 또는 제적증명서
            </td>
          </tr>
          <tr>
            <td>
              전문대학, 대학 제적
            </td>
            <td>
              제적증명서
            </td>
          </tr>
          <tr>
            <td>
              전문대학, 대학 졸업
            </td>
            <td>
              졸업 증명서
            </td>
          </tr>
          <tr>
            <td>
              독학학위제 취득
            </td>
            <td>
              제출서류 없음
            </td>
          </tr>
          <tr>
            <td>
              간호·보건계열 학습자 등록 신청자
            </td>
            <td>
              면허(자격)증명서
              <br />
              * 면허증 제출 불가
            </td>
          </tr>
          <tr>
            <td>
              북한이탈주민
            </td>
            <td>
              국가평생교육진흥원 학점은행제 홈페이지 참고
            </td>
          </tr>
          <tr>
            <td>
              외국교육과정 이수자
            </td>
            <td>
              국가평생교육진흥원 학점은행제 홈페이지 참고
            </td>
          </tr>
        </tbody>
      </table>
      <ul className="page-list" style={{ marginTop: "10px" }}>
        <li className="page-list-dangu">
          수수료 1인 당 4,000원
        </li>
        <li className="page-list-dangu">
          2개 이상 대학 졸업/제적 시 각 대학의 증명서 모두 제출하여야 함.
        </li>
        <li className="page-list-dangu">
          학위취득 예정자는 학위신청 마감일을 기준으로 75일 전에 학습자 등록 신청서를 제출해야 합니다. 따라서 전기 (2월) 학위취득 예정자는 전년도 4분기 (10월) 접수기간,
          <br />
          {" "}후기 (8월) 학위취득 예정자는 2분기 (4월) 접수기간까지 학습자 등록을 해야 합니다.
        </li>
        <li className="page-list-dangu">
          온라인 접수 시 반드시 범용인증서를 통해 로그인 하고, 신청서류 및 증빙서류는 정해진 일자까지 국가평생진흥원으로 우편 발송해야 합니다.
        </li>
        <li className="page-list-dangu">
          국가평생교육진흥원으로 접수된 서류는 반환되지 않습니다.
        </li>
      </ul>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
        <a href="https://www.cb.or.kr/creditbank/base/nPerSeason.do" target="_blank" rel="noopener noreferrer" className="learner-registration-btn">
          <span>
            학습자등록 바로가기
          </span>
          {" "}
          <img src="/resources/images/credit-bank/right-arrow.png" alt="화살표" className="learner-registration-arrow" />
        </a>
      </div>
    </div>
  </>
);

const credit = (
  <>
    <div className="container container-positive">
      <h1 className="page-title">
        학습자 등록이란?
      </h1>
      <img src="/resources/images/guide/guide-3.png" alt="학습자 등록이란" className="page-absolute-image" />
      <ul className="page-list">
        <li className="page-list-item">
          학점인정 신청은 여러 방법을 통하여 취득한 학점을 학점은행제 학점으로 인정 받기 위한 신청절차로 신청기간 중에 학점인정 신청을 해야만
          <br />
          {" "}정식 학점으로 인정 받을 수 있으며, 인정 처리 이후 성적증명서 등의 인정내역에 대한 각종 증명서를 발급 받을 수 있습니다.
        </li>
        <li className="page-list-item">
          학점인정은 학위요건에 필요한 모든 학점 취득 후 한꺼번에 신청하기 보다는 취득한 학점이 있을 시 가까운 신청기간을 이용하여 계속적으로 신청하는 것이 좋습니다.
          <br />
          특히, 학위수여 예정 증명서를 발급받고자 하는 경우, 신청일 이전에 학습자로 등록되어 있어야 하고, 학사학위 과정은 100학점 (전문학사 과정은 40학점) 이상의
          <br />
          {" "}학점을 인정받은 자에 한하므로 취득 학점은 가까운 신청기간 중 계속적으로 신청하시기 바랍니다.{" "}
          <br />
          ※ 근거기준: [학점인정 등에 관한 운영규정] 제 33조 제 4항
        </li>
      </ul>
      <table className="page-table schedule-table">
        <thead>
          <tr>
            <th className="active">
              12월
            </th>
            <th className="active">
              1월
            </th>
            <th>
              2월
            </th>
            <th>
              3월
            </th>
            <th className="active">
              4월
            </th>
            <th>
              5월
            </th>
            <th className="active">
              6월
            </th>
            <th className="active">
              7월
            </th>
            <th>
              8월
            </th>
            <th>
              9월
            </th>
            <th className="active">
              10월
            </th>
            <th>
              11월
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2} className="schedule-cell">
              학습자 등록
              <br />
              {" "}
              <span className="text-primary">
                학점인정신청
              </span>
              <br />
              {" "}학위신청
            </td>
            <td colSpan={2} className="schedule-cell empty"></td>
            <td className="schedule-cell">
              학습자 등록
              <br />
              {" "}
              <span className="text-primary">
                학점인정신청
              </span>
            </td>
            <td className="schedule-cell empty"></td>
            <td colSpan={2} className="schedule-cell">
              학습자 등록
              <br />
              {" "}
              <span className="text-primary">
                학점인정신청
              </span>
              <br />
              {" "}학위신청
            </td>
            <td colSpan={2} className="schedule-cell empty"></td>
            <td className="schedule-cell">
              학습자 등록
              <br />
              {" "}
              <span className="text-primary">
                학점인정신청
              </span>
              <br />
            </td>
            <td className="schedule-cell empty"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="container">
      <h1 className="page-title">
        학점인정 신청 시 주의사항
      </h1>
      <ul className="page-list">
        <li className="page-list-item">
          학점인정 신청 전에 학습자 등록 신청이 선행되어야 합니다.
        </li>
        <li className="page-list-item">
          취득한 모든 학점은 학점인정 신청을 해야만 학점으로 인정 받을 수 있습니다.
        </li>
        <li className="page-list-item">
          정해진 기간에만 각종 신청이 가능하므로 취득학점은 가능한 빠른 신청기간에 학점인정 신청 하기를 권장합니다.
        </li>
        <li className="page-list-item">
          수수료는 학점 당 1,000원입니다.
        </li>
      </ul>
    </div>
    <div className="container">
      <h1 className="page-title">
        학점인정 신청 시 주의사항
      </h1>
      <table className="page-table schedule-guide-table">
        <thead>
          <tr>
            <th colSpan={2}>
              구분
            </th>
            <th>
              1/4분기
            </th>
            <th>
              2/4분기
            </th>
            <th>
              3/4분기
            </th>
            <th>
              4/4분기
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2} className="category-cell">
              온라인 신청
            </td>
            <td>
              12월 중순 ~ 1월 중
              <br />
              <span className="note">
                (홈페이지 참고)
              </span>
            </td>
            <td>
              4월 중
              <br />
              <span className="note">
                (홈페이지 참고)
              </span>
            </td>
            <td>
              6월 중순 ~ 7월 중
              <br />
              <span className="note">
                (홈페이지 참고)
              </span>
            </td>
            <td>
              10월 중
              <br />
              <span className="note">
                (홈페이지 참고)
              </span>
            </td>
          </tr>
          <tr>
            <td rowSpan={2} className="category-cell">
              온라인 접수
            </td>
            <td className="sub-category">
              국평원
            </td>
            <td rowSpan={2}>
              12월 중순 ~ 1월 중
              <br />
              <span className="note">
                (홈페이지 참고)
              </span>
            </td>
            <td rowSpan={2}>
              4월 중
              <br />
              <span className="note">
                (홈페이지 참고)
              </span>
            </td>
            <td rowSpan={2}>
              6월 중순 ~ 7월 중
              <br />
              <span className="note">
                (홈페이지 참고)
              </span>
            </td>
            <td rowSpan={2}>
              10월 중
              <br />
              <span className="note">
                (홈페이지 참고)
              </span>
            </td>
          </tr>
          <tr>
            <td className="sub-category">
              17개
              <br />
              시·도 교육청
            </td>
          </tr>
        </tbody>
      </table>
      <ul className="page-list" style={{ marginTop: "10px" }}>
        <li className="page-list-plain">
          ★ 주의 ★
          <br />
          {" "}학점인정 신청 기간은 위 표와 같이 매년 비슷한 일정으로 진행되나, 요일 및 공휴일에 따라 날짜가 상이할 수 있으므로 반드시 국가평생교육진흥원 홈페이지에서 날짜를 확인하시기 바랍니다.
        </li>
        <li className="page-list-dangu">
          평일 (월~금) 09:00~17:00까지 접수 가능합니다.
        </li>
        <li className="page-list-dangu">
          교육청 접수시간: 오전 09:00~12:00, 오후 13:00~16:00 (해당 교육청의 접수 마감 시간을 확인하시기 바랍니다.)
        </li>
        <li className="page-list-dangu">
          현재 학습자 등록 및 학점인정 신청은 방문접수 (대리인 접수 가능) 외에 온라인 접수 (분기별 일정 기간)도 시행되고 있습니다.
        </li>
        <li className="page-list-dangu">
          방문접수의 경우, 토,일,공휴일제외
        </li>
      </ul>
    </div>
    <div className="container">
      <h1 className="page-title">
        학점인정 신청 시 주의사항
      </h1>
      <p className="page-sub-title">
        학점인정 신청서와 해당하는 별지: 국가평생교육진흥원 알림마당 [자료실]에서 다운받아 작성할 수 있음
      </p>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <table className="page-table credit-source-table">
          <thead>
            <tr>
              <th>
                학점원
              </th>
              <th>
                별지서식
              </th>
              <th>
                증빙서류
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                평가인정학습과목
              </td>
              <td>
                별지 제5호의 2 서식
              </td>
              <td>
                제출서류 없음 (사전보고에 의해 전산에서 확인 가능)
              </td>
            </tr>
            <tr>
              <td>
                학점인정대상학교 학습과목
              </td>
              <td>
                별지 제5호의 3 서식
              </td>
              <td>
                성적증명서 1부 (이수한 대학(교)에서 발급)
                <br />
                {" "}
                <span className="table-note">
                  * 2개 이상의 대학(교) 졸업(제적)자가 각 대학에서 이수한 학점을 인정 받고자 할 경우에는 각 대학(교)의 졸업(제적)증명서, 성적증명서를 모두 제출해야 함
                </span>
              </td>
            </tr>
            <tr>
              <td>
                시간제 등록
              </td>
              <td>
                별지 제5호의 4 서식
              </td>
              <td>
                성적증명서 1부 (이수한 대학(교)에서 발급)
              </td>
            </tr>
            <tr>
              <td>
                자격
              </td>
              <td>
                별지 제5호의 5 서식
              </td>
              <td>
                자격증 원본 및 사본 1부
                <br />
                {" "}
                <span className="table-note">
                  * 국가평생교육진흥원 방문접수 시 자격증 원본은 대조 후 신청자에게 즉시 반환함
                </span>
                <br />
                {" "}
                <span className="table-note">
                  * 시도교육청 접수 시에는 해당
                </span>
              </td>
            </tr>
            <tr>
              <td>
                중요무형문화재
              </td>
              <td>
                별지 제5호의 5 서식
              </td>
              <td>
                <span className="table-bullet">
                  -
                </span>
                {" "}보유자: 중요무형문화재보유자 인정서 사본 (원본 지참)
                <br />
                {" "}
                <span className="table-bullet">
                  -
                </span>
                {" "}전수교육조교: 문화재청에서 발급한 조교증 사본 (원본 지참)
                <br />
                {" "}
                <span className="table-note">
                  * 문화재보호법에 따라 등급 명칭이 달라진 경우 가장 최초에 교부 받았던 증서 사본 (원본 지참)
                </span>
                <br />
                {" "}
                <span className="table-bullet">
                  -
                </span>
                {" "}이수자: 보유자가 문화재청에 보고한 이수증 사본 (원본 지참)
                <br />
                {" "}
                <span className="table-bullet">
                  -
                </span>
                {" "}전수생: 보유자가 (보유단체장)가 증명하는 학습자 전수교육확인서
                <br />
                {" "}
                <span className="table-note">
                  * 홈페이지 → 자료실 → 학습자관련신청양식 탑재
                </span>
              </td>
            </tr>
            <tr>
              <td>
                독학학위제 시험 합격 및
                <br />
                시험면제교육과정 이수
              </td>
              <td>
                별지 제5호의 6 서식
              </td>
              <td>
                시험합격: 제출서류 없음 (별지서식에 독학학위제 학적번호, 이수내역 기재)
                <br />
                {" "}시험면제교육과정 이수: 해당 교육기관에서 발급하는 과정 이수 확인서 및 성적증명서
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul className="page-list" style={{ marginTop: "10px" }}>
        <li className="page-list-dangu">
          모든 증빙서류는 원본으로 제출하여야 하며, 접수된 서류는 반환되지 않음
        </li>
        <li className="page-list-dangu">
          온라인 신청 시 제출서류 마감일까지 신청서와 증빙서류를 국가평생교육진흥원으로 우편 발송하여야 함
          <br />
        </li>
        <li className="page-list-plain">
          학점은행제는 [학점인정 등에 관한 법률] (법률 제 11690호)에 의거하여, 학교에서 뿐만 아니라 학교 밖에서 이루어지는 다양한 형태의 학습 및 자격을 학점으로 인정하고,
          <br />
          {" "}학점이 누적되어 일정 기준을 충족하면 학위취득이 가능하게 함으로써 궁극적으로 열린 학습사회, 평생학습사회를 구현하기 위한 제도입니다.
        </li>
      </ul>
    </div>
  </>
);

const degree = (
  <>
    <div className="container container-positive">
      <h1 className="page-title">
        학습자신청이란?
      </h1>
      <img src="/resources/images/guide/guide-4.png" alt="학습자 등록이란" className="page-absolute-image" />
      <ul className="page-list">
        <li className="page-list-item">
          학위요건이 충족되어 학위취득을 희망하는 경우 신청하는 절차이며, 매년 2월과 8월 두 번 학위수여가 이루어집니다.
        </li>
        <li className="page-list-item">
          학사학위는 4년제 대학 졸업 시 주어지는 학위며, 전문학사는 전문대학 (2,3년제) 졸업 시 주어지는 학위입니다.{" "}
          <br />
          ※ 학점은행제를 통해 학사학위를 취득할 경우 일반 대학(교) 졸업자와 동등하게 학력을 인정 받을 수 있습니다.
        </li>
      </ul>
      <table className="page-table schedule-table">
        <thead>
          <tr>
            <th className="active">
              12월
            </th>
            <th className="active">
              1월
            </th>
            <th>
              2월
            </th>
            <th>
              3월
            </th>
            <th>
              4월
            </th>
            <th>
              5월
            </th>
            <th className="active">
              6월
            </th>
            <th className="active">
              7월
            </th>
            <th>
              8월
            </th>
            <th>
              9월
            </th>
            <th>
              10월
            </th>
            <th>
              11월
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2} className="schedule-cell">
              학습자 등록
              <br />
              {" "}학점인정신청
              <br />
              {" "}
              <span className="text-primary">
                학위신청
              </span>
            </td>
            <td colSpan={2} className="schedule-cell empty"></td>
            <td className="schedule-cell">
              학습자 등록
              <br />
              {" "}학점인정신청
            </td>
            <td className="schedule-cell empty"></td>
            <td colSpan={2} className="schedule-cell">
              학습자 등록
              <br />
              {" "}학점인정신청
              <br />
              {" "}
              <span className="text-primary">
                학위신청
              </span>
            </td>
            <td colSpan={2} className="schedule-cell empty"></td>
            <td className="schedule-cell">
              학습자 등록
              <br />
              {" "}학점인정신청
              <br />
            </td>
            <td className="schedule-cell empty"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="container" id="linkage">
      <h1 className="page-title">
        학위신청 시 주의사항
      </h1>
      <ul className="page-list">
        <li className="page-list-item">
          학위요건 충족 시 자동으로 학위수여가 이루어지지 않으므로, 학점은행제 학위를 취득하고자 하는 학습자는 정해진 기간 중에 &apos;학위신청&apos;을 해야 합니다.
        </li>
        <li className="page-list-item">
          학위수여 이후 학습자의 개인사유에 의한 학위취소는 불가합니다.
          <br />
          {" "}※ 학위신청 시 미신청한 학점은 추후 다른 학위과정으로 연계 시 사용 가능한 부분은 상황에 따라 다르므로, 자세한 부분은 국가평생교육진흥원 학점은행 홈페이지에 문의 해주시기 바랍니다.
        </li>
      </ul>
    </div>
    <div className="container">
      <h1 className="page-title">
        학위신청 시간
      </h1>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <table className="page-table degree-application-table">
          <thead>
            <tr>
              <th>
                구분
              </th>
              <th>
                접수처
              </th>
              <th>
                신청기간
              </th>
              <th>
                신청방법
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                교육부 장관 명의 학위
              </td>
              <td>
                국가평생교육진흥원
              </td>
              <td>
                전기 (2월): 12/15 ~ 이듬해 1/15
                <br />
                {" "}후기 (8월): 6/15 ~ 7/15
              </td>
              <td>
                온라인 신청
                <br />
                {" "}[홈페이지 &gt; 학점인정 신청 &gt; 학위신청]
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul className="page-list" style={{ marginTop: "10px" }}></ul>
      <li className="page-list-plain">
        ★ 주의 ★
      </li>
      <li className="page-list-item">
        학습자등록이 학위신청 75일 전까지 완료되어야 합니다.
      </li>
      <li className="page-list-item">
        학위신청 기간은 매년 변동이 있으므로, 자세한 사항은 국가평생교육진흥원 홈페이지를 통해 확인하시기 바랍니다.
      </li>
      <li className="page-list-item">
        2월 학위수여 예정자는 4분기 (10월), 8월 학위수여 예정자는 2분기 (4월) 신청기간 내에 학습자 등록신청을 완료해야 합니다.
      </li>
      <li className="page-list-item">
        학위신청 전에 등록된 학위과정 및 전공을 반드시 확인한 후에 ‘학위신청’을 진행하시기 바랍니다.
      </li>
      <li className="page-list-item">
        정해진 기간 동안 [학위 합격/탈락여부]를 스스로 확인해야 함 (교육기관 신청자 또는 대학의 장 명의 학위 신청자는 해당 기관 또는 대학을 통해 확인해야 함)
      </li>
    </div>
    <div className="container">
      <h1 className="page-title">
        교육부 장관에 의한 학위
      </h1>
      <p className="page-sub-title">
        일반적으로 학점은행제를 통한 학위 수여 시에는 교육부 장관에 의한 학위를 받게 됩니다. 대학에서 정하는 학위 종류 및 전공이 학점은행제 표준 교육과정 학위종류 및 전공과 유사할 경우 해당 대학의 학위를 수여할 수 있습니다. 단, 그 학위 종류나 전공이 해당 대학의 정규과정에 개설되어 있지 않거나 사범계열 등 학점은행제 취지에 벗어나는 경우는 제외합니다.
      </p>
      <ul className="page-list" style={{ marginTop: "10px" }}></ul>
      <li className="page-list-plain">
        ★ 주의 ★
      </li>
      <li className="page-list-item">
        학습자등록이 학위신청 75일 전까지 완료되어야 합니다.
      </li>
      <li className="page-list-item">
        학위신청 기간은 매년 변동이 있으므로, 자세한 사항은 국가평생교육진흥원 홈페이지를 통해 확인하시기 바랍니다.
      </li>
      <li className="page-list-item">
        2월 학위수여 예정자는 4분기 (10월), 8월 학위수여 예정자는 2분기 (4월) 신청기간 내에 학습자 등록신청을 완료해야 합니다.
      </li>
      <li className="page-list-item">
        학위신청 전에 등록된 학위과정 및 전공을 반드시 확인한 후에 ‘학위신청’을 진행하시기 바랍니다.
      </li>
      <li style={{ marginBottom: "10px" }} className="page-list-item">
        정해진 기간 동안 [학위 합격/탈락여부]를 스스로 확인해야 함 (교육기관 신청자 또는 대학의 장 명의 학위 신청자는 해당 기관 또는 대학을 통해 확인해야 함)
      </li>
      <h1 className="page-title">
        학위수여 요건
      </h1>
      <p className="page-sub-title" style={{ marginBottom: "10px" }}>
        아래의 ① ~ ⑤의 모든 요건이 충족되어야 합니다.
        <br />
        {" "}어느 하나라도 부족하다면 학위수여를 받을 수 없음을 유의하셔야 합니다.
      </p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <table className="page-table degree-requirement-table">
          <thead>
            <tr>
              <th colSpan={2} rowSpan={2}>
                구분
              </th>
              <th rowSpan={2}>
                학사 학위
              </th>
              <th colSpan={2}>
                전문학사 학위
              </th>
            </tr>
            <tr>
              <th>
                2년제
              </th>
              <th>
                3년제
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="num-col">
                ①
              </td>
              <td>
                별지 제5호의 3 서식
              </td>
              <td>
                140학점 이상
              </td>
              <td>
                80학점 이상
              </td>
              <td>
                120학점 이상
              </td>
            </tr>
            <tr>
              <td className="num-col">
                ②
              </td>
              <td>
                별지 제5호의 4 서식
              </td>
              <td>
                60학점 이상
              </td>
              <td>
                45학점 이상
              </td>
              <td>
                54학점 이상
              </td>
            </tr>
            <tr>
              <td className="num-col">
                ③
              </td>
              <td>
                별지 제5호의 5 서식
              </td>
              <td>
                30학점 이상
              </td>
              <td>
                15학점 이상
              </td>
              <td>
                21학점 이상
              </td>
            </tr>
            <tr>
              <td className="num-col">
                ④
              </td>
              <td colSpan={4}>
                이수학점 중 평가인정 학습과목 또는 시간제 등록을 통해 이수한 학점이 반드시 18학점 이상 포함되어야 함
              </td>
            </tr>
            <tr>
              <td className="num-col">
                ⑤
              </td>
              <td colSpan={4}>
                전공필수는 희망하는 전공에 따라 학점 수 또는 과목 수로 충족하여야 함
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul className="page-list" style={{ marginTop: "10px" }}>
        <li className="page-list-plain">
          ★ 주의 ★
          <br />
          {" "}학점인정 신청 기간은 위 표와 같이 매년 비슷한 일정으로 진행되나, 요일 및 공휴일에 따라 날짜가 상이할 수 있으므로 반드시 국가평생교육진흥원 홈페이지에서 날짜를 확인하시기 바랍니다.
        </li>
        <li className="page-list-item">
          전공필수 요건에 해당하는 학점은 그 전공을 희망하는 자가 반드시 그에 해당하는 학점을 취득하거나 정해진 과목을 이수하여 요건을 충족해야 하는 학점을 말합니다.
        </li>
        <li className="page-list-item">
          해당 학점을 인정받는 방법은 기준 학점이 일정 전공필수 학점으로 인정받을 경우 과목을 모두 이수하지 않아도 전공필수 요건이 충족됩니다.
        </li>
        <li className="page-list-item" style={{ marginBottom: "10px" }}>
          전공과 교양을 제외한 부분은 일반선택으로, 전공 및 교양에 해당하지 않는 다른 전공의 학점을 말합니다. 학사과정에서 전공과 교양의 최소요건 학점(학사의 경우 60+30=90)을 제외한 50학점(140-90)은 학습구분(전공, 교양, 일반선택)에 관계없이 원하는 대로 학습구분을 선택하여 이수할 수 있는 것으로 반드시 다른 전공의 전공과목으로 일반선택 학점을 이수할 필요는 없습니다.
        </li>
      </ul>
      <h1 className="page-title">
        타전공 학위수여요건
      </h1>
      <p className="page-sub-title" style={{ marginBottom: "10px" }}>
        대학의 복수전공 제도와 유사하게 이전에 이미 학위수여 받은 학습자가 학점은행제를 통해 다른 전공의 학위를 수여받고자 할 때 이용하는 방법입니다.
        <br />
        {" "}(※타전공 학위수여 요건 개정: 학점인정 등에 관한 법률 시행령 제 16조 제1항 제2호)
      </p>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <table className="page-table major-requirement-table">
          <tbody>
            <tr>
              <td>
                전문학사 학위 (2년제)
              </td>
              <td>
                전공 36학점 이상
              </td>
            </tr>
            <tr>
              <td>
                전문학사 학위 (3년제)
              </td>
              <td>
                전공 42학점 이상
              </td>
            </tr>
            <tr>
              <td>
                학사학위 (4년제)
              </td>
              <td>
                전공 48학점 이상
              </td>
            </tr>
            <tr>
              <td>
                공통요건
              </td>
              <td>
                ① 학점은행제 평가인정 학습과목 또는 시간제등록을 통한 학점이 반드시 전공 18학점 이상 포함되어야 합니다.
                <br />
                {" "}② 전공필수는 희망하시는 전공에 맞게 학점 또는 과목을 모두 이수하셔야 합니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul className="page-list">
        <li className="page-list-plain" style={{ marginTop: "10px", marginBottom: "10px" }}>
          ★ 주의 ★
        </li>
        <li className="page-list-dangu">
          타전공 학위수여 방식은 이미 학위취득을 하신 분들에게만 해당됩니다.
        </li>
        <li className="page-list-dangu">
          평가인정학습과목, 시간제등록, 학점인정대상학교, 독학학위제, 자격증, 중요무형문화재 등을 통해 취득할 수 있습니다. 자격증은 최대 1개까지만 인정됩니다.
        </li>
        <li className="page-list-dangu">
          학위취득 이후에 취득한 학점만 인정됩니다. 단, 자격증과 중요무형문화재는 취득기간에 관계없이 인정가능 합니다.
        </li>
        <li className="page-list-dangu">
          대학의 장등에 의한 학위수여가 가능하나, 해당 대학으로 세부적인 학위요건을 확인해야 합니다.
        </li>
      </ul>
    </div>
  </>
);

/** 원본 credit-bank/guide.html — 정적 탭 4개는 여기, 가이드 다운로드 탭은 GuideTabs 안에 있다 */
export default function CreditBankGuidePage() {
  return (
    <main className="wrapper">
      <GuideTabs panels={{ procedure, registration, credit, degree }} />
    </main>
  );
}
