import type { Metadata } from "next";

export const metadata: Metadata = { title: "서류제출" };

/** 원본도 제목만 있는 빈 페이지 (README: "자체개발") */
export default function PracticeDocumentsPage() {
  return (
    <main className="wrapper">
      <div className="content-section">
        <div className="container">
          <h1 className="page-title">서류제출</h1>
          {/* TODO: 서류제출 기능 (자체개발 예정) */}
        </div>
      </div>
    </main>
  );
}
