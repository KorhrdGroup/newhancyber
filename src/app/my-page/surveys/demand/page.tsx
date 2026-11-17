import type { Metadata } from "next";
import Link from "next/link";
import PageTabs from "@/components/common/PageTabs";
import MyPageShell from "@/components/my-page/MyPageShell";
import StatusBadge from "@/components/my-page/a/StatusBadge";
import { demandSurveys, surveyTabs } from "@/components/my-page/myPageDataA";

export const metadata: Metadata = { title: "수요 조사 - 설문조사 - 마이페이지" };

/** U30 설문조사 — 수요 조사 목록 */
export default function DemandSurveysPage() {
  // TODO: API 수요 조사 목록 조회
  const surveys = demandSurveys;

  return (
    <MyPageShell title="설문조사" desc="여러분의 의견은 이름 없이 모아 강의와 학습 환경을 고치는 데 씁니다.">
      <PageTabs items={surveyTabs} />
      {surveys.length === 0 ? (
        <p className="cr-empty">진행 중인 수요 조사가 없습니다.</p>
      ) : (
        <table className="ds-table ds-table--stack">
          <thead>
            <tr>
              <th className="is-left">설문 제목</th>
              <th>조사 기간</th>
              <th>상태</th>
              <th>참여</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((s) => (
              <tr key={s.id}>
                <td className="ds-table-stack-head is-left">{s.title}</td>
                <td className="mp-nowrap" data-label="조사 기간">
                  {s.start} ~ {s.end}
                </td>
                <td data-label="상태">
                  <StatusBadge>{s.status}</StatusBadge>
                </td>
                <td data-label="참여">
                  {s.status === "진행 중" ? (
                    <Link href={`/my-page/surveys/demand/${s.id}`} className="ds-btn ds-btn--primary ds-btn--sm">
                      참여하기
                    </Link>
                  ) : (
                    <button type="button" className="ds-btn ds-btn--sm" disabled>
                      {s.status === "참여 완료" ? "참여 완료" : "마감"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </MyPageShell>
  );
}
