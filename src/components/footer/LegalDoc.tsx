import type { ReactNode } from "react";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import "@/styles/learning-extra.css";
import "@/styles/legal.css";

/** 조항 안의 번호 항목 (1. 2. …) — sub 는 그 아래 가) 나) … */
export type LegalItem = { text: string; sub?: string[] };

/** 조항 하나: 제목 → 본문 문단 → 가) 나) 목록 → 번호 항목 순으로 그린다 */
export type LegalArticleData = {
  title: string;
  body?: string[];
  sub?: string[];
  items?: LegalItem[];
};

const SUB_MARKS = "가나다라마바사아자차카타파하";

function SubList({ items }: { items: string[] }) {
  return (
    <ol className="legal-sub">
      {items.map((text, i) => (
        <li key={text}>
          <span className="legal-mark">{SUB_MARKS[i]})</span>
          <span>{text}</span>
        </li>
      ))}
    </ol>
  );
}

export function LegalArticle({ article }: { article: LegalArticleData }) {
  return (
    <section className="legal-article">
      <h2 className="legal-article-title">{article.title}</h2>
      {article.body?.map((p) => (
        <p key={p} className="legal-text">
          {p}
        </p>
      ))}
      {article.sub && <SubList items={article.sub} />}
      {article.items && (
        <ol className="legal-items">
          {article.items.map((item, i) => (
            <li key={item.text}>
              <span className="legal-mark">{i + 1}.</span>
              <div>
                <p className="legal-text">{item.text}</p>
                {item.sub && <SubList items={item.sub} />}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

/** 규정·약관 화면 공통 틀 (이용약관·개인정보처리방침·이메일무단수집거부)
 *  흰 바탕 안내 틀(lx-page--plain) + 제목 · 설명, 휴대폰은 파란 제목 띠 */
export default function LegalDoc({ title, desc, children }: { title: string; desc: string; children: ReactNode }) {
  return (
    <>
      <MobilePageBanner name="legal" text={title} />
      <main className="wrapper">
        <div className="container lx-page lx-page--plain legal-page">
          <h1 className="page-title">{title}</h1>
          <p className="lx-desc">{desc}</p>
          <div className="legal-doc">{children}</div>
        </div>
      </main>
    </>
  );
}
