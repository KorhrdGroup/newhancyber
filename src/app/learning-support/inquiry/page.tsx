import type { Metadata } from "next";
import Link from "next/link";
import InquiryList from "@/components/learning-support/extra/InquiryList";
import { InquiryLoginNeeded, InquiryUnavailable, toInquiries } from "@/components/learning-support/extra/MemberInquiries";
import { loadCurrentMember, loadMemberInquiries } from "@/lib/publicBoards";

export const metadata: Metadata = { title: "1:1 문의" };

/**
 * 1:1 문의 — board_posts.qna 가운데 로그인한 회원이 쓴 글만(author_type member · author_id 회원 번호).
 * 답변은 관리자 「게시판 관리 › 1:1 문의」의 answer_content · answered_at. 로그인하지 않았으면 목록 자리에 로그인 안내.
 */
export default async function LearningInquiryPage() {
  const member = await loadCurrentMember();
  const list = member && member !== "failed" ? await loadMemberInquiries(member.memberId) : null;
  const items = list ? toInquiries(list.rows) : [];

  return (
    <main className="wrapper">
      <div className="container lx-page lx-page--top lx-page--plain">
        <div className="lx-head">
          <div>
            <h1 className="page-title">1:1 문의</h1>
            <p className="lx-desc">학습·수강·시험 등 궁금한 점을 남겨 주시면 담당자가 답변해 드립니다. 내가 남긴 문의만 보입니다.</p>
          </div>
          <Link href="/learning-support/inquiry/write" className="ds-btn ds-btn--primary">
            문의하기
          </Link>
        </div>

        {member === null ? (
          <InquiryLoginNeeded />
        ) : member === "failed" || list?.failed ? (
          <InquiryUnavailable />
        ) : (
          <>
            <div className="lx-board-bar lx-inquiry-bar">
              <p className="lx-board-count">
                총 <strong>{items.length}</strong>건
              </p>
            </div>
            <InquiryList items={items} />
          </>
        )}
      </div>
    </main>
  );
}
