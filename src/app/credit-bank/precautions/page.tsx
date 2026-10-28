import type { Metadata } from "next";
import Link from "next/link";
import PrecautionsTabs from "@/components/credit-bank/PrecautionsTabs";

export const metadata: Metadata = { title: "주의사항" };

const creditLimit = (
  <>
    <div className="container">
      <h1 className="page-title">
        1년/1학기에 인정받을 수 있는 학점
      </h1>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <table className="page-table credit-limit-table">
          <thead>
            <tr>
              <th>
                연간 인정 제한 학점(과목수)
              </th>
              <th>
                학기당 인정 제한 학점(과목수)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                최대{" "}
                <span className="text-primary">
                  42
                </span>
                학점(14과목)
              </td>
              <td>
                최대{" "}
                <span className="text-primary">
                  24
                </span>
                학점(8과목)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul className="page-list">
        <li style={{ marginTop: "10px", marginBottom: "10px" }} className="page-list-plain">
          학점인정 신청 전에 학습자 등록 신청이 선행되어야 합니다.
        </li>
        <li className="page-list-dangu">
          1년/1학기에 인정받을 수 있는 학점에는 아래와 같이 수업을 통한 학점원은 포함되지만, 수업 이외의 학점원은 포함되지 않음.
        </li>
        <li className="page-list-dangu">
          단, 학점인정대상학교에서 이수한 학점은 해당 학교와 동일한 연도/학기에 타 학점원(평가인정학습과정, 시간제등록, 독학학위제 시험면제교육과정)을
          <br />
          {" "}이수한 경우에 한해, 1년/1학기 제한 학점 기준을 적용 받음.
        </li>
      </ul>
      <ul className="page-list">
        <li className="page-list-dangu">
          학기의 개념
        </li>
      </ul>
      <ul className="page-list">
        <li className="page-list-item">
          1년은 당해 3월 1일부터 다음해 2월 말일까지를 의미합니다.
        </li>
        <li className="page-list-item">
          1학기는 3월 1일부터 8월 말일까지입니다.
        </li>
        <li className="page-list-item">
          2학기는 9월 1일부터 다음해 2월 말일까지입니다.
        </li>
        <li className="page-list-item">
          이는 수업이 끝나는 날(종강일)을 기준으로 합니다.
        </li>
      </ul>
      <div style={{ marginTop: "10px" }}>
        <table className="page-table semester-table">
          <tbody>
            <tr>
              <th rowSpan={2} className="year">
                1년
              </th>
              <th>
                1학기
              </th>
              <th>
                2학기
              </th>
            </tr>
            <tr>
              <td>
                <span className="date-link">
                  3월 1일부터 ~ 8월 31일까지
                </span>
              </td>
              <td>
                9월 1일 ~ 다음해 2월 28/29일
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h1 className="page-title" style={{ marginTop: "34px" }}>
        1년/1학기에 인정받을 수 있는 학점
      </h1>
      <div style={{ marginTop: "20px" }}>
        <table className="page-table credit-recognition-table">
          <thead>
            <tr>
              <th>
                구분
              </th>
              <th>
                최대 인정 학점
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                학사학위 과정
              </td>
              <td>
                105학점
              </td>
            </tr>
            <tr>
              <td>
                전문학사학위 과정
              </td>
              <td>
                60학점
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul className="page-list">
        <li style={{ marginTop: "10px" }} className="page-list-item">
          4년제 학사과정에 상응하는 과정은 105학점, 전문학사에 상응하는 과정은 2년제 60학점을 초과하여 인정받을 수 없습니다.
        </li>
        <li className="page-list-item">
          평가인정 학습과목 및 독학사 시험면제교육과정으로 이수한 학점을 포함합니다. (시간제 등록을 통한 학습과목 이수 제외)
          <br />
          {" "}EX) 학점은행제를 통해 학사과정 경영학 전공자인 A는 B라는 평가인정기관에서 이수한 학점이 이미 102학점인 상태에서 이번 학기에 3학점씩 3과목, 총 9학점을 이수하고 있다면?
          <br />
          {" "}→ 학사과정은 1개 기관에서 105학점까지만 학점인정이 가능하므로 이수 중인 과목 중 1개 과목만 선택하여 학점인정이 가능합니다.
        </li>
      </ul>
      {/* 상담 신청 배너 */}
      <div className="consultation-banner">
        <div className="consultation-banner-content">
          <p className="consultation-banner-title">
            잠깐! 학점은행제 도움을 받고싶다면
            <br />
            지금 바로{" "}
            <span className="text-consultations">
              상담신청
            </span>
            하세요!
          </p>
          <Link href="/course-registration/learning-design" className="consultation-banner-button">
            상담신청 하러가기{" "}
            <span className="consultation-banner-arrow">
              <img src="/resources/images/credit-bank/mark.png" alt="arrow" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  </>
);

