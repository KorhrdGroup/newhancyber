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
export default function PostView({ title, date, fileName, prev, next, listHref, className, children }: PostViewProps) {
  return (
    <article className={["container lx-page lx-article", className].filter(Boolean).join(" ")}>
      <header className="lx-article-head">
        <h1 className="lx-article-title">{title}</h1>
        <dl className="lx-article-meta">
          <div>
            <dt>작성일</dt>
            <dd>{date}</dd>
          </div>
          <div>
            <dt>첨부파일</dt>
            <dd>
              {fileName ? (
                <a href={TBD_HREF} className="lx-article-file">
                  {fileName}
                </a>
              ) : (
                "없음"
              )}
            </dd>
          </div>
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
