/** 회원가입 약관 — 개인정보 제공 및 이용 동의 (필수). 원본 member/signup.html 에서 변환 */
export default function PrivacyProvideText() {
  return (
    <>
      <div className="inner">
        <table className="table-border">
          <tbody>
            <tr>
              <th style={{ width: "10%" }}>
                제공받는 자
              </th>
              <th style={{ width: "30%" }}>
                국가평생교육진흥원 학점은행제
              </th>
              <th style={{ width: "30%" }}>
                국세청
              </th>
              <th style={{ width: "30%" }}>
                국가보훈처
              </th>
            </tr>
            <tr>
              <td style={{ width: "10%" }}>
                근거법령
              </td>
              <td style={{ width: "30%" }}>
                <p className="dot">
                  학점인정 등에 관한 법률 시행령 제19조 2 (고유식별정보의 처리) 학점인정 등에 관한 법률 시행령 제 4조 (학점인정 절차)
                </p>
                <p className="dot">
                  국가평생교육진흥원 학점은행제 학사관리지침
                </p>
              </td>
              <td style={{ width: "30%" }}>
                소득세법 시행규칙 (제58조의3의2항)
              </td>
              <td style={{ width: "30%" }}>
                국가유공자 등 예우 및 지원에 관한 법률, 국가유공자 등 예우 및 지원에 관한 법률 시행령
              </td>
            </tr>
            <tr>
              <td style={{ width: "10%" }}>
                이용목적
              </td>
              <td style={{ width: "20%" }}>
                학습자등록, 학점인정신청, 사전보고 및 성적 등의 행정보고
              </td>
              <td style={{ width: "20%" }}>
                연말정산 간소화 서비스 이용
              </td>
              <td style={{ width: "20%" }}>
                국가유공자 및 국가유공자 손자녀 등의 수업료 국고보조금 신청
              </td>
            </tr>
            <tr>
              <td style={{ width: "10%" }}>
                제공항목
              </td>
              <td style={{ width: "30%" }}>
                성명, 주민등록번호, 주소, 전화번호, 이메일주소, 최종출신교, 최종학력, 수강과목, 성적
              </td>
              <td style={{ width: "30%" }}>
                성명, 주민등록번호, 결제년월, 결제금액
              </td>
              <td style={{ width: "30%" }}>
                성명, 생년월일, 보훈번호, 학과, 성적, 신청학점, 수업료, 총 이수학점, 수강과목 등
              </td>
            </tr>
            <tr>
              <td style={{ width: "10%" }}>
                보유 및 이용기간
              </td>
              <td style={{ width: "30%" }}>
                개인정보취급방침 제2조2항 참조
              </td>
              <td style={{ width: "30%" }}>
                국세청 보유기간에 따름
              </td>
              <td style={{ width: "30%" }}>
                국가보훈처 보유기간에 따름
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
