import Link from "next/link";
import PageTabs from "@/components/common/PageTabs";
import { Badge } from "@/components/my-classroom/ClassroomUI";
import { getInquiries, inquiryStatus, inquiryStatusTone, inquiryTabs, type InquiryKind } from "../myPageDataB";
import Guide from "./Guide";

const inquiryBase = { personal: "/my-page/inquiries", qna: "/my-page/inquiries/qna" } as const;

/** U36 문의 내역 — 목록 (1:1 문의 / 학습 Q&A) */
export default function InquiryList({ kind }: { kind: InquiryKind }) {
  const list = getInquiries(kind);
  const isPersonal = kind === "personal";

  return (
    <>
      <PageTabs items={inquiryTabs} className="mq-subtabs" />
      <Guide
        items={
          isPersonal
            ? [
                "수강·결제·학습 이용처럼 궁금한 점을 남기면 학습지원센터가 답변해 드려요.",
                "답변은 평일 기준 1~2일 안에 드려요. 급한 문의는 1661-7769로 전화 주세요.",
              ]
            : [
                "과목 강의실에서 교수님께 남긴 학습 질문을 모아 볼 수 있어요.",
                "새 질문은 나의 강의실 > 과목 강의실의 학습 Q&A에서 남겨 주세요.",
              ]
        }
      />
      <div className="mq-toolbar mq-toolbar--between">
        <p className="pp-note">총 {list.length}건</p>
        {isPersonal ? (
          <Link href="/learning-support/inquiry/write" className="ds-btn ds-btn--primary ds-btn--sm">
            문의하기
          </Link>
        ) : (
          <Link href="/my-classroom" className="ds-btn ds-btn--secondary ds-btn--sm">
            나의 강의실로 가기
          </Link>
        )}
      </div>
      {list.length === 0 ? (
        <p className="cr-empty">남긴 문의가 없어요.</p>
      ) : (
        <div className="cr-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>{isPersonal ? "분류" : "과목명"}</th>
                <th>제목</th>
                <th>문의일</th>
                <th>답변 상태</th>
              </tr>
            </thead>
            <tbody>
              {list.map((q) => {
                const status = inquiryStatus(q);
                return (
                  <tr key={q.id}>
                    <td>{q.no}</td>
                    <td>{q.category}</td>
                    <td className="is-left">
                      <Link href={`${inquiryBase[kind]}/${q.id}`} className="mq-link">
                        {q.title}
                      </Link>
                    </td>
                    <td>{q.askedAt}</td>
                    <td>
                      <Badge tone={inquiryStatusTone[status]}>{status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
