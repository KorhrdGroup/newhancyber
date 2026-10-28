/** 회원가입 약관 — 개인정보의 마케팅 및 광고 활용 (선택). 원본 member/signup.html 에서 변환 */
export default function MarketingText() {
  return (
    <>
      <div className="inner">
        <table>
          <tbody>
            <tr>
              <th>
                수집 및 이용목적
              </th>
              <td>
                신규서비스(제품) 개발 및 특화, 이벤트 등 광고성 정보 전달, 접속빈도 파악, 회원 서비스 이용 통게
              </td>
            </tr>
            <tr>
              <th>
                수집항목
              </th>
              <td>
                성명, 아이디, 이메일, 연락처
              </td>
            </tr>
            <tr>
              <th>
                보유 및 이용기간
              </th>
              <td>
                회원탈퇴 시 또는 법정의무 보유기간 까지
              </td>
            </tr>
            <tr>
              <th>
                동의거부권 및 불이익
              </th>
              <td>
                선택 정보에 대한 수집 및 이용 동의를 거부하실 권리가 있으며, 미동의시에도 회원가입 및 서비스 이용은 가능합니다. 단, 일부 서비스 제공 혜택 안내는 제한될 수 있습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
