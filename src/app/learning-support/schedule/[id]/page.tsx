import type { Metadata } from "next";
import PostDetail from "@/components/learning-support/PostDetail";
import MobilePageBanner from "@/components/layout/MobilePageBanner";

export const metadata: Metadata = { title: "학사일정 상세" };

const TITLE = "[공지] 25년 제4차 평생교육사 자격증 단체 접수 안내";
const NEXT_TITLE = "[한국어교원] 2024-2학기 성적우수수강생 진로선택 학습자 수기";

// TODO: params.id 로 학사일정 상세를 조회한다 (지금은 원본 샘플 그대로)
export default function LearningScheduleDetailPage() {
  return (
    <>
      <MobilePageBanner name="notice-detail" text="학사일정" />
      <main className="wrapper">
        <PostDetail
          mobileInfoTitle={TITLE}
          title={TITLE}
          date="25.10.21"
          fileName="파일명.PDF"
          bannerAlt="학사일정 배너"
          mobileNext={{ title: NEXT_TITLE }}
          desktopNext={NEXT_TITLE}
          listHref="/learning-support/schedule"
        />
      </main>
    </>
  );
}
