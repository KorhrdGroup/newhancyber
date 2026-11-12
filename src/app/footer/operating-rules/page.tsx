import type { Metadata } from "next";
import { operatingRules } from "@/components/course-registration/extra/extraData";
import "@/styles/classroom.css";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "운영규칙" };

/** 운영규칙 (원본 /inc/footer/useTerms.asp — 학사관리규정) */
export default function OperatingRulesPage() {
  return (
    <main className="wrapper ft-page">
      <div className="terms-container ex-rules" style={{ backgroundColor: "#f3f8ff" }}>
        <h1 className="terms-page-title">운영규칙</h1>
        <div className="ex-rules-head">
          <h2>학사관리규정</h2>
          <p>학점은행제 학사관리지침 - 원격기반 교육훈련기관</p>
        </div>
        {operatingRules.map((section) => (
          <section key={section.title} className="ex-rules-section">
            <h3>{section.title}</h3>
            {section.articles.map((article) => (
              <div key={article.title} className="ex-rules-article">
                {article.items || article.table ? (
                  <h4>{article.title}</h4>
                ) : (
                  <p className="ex-rules-text">{article.title}</p>
                )}
                {article.items && (
                  <ul className="ex-rules-list">
                    {article.items.map((item) => (
                      <li
                        key={item}
                        className={item.startsWith("※") ? "is-note" : /^[가-라]\./.test(item) ? "is-sub" : undefined}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {article.table && (
                  <table className="ds-table ex-rules-table">
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
                )}
              </div>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
