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

export const metadata: Metadata = { title: "보육교사실습" };

// 추후 오픈 예정 — 메뉴·사이트맵에서 숨김 처리된 페이지
export default function ChildcareTeacherPracticePage() {
  return (
    <main className="wrapper">
      <PracticeTabs
        title="보육교사실습"
        desc="보육교사 2급 자격증 취득에 필요한 보육실습을 단계별로 안내합니다."
        step1Label="보육실습 선이수과목"
        step1={
          <>
            <PracticeSection title="실습 전 필수 확인사항">
              <Notes
                items={[
                  <>
                    보육실습 과목 운영 교육기관마다 <strong>선이수과목이 다르므로</strong> 실습과목 수강신청 전 해당 기관의 선이수과목을
                    반드시 확인하시기 바랍니다.
                  </>,
                ]}
              />
            </PracticeSection>

            <PracticeSection title="보육교사2급 과목">
              <div className="lx-table-scroll">
                <table className="ds-table lx-table lx-practice-grid">
                  <thead>
                    <tr>
                      <th scope="col">구분</th>
                      <th scope="col" className="is-left">교과목</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">교과인성</th>
                      <td className="is-left">
                        <span className="lx-red">보육교사(인성)론, 아동권리와복지, 보육교사 역할과 책임</span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">보육지식과기술</th>
                      <td className="is-left">
                        <span className="lx-red">
                          놀이지도, 언어지도, 아동음악(아동동작 or 아동미술), 아동수학지도(아동과학지도), 아동안전관리(아동생활지도),
                        </span>{" "}
                        보육학개론, 보육과정, 영유아발달, 영유아교수방법론, 아동건강교육, 영유아사회정서지도, 아동문학교육, 아동상담론,
                        장애아지도, 특수아동이해, 어린이집운영관리, 영유아보육프로그램개발과평가, 보육정책론, 정신건강론, 아동간호학,
                        인간행동과사회환경, 아동영양학, 부모교육론, 가족복지론, 가족관계론, 지역사회복지론
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">보육실무</th>
                      <td className="is-left">
                        <span className="lx-red">아동관찰및행동연구</span>, 보육실습
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* 원본 "프라인" 은 "오프라인" 의 오타라 바로잡는다 */}
              <p className="lx-table-note">
                * <span className="lx-red">붉은색</span>은 오프라인 출석이 1회 있는 대면 교과목
              </p>
            </PracticeSection>
          </>
        }
        step2={
          <>
            <RegisterSection />

            {/* 원본 표 제목 "사회복지현장실습 기관 섭외" 는 다른 화면에서 복사된 것이라 보육교사로 바로잡는다 */}
            <PracticeSection title="보육교사 실습 기관섭외">
              <OrgLinks items={[{ text: "통합정보공시홈페이지 바로가기" }, { logo: "branch-03.png", alt: "아이사랑" }]} />
              <InfoTable
                caption="보육교사 실습 기관 섭외"
                rows={[
                  {
                    label: "실습기관섭외",
                    lines: [
                      "공통사항: 보육 정원 15인 이상",
                      "선택사항(3가지 중 반드시 1가지에 해당해야 함)",
                      "① 의무평가제 결과: A, B등급을 받은 어린이집(2019.6 이후)",
                      "② 평가인증제 결과: 인증상태를 유지하고 있는 어린이집(2017.1.1 이후)",
                      "③ 교육부 신고 기준, 방과 후 과정 운영하는 종일제 유치원",
                    ],
                  },
                  {
                    label: "실습지도자요건",
                    lines: [
                      "- 보육교사 1급 또는 유치원 정교사 1급 자격을 가진 사람",
                      "- 실습지도교사 1명 당 실습생 3명 이내",
                      "- 인가 정원 20인 이하인 가정 어린이집에 한하여 원장이 1급을 소지하고 반을 담당하고 있다면 어린이집 원장도 실습 지도 가능",
                    ],
                  },
                  { label: "실습의뢰", lines: ["- 실습 수강료 이외에 실습 기관에 지불하는 실습비용 별도로 있음"] },
                  {
                    label: "실습시간",
                    lines: [
                      "- 총 240시간 (6주, 평일만 가능)",
                      "- 하루 8시간, 평일 오전 9시부터 오후 7시 사이에 한 경우에만 인정 (점심시간 제외)",
                      "- 공휴일 또는 어린이집이 방학인 경우 실습 미진행 기간이 1일 이상인 경우 6주 실습에 이어서 연속으로 진행",
                    ],
                  },
                  {
                    label: "실습평가",
                    lines: [
                      "- 오프라인 대학: 총 5회 이상 오프라인 출석 / 사이버대학: 학교별 상이",
                      "- 실습일지와 실습평가서 작성",
                      "- 평가점수 80점 이상",
                    ],
                  },
                  {
                    label: "참고 사이트",
                    lines: [
                      "한국보육진흥원 보육인력개발국 홈페이지 (https://chrd.childcare.go.kr)",
                      "[자격증 종류 및 자격기준 → 보육관련 교과목/실습기준]",
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
