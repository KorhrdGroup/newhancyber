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
  /** 샘플 게시판용 — 첨부파일 이름만 (받기 주소 없음). DB 게시판은 files 를 쓴다 */
  fileName?: string;
  /** DB 게시판의 첨부 — 이름과 받기 주소. 빈 배열이면 「없음」 */
  files?: { name: string; href: string }[];
  prev?: PostNavLink;
  next?: PostNavLink;
  /** 제목 아래 정보 줄. 주면 기본(작성일 · 첨부파일) 대신 이 항목들을 순서대로 보여 준다 (예: 수강후기의 작성자 · 수강 과정 · 조회) */
  meta?: { label: string; value: ReactNode }[];
  listHref: string;
  /** false 면 바깥 container 틀 없이 (마이페이지처럼 이미 틀 안에 있는 화면) */
  framed?: boolean;
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
export default function PostView({ title, date, fileName, files, prev, next, meta, listHref, framed = true, className, children }: PostViewProps) {
  const fileValue = files ? (
    files.length > 0 ? (
      <span className="lx-article-files">
        {files.map((f) => (
          <a key={f.href} href={f.href} className="lx-article-file" download>
            {f.name}
          </a>
        ))}
      </span>
    ) : (
      "없음"
    )
  ) : fileName ? (
    <a href={TBD_HREF} className="lx-article-file">
      {fileName}
    </a>
  ) : (
    "없음"
  );
  return (
    <article className={[framed ? "container lx-page lx-article" : "lx-article lx-article--bare", className].filter(Boolean).join(" ")}>
      <header className="lx-article-head">
        <h1 className="lx-article-title">{title}</h1>
        <dl className="lx-article-meta">
          {(
            meta ?? [
              { label: "작성일", value: date },
              { label: "첨부파일", value: fileValue },
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
