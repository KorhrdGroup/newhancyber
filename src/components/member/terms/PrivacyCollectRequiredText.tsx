/** 회원가입 약관 — 개인정보 수집 및 이용 동의 (필수). 원본 member/signup.html 에서 변환 */
export default function PrivacyCollectRequiredText() {
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
                회원가입 및 회원관리
              </td>
            </tr>
            <tr>
              <th>
                수집항목
              </th>
              <td>
                성명, 아이디, 비밀번호, 이메일, 연락처, 주소, 최종학력, 학점은행제 이용목적, 유입경로
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
                당사의 개인정보수집에 대해 부당하다고 판단하시면 회원가입을 유보하실 수 있습니다.
                <br />
                단, 해당 사이트의 서비스 이용이 제한될 수 있습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
