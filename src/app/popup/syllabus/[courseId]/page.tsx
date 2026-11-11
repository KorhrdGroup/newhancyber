import type { Metadata } from "next";
import PopupShell from "@/components/my-classroom/PopupShell";
import { PrintButton } from "@/components/my-classroom/PopupActions";
import { getSyllabus } from "@/components/my-classroom/classroomData";

export const metadata: Metadata = { title: "강의계획서" };

export default async function SyllabusPopup({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  // TODO: API 강의계획서 조회
  const s = getSyllabus(courseId);

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
        <p className="pp-text">{s.intro}</p>
        <h2 className="pp-box-title ds-mt-20">
          강의 목표
        </h2>
        <ul className="pp-list">
          {s.goals.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>
      <div className="pp-box">
        <h2 className="pp-box-title">평가 · 이의신청 기간</h2>
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
      </div>
      <div className="pp-box">
        <h2 className="pp-box-title">성적 기준 · 배점</h2>
        <table className="ds-table">
          <thead>
            <tr>
              <th>항목</th>
              <th>배점</th>
              <th>기준</th>
            </tr>
          </thead>
          <tbody>
            {s.criteria.map((c) => (
              <tr key={c.label}>
                <td>{c.label}</td>
                <td>{c.weight}%</td>
                <td className="is-left">{c.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pp-box">
        <h2 className="pp-box-title">주차별 강의 계획</h2>
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
      </div>
      <div className="pp-box">
        <h2 className="pp-box-title">교강사</h2>
        <p className="ds-body-16-semibold">{s.instructor.name}</p>
        <ul className="pp-list ds-mt-8">
          {s.instructor.career.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </PopupShell>
  );
}
