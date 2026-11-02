import type { NextConfig } from "next";

/**
 * 파일명이 바뀐 옛 주소. 아래 일반 규칙(.html 떼기)보다 먼저 검사한다.
 * 상세 페이지는 원본에 글 번호가 없었으므로 목록으로 보낸다.
 */
const renamedPages: [string, string][] = [
  ["/member/signup-step2.html", "/member/signup/step2"],
  ["/member/signup-step3.html", "/member/signup/step3"],
  ["/event/event.html", "/event"],
  ["/learning-support/notice-detail.html", "/learning-support/notice"],
  ["/learning-support/schedule-detail.html", "/learning-support/schedule"],
  ["/learning-support/forms-data-room-detail.html", "/learning-support/forms-data-room"],
  ["/practice-support/notice-detail.html", "/practice-support/notice"],
  ["/course-registration/reviews-detail.html", "/course-registration/reviews"],
  ["/course-registration/reviews-detail-normal.html", "/course-registration/reviews"],
];

const nextConfig: NextConfig = {
  // 로컬 폴더는 iCloud(데스크탑·문서 동기화) 안에 있다. 이름이 .nosync 로 끝나면 iCloud 가
  // 동기화하지 않아서, 빌드 중 "routes.d 2.ts" 같은 충돌 사본이 생기지 않는다.
  // Vercel 은 빌드 결과를 .next 에서만 찾으므로 Vercel 빌드(VERCEL=1)에서는 기본값을 쓴다.
  distDir: process.env.VERCEL ? ".next" : ".next.nosync",
  // 기존 퍼블리싱 주소(*.html)로 들어와도 새 주소로 보낸다.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      ...renamedPages.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      {
        source: "/:path((?:[^/]+/)*[^/]+)\\.html",
        destination: "/:path",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
