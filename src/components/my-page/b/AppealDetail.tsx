import { appealStatusTone, type Appeal } from "../myPageDataB";
import "@/styles/learning-extra.css";

const FileIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const AppealBadge = ({ appeal }: { appeal: Appeal }) => (
  <span className={`ds-badge ds-badge--${appealStatusTone[appeal.status]}`}>{appeal.status}</span>
);

/** 신청 사유 + 첨부 — 목록의 펼침 칸 (1:1 문의 글과 같은 모양) */
export function AppealBody({ appeal }: { appeal: Appeal }) {
  return (
    <>
      <div className="lx-post-body">
        {appeal.reason.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      {appeal.attachment && (
        // TODO: 첨부파일 다운로드 링크
        <p className="lx-file-chip" aria-label={`첨부파일 ${appeal.attachment}`}>
          <FileIcon />
          {appeal.attachment}
        </p>
      )}
    </>
  );
}

/** 처리 결과 (또는 처리 대기 안내) — 1:1 문의 답변과 같은 상자 */
export function AppealResult({ appeal }: { appeal: Appeal }) {
  return appeal.answer ? (
    <section className="lx-answer">
      <div className="lx-answer-head">
        <strong>처리 결과</strong>
        <span className="lx-post-meta">처리일 {appeal.answer.answeredAt}</span>
      </div>
      <div className="lx-post-body">
        <p className="lx-answer-result">{appeal.answer.result}</p>
        {appeal.answer.body.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </section>
  ) : (
    <section className="lx-answer lx-answer--waiting">
      <p>{appeal.status === "접수" ? "접수되었습니다." : "검토 중입니다."}</p>
      <p>담당자가 확인한 뒤 처리 결과를 알려 드립니다.</p>
    </section>
  );
}
