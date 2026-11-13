import type { Metadata } from "next";
import PracticeTabs from "@/components/practice-support/PracticeTabs";
import {
  Notes,
  OrgLinks,
  PracticeSection,
  ProgressSection,
  RefNotes,
  RegisterSection,
} from "@/components/practice-support/PracticeParts";

export const metadata: Metadata = { title: "한국어교원실습" };

const areas: { area: string; name: string; courses: string; credits: string }[] = [
  {
    area: "1영역",
    name: "한국어학",
    courses: "한국어학개론, 한국어음운론, 한국어문법론, 한국어어휘론, 한국어의미론, 한국어화용론, 한국어사, 한국어어문규범 등",
    credits: "6학점",
  },
  {
    area: "2영역",
    name: "일반언어학 및 응용언어학",
    courses: "응용언어학, 언어학개론, 대조언어학, 사회언어학, 심리언어학, 외국어습득론",
    credits: "6학점",
  },
  {
    area: "3영역",
    name: "외국어로서의한국어교육론",
    courses:
      "한국어교육개론, 한국어표현교육론, 한국어교재론, 한국어이해교육론, 한국어문법교육론, 한국어발음교육론, 한국문화교육론, 한국어어휘교육론, 한국어교육과정 및 교수요목설계, 한국어능력평가론, 언어교수이론, 한국어한자교육론, 한국어교육정책론, 한국어번역론 등",
    credits: "24학점",
  },
  {
    area: "4영역",
    name: "한국문화",
    courses:
      "한국문학개론, 현대한국사회, 한국사의이해, 한국의현대문화, 한국민속학, 한국의전통문화, 전통문화현장실습, 한국현대문화비평, 한국문학의이해 등",
    credits: "6학점",
  },
  { area: "5영역", name: "한국어교육실습", courses: "한국어교육실습", credits: "3학점" },
];

// 추후 오픈 예정 — 메뉴·사이트맵에서 숨김 처리된 페이지
export default function KoreanTeacherPracticePage() {
  return (
    <main className="wrapper">
      <PracticeTabs
        title="한국어교원실습"
        desc="한국어교원 2급 자격증 취득에 필요한 한국어교육실습을 단계별로 안내합니다."
        step1Label="한국어교원 실습 선이수과목"
        step1={
          <>
            <PracticeSection title="실습 전 필수 확인사항">
              <Notes
                items={[
                  "한국어교원 현장실습 과목은 한국어교원 자격증 이수 교과목 중 한국어학(1영역), 외국어로서의 한국어교육론(3영역) 합해 8과목(24학점) 이상 이수 해야 실습을 진행할 수 있습니다.",
                  "실습 = 학교 출석수업 + 실습기관에서의 현장실습. 실습도 하나의 과목이기 때문에 실습 과목을 수강신청한 후에 신청한 학교 일정에 맞춰 “학교 출석수업”과 “실습기관에서의 현장실습”을 동시에 진행",
                ]}
              />
            </PracticeSection>

            <PracticeSection title="한국어교원 과목">
              <div className="lx-table-scroll">
                <table className="ds-table lx-table lx-practice-grid">
                  <thead>
                    <tr>
                      <th scope="col" colSpan={2}>
                        영역
                      </th>
                      <th scope="col">교과목</th>
                      <th scope="col">필수 이수 학점</th>
                    </tr>
                  </thead>
                  <tbody>
                    {areas.map((row) => (
                      <tr key={row.area}>
                        <th scope="row">{row.area}</th>
                        <td>{row.name}</td>
                        <td className="is-left">{row.courses}</td>
                        <td>{row.credits}</td>
                      </tr>
                    ))}
                    <tr className="lx-practice-total">
                      <th scope="row" colSpan={3}>
                        합계
                      </th>
                      <td>45학점</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <RefNotes
                items={[
                  "단, 국립국어원에 자격증 심사 신청을 위해서 외국어로서의 한국어학 학위를 취득해야 하며, 학위취득을 위한 조건은 최소 48학점(대졸 기준)입니다. 따라서 국립국어원에서 제시하는 영역별 필수이수 학점인 45학점 외에도 추가로 3학점을 더 이수해야 한국어교원2급 자격증 심사 신청 및 발급이 가능합니다.",
                  "학위취득을 위한 교과목: 교육심리학 또는 1~4영역 1과목 추가 수강해야 함.",
                ]}
              />
            </PracticeSection>
          </>
        }
        step2={
          <>
            <RegisterSection />

            {/* 원본 제목 "사회복지현장실습 기관섭외" 는 다른 화면에서 복사된 것이라 한국어교원으로 바로잡는다 */}
            <PracticeSection title="한국어교원 실습 기관섭외">
              <OrgLinks items={[{ logo: "branch-04.png", alt: "국립국어원" }]} />
              <p className="lx-table-note">* 현재 코로나 19이후, 오프라인 현장실습 대신 온라인 실습으로 대체되었습니다.</p>
            </PracticeSection>
          </>
        }
        step3={<ProgressSection />}
      />
    </main>
  );
}
