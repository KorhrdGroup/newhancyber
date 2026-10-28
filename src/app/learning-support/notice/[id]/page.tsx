import type { Metadata } from "next";
import PostDetail from "@/components/learning-support/PostDetail";
import MobilePageBanner from "@/components/layout/MobilePageBanner";

export const metadata: Metadata = { title: "공지사항 상세" };

const NEXT_TITLE = "[한국어교원] 2024-2학기 성적우수수강생 진로선택 학습자 수기";

// TODO: params.id 로 공지사항 상세를 조회한다 (지금은 원본 샘플 그대로)
export default function LearningNoticeDetailPage() {
  return (
    <>
      <MobilePageBanner name="notice-detail" text="공지사항" />
      <main className="wrapper">
        <PostDetail
          mobileInfoTitle="26년 1학기 1차(12월 24일 개강반) 사회복지현장실습 모집 안내문(지방)"
          title="26년 1학기 1차(12월 24일 개강반) 사회복지..."
          date="25.10.21"
          fileName="파일명.PDF"
          bannerAlt="공지사항 배너"
          mobilePrev={{ title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습", subtitle: "모집 안내문(지방)" }}
          mobileNext={{ title: "26년 1학기 1차(12월 24일 개강반) 사회복지현장실습", subtitle: "모집 안내문(지방)" }}
          desktopNext={NEXT_TITLE}
          listHref="/learning-support/notice"
        />
      </main>
    </>
  );
}
