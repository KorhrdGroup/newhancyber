import type { Metadata } from "next";
import { Badge } from "@/components/my-classroom/ClassroomUI";
import PopupShell from "@/components/my-classroom/PopupShell";
import { TodoButton } from "@/components/my-classroom/PopupActions";
import { getCourse, practiceDocs } from "@/components/my-classroom/classroomData";

export const metadata: Metadata = { title: "실습 서류 제출" };

export default async function PracticeDocumentsPopup({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  // TODO: API 실습 서류 제출 현황 조회·파일 올리기
  const course = getCourse(courseId);
  const done = practiceDocs.filter((d) => d.status === "제출 완료").length;

  return (
    <PopupShell title="실습 서류 제출" sub={course.title}>
      <div className="pp-box">
        <p className="pp-text">
          실습기관 배정 전에 아래 서류 6가지를 모두 내야 합니다. 지금 <strong>{done}/{practiceDocs.length}</strong>개를 냈습니다.
          서식은 <a href="/practice-support/documents" target="_blank" className="ds-text-brand">실습지원 &gt; 서류제출</a>에서 받을 수 있습니다.
        </p>
      </div>
      <div className="pp-box">
        <table className="ds-table">
          <thead>
            <tr>
              <th>서류</th>
              <th>설명</th>
              <th>상태</th>
              <th>낸 날</th>
              <th>파일</th>
            </tr>
          </thead>
          <tbody>
            {practiceDocs.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <strong>{doc.name}</strong>
                </td>
                <td className="is-left">
                  {doc.description}
                  {doc.note && (
                    <p className="pp-note ds-text-danger ds-mt-4">
                      반려 사유: {doc.note}
                    </p>
                  )}
                </td>
                <td>
                  <Badge>{doc.status}</Badge>
                </td>
                <td>{doc.submittedAt ?? "-"}</td>
                <td>
                  <TodoButton
                    className={`ds-btn ds-btn--sm ${doc.status === "제출 완료" ? "ds-btn--secondary" : "ds-btn--primary"}`}
                    label={doc.status === "제출 완료" ? "다시 올리기" : "파일 올리기"}
                    message={`${doc.name} 올리기는`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PopupShell>
  );
}
