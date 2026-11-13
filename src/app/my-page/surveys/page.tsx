import type { Metadata } from "next";
import PageTabs from "@/components/common/PageTabs";
import MyPageShell from "@/components/my-page/MyPageShell";
import PopupButton from "@/components/my-classroom/PopupButton";
import StatusBadge from "@/components/my-page/a/StatusBadge";
import { getCourse } from "@/components/my-classroom/classroomData";
import { satisfactionSurveys, surveyTabs } from "@/components/my-page/myPageDataA";

export const metadata: Metadata = { title: "과정 만족도 조사 - 설문조사 - 마이페이지" };

/** U30 설문조사 — 과정 만족도 조사 (참여는 강의 평가 팝업) */
export default function SatisfactionSurveysPage() {
  // TODO: API 과정 만족도 조사 목록 조회
  const surveys = satisfactionSurveys;

  return (
    <MyPageShell title="설문조사" desc="여러분의 의견은 이름 없이 모아 강의와 학습 환경을 고치는 데 씁니다.">
      <PageTabs items={surveyTabs} />
      <div className="cr-table-wrap">
        <table className="ds-table">
          <thead>
            <tr>
              <th>차수</th>
              <th>과목</th>
              <th>조사 기간</th>
              <th>상태</th>
              <th>참여</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((s) => {
              const course = getCourse(s.courseId);
              return (
                <tr key={s.courseId}>
                  <td className="mp-nowrap">{course.term}</td>
                  <td className="is-left">
                    <strong>{course.title}</strong> <span className="pp-note">{course.classNo}</span>
                  </td>
                  <td className="mp-nowrap">
                    {s.start} ~ {s.end}
                  </td>
                  <td>
                    <StatusBadge>{s.status}</StatusBadge>
                  </td>
                  <td>
                    {s.status === "참여 전" ? (
                      <PopupButton href={`/popup/survey/${s.courseId}`} className="ds-btn ds-btn--primary ds-btn--sm">
                        참여하기
                      </PopupButton>
                    ) : (
                      <button type="button" className="ds-btn ds-btn--sm" disabled>
                        {s.status === "참여 완료" ? "참여 완료" : "참여 불가"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="pp-note ds-mt-12">과정 만족도 조사를 마쳐야 그 과목의 성적을 볼 수 있습니다.</p>
    </MyPageShell>
  );
}
