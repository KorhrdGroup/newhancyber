import type { Metadata } from "next";
import PracticeTabs from "@/components/practice-support/PracticeTabs";
import {
  InfoTable,
  Notes,
  OrgLinks,
  PracticeSection,
  ProgressSection,
  RegisterSection,
} from "@/components/practice-support/PracticeParts";

export const metadata: Metadata = { title: "사회복지사실습" };

const requirementRows = (hours: string, seminar: string) => [
  {
    label: "실습시간",
    lines: [
      hours,
      "하루 4시간 이상 8시간 이하",
      "주중, 주말, 야간 가능",
      "(단, 야간이나 주말실습일 경우 프로그램이 운영중이여야 하며 실습 지도자가 상근해야 함)",
    ],
  },
  { label: "실습세미나", lines: [seminar] },
  {
    label: "실습기관",
    lines: [
      "보건복지부장관으로부터 선정된 사회복지사업을 수행하는, 평가인증을 받은 사회복지 기관, 법인, 시설 또는 단체로 실습기관",
      "지도자가 2명 이상 상근해야 함",
    ],
  },
  {
    label: "실습지도자",
    lines: [
      "1급 사회복지사 자격증을 취득한 이후, 3년 이상의 사회복지사업 실무경험 보유",
      "2급 사회복지사 자격증을 취득한 이후, 5년 이상의 사회복지사업 실무경험 보유",
    ],
  },
];

