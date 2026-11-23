import type { Metadata } from "next";
import "@/styles/learning-extra.css";
import { CbIconFlow, CbIconGrid, CbStepFlow } from "@/components/credit-bank/CbFlow";

export const metadata: Metadata = { title: "학점은행제란" };

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
          <CbIconFlow
            items={[
              { icon: "school", label: "학교에서의 학습경험" },
              { icon: "books", label: "다양한 형태의 학습과 자격" },
              { icon: "certificate", label: "학점 인정" },
              { icon: "graduation", label: "학위 수여" },
            ]}
            joins={["plus", "arrow", "arrow"]}
            numbered={false}
            highlightLast
          />
        </section>

        <section className="lx-panel">
          <h2 className="lx-section-title">이용대상</h2>
          <p className="lx-text">
            고등학교 졸업자나 동등 이상의 학력을 가진 사람들은 누구라도 학점은행제를 활용하여 학위 및 자격증 취득을 할 수 있습니다.
          </p>
          <CbIconGrid
            items={[
              { icon: "notebook", lines: ["중도 포기한 학업에", "아쉬움이 남는 경우"] },
              { icon: "diploma", lines: ["새로운 전공 분야를", "공부하고자 하는 경우"] },
              { icon: "books-glasses", lines: ["만학의 꿈을 펼치길", "희망하는 경우"] },
              { icon: "hands", lines: ["사회복지사, 보육교사 등과 같은", "자격증 취득을 원하는 경우"] },
              { icon: "aplus", lines: ["자격증을 학점으로", "인정받기 원하는 경우"] },
              { icon: "gradbook", lines: ["대학원 진학 준비를 위한", "학위 취득을 희망하는 경우"] },
              { icon: "badge", lines: ["시험응시를 위한", "자격요건 충족을 희망하는 경우"] },
              { icon: "gate", lines: ["중요무형문화재 전수교육을", "학점으로 인정받길 원하는 경우"] },
            ]}
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
          <h2 className="lx-section-title">학점은행제 흐름도</h2>
          <CbStepFlow
            steps={[
              { icon: "magnifier", label: "학위-전공 선택" },
              { icon: "chat-person", label: "학습 설계 및 상담" },
              { icon: "tuition", label: "학습자 등록 / 학습하기" },
              { icon: "aplus", label: "학점인정 신청" },
            ]}
            finals={[
              { icon: "graduation", label: "학위 신청 및 학위수여" },
              { icon: "license", label: "자격증 취득" },
              { icon: "badge", label: "시험 응시 자격 취득" },
            ]}
          />
        </section>

      </div>
    </main>
  );
}
