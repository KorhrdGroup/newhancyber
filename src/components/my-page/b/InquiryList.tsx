import Link from "next/link";
import PageTabs from "@/components/common/PageTabs";
import { Badge } from "@/components/my-classroom/ClassroomUI";
import { getInquiries, inquiryStatus, inquiryStatusTone } from "../myPageDataB";
import Guide from "./Guide";
import { myPageBoardTabs } from "@/lib/navigation";

/** U36 문의 내역 — 1:1 문의 목록 (학습 Q&A 는 학습 게시판 쪽 하나로 모음) */
export default function InquiryList() {
  const list = getInquiries();

  return (
    <>
      <PageTabs items={myPageBoardTabs} className="mp-subtabs" />
      <Guide
        items={[
          "수강·결제·학습 이용처럼 궁금한 점을 남기면 학습지원센터가 답변해 드려요.",
          "답변은 평일 기준 1~2일 안에 드려요. 급한 문의는 1661-7769로 전화 주세요.",
        ]}
      />
      <div className="mq-toolbar mq-toolbar--between">
        <p className="pp-note">총 {list.length}건</p>
        <Link href="/learning-support/inquiry/write" className="ds-btn ds-btn--primary ds-btn--sm">
          문의하기
        </Link>
      </div>
      {list.length === 0 ? (
        <p className="cr-empty">남긴 문의가 없어요.</p>
      ) : (
        <div className="cr-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>분류</th>
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
                      <Link href={`/my-page/inquiries/${q.id}`} className="mq-link">
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
