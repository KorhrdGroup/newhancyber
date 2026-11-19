import type { Metadata } from "next";
import Link from "next/link";
import PageTabs from "@/components/common/PageTabs";
import InquiryList from "@/components/learning-support/extra/InquiryList";
import { inquiries } from "@/components/learning-support/extra/inquiryData";
import MyPageShell from "@/components/my-page/MyPageShell";
import { myPageBoardTabs } from "@/lib/navigation";

export const metadata: Metadata = { title: "1:1 문의 - 학습 게시판 - 마이페이지" };

/**
 * U36 문의 내역 — 1:1 문의. 원본 /stdMng/questionList.asp 도 학습지원 1:1 문의와 같은 글을 보여 주므로,
 * 목록도 학습지원 1:1 문의(/learning-support/inquiry)와 같은 펼침 목록을 그대로 쓴다.
 */
export default function PersonalInquiriesPage() {
  // TODO: API — 로그인한 학습자의 문의 목록 (학습지원 1:1 문의와 같은 데이터)
  return (
    <MyPageShell title="학습 게시판" desc="수강 중인 과목의 공지와 학습 자료, 내 1:1 문의를 모아 볼 수 있습니다.">
      <PageTabs items={myPageBoardTabs} />
      <div className="lx-board-bar">
        <p className="lx-board-count">
          총 <strong>{inquiries.length}</strong>건
        </p>
        <Link href="/learning-support/inquiry/write" className="ds-btn ds-btn--primary">
          문의하기
        </Link>
      </div>
      <InquiryList items={inquiries} />
    </MyPageShell>
  );
}
