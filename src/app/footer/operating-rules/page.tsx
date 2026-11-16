import type { Metadata } from "next";
import LegalDoc from "@/components/footer/LegalDoc";
import { operatingRules, type RuleArticle } from "@/components/course-registration/extra/extraData";
import "@/styles/classroom.css";

export const metadata: Metadata = { title: "운영규칙" };

type Item = { mark: string; text: string; sub: { mark: string; text: string }[] };

/** "1) …", "가. …", "※ …" 줄을 번호와 글로 나누고, 가. 나. 줄은 바로 위 번호 항목 아래로 묶는다 */
function groupItems(lines: string[]) {
  const items: Item[] = [];
  const notesBefore: string[] = [];
  for (const line of lines) {
    const sub = line.match(/^([가-하])\.\s*(.*)$/);
    const num = line.match(/^(\d+\))\s*(.*)$/);
    if (sub && items.length) items[items.length - 1].sub.push({ mark: `${sub[1]}.`, text: sub[2] });
    else if (num) items.push({ mark: num[1], text: num[2], sub: [] });
    else if (items.length) items.push({ mark: "", text: line, sub: [] });
    else notesBefore.push(line);
  }
  return { items, notesBefore };
}

function Article({ article }: { article: RuleArticle }) {
  // 항목 없는 조문(1-1. … 함.)은 한 문단
  if (!article.items && !article.table) {
    const m = article.title.match(/^(\d+-\d+\.)\s*(.*)$/);
    return (
      <div className="legal-clause legal-clause--text">
        <span className="legal-mark">{m?.[1]}</span>
        <p className="legal-text">{m?.[2] ?? article.title}</p>
      </div>
    );
  }
  const { items, notesBefore } = groupItems(article.items ?? []);
  return (
    <div className="legal-clause">
      <h3 className="legal-clause-title">{article.title}</h3>
      {notesBefore.map((n) => (
        <p key={n} className="legal-note">
          {n}
        </p>
      ))}
      <ol className="legal-items">
        {items.map((item) =>
          item.mark ? (
            <li key={item.text}>
              <span className="legal-mark">{item.mark}</span>
              <div>
                <p className="legal-text">{item.text}</p>
                {item.sub.length > 0 && (
                  <ol className="legal-sub">
                    {item.sub.map((s) => (
                      <li key={s.text}>
                        <span className="legal-mark">{s.mark}</span>
                        <span>{s.text}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </li>
          ) : (
            // 번호 사이에 끼인 ※ 참고 줄
            <li key={item.text} className="legal-items-note">
              <p className="legal-note">{item.text}</p>
            </li>
          ),
        )}
      </ol>
      {article.table && (
        <div className="lx-table-scroll legal-table">
          <table className="ds-table">
            <thead>
              <tr>
                {article.table.head.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {article.table.rows.map(([rate, score]) => (
                <tr key={rate}>
                  <td>{rate}</td>
                  <td>{score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** 운영규칙 (원본 /inc/footer/useTerms.asp — 학사관리규정). 이용약관과 같은 조항 틀: 장(1. 총칙) → 조문(2-1.) → 번호 항목 */
export default function OperatingRulesPage() {
  return (
    <LegalDoc title="운영규칙" desc="학점은행제 학사관리지침(원격기반 교육훈련기관)에 따른 한평생원격교육원의 학사관리규정입니다.">
      {operatingRules.map((section) => (
        <section key={section.title} className="legal-article">
          <h2 className="legal-article-title">{section.title}</h2>
          {section.articles.map((article) => (
            <Article key={article.title} article={article} />
          ))}
        </section>
      ))}
    </LegalDoc>
  );
}
