import Link from "next/link";
import type { ReactNode } from "react";
import { TBD_HREF } from "@/lib/navigation";

export interface PostNavLink {
  title: string;
  /** 없으면 아직 주소 미정 (TODO: 이전글/다음글 주소) */
  href?: string;
}

interface PostViewProps {
  title: string;
  date: string;
  /** TODO: 첨부파일 다운로드 링크 (지금은 파일명만) */
  fileName?: string;
  prev?: PostNavLink;
  next?: PostNavLink;
  /** 제목 아래 정보 줄. 주면 기본(작성일 · 첨부파일) 대신 이 항목들을 순서대로 보여 준다 (예: 수강후기의 작성자 · 수강 과정 · 조회) */
  meta?: { label: string; value: ReactNode }[];
  listHref: string;
  className?: string;
  children: ReactNode;
}

function NavRow({ label, link }: { label: string; link?: PostNavLink }) {
  return (
    <li className="lx-article-nav-row">
      <span className="lx-article-nav-label">{label}</span>
      {link ? (
        <Link href={link.href ?? TBD_HREF} className="lx-article-nav-link">
          {link.title}
        </Link>
      ) : (
        <span className="lx-article-nav-empty">없음</span>
      )}
    </li>
  );
}

/** 게시글 상세 (공지사항·관련기관 소식·학사일정·서식자료실). 디자인 시스템 색·간격·버튼으로 그린다 */
export default function PostView({ title, date, fileName, prev, next, meta, listHref, className, children }: PostViewProps) {
  return (
    <article className={["container lx-page lx-article", className].filter(Boolean).join(" ")}>
      <header className="lx-article-head">
        <h1 className="lx-article-title">{title}</h1>
        <dl className="lx-article-meta">
          {(
            meta ?? [
              { label: "작성일", value: date },
              {
                label: "첨부파일",
                value: fileName ? (
                  <a href={TBD_HREF} className="lx-article-file">
                    {fileName}
                  </a>
                ) : (
                  "없음"
                ),
              },
            ]
          ).map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="lx-article-body">{children}</div>

      <ul className="lx-article-nav">
        <NavRow label="이전글" link={prev} />
        <NavRow label="다음글" link={next} />
      </ul>

      <div className="lx-article-actions">
        <Link href={listHref} className="ds-btn ds-btn--secondary ds-btn--lg">
          목록으로
        </Link>
      </div>
    </article>
  );
}
