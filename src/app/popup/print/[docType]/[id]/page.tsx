import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CloseButton, PrintButton } from "@/components/my-classroom/PopupActions";
import {
  formatWon,
  getCourse,
  getFinishedCourses,
  getOngoingCourses,
  getPayment,
  institution,
  issueDate,
  sampleLearner,
  type Course,
} from "@/components/my-classroom/classroomData";

const titles = {
  enrollment: "수강확인서",
  transcript: "성적증명서",
  certificate: "수료증",
  "payment-receipt": "영수증",
} as const;
type DocType = keyof typeof titles;

export const metadata: Metadata = { title: "증명서 출력" };

function LearnerTable() {
  return (
    <table className="doc-table">
      <tbody>
        <tr>
          <th>성명</th>
          <td>{sampleLearner.name}</td>
          <th>생년월일</th>
          <td>{sampleLearner.birth}</td>
        </tr>
        <tr>
          <th>학습자 번호</th>
          <td colSpan={3}>{sampleLearner.learnerNo}</td>
        </tr>
      </tbody>
    </table>
  );
}

function CourseTable({ courses, withGrade }: { courses: Course[]; withGrade?: boolean }) {
  return (
    <table className="doc-table doc-table--list ds-mt-16">
      <thead>
        <tr>
          <th>차수</th>
          <th>과목명</th>
          <th>이수 구분</th>
          <th>학점</th>
          {withGrade ? <th>성적</th> : <th>수강 기간</th>}
        </tr>
      </thead>
      <tbody>
        {courses.map((c) => (
          <tr key={c.id}>
            <td>{c.term}</td>
            <td>{c.title}</td>
            <td>{c.category}</td>
            <td>{c.credit}</td>
            {withGrade ? (
              <td>
                {c.grade?.letter} ({c.grade?.total})
              </td>
            ) : (
              <td>
                {c.studyStart} ~ {c.studyEnd}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function PrintPopup({ params }: { params: Promise<{ docType: string; id: string }> }) {
  const { docType, id } = await params;
  if (!(docType in titles)) notFound();
  const type = docType as DocType;
  // TODO: API 증명서 발급 (발급 번호·발급 이력 저장)
  const docNo = `제 ${new Date().getFullYear()}-${id.toUpperCase()} 호`;

  let body: React.ReactNode;
  if (type === "enrollment") {
    const courses = getOngoingCourses();
    body = (
      <>
        <LearnerTable />
        <CourseTable courses={courses} />
        <p className="doc-text">위 사람은 본 교육원에서 위 과목을 수강하고 있음을 확인합니다.</p>
      </>
    );
  } else if (type === "transcript") {
    const courses = id === "all" ? getFinishedCourses() : [getCourse(id)].filter((c) => c.grade);
    const credits = courses.reduce((s, c) => s + c.credit, 0);
    body = (
      <>
        <LearnerTable />
        <CourseTable courses={courses} withGrade />
        <p className="doc-foot ds-text-right">
          취득 학점 합계 {credits}학점
        </p>
        <p className="doc-text">위와 같이 성적을 증명합니다.</p>
      </>
    );
  } else if (type === "certificate") {
    const c = getCourse(id);
    body = (
      <>
        <LearnerTable />
        <table className="doc-table ds-mt-16">
          <tbody>
            <tr>
              <th>과목명</th>
              <td>{c.title}</td>
            </tr>
            <tr>
              <th>수강 기간</th>
              <td>
                {c.studyStart} ~ {c.studyEnd}
              </td>
            </tr>
            <tr>
              <th>학점</th>
              <td>{c.credit}학점</td>
            </tr>
          </tbody>
        </table>
        <p className="doc-text">위 사람은 본 교육원에서 위 과목의 모든 과정을 마쳤기에 이 증서를 드립니다.</p>
      </>
    );
  } else {
    const p = getPayment(id);
    body = (
      <>
        <table className="doc-table">
          <tbody>
            <tr>
              <th>받는 분</th>
              <td>{sampleLearner.name}</td>
              <th>결제일</th>
              <td>{p.paidAt ?? "-"}</td>
            </tr>
            <tr>
              <th>결제명</th>
              <td colSpan={3}>{p.title}</td>
            </tr>
            <tr>
              <th>결제 수단</th>
              <td colSpan={3}>{p.method}</td>
            </tr>
          </tbody>
        </table>
        <table className="doc-table doc-table--list ds-mt-16">
          <thead>
            <tr>
              <th>과목명</th>
              <th>금액</th>
            </tr>
          </thead>
          <tbody>
            {p.courses.map((c) => (
              <tr key={c.title}>
                <td>{c.title}</td>
                <td>{formatWon(c.price)}</td>
              </tr>
            ))}
            <tr>
              <td>쿠폰 할인</td>
              <td>- {formatWon(p.coupon)}</td>
            </tr>
            <tr>
              <th>합계</th>
              <th>{formatWon(p.paid)}</th>
            </tr>
          </tbody>
        </table>
        <p className="doc-text">위 금액을 정히 영수합니다.</p>
        <p className="doc-foot">
          사업자등록번호 {institution.businessNo} · 대표 {institution.representative} · {institution.address}
        </p>
      </>
    );
  }

  return (
    <>
      <div className="doc-toolbar no-print">
        <CloseButton variant="button" />
        <PrintButton />
      </div>
      <article className="doc-page">
        <p className="doc-no">{docNo}</p>
        <h1 className="doc-title">{titles[type]}</h1>
        {body}
        <p className="doc-date">{issueDate}</p>
        <p className="doc-sign">
          {institution.name}장
          <span className="doc-seal" aria-hidden>
            직인
          </span>
        </p>
        <p className="doc-foot">문의 {institution.phone}</p>
      </article>
    </>
  );
}
