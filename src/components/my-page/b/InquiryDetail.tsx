import Link from "next/link";
import PageTabs from "@/components/common/PageTabs";
import { Badge } from "@/components/my-classroom/ClassroomUI";
import { inquiryStatus, inquiryStatusTone, type Inquiry } from "../myPageDataB";
import { myPageBoardTabs } from "@/lib/navigation";

/** U36 문의 상세 — 질문 + 답변 */
export default function InquiryDetail({ inquiry, backHref }: { inquiry: Inquiry; backHref: string }) {
  const status = inquiryStatus(inquiry);

  return (
    <>
      <PageTabs items={myPageBoardTabs} className="mp-subtabs" />
      <section className="pp-box">
        <div className="mq-meta">
          <Badge tone={inquiryStatusTone[status]}>{status}</Badge>
          <span>{inquiry.category}</span>
          <span>문의일 {inquiry.askedAt}</span>
        </div>
        <h3 className="mq-post-title ds-mt-8">{inquiry.title}</h3>
        <p className="mq-body ds-mt-16">{inquiry.body}</p>
      </section>

      {inquiry.answer ? (
        <section className="pp-box mq-answer">
          <div className="pp-row pp-row--between">
            <h3 className="pp-box-title pp-box-title--flush">답변</h3>
            <span className="pp-note">
              {inquiry.answer.writer} · {inquiry.answer.answeredAt}
            </span>
          </div>
          <p className="mq-body ds-mt-12">{inquiry.answer.body}</p>
        </section>
      ) : (
        <section className="pp-box mq-waiting">
          <p className="mq-waiting-title">답변을 기다리고 있어요</p>
          <p className="pp-note ds-mt-4">답변이 등록되면 문자로 알려 드릴게요.</p>
        </section>
      )}

      <div className="pp-actions">
        <Link href={backHref} className="ds-btn ds-btn--secondary">
          목록으로
        </Link>
      </div>
    </>
  );
}
