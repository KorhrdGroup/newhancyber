import type { SiteTerm } from "@/lib/site";

/**
 * 관리자 「약관 관리」(site_terms)에 쓴 약관 본문 — 글자 그대로(HTML 아님), 줄바꿈만 살린다.
 * 그 종류의 약관이 표에 없으면 각 화면은 지금 코드 안 문서를 그대로 보여 준다.
 */
export default function DbTermBody({ term }: { term: SiteTerm }) {
  return (
    <section className="legal-article">
      {term.title && <h2 className="legal-article-title">{term.title}</h2>}
      <div className="legal-text legal-text--plain">{term.content}</div>
    </section>
  );
}