export default function SocialWorkerPracticePage() {
  return (
    <main className="wrapper">
      <PracticeTabs
        title="사회복지사실습"
        desc="사회복지사 2급 자격증 취득에 필요한 사회복지현장실습을 단계별로 안내합니다."
        step1Label="실습과목 신청 전 선이수과목"
        step1={
          <>
            <PracticeSection title="실습 전 필수 확인사항">
              <Notes
                items={[
                  "사회복지사 현장실습 과목은 사회복지사 2급 자격증 이수 교과목 중 필수 4과목, 선택 2과목 이상의 선이수과목이 충족되어야 수강과 실습을 진행할 수 있습니다.",
                  <>
                    실습 = 교육원 출석수업 + 실습기관에서의 현장실습. 실습도 하나의 과목이기 때문에 실습 과목을 수강신청한 후에 신청한
                    학교 일정에 맞춰 &quot;교육원 출석수업&quot;과 &quot;실습기관에서의 현장실습&quot;을 동시에 진행
                  </>,
                ]}
              />
            </PracticeSection>

            <PracticeSection title="실습과목 신청 전 선이수과목">
              <InfoTable
                rows={[
                  {
                    label: "필수과목(4과목) 이상 이수",
                    lines: [
                      "사회복지개론, 사회복지법제, 사회복지실천기술론, 사회복지실천론, 사회복지정책론, 사회복지조사론, 사회복지행정론, 인간행동과사회환경, 지역사회복지론",
                    ],
                  },
                  {
                    label: "선택과목(2과목) 이상 이수",
                    lines: [
                      "가족복지론, 가족상담및가족치료, 교정복지론, 국제사회복지론, 노인복지론, 복지국가론, 빈곤론, 사례관리론, 사회문제론, 사회보장론, 사회복지역사, 사회복지와문화다양성, 사회복지와인권, 사회복지윤리와철학, 사회복지자료분석론, 사회복지지도가독론, 산업복지론, 아동복지론, 여성복지론, 의료사회복지론, 자원봉사론, 장애인복지론, 정신건강론, 정신건강사회복지론, 청소년복지론, 프로그램개발과평가, 학교사회복지론",
                    ],
                  },
                ]}
              />
            </PracticeSection>

            {/* 구법·신법 안내 — 원본 캐릭터 그림을 살린 안내 상자 */}
            <aside className="lx-law-box">
              <img src="/resources/images/pratice-support/pratice-support-04.png" alt="" className="lx-law-img" />
              <div>
                <h2 className="lx-law-title">구법? 신법? 나는 어디에 해당할까?</h2>
                <ul className="lx-law-list">
                  <li>
                    법령의 시행일인 2020년 1월 1일 이전에 사회복지학 전공교과목 및 사회복지관련 교과목을 1과목이라도 수강(개강)을
                    시작했다면 → <strong>구법 대상자</strong>
                  </li>
                  <li>
                    2020년 1월 1일 이후에 수강(개강)을 시작했다면 → <strong>개정법 대상자</strong>
                  </li>
                </ul>
                <p className="lx-law-note">
                  *자세한 내용은 &apos;한국사회복지사협회 자격관리센터&apos; 사이트에서 공지사항을 확인하시기 바랍니다.
                </p>
              </div>
            </aside>

            <PracticeSection title="개정법(신법) - 2020년 1월 1일 이후에 사회복지 과정을 시작한 학습자">
              <InfoTable caption="사회복지현장실습 이수조건" rows={requirementRows("160시간 이상", "총 30시간")} />
            </PracticeSection>

            {/* 원본은 이 표도 제목이 "개정법(신법)" 으로 잘못 복사돼 있었다. 120시간·세미나 기관별 상이 = 구법 기준이라 제목을 바로잡는다 */}
            <PracticeSection title="구법 - 2019년 12월 31일 이전에 사회복지 과정을 시작한 학습자">
              <InfoTable caption="사회복지현장실습 이수조건" rows={requirementRows("120시간 이상", "각 운영기관마다 상이함")} />
            </PracticeSection>
          </>
        }
        step2={
          <>
            <RegisterSection />

            <PracticeSection title="사회복지현장실습 기관섭외">
              <OrgLinks
                items={[
                  { href: "https://www.welfare.net/lic/", logo: "branch-01.png", alt: "한국사회복지사협회 자격관리센터" },
                  { href: "https://www.bokji.net/", logo: "branch-02.png", alt: "사회복지포털 복지넷" },
                  { href: "https://www.welfare.net/prm/find-training-center/current-stat/", text: "사회복지현장실습기관 선정 현황" },
                ]}
              />
              <InfoTable
                caption="사회복지현장실습 기관 섭외"
                rows={[
                  {
                    label: "실습기관섭외",
                    lines: [
                      "- 사회복지법인 및 사회복지시설(이용시설, 거주시설 등)",
                      "- 공공기관(지방자치단체 등)",
                      "- 사회복지서비스를 제공하는 병원, 학교, 교정시설, 시민사회단체 등",
                      "※ 위 기관 예시는 참고용이며, 실습기관 선정은 한국사회복지사협회 등록 여부를 확인하여 결정해야 합니다.",
                      "※ 현재 근무하는 기관 및 동일 법인, 재단에서 실습 불가능",
                    ],
                  },
                  {
                    label: "실습지도자요건",
                    lines: [
                      "- 1급 사회복지사자격증을 취득한 이후 3년 이상의 사회복지사업의 실무 경험이 있는 자",
                      "- 2급 사회복지사자격증을 취득한 이후 5년 이상의 사회복지사업의 실무 경험이 있는자",
                      "- 기관실습이 실시되는 연도의 전년도에 8시간 이상의 보수교육 이수한 자",
                      "- 기관실습 지도자 1명이 동시에 지도할 수 있는 학생 수는 5명 이내",
                    ],
                  },
                  {
                    label: "실습의뢰",
                    lines: [
                      "- 실습 담당자 통해 실습 진행할 기관에 실습 요청",
                      "- 실습 수강료 이외에 실습 기관에 지불하는 실습비용 별도로 발생됨",
                    ],
                  },
                  {
                    label: "실습시간",
                    lines: [
                      "- 총 160시간(야간/주말 가능)",
                      "단, 2019년 12월 31일까지 일부 교과목을 수강한 경우는 120시간 적용 대상이나 규정에 따라야 함",
                      "- 하루 최소 4시간 이상, 최대 8시간 이하",
                    ],
                  },
                  {
                    label: "실습평가",
                    lines: [
                      "- 오프라인 대학: 총 5회 이상 오프라인 출석 / 사이버대학교: 학교별 상이",
                      "- 실습 세미나",
                      "- 실습일지와 실습 평가서 작성",
                      "- 평가점수 60점 이상",
                    ],
                  },
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
