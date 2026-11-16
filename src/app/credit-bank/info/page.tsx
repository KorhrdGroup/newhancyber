import type { Metadata } from "next";
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "학점은행제란" };

const IMG = "/resources/images/credit-bank";

/** 원본 credit-bank/info.html — 학습지원 안내와 같은 흰 바탕 틀 + 소제목 · 그림 · 목록 */
export default function CreditBankInfoPage() {
  return (
    <main className="wrapper">
      <div className="container lx-page lx-page--top lx-page--plain cb-page">
        <h1 className="page-title">학점은행제란</h1>
        <p className="lx-desc">학점은행제가 어떤 제도이고 누가, 어떻게 이용할 수 있는지 안내합니다.</p>

        <section className="lx-panel">
          <h2 className="lx-section-title">학점은행제란</h2>
          <p className="lx-text">
            학점은행제는 [학점인정 등에 관한 법률] (법률 제 11690호)에 의거하여, 학교에서 뿐만 아니라 학교 밖에서 이루어지는 다양한
            형태의 학습 및 자격을 학점으로 인정하고, 학점이 누적되어 일정 기준을 충족하면 학위취득이 가능하게 함으로써 궁극적으로 열린
            학습사회, 평생학습사회를 구현하기 위한 제도입니다.
          </p>
          <img src={`${IMG}/info-1.png`} alt="학교에서의 학습경험과 다양한 형태의 학습과 자격을 학점으로 인정받아 학위를 수여받습니다." className="cb-image" />
        </section>

        <section className="lx-panel">
          <h2 className="lx-section-title">이용대상</h2>
          <p className="lx-text">
            고등학교 졸업자나 동등 이상의 학력을 가진 사람들은 누구라도 학점은행제를 활용하여 학위 및 자격증 취득을 할 수 있습니다.
          </p>
          <img
            src={`${IMG}/info-2.png`}
            alt="중도 포기한 학업, 새로운 전공, 만학의 꿈, 사회복지사·보육교사 자격증, 자격증 학점인정, 대학원 진학 준비, 시험응시 자격요건, 중요무형문화재 전수교육 학점인정을 원하는 경우"
            className="cb-image"
          />
        </section>

        <section className="lx-panel">
          <h2 className="lx-section-title">학점은행제 장점</h2>
          <ul className="lx-notes">
            <li className="page-list-item">
              고등학교 졸업자나 동등 이상의 학력을 가진 사람들은 누구라도 학점은행제를 활용하여 학위 및 자격증 취득을 할 수 있습니다.
            </li>
            <li className="page-list-item">
              자격증 취득, 독학학위제 합격, 평가인정학습과목 이수, 시간제 수업 등 다양한 학습 활동을 학점으로 인정받을 수 있습니다.
            </li>
            <li className="page-list-item">다양한 전공의 학위를 취득할 수 있습니다.</li>
          </ul>
        </section>

        <section className="lx-panel">
          <h2 className="lx-section-title">학위취득 절차</h2>
          <img
            src={`${IMG}/info-3.png`}
            alt="STEP 1 학위·전공 선택, STEP 2 학습 설계 및 상담, STEP 3 학습자 등록 / 학습하기, STEP 4 학점인정 신청"
            className="cb-image"
          />
          <img src={`${IMG}/divider.png`} alt="" className="cb-image" />
          <img src={`${IMG}/info-4.png`} alt="STEP 5 학위 신청 및 학위수여, 자격증 취득 또는 시험 응시 자격 취득" className="cb-image" />
        </section>

      </div>
    </main>
  );
}
