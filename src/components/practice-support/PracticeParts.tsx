import { Fragment } from "react";
import Link from "next/link";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

/*
 * 실습 안내 4개 화면이 함께 쓰는 부품 (디자인 시스템 표·버튼 + 학습지원 흰 바탕 틀의 lx-* 모양).
 * 글은 원본 퍼블리싱 그대로 옮기고, 줄바꿈(<br>)은 배열 한 칸씩으로 둔다.
 */

const IMG = "/resources/images/pratice-support";

/** 줄 배열을 <br> 로 이어 그린다 */
export function Lines({ lines }: { lines: React.ReactNode[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}

/** 소제목 + 내용 한 묶음 (흰 바탕 틀에서는 테두리 없이 제목과 내용만) */
export function PracticeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="lx-panel">
      <h2 className="lx-section-title">{title}</h2>
      {children}
    </section>
  );
}

/** "- " 로 시작하는 안내 목록 */
export function Notes({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="lx-notes">
      {items.map((item, i) => (
        <li key={i} className="page-list-item">
          {item}
        </li>
      ))}
    </ul>
  );
}

/** "※ " 로 시작하는 참고 목록 (표 아래) */
export function RefNotes({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="lx-notes lx-ref-notes">
      {items.map((item, i) => (
        <li key={i} className="page-list-dangu">
          {item}
        </li>
      ))}
    </ul>
  );
}

/** 왼쪽 항목 이름 + 오른쪽 내용 표 (위에 표 제목 한 줄이 있을 수 있다) */
export function InfoTable({ caption, rows }: { caption?: string; rows: { label: string; lines: React.ReactNode[] }[] }) {
  return (
    <div className="lx-table-scroll">
      <table className="ds-table lx-table ds-table--info lx-practice-info">
        {caption && (
          <thead>
            <tr>
              <th colSpan={2}>{caption}</th>
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td className="is-left">
                <Lines lines={row.lines} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 오른쪽 작은 화살표 (버튼·바로가기 카드) */
function ChevronRight() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6.25 4.5 9.75 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** STEP 2 위쪽: 실습과목 접수 안내 + 접수 버튼 (네 과정 모두 같은 글) */
export function RegisterSection({ title = "실습과목 접수 / 실습기관 섭외" }: { title?: string }) {
  return (
    <PracticeSection title={title}>
      <p className="lx-practice-text">
        실습과목을 신청할 수 있는 교육기관(대학부설평생교육원, 사이버대학교시간제, 직업학교, 원격평생교육원)에 따라 모집요강이
        다르므로 실습 담당자의 안내를 받아 접수 진행
      </p>
      <Link href="/course-registration/register" className="ds-btn ds-btn--primary ds-btn--lg lx-practice-register">
        실습과목 접수
        <ChevronRight />
      </Link>
    </PracticeSection>
  );
}

/** 실습기관 섭외 바로가기 카드 — 기관 로고(또는 글자) + 화살표. 기관 사이트는 새 창으로 엽니다. */
export function OrgLinks({
  items,
}: {
  items: ({ href: string } & ({ logo: string; alt: string } | { text: React.ReactNode }))[];
}) {
  return (
    <div className="lx-org-links">
      {items.map((item, i) => (
        <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" title="새 창으로 열기" className="lx-org-link">
          {"logo" in item ? (
            <img src={`${IMG}/${item.logo}`} alt={item.alt} className="lx-org-logo" />
          ) : (
            <span className="lx-org-text">{item.text}</span>
          )}
          <ChevronRight />
        </a>
      ))}
    </div>
  );
}

/** STEP 3: 실습진행 (네 과정 모두 같은 글) */
export function ProgressSection() {
  return (
    <PracticeSection title="실습진행">
      <Notes
        items={[
          "실습과목을 신청할 수 있는 교육기관(대학부설평생교육원, 사이버대학교시간제, 직업학교, 원격평생교육원)에 따라 모집요강이 다르므로 실습 담당자의 안내를 받아 접수 진행",
          "세미나 출석일정에 맞춰 출석 + 실습인정 기간 내에 실습기관에서 실습 진행하며 실습일지 작성",
          "실습 관련 문의 사항은 실습 담당자에게 문의",
        ]}
      />
    </PracticeSection>
  );
}
