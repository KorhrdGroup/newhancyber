import type { Metadata } from "next";
import { InfoTable, Notes, PracticeSection, RefNotes } from "@/components/practice-support/PracticeParts";
import { DataTable } from "@/components/social-worker/SwParts";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "수강규정" };

/** 과정별 평가항목 비율 표 (일반과정 · 사회복지현장실습) */
const gradeItems: { title: string; head: string[]; rates: string[]; notes: string[] }[] = [
  {
    title: "일반과정",
    head: ["온라인 출석", "중간고사", "기말고사", "과제", "토론", "퀴즈", "수업참여도"],
    rates: ["15%", "30%", "30%", "15%", "5%", "3%", "2%"],
    notes: ["터치되는 노트북 시험 불가", "태블릿 PC 시험 불가", "데스크탑 PC로만 시험 응시 가능"],
  },
  {
    title: "사회복지현장실습",
    head: ["출결(온/오)", "과제물", "기관실습평가서", "실습일지", "학습계획서", "방문지도교수평가"],
    rates: ["15%", "10%", "50%", "15%", "5%", "5%"],
    notes: ["퀴즈 · 중간/기말 시험 없음"],
  },
];

/** 성적분포: [취득점수, 평점, 등급], 두 줄마다 분포 비율 하나 */
const grades: [string, string, string][] = [
  ["95점 이상", "4.5", "A+"],
  ["90~94점", "4.0", "A"],
  ["85~89점", "3.5", "B+"],
  ["80~84점", "3.0", "B"],
  ["75~79점", "2.5", "C+"],
  ["70~74점", "2.0", "C"],
  ["65~69점", "1.5", "D+"],
  ["60~64점", "1.0", "D"],
];
const distribution = ["20%", "40%", "30%", "10%"];

/** 수강규정 — 수강신청 절차와 같은 흰 바탕 틀: 소제목 + 디자인 시스템 표 + 안내 목록 */
export default function CourseRegulationsPage() {
  return (
    <main className="wrapper">
      <div className="container lx-page lx-page--top lx-page--plain cr-rules">
        <h1 className="page-title">수강규정</h1>
        <p className="lx-desc">수료기준과 과정별 평가항목, 평가방법, 성적부여 기준을 안내합니다.</p>

        <PracticeSection title="수료기준">
          <DataTable head={["과정", "총점", "출석률"]}>
            <tr>
              <td>일반과정</td>
              <td>총점 60점 이상</td>
              <td>출석률 80% 이상</td>
            </tr>
            <tr>
              <td>사회복지현장실습</td>
              <td>총점 60점 이상</td>
              <td>
                온라인 수업 출석률 80% 이상,
                <br />
                오프라인 수업 100% 이수
              </td>
            </tr>
          </DataTable>
        </PracticeSection>

        <PracticeSection title="과정별 평가항목 및 비율">
          {gradeItems.map((g) => (
            <div key={g.title} className="cr-rule-block">
              <h3 className="cr-rule-sub">{g.title}</h3>
              <DataTable head={g.head}>
                <tr>
                  {g.rates.map((r, i) => (
                    <td key={i}>{r}</td>
                  ))}
                </tr>
              </DataTable>
              <Notes items={g.notes} />
            </div>
          ))}
        </PracticeSection>

        <PracticeSection title="평가방법">
          <Notes
            items={[
              "각 평가항목별 참여(응시)기간이 별도 지정되어 있습니다.",
              "각 학습과정별 평가방법 및 기간과 배정이 상이하오니 과정별 강의(수업)계획서를 반드시 확인하시기 바랍니다.",
            ]}
          />
          <InfoTable
            rows={[
              {
                label: "온라인 수업",
                lines: ["콘텐츠 100% 수강해야 출석으로 인정됩니다.", "실습 과목은 1강 이상 미수강 시 미수료(100% 수강해야 함)"],
              },
              {
                label: "정기시험 (중간고사/기말고사)",
                lines: [
                  "중간고사: 8주차 학습기간 중 5일간 시험 (객관식 20문항 / 주관식 5문항: 총 25문항 출제)",
                  "기말고사: 15주차 학습기간 중 5일간 시험 (객관식 20문항 / 주관식 5문항: 총 25문항 출제)",
                  "※ 사회복지사 실습은 시험 없음",
                ],
              },
              { label: "퀴즈", lines: ["4주차 학습기간 중 7일간 시험 (객관식 3문항)"] },
              {
                label: "과제",
                lines: ["9주차 학습기간 동안 제출가능 (4주간)", "각 학습과정별 과제 주제 확인 후 과제 작성", "작성완료된 과제는 파일로 첨부"],
              },
              { label: "토론", lines: ["12주차 학습기간 동안 응시가능 (2주간)", "각 학습과정별 토론 주제 확인 후 토론 응시"] },
            ]}
          />
        </PracticeSection>

        <PracticeSection title="성적부여 방법 및 성적분포 비율">
          <Notes items={["상대평가 실시, 단 실습과정 또는 10명 미만의 학습과정의 경우 절대평가 실시", "원 점수 60점 미만 및 출석률 80% 미만 시 과락처리"]} />
          <DataTable head={["취득점수 (상대평가 변환점수)", "평점", "등급", "성적분포"]}>
            {grades.map(([score, point, grade], i) => (
              <tr key={grade}>
                <td>{score}</td>
                <td>{point}</td>
                <td>{grade}</td>
                {i % 2 === 0 && <td rowSpan={2}>{distribution[i / 2]}</td>}
              </tr>
            ))}
            <tr>
              <td>60점 미만</td>
              <td>없음</td>
              <td>F</td>
              <td>-</td>
            </tr>
          </DataTable>
        </PracticeSection>

        <PracticeSection title="상대평가 안내사항">
          <Notes
            items={[
              "상대평가는 최종성적 공지 시 획득점수(원점수)에 비례하여 반영됩니다. (수강 중 상대평가 점수는 확인 불가합니다.)",
              "상대평가는 각 학습과정 학급별 수강인원을 기준으로 진행됩니다.",
              "동점자 발생 시: 출석 > 시험 > 과제 · 토론 점수 순으로 석차를 산출합니다.",
            ]}
          />
          <RefNotes items={["실습과목은 해당사항 없음(절대평가로 진행)"]} />
        </PracticeSection>
      </div>
    </main>
  );
}
