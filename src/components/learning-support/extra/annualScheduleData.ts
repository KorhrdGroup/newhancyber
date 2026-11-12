/**
 * 연간 학사일정 (원본 /stdSup/yearStdSch.asp 2026-11-11 기준 값 그대로).
 * 원본에서 "성적확인"·"학점 인정 신청/학위 신청" 요약 줄은 주석 처리돼 있어 뺐다.
 * TODO: API — 학기·차수별 학사일정을 서버에서 받아온다.
 */

export interface ScheduleRow {
  label: string;
  value: string;
}

export interface TermSchedule {
  term: string;
  /** 지금 수강신청을 받는 차수 */
  open: boolean;
  rows: ScheduleRow[];
}

const rows = (
  apply: string,
  study: string,
  midterm: string,
  finalExam: string,
  credit: string,
  degree: string,
): ScheduleRow[] => [
  { label: "수강신청", value: apply },
  { label: "학습기간", value: study },
  { label: "중간고사", value: midterm },
  { label: "기말고사", value: finalExam },
  { label: "학점인정", value: credit },
  { label: "학위신청", value: degree },
];

export const annualSchedule: { year: string; terms: TermSchedule[] }[] = [
  {
    year: "2026년 2학기",
    terms: [
      {
        term: "2026년 2학기 1차",
        open: false,
        rows: rows(
          "2026-08-06 ~ 2026-09-18",
          "2026-09-19 ~ 2027-01-01",
          "2026-11-07 ~ 2026-11-11",
          "2026-12-26 ~ 2026-12-30",
          "2026-12-01",
          "2027-02-01",
        ),
      },
      {
        // 수강신청·학습기간·시험 날짜가 다른 차수와 맞지 않지만 원본 값 그대로 둔다
        term: "2026년 2학기 2차",
        open: false,
        rows: rows(
          "2026-09-01 ~ 2026-09-01",
          "2026-02-01 ~ 2026-05-16",
          "2026-03-22 ~ 2026-03-26",
          "2026-05-10 ~ 2026-05-14",
          "2027-01-01",
          "2027-02-01",
        ),
      },
      {
        term: "2026년 2학기 3차",
        open: false,
        rows: rows(
          "2026-09-10 ~ 2026-10-14",
          "2026-10-15 ~ 2027-01-27",
          "2026-12-03 ~ 2026-12-07",
          "2027-01-21 ~ 2027-01-25",
          "2027-04-01",
          "2027-08-01",
        ),
      },
      {
        term: "2026년 2학기 4차",
        open: true,
        rows: rows(
          "2026-10-15 ~ 2026-11-11",
          "2026-11-12 ~ 2027-02-24",
          "2026-12-31 ~ 2027-01-04",
          "2027-02-18 ~ 2027-02-22",
          "2027-04-01",
          "2027-08-01",
        ),
      },
    ],
  },
];
