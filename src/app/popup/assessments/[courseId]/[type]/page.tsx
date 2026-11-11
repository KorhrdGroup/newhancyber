import type { Metadata } from "next";
import { Badge } from "@/components/my-classroom/ClassroomUI";
import PopupShell from "@/components/my-classroom/PopupShell";
import ExamSheet from "@/components/my-classroom/popups/ExamSheet";
import WriteForm from "@/components/my-classroom/popups/WriteForm";
import {
  assessmentLabels,
  getAssessments,
  getCourse,
  getExamQuestions,
  sampleDiscussionPosts,
  type AssessmentType,
} from "@/components/my-classroom/classroomData";

export const metadata: Metadata = { title: "시험·과제" };

const guide: Partial<Record<AssessmentType, string>> = {
  assignment: "주어진 사례를 읽고 문제와 해결 방안을 A4 2~3장으로 정리해 올려 주세요. 다른 사람의 글을 옮겨 쓰면 0점 처리됩니다.",
  quiz: "배운 내용을 확인하는 퀴즈입니다. 기간 안에 한 번 풀 수 있습니다.",
  note: "용어를 확인하는 짧은 쪽지시험입니다.",
  discussion: "주제에 대한 생각을 올리고, 다른 학습자의 글에 의견을 남겨 주세요. 글 1개 이상 써야 점수가 인정됩니다.",
  activity: "관련 기사나 자료를 읽고 느낀 점과 현장에 쓸 수 있는 점을 정리해 주세요.",
};

export default async function AssessmentPopup({ params }: { params: Promise<{ courseId: string; type: string }> }) {
  const { courseId, type } = await params;
  // TODO: API 평가 상세·제출 내역 조회
  const course = getCourse(courseId);
  const items = getAssessments(course.id);
  const item = items.find((a) => a.type === type) ?? items.find((a) => a.type === "assignment")!;
  const label = assessmentLabels[item.type];
  const isTest = item.type === "quiz" || item.type === "note";

  return (
    <PopupShell title={label} sub={course.title} footer={null}>
      <div className="pp-box">
        <div className="pp-row pp-row--between">
          <h2 className="pp-box-title pp-box-title--flush">
            {item.title}
          </h2>
          <Badge>{item.status}</Badge>
        </div>
        <table className="ds-table ds-table--info ds-mt-12">
          <tbody>
            <tr>
              <th>참여 기간</th>
              <td>
                {item.start} ~ {item.end}
              </td>
            </tr>
            <tr>
              <th>배점</th>
              <td>{item.maxScore}점</td>
            </tr>
            {item.score !== undefined && (
              <tr>
                <th>받은 점수</th>
                <td>
                  <strong>{item.score}점</strong>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="pp-text ds-mt-16">
          {guide[item.type]}
        </p>
      </div>

      {item.status === "참여 완료" ? (
        <div className="pp-box">
          <p className="pp-text">이미 참여했습니다. 점수와 정답은 기간이 끝난 뒤 공개됩니다.</p>
        </div>
      ) : isTest ? (
        <div className="ds-mt-16">
          <ExamSheet questions={getExamQuestions(item.type === "note" ? 5 : 10)} submitLabel="답안 제출" />
        </div>
      ) : item.type === "discussion" ? (
        <>
          <div className="pp-box">
            <h3 className="pp-box-title">올라온 글 {sampleDiscussionPosts.length}</h3>
            {sampleDiscussionPosts.map((post, i) => (
              <div key={i} className="pp-post">
                <div className="pp-post-head">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
                <p className="pp-post-body">{post.body}</p>
              </div>
            ))}
          </div>
          <div className="pp-box">
            <WriteForm submitLabel="글 올리기" placeholder="토론 주제에 대한 내 생각을 적어 주세요." />
          </div>
        </>
      ) : (
        <div className="pp-box">
          <WriteForm withFile={item.type === "assignment"} submitLabel={`${label} 제출`} placeholder={`${label} 내용을 적어 주세요.`} />
        </div>
      )}
    </PopupShell>
  );
}
