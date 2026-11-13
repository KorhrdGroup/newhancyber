import type { Metadata } from "next";
import Link from "next/link";
import { SUPPORT_PHONE } from "@/lib/contact";
import DraftNote from "@/components/common/DraftNote";
import { Badge } from "@/components/my-classroom/ClassroomUI";
import { TodoButton } from "@/components/my-classroom/PopupActions";
import PopupButton from "@/components/my-classroom/PopupButton";
import {
  getCourse,
  practiceDocs,
} from "@/components/my-classroom/classroomData";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

export const metadata: Metadata = { title: "서류제출" };

/*
 * 원본은 제목만 있는 빈 페이지 (README: "자체개발").
 * 서류 6종은 원본 나의 강의실 실습 과목의 사전 서류(기본정보·성적증명서·개인정보활용동의서·
 * 실습생 프로파일·실습일정표·실습기관현황서)를 따랐고, 나머지 안내는 새로 썼다.
 * 실제 파일 올리기는 나의 강의실의 '실습 서류 제출' 팝업에서 한다.
 */
const preparation: Record<string, { how: string; hasForm: boolean }> = {
  basic: { how: "제출 화면에서 바로 입력", hasForm: false },
  transcript: { how: "출신 학교 또는 학점은행에서 발급", hasForm: false },
  privacy: { how: "서식을 내려받아 서명 후 스캔", hasForm: true },
  profile: { how: "서식에 작성", hasForm: true },
  schedule: { how: "실습기관과 정한 일정을 서식에 작성", hasForm: true },
  agency: { how: "실습기관에서 작성·직인", hasForm: true },
};

const steps = [
  { title: "서식 내려받기", text: "아래 표에서 필요한 서식을 내려받습니다." },
  {
    title: "작성·서명",
    text: "서식을 작성하고, 서명이나 직인이 필요한 서류는 빠짐없이 받습니다.",
  },
  {
    title: "올리기",
    text: "나의 강의실 > 실습 과목 > 실습 서류 제출에서 파일을 올립니다.",
  },
];

export default function PracticeDocumentsPage() {
  // TODO: API 로그인한 학습자의 실습 과목·서류 제출 현황 조회 (지금은 샘플 실습 과목 c103)
  const course = getCourse("c103");
  const done = practiceDocs.filter((d) => d.status === "제출 완료").length;
  const rejected = practiceDocs.filter((d) => d.status === "반려").length;

  return (
    <main className="wrapper">
      {/* .content-section 은 안의 h2 를 32px 로 키워서(style.css) 학습자 OT 화면과 같은 틀을 쓴다 */}
      <div className="container lx-page lx-page--plain">
        <h1 className="page-title">서류제출</h1>
        <p className="lx-desc">
          실습 과목을 신청했다면 실습을 시작하기 전에 아래 서류 6가지를 모두
          내야 합니다. 서류가 모두 확인되면 실습기관이 배정되고 실습 과목이
          열립니다.
        </p>

        <DraftNote>
          원본에 내용이 없던 페이지라 서류 이름 외의 안내(제출 순서, 서류 설명·준비 방법, 파일
          형식·10MB, 실습 2주 전 기한, 실습기관 배정 순서)는 임시로 작성했습니다. 실제 규정을 확인한
          뒤 바꿔야 합니다.
        </DraftNote>

        <section className="lx-panel">
          <h2 className="lx-section-title">내 제출 현황</h2>
          {/* 과목·숫자·버튼을 한 카드에 — 왼쪽 현황, 오른쪽 할 일 */}
          <div className="lx-doc-status">
            <div className="lx-doc-status-info">
              <p className="lx-doc-status-course">
                {course.title} · {course.term}
              </p>
              <dl className="lx-doc-status-stats">
                <div>
                  <dt className="ds-stat-label">낸 서류</dt>
                  <dd className="ds-stat-value">
                    {done}
                    <small> / {practiceDocs.length}</small>
                  </dd>
                </div>
                <div>
                  <dt className="ds-stat-label">다시 내야 할 서류</dt>
                  <dd className={`ds-stat-value${rejected > 0 ? " ds-text-danger" : ""}`}>{rejected}</dd>
                </div>
              </dl>
            </div>
            <div className="lx-doc-status-actions">
              <PopupButton
              href={`/popup/practice-documents/${course.id}`}
              className="ds-btn ds-btn--primary"
            >
                실습 서류 제출하기
              </PopupButton>
              <Link href="/my-classroom" className="ds-btn ds-btn--secondary">
                나의 강의실로 가기
              </Link>
            </div>
          </div>
        </section>

        <section className="lx-panel">
          <h2 className="lx-section-title">제출 순서</h2>
          <ol className="lx-flow lx-flow--3">
            {steps.map((step, i) => (
              <li key={step.title} className="lx-flow-item">
                <span className="lx-flow-num">STEP {i + 1}</span>
                <strong>{step.title}</strong>
                <span className="lx-flow-desc">{step.text}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="lx-panel">
          <h2 className="lx-section-title">제출 서류</h2>
          <div className="lx-table-scroll">
            <table className="ds-table lx-table lx-practice-grid lx-doc-table">
              <thead>
                <tr>
                  <th>서류</th>
                  <th>내용</th>
                  <th>준비 방법</th>
                  <th>내 상태</th>
                  <th>서식</th>
                </tr>
              </thead>
              <tbody>
                {practiceDocs.map((doc) => (
                  <tr key={doc.id}>
                    <td className="is-left">
                      <strong>{doc.name}</strong>
                    </td>
                    <td className="is-left">{doc.description}</td>
                    <td className="is-left">{preparation[doc.id]?.how}</td>
                    <td>
                      <Badge>{doc.status}</Badge>
                    </td>
                    <td>
                      {preparation[doc.id]?.hasForm ? (
                        <TodoButton
                          className="ds-btn ds-btn--secondary ds-btn--sm"
                          label="내려받기"
                          message={`${doc.name} 서식 내려받기는`}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="lx-notes">
            <li className="page-list-item">
              파일은 pdf·hwp·jpg·png 형식으로, 한 파일에 10MB까지 올릴 수
              있습니다.
            </li>
            <li className="page-list-item">
              서명·직인이 빠지거나 글자가 흐리면 반려됩니다. 반려 사유를
              확인하고 다시 올려 주세요.
            </li>
            <li className="page-list-item">
              서류는 실습 시작일 2주 전까지 내 주세요.
            </li>
          </ul>
        </section>

        <p className="lx-callout">
          실습 기준과 기관 찾기는{" "}
          <Link href="/practice-support/social-worker-practice">
            사회복지현장실습
          </Link>{" "}
          안내를 참고해 주세요. 서류 제출이 어려우면 학습지원센터(
          {SUPPORT_PHONE})로 문의해 주세요.
        </p>
      </div>
    </main>
  );
}