const duplicateCredit = (
  <>
    <h1 className="page-title">
      중복과목에 대한 학점인정
    </h1>
    <ul className="page-list">
      <li className="page-list-item">
        시간제 등록 이수과목, 독학사 시험 합격과목 및 면제과정에서 이수한 과목, 평가인정 학습과목 중에서 어느 한 과목이라도 중복될 때에는 중복과목을 동일과목으로 간주하여 1개 과목에 대해서만 학점인정이 가능합니다. 이는 대학(교)에서 어느 특정과목을 여러 번 수강하였을 시 여러 번 학점이 인정되는 것이 아니라 재수강으로 인정되는 것과 마찬가지입니다.
      </li>
      <li className="page-list-item">
        중복과목 여부는 학점인정 신청 시 분과위원회에서 심의하며 과목명/교육요목을 기준으로 심의하게 됩니다. 표준교육 과정 상에 교수요목과 해당과목의 교수요목이 70%이상이 유사하다고 분과위원회 위원들이 판정하게 된다면 동일과목으로 인정될 수 있습니다.
      </li>
      <li className="page-list-item" style={{ marginBottom: "34px" }}>
        2004년 10월부터는 학습과목별 인정학점 수 표기가 아닌 학습 구분별 총 취득학점 수로 기재되므로 학점인정 대상학교에서 이수한 학점과 타 학점원(평가인정학습과목, 시간제, 독학사 시험합격 및 면제과정이수)간의 중복 과목여부를 심의하지 않습니다. 단, 평가인정학습과목, 시간제, 독학사 시험합격 및 면제과정 이수 과목 간에는 중복여부를 심의하므로 중복과목을 수강하면 학점인정이 되지 않습니다.
      </li>
    </ul>
    <h1 className="page-title">
      대학생(재적/휴학생) 학점인정
    </h1>
    <ul className="page-list">
      <li className="page-list-number">
        법률 근거 없는 대학 재적 중인 자에 대한 “시간제 등록 금지” 및 “학점은행제 학점인정 제한”에 관한 지침 폐기
        <br />
        {" "}
        <br />
      </li>
      <li className="page-list-plain">
        대학 재적 중 시간제 등록 이수 및 학점은행제 학점인정 가능하며 자격응시를 위한 학점인정 신청 시 동일한 학기에 대학에서 취득한 학점과 관계없이 인정함
      </li>
      <br />
      <li className="page-list-dangu">
        대학 재적 중인 A학습자가 2005년도에 대학 정규과목 36학점 + 시간제 등록 18학점을 이수한 자가 시간제 등록 18학점을 사법 시험 응시를 위해 학점은행제 학점으로 인정 신청할 경우, 대학 재적 여부와 관계없이 인정
      </li>
      <li className="page-list-plain">
        1) 평가인정 학습과목 이수
        <br />
        {" "}2) 시간제 등록 이수
        <br />
        {" "}3) 독학사 시험 면제 교육과정 이수
        <br />
        {" "}&nbsp;※ 1)~3)의 경우 학점은행제 학기 당, 연간 이수 제한 학점에 포함됨
        <br />
        {" "}4) 독학사 단계별 시험합격
        <br />
        {" "}5) 자격 취득 학점
        <br />
        {" "}6) 중요무형문화재 전수교육 이수
        <br />
      </li>
      <li className="page-list-plain">
        위와 같이 자격응시를 위해 시간제 등록을 위해 시간제 등록 등을 동시에 이수한 대학 재적생이 선 인정 후, 대학에서 취득한 학점을 학점은행제 학위취득을 목적으로 등록할 경우
        <br />
        {" "}학점은행제 학기 당, 연간 취득학점 범위 내에서 인정함.
      </li>
      <li className="page-list-dangu">
        대학 재적 중인 A학습자가 2007년도 2월 졸업 (또는 중퇴) 후 2005년도에 이수한 대학 정규과목 36학점에 대하여 학점은행제 학위취득 목적으로 학점인정 신청한 경우, 학기 당 (24학점) 및 연간 최대 인정학점 (42학점)내에서만 인정 → 연간 42학점을 초과하는 12학점 불인정 (학기 당 이수제한 학점을 초과하는 경우도 불인정)
      </li>
      <li className="page-list-plain">
        자격응시를 위해 시간제 등록 등을 동시에 이수한 대학 재적생이 해당 대학 중퇴 또는 전문대학 졸업 후 학점은행제 학위취득을 목적으로 대학에서 취득한 학점을 학점인정
        <br />
        {" "}신청하는 것은 2008년 4월부터 신청 가능함
      </li>
    </ul>
    {/* 상담 신청 배너 */}
    <div className="consultation-banner">
      <div className="consultation-banner-content">
        <p className="consultation-banner-title">
          잠깐! 학점은행제 도움을 받고싶다면
          <br />
          지금 바로{" "}
          <span className="text-consultations">
            상담신청
          </span>
          하세요!
        </p>
        <Link href="/course-registration/learning-design" className="consultation-banner-button">
          상담신청 하러가기{" "}
          <span className="consultation-banner-arrow">
            <img src="/resources/images/credit-bank/mark.png" alt="arrow" />
          </span>
        </Link>
      </div>
    </div>
  </>
);

/** 원본 credit-bank/precautions.html */
export default function CreditBankPrecautionsPage() {
  return (
    <main className="wrapper">
      <PrecautionsTabs
        panels={[
          { key: "credit-limit", label: "학점제한", content: creditLimit },
          { key: "duplicate-credit", label: "중복과목/대학생(재적) 학점인정", content: duplicateCredit },
        ]}
      />
    </main>
  );
}
