import type { Metadata } from "next";

export const metadata: Metadata = { title: "모바일학습가이드" };

export default function LearningMobileGuidePage() {
  return (
    <main className="wrapper">
      <div className="container">
        <h1 className="page-title">모바일학습가이드</h1>
        {/* 원본도 내용 준비 중 문구만 있다 */}
        <div className="mobile-guide-content">
          <p>모바일학습가이드 내용이 여기에 표시됩니다.</p>
        </div>
      </div>
    </main>
  );
}
