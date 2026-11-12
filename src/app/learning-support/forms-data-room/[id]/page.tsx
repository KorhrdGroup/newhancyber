import type { Metadata } from "next";
import PostView from "@/components/learning-support/PostView";

export const metadata: Metadata = { title: "서식자료실 상세" };

// TODO: params.id 로 서식자료 상세를 조회한다 (지금은 원본 샘플 그대로)
export default function FormsDataRoomDetailPage() {
  return (
    <main className="wrapper">
      <PostView
        className="lx-page--top"
        title="과제물 작성 가이드 라인"
        date="25.10.21"
        fileName="과제+작성+가이드+라인.PDF(25KB)"
        next={{ title: "공결신청서" }}
        listHref="/learning-support/forms-data-room"
      >
        <p>안녕하십니까? 한평생원격교육원입니다.</p>
        <p>과제물 작성 가이드라인 파일 공유드립니다.</p>
        <p>과제물과 관련된 자세한 내용은 [나의 강의실 &gt; 과목 &gt; 공지사항]을 참고해주시기 바랍니다.</p>
      </PostView>
    </main>
  );
}
