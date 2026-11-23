import type { Metadata } from "next";
import Link from "next/link";
import PageTabs from "@/components/common/PageTabs";
import InquiryList from "@/components/learning-support/extra/InquiryList";
import { InquiryLoginNeeded, InquiryUnavailable, toInquiries } from "@/components/learning-support/extra/MemberInquiries";
import MyPageShell from "@/components/my-page/MyPageShell";
import { myPageBoardTabs } from "@/lib/navigation";
import { loadCurrentMember, loadMemberInquiries } from "@/lib/publicBoards";

export const metadata: Metadata = { title: "1:1 문의 - 학습 게시판 - 마이페이지" };

/**
 * U36 문의 내역 — 1:1 문의. 원본 /stdMng/questionList.asp 도 학습지원 1:1 문의와 같은 글을 보여 주므로,
 * 목록도 학습지원 1:1 문의(/learning-support/inquiry)와 같은 데이터 · 같은 펼침 목록을 쓴다 (로그인한 회원 자기 글만).
 */
export default async function PersonalInquiriesPage() {
  const member = await loadCurrentMember();
  const list = member && member !== "failed" ? await loadMemberInquiries(member.memberId) : null;
  const items = list ? toInquiries(list.rows) : [];

  return (
    <MyPageShell title="학습 게시판" desc="수강 중인 과목의 공지와 학습 자료, 내 1:1 문의를 모아 볼 수 있습니다.">
      <PageTabs items={myPageBoardTabs} />
      <div className="lx-board-bar">
        {member && member !== "failed" && !list?.failed ? (
          <p className="lx-board-count">
            총 <strong>{items.length}</strong>건
          </p>
        ) : (
          <span />
        )}
        <Link href="/learning-support/inquiry/write" className="ds-btn ds-btn--primary">
          문의하기
        </Link>
      </div>
      {member === null ? <InquiryLoginNeeded /> : member === "failed" || list?.failed ? <InquiryUnavailable /> : <InquiryList items={items} />}
    </MyPageShell>
  );
}
