import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostView from "@/components/learning-support/PostView";
import SampleBody from "@/components/learning-support/SampleBody";
import { practiceNotices } from "@/components/practice-support/noticeData";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
// 글 상세 틀(PostView) 스타일은 학습지원 CSS 에 있어서 같이 불러온다
import "@/styles/learning-support.css";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "실습공지사항 상세" };

const LIST_HREF = "/practice-support/notice";

// TODO: API — id 로 실습 공지 상세와 이전글/다음글을 조회한다 (지금은 목록 샘플에서 찾고 본문은 원본 샘플)
export default async function PracticeNoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = practiceNotices.findIndex((n) => String(n.id) === id);
  if (index < 0) notFound();

  const notice = practiceNotices[index];
  // 목록은 최신 글이 위 — 위 줄이 다음글, 아래 줄이 이전글 (학습지원 공지사항과 같은 규칙)
  const link = (n?: (typeof practiceNotices)[number]) =>
    n ? { title: n.title, href: `${LIST_HREF}/${n.id}` } : undefined;

  return (
    <>
      <MobilePageBanner name="notice-detail" text="실습공지사항" />
      <main className="wrapper">
        <PostView
          title={notice.title}
          date={notice.date}
          fileName="파일명.PDF"
          prev={link(practiceNotices[index + 1])}
          next={link(practiceNotices[index - 1])}
          listHref={LIST_HREF}
        >
          <SampleBody bannerAlt="실습공지사항 배너" />
        </PostView>
      </main>
    </>
  );
}
