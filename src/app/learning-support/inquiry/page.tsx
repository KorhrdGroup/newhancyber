import type { Metadata } from "next";
import Link from "next/link";
import { inquiries } from "@/components/learning-support/extra/inquiryData";

export const metadata: Metadata = { title: "1:1 문의" };

// TODO: 로그인 확인 — 로그인하지 않았으면 /member/login 으로 보낸다 (원본도 로그인해야 열림)
// TODO: API — 로그인한 학습자의 문의 목록·페이지 정보
export default function LearningInquiryPage() {
  return (
    <main className="wrapper">
      <div className="container lx-page lx-page--top">
        <div className="lx-head">
          <div>
            <h1 className="page-title">1:1 문의</h1>
            <p className="lx-desc">학습·수강·시험 등 궁금한 점을 남겨 주시면 담당자가 답변해 드립니다. 내가 남긴 문의만 보입니다.</p>
          </div>
          <Link href="/learning-support/inquiry/write" className="ds-btn ds-btn--primary">
            문의하기
          </Link>
        </div>

        <div className="lx-panel">
          <table className="ds-table lx-inquiry-table">
            <thead>
              <tr>
                <th className="lx-col-num">번호</th>
                <th>제목</th>
                <th className="lx-col-date">문의일</th>
                <th className="lx-col-status">답변 상태</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={4}>남긴 문의가 없습니다.</td>
                </tr>
              )}
              {inquiries.map((item) => (
                <tr key={item.id}>
                  <td className="lx-col-num">{item.number}</td>
                  <td className="is-left">
                    <Link href={`/learning-support/inquiry/${item.id}`} className="lx-title-link">
                      {item.title}
                    </Link>
                  </td>
                  <td className="lx-col-date">{item.date}</td>
                  <td className="lx-col-status">
                    {item.answer ? (
                      <span className="ds-badge ds-badge--success">답변 완료</span>
                    ) : (
                      <span className="ds-badge ds-badge--neutral">답변 대기</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
