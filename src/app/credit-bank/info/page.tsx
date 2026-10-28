import type { Metadata } from "next";

export const metadata: Metadata = { title: "학점은행제란" };

/** 원본 credit-bank/info.html */
export default function CreditBankInfoPage() {
  return (
    <main className="wrapper">
      {/* 페이지 제목 영역 */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">
            학점은행제란
          </h1>
          <p className="page-sub-title">
            학점은행제는 [학점인정 등에 관한 법률] (법률 제 11690호)에 의거하여, 학교에서 뿐만 아니라 학교 밖에서 이루어지는 다양한 형태의 학습 및 자격을 학점으로 인정하고, 학점이 누적되어 일정 기준을 충족하면 학위취득이 가능하게 함으로써 궁극적으로 열린 학습사회, 평생학습사회를 구현하기 위한 제도입니다.
          </p>
          <img src="/resources/images/credit-bank/info-1.png" alt="학점은행제란" className="page-image" />
        </div>
        <div className="container">
          <h1 className="page-title">
            이용대상
          </h1>
          <p className="page-sub-title">
            고등학교 졸업자나 동등 이상의 학력을 가진 사람들은 누구라도 학점은행제를 활용하여 학위 및 자격증 취득을 할 수 있습니다.
          </p>
          <img src="/resources/images/credit-bank/info-2.png" alt="학점은행제란" className="page-image" />
        </div>
        <div className="container">
          <h1 className="page-title">
            학점은행제 장점
          </h1>
          <ul className="page-list">
            <li className="page-list-item">
              고등학교 졸업자나 동등 이상의 학력을 가진 사람들은 누구라도 학점은행제를 활용하여 학위 및 자격증 취득을 할 수 있습니다.
            </li>
            <li className="page-list-item">
              자격증 취득, 독학학위제 합격, 평가인정학습과목 이수, 시간제 수업 등 다양한 학습 활동을 학점으로 인정받을 수 있습니다.
            </li>
            <li className="page-list-item">
              다양한 전공의 학위를 취득할 수 있습니다.
            </li>
          </ul>
        </div>
        <div className="container">
          <h1 className="page-title">
            이용대상
          </h1>
          <img src="/resources/images/credit-bank/info-3.png" alt="학점은행제란" className="page-image" />
          {" "}
          <img src="/resources/images/credit-bank/divider.png" alt="학점은행제란" className="page-image" />
          {" "}
          <img src="/resources/images/credit-bank/info-4.png" alt="학점은행제란" className="page-image" />
        </div>
      </section>
    </main>
  );
}
