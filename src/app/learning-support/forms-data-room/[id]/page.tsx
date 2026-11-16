import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostView from "@/components/learning-support/PostView";
import { findPostWithSiblings, formPosts } from "@/components/learning-support/boardData";
import MobilePageBanner from "@/components/layout/MobilePageBanner";

export const metadata: Metadata = { title: "서식자료실 상세" };

// TODO: API — id 로 서식자료 상세(본문·첨부파일)와 이전글/다음글을 조회한다 (지금은 목록 샘플에서 찾는다)
export default async function FormsDataRoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = findPostWithSiblings([formPosts], `/learning-support/forms-data-room/${id}`);
  if (!found) notFound();
  const { post } = found;

  return (
    <>
      <MobilePageBanner name="notice-detail" text="서식자료실" />
      <main className="wrapper">
        <PostView
          title={post.title}
          date={post.date}
          fileName={`${post.title.replace(/\.$/, "").replaceAll(" ", "_")}.hwp`}
          prev={found.prev}
          next={found.next}
          listHref="/learning-support/forms-data-room"
        >
          {/* 본문 샘플 (원본 forms-data-room-detail.html 문구를 글 제목에 맞춤) */}
          <p>안녕하십니까? 한평생원격교육원입니다.</p>
          <p>{post.title.replace(/\.$/, "")} 파일 공유드립니다.</p>
          <p>첨부파일을 내려받아 작성해 주시고, 자세한 내용은 [나의 강의실 &gt; 과목 &gt; 공지사항]을 참고해주시기 바랍니다.</p>
        </PostView>
      </main>
    </>
  );
}
