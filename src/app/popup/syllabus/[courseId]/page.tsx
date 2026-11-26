import type { Metadata } from "next";
import PopupShell from "@/components/my-classroom/PopupShell";
import { PrintButton } from "@/components/my-classroom/PopupActions";
import { getSyllabus } from "@/components/my-classroom/classroomData";
import { getClassSyllabus } from "@/lib/classroom";

export const metadata: Metadata = { title: "강의계획서" };

/**
 * 강의계획서. DB: LMS 과목 관리(소개 · 목표) · 차수(교강사) · 성적 기준 · 평가 기간 + CDMS 콘텐츠 차시 — 로그인 없이 본다.
 * 샘플: classroomData.
 */
export default async function SyllabusPopup({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const s = (await getClassSyllabus(courseId)) ?? getSyllabus(courseId);
  const hasNote = s.criteria.some((c) => c.note);

  return (
    <PopupShell title="강의계획서" sub={s.overview[0].value} footer={<PrintButton />}>
      <div className="pp-box">
        <h2 className="pp-box-title">과목 개요</h2>
        <table className="ds-table ds-table--info">
          <tbody>
            {s.overview.map((row) => (
              <tr key={row.label}>
                <th>{row.label}</th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pp-box">
        <h2 className="pp-box-title">강의 소개</h2>
        <p className="pp-text" style={{ whiteSpace: "pre-line" }}>
          {s.intro || "강의 소개가 아직 없어요."}
        </p>
        {s.goals.length > 0 && (
          <>
            <h2 className="pp-box-title ds-mt-20">강의 목표</h2>
            <ul className="pp-list">
              {s.goals.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="pp-box">
        <h2 className="pp-box-title">평가 기간</h2>
        {s.periods.length === 0 ? (
          <p className="pp-text">평가 일정은 추후 안내돼요.</p>
        ) : (
          <table className="ds-table ds-table--info">
            <tbody>
              {s.periods.map((p) => (
                <tr key={p.label}>
                  <th>{p.label}</th>
                  <td>{p.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="pp-box">
        <h2 className="pp-box-title">성적 기준 · 배점</h2>
        <table className="ds-table">
          <thead>
            <tr>
              <th>항목</th>
              <th>배점</th>
              {hasNote && <th>기준</th>}
            </tr>
          </thead>
          <tbody>
            {s.criteria.map((c) => (
              <tr key={c.label}>
                <td>{c.label}</td>
                <td>{c.weight}%</td>
                {hasNote && <td className="is-left">{c.note}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pp-box">
        <h2 className="pp-box-title">주차별 강의 계획</h2>
        {s.weeks.length === 0 ? (
          <p className="pp-text">차시 구성은 준비 중이에요.</p>
        ) : (
          <table className="ds-table">
            <thead>
              <tr>
                <th className="pp-week-col">주차</th>
                <th>주제</th>
                <th>차시</th>
              </tr>
            </thead>
            <tbody>
              {s.weeks.map((w) => (
                <tr key={w.week}>
                  <td>{w.week}주차</td>
                  <td className="is-left">{w.topic}</td>
                  <td className="is-left">{w.lessons.join(" / ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="pp-box">
        <h2 className="pp-box-title">교강사</h2>
        <p className="ds-body-16-semibold">{s.instructor.name}</p>
        {s.instructor.career.length > 0 && (
          <ul className="pp-list ds-mt-8">
            {s.instructor.career.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        )}
      </div>
    </PopupShell>
  );
}
