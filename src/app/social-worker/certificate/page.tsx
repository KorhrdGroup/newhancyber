import type { Metadata } from "next";

export const metadata: Metadata = { title: "자격증 발급 안내" };

/** 원본 social-worker/certificate.html */
export default function SocialWorkerCertificatePage() {
  return (
    <main className="wrapper">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">
            교부 신청절차
          </h1>
          <ul className="page-list">
            <li className="page-list-plain">
              <strong>
                장소
              </strong>
              {" "}: 사회복지사업법 제11조제1항 및 동법시행규칙 제4조제4항과 사단법인 한국사회복지사협회
            </li>
            <li className="page-list-plain">
              <strong>
                자격증, 회원증 신청 접수처
              </strong>
              {" "}: 전국 시•도 지방협회
            </li>
          </ul>
          <img src="/resources/images/social-worker/social-wooker08.png" alt="사회복지사자격증 신청절차" className="page-image" />
          <ul className="page-list">
            <li className="page-list-dangu">
              제출하신 서류를 심사한 후 자격이 인정될 경우에만 자격증이 발급됩니다. 신원조회 또는 사실조회 실시 후 부적격자는 사안에 따라 자격증 발급취소 또는 무효처분을 받습니다.
            </li>
            <li className="page-list-dangu">
              민원처리기간: 사회복지사업법 시행규칙 제4조에 한함 (7일 소요, 단 졸업 후 단체발급 시 지연될 수 있으니 이해해주시기 바랍니다.
            </li>
          </ul>
        </div>
        <div className="container">
          <h1 className="page-title">
            재교부 신청자(분실, 명의변경 등에 한함) 구비서류
          </h1>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <table className="page-table reissue-document-table">
              <thead>
                <tr>
                  <th>
                    구분
                  </th>
                  <th>
                    내용
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    공통구비서류
                  </td>
                  <td>
                    1. 사회복지사 자격증 교부신청서 1부 (지방협회별 경유 원칙)
                    <br />
                    {" "}2. 사진명함판 (3.5cm X 4.5cm) 2매
                  </td>
                </tr>
                <tr>
                  <td>
                    별도구비서류
                  </td>
                  <td>
                    1 .명의변경 및 주소변경: 주민등록초(등)본 1부
                    <br />
                    {" "}2. 사회복지사자격증 원본 1부
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="container">
          <h1 className="page-title">
            수수료안내
          </h1>
          <ul className="page-list">
            <li className="page-list-plain">
              사회복지사업법 제11조제4항 및 동법시행규칙 제4조제4항과 사단법인 한국사회복지사협회 정관 제5조 회원규정에 의거 사회복지사자격증및 회원증 발급수수료 및 연회비는 다음과 같습니다.
            </li>
          </ul>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <table className="page-table reissue-document-table">
              <thead>
                <tr>
                  <th>
                    구분
                  </th>
                  <th>
                    내용
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    공통구비서류
                  </td>
                  <td>
                    1. 사회복지사 자격증 교부신청서 1부 (지방협회별 경유 원칙)
                    <br />
                    {" "}2. 사진명함판 (3.5cm X 4.5cm) 2매
                  </td>
                </tr>
                <tr>
                  <td>
                    별도구비서류
                  </td>
                  <td>
                    2. 명의변경 및 주소변경: 주민등록초(등)본 1부
                    <br />
                    {" "}1. 사회복지사자격증 원본 1부
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul className="page-list">
            <li className="page-list-dangu">
              발급 수수료는 지방협회로 서류 접수 시 계좌입금 하시면 됩니다.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
