import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Badge } from "@/components/my-classroom/ClassroomUI";
import { blockedReason, getMyAssessment, KIND_TO_TYPE } from "@/lib/classroom";
import { readDiscussionPosts, WRITING_KINDS, type LearnerAssessment } from "@/lib/db/assessments";
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

/**
 * 과제 · 토론 · 학습심화활동 (+ 샘플 퀴즈 · 쪽지시험). DB: ?a=평가 번호 — 로그인한 회원 자신의 수강만,
 * 시험 종류(중간 · 기말 · 퀴즈)면 시험 유의사항으로 보낸다. 내 제출 · 점수 · 피드백, 토론은 다른 학습자 글(이름 가림)도.
 */
export default async function AssessmentPopup({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string; type: string }>;
  searchParams: Promise<{ a?: string | string[] }>;
}) {
  const { courseId, type } = await params;
  const { a } = await searchParams;
  const la = await getMyAssessment(courseId, a, `/popup/assessments/${courseId}/${type}?a=${a ?? ""}`);
  if (la) return <DbAssessment la={la} courseId={courseId} />;

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

/** DB 과제 · 토론 · 학습심화활동 */
async function DbAssessment({ la, courseId }: { la: LearnerAssessment; courseId: string }) {
  const type = KIND_TO_TYPE[la.kind] ?? "assignment";
  // 시험 종류는 유의사항 → 시험지로
  if (!(WRITING_KINDS as readonly string[]).includes(la.kind)) redirect(`/popup/exam/${courseId}/${type}/notice?a=${la.assessmentId}`);
  const label = assessmentLabels[type];
  const blocked = blockedReason(la);
  const done = la.submissionStatus === "제출 완료" || la.submissionStatus === "채점 완료";
  const status = done ? "참여 완료" : la.phase === "before" ? "기간 전" : la.phase === "closed" ? "기간 종료" : "참여 전";
  const posts = type === "discussion" ? await readDiscussionPosts(la.assessmentId, la.enrollmentId) : [];
  const canWrite = !blocked && la.submissionStatus !== "채점 완료";

  return (
    <PopupShell title={label} sub={la.courseName} footer={null}>
      <div className="pp-box">
        <div className="pp-row pp-row--between">
          <h2 className="pp-box-title pp-box-title--flush">{la.title}</h2>
          <Badge>{status}</Badge>
        </div>
        <table className="ds-table ds-table--info ds-mt-12">
          <tbody>
            <tr>
              <th>참여 기간</th>
              <td>
                {la.openAt ?? "-"} ~ {la.closeAt ?? "-"}
              </td>
            </tr>
            <tr>
              <th>배점</th>
              <td>{la.maxScore}점</td>
            </tr>
            {la.submissionStatus === "채점 완료" && (
              <tr>
                <th>받은 점수</th>
                <td>
                  <strong>{la.score ?? 0}점</strong>
                </td>
              </tr>
            )}
            {la.submittedAt && (
              <tr>
                <th>낸 때</th>
                <td>{la.submittedAt}</td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="pp-text ds-mt-16">{la.description?.trim() || guide[type]}</p>
        {la.feedback && <p className="pp-note ds-mt-8">교강사 의견: {la.feedback}</p>}
      </div>

      {type === "discussion" && (
        <div className="pp-box">
          <h3 className="pp-box-title">올라온 글 {posts.length}</h3>
          {posts.length === 0 && <p className="pp-note">아직 올라온 글이 없어요.</p>}
          {posts.map((post, i) => (
            <div key={i} className="pp-post">
              <div className="pp-post-head">
                <span>{post.author}</span>
                <span>{post.date}</span>
              </div>
              <p className="pp-post-body">{post.body}</p>
            </div>
          ))}
        </div>
      )}

      <div className="pp-box">
        {canWrite ? (
          <WriteForm
            submitLabel={type === "discussion" ? "글 올리기" : `${label} 제출`}
            placeholder={type === "discussion" ? "토론 주제에 대한 내 생각을 적어 주세요." : `${label} 내용을 적어 주세요.`}
            db={{ classId: la.classId, assessmentId: la.assessmentId, initial: la.content ?? undefined }}
          />
        ) : (
          <>
            <p className="pp-text">{blocked ?? "채점이 끝나 고칠 수 없어요."}</p>
            {la.content && <p className="pp-post-body ds-mt-12">{la.content}</p>}
          </>
        )}
        {type === "assignment" && canWrite && <p className="pp-note ds-mt-8">첨부 파일 제출은 준비 중이에요. 내용은 글로 적어 주세요.</p>}
      </div>
    </PopupShell>
  );
}
