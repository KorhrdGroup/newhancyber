import type { Metadata } from "next";
import PracticeTabs from "@/components/practice-support/PracticeTabs";
import {
  InfoTable,
  Notes,
  OrgLinks,
  PracticeSection,
  ProgressSection,
  RefNotes,
  RegisterSection,
} from "@/components/practice-support/PracticeParts";

export const metadata: Metadata = { title: "평생교육사실습" };

// 추후 오픈 예정 — 메뉴·사이트맵에서 숨김 처리된 페이지
export default function LifelongEducatorPracticePage() {
  return (
    <main className="wrapper">
      <PracticeTabs
        title="평생교육사실습"
        desc="평생교육사 자격증 취득에 필요한 평생교육현장실습을 단계별로 안내합니다."
        step1Label="평생교육사 실습 선이수과목"
        step1={
          <>
            <PracticeSection title="실습 전 필수 확인사항">
              <Notes
                items={[
                  "평생교육사 현장실습 과목은 평생교육사 자격증 이수 교과목 중 필수 4과목 이상의 선이수과목이 충족되어야 수강과 실습을 진행할 수 있습니다.",
                  "실습 = 학교 출석수업 + 실습기관에서의 현장실습. 실습도 하나의 과목이기 때문에 실습 과목을 수강신청한 후에 신청한 학교 일정에 맞춰 “학교 출석수업”과 “실습기관에서의 현장실습”을 동시에 진행",
                ]}
              />
            </PracticeSection>

            <PracticeSection title="평생교육사 과목">
              <div className="lx-table-scroll">
                <table className="ds-table lx-table lx-practice-grid">
                  <thead>
                    <tr>
                      <th scope="col">구분</th>
                      <th scope="col" colSpan={2}>
                        교과목
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">필수과목</th>
                      <td className="is-left" colSpan={2}>
                        평생교육론, 평생교육방법론, 평생교육경영론, 평생교육프로그램개발론, 평생교육실습(4주, 160시간 이상)
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" rowSpan={2}>
                        선택과목
                      </th>
                      <td className="lx-practice-sub">실천영역</td>
                      <td className="is-left">
                        아동교육론, 청소년교육론, 여성교육론, 노인교육론, 시민교육론, 문자해득교육론, 성인학습및상담, 특수교육론
                      </td>
                    </tr>
                    <tr>
                      <td className="lx-practice-sub">방법영역</td>
                      <td className="is-left">
                        교수설계, 교육공학, 교육복지론, 교육사회학, 교육조사방법론, 기업교육론, 문화예술교육론, 상담심리학,
                        원격(이러닝, 사이버)교육론, 인적자원개발론, 지역사회교육론, 직업·진로설계, 환경교육론
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <RefNotes
                items={[
                  "평생교육사 2급은 선택과목 5과목, 3급은 2과목을 이수하여야 함.",
                  "선택과목은 실천영역과 방법영역에서 각각 1과목 이상을 반드시 포함하여 이수하여야 함.",
                  "이수과목의 백분위 성적은 100점을 만점으로 하여, 전체 이수과목 성적 총합의 평균이 80점 이상이어야 함.",
                ]}
              />
            </PracticeSection>
          </>
        }
        step2={
          <>
            <RegisterSection />

            <PracticeSection title="평생교육사 현장실습 기관섭외">
              <OrgLinks
                items={[
                  { href: "https://lledu.nile.or.kr/", logo: "branch-05.png", alt: "평생교육사 자격관리" },
                  { href: "https://www.nile.or.kr/", logo: "branch-06.png", alt: "국가평생교육진흥원" },
                ]}
              />
              <InfoTable
                caption="평생교육사 실습 기관 섭외"
                rows={[
                  {
                    label: "실습기관섭외",
                    lines: [
                      "국가평생교육진흥원, 시•도 평생교육진흥원, 시•군•구 평생학습관, 문자해득교육프로그램 지정기관, 성인문해교육 지원사업 선정기관, 평생학습도시, 국가•지자체 평생학습 추진기구, 평생교육 관련사업 수행학교, 평생교육시설 신고•인가 기관, 평생직업교육학원, 기관형 교육기관, 훈련•연수형 교육기관, 시민사회 단체형 교육기관",
                      "* 그 밖의 다른 법령에 의한 기관의 경우 반드시 해당 설치 및 운영 법적 근거 및 평생교육 사업 수행 여부 확인",
                    ],
                  },
                  {
                    label: "실습지도자요건",
                    lines: [
                      "- 평생교육사 1급 자격증 소지자",
                      "- 평생교육사 2급 자격증을 보유하고 관련 업무 2년 이상 종사한 자",
                      "- 평생교육사 3급 자격증을 보유하고 관련 업무 3년 이상 종사한 자",
                      // 원본 "1인ㄷ 당" 오타를 바로잡는다
                      "- 동일 시간대를 기준으로 하여 실습 지도자 1인 당 실습생은 가능한 5명의 범위 내에서 지도 및 관리",
                      "- 실습 지도자는 실습생이 제출한 실습일지를 검토하고, 주 1회(1주: 40시간), 총 4회에 걸쳐 실습생의 실습수행에 대한 의견을 실습지도 기록서에 기록",
                    ],
                  },
                  { label: "실습의뢰", lines: ["- 실습 수강료 이외에 실습 기관에 지불하는 실습비용 별도로 있음"] },
                  {
                    label: "실습기간",
                    lines: ["수강 등록한 평생교육실습 과목 운영기관에서 정하는 실습인정 기간 내 160시간 이수"],
                  },
                  {
                    label: "실습시간",
                    lines: [
                      "- 최소 4주간(최소 20일 이상) 총 160시간 이상 실시",
                      "- 하루 4시간 이상 8시간 이하",
                      "- 주중, 주말, 야간 가능(단, 야간이나 주말 실습일 경우 프로그램이 운영중이여야 하며 실습지도자가 상근해야 함)",
                      "- 점심 및 저녁 등의 식사시간은 총 160시간의 실습시간에서 제외",
                    ],
                  },
                  // 원본 주소 "lledu.nile.ork.kr" 는 오타라 바로잡는다
                  { label: "참고 사이트", lines: [
                    <>
                      평생교육사 자격관리 사이트(
                      <a href="https://lledu.nile.or.kr" target="_blank" rel="noopener noreferrer" className="ds-text-brand">
                        https://lledu.nile.or.kr
                      </a>
                      )
                    </>,
                  ] },
                ]}
              />
            </PracticeSection>
          </>
        }
        step3={<ProgressSection />}
      />
    </main>
  );
}
