import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isDbConfigured } from "@/lib/db/client";
import { getMemberPayment } from "@/lib/db/payments";
import { getCurrentMember } from "@/lib/memberAuth";
import { getLayoutSite } from "@/lib/site";
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
import { getTuitionPayments } from "@/components/my-page/myPageDataB";

const titles = {
  enrollment: "수강확인서",
  transcript: "성적증명서",
  certificate: "수료증",
  "payment-receipt": "영수증",
  tuition: "교육비 납입 증명서",
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

/** 영수증을 줄 수 있는 결제 상태 — 돈을 받은 결제만 (입금 대기 · 결제 취소는 영수증이 없다) */
const RECEIPT_STATUSES = ["결제 완료", "부분 환불", "환불 접수", "환불 진행 중", "환불 반려", "환불 완료"];

/** 한국 날짜 「2026년 11월 26일」 */
function todayKstLong(): string {
  const d = new Date(Date.now() + 9 * 3600_000);
  return `${d.getUTCFullYear()}년 ${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일`;
}

/**
 * 영수증 데이터 — DB 면 로그인한 회원 자신의 결제(다른 회원 결제 · 받은 돈이 없는 결제면 404),
 * 교육원 정보는 LMS 「홈페이지 관리 › 기본정보 관리」(site_info) 값, 없으면 코드 값. DB 설정이 없으면 샘플.
 */
async function loadReceipt(id: string) {
  if (!isDbConfigured()) {
    return { p: getPayment(id), receiver: sampleLearner.name, org: institution, issuedOn: issueDate };
  }
  const paymentId = Number(id);
  if (!Number.isSafeInteger(paymentId) || paymentId <= 0) notFound();
  const member = await getCurrentMember();
  if (!member) redirect(`/member/login?next=${encodeURIComponent(`/popup/print/payment-receipt/${paymentId}`)}`);
  const [p, { info }] = await Promise.all([getMemberPayment(member.memberId, paymentId), getLayoutSite()]);
  if (!p || !RECEIPT_STATUSES.includes(p.status)) notFound();
  const org = {
    ...institution,
    representative: info?.ceoName?.trim() || institution.representative,
    businessNo: info?.businessNo?.trim() || institution.businessNo,
    address: info?.address?.trim() || institution.address,
    phone: info?.enrollPhone?.trim() || institution.phone,
  };
  return { p, receiver: member.name, org, issuedOn: todayKstLong() };
}

export default async function PrintPopup({ params }: { params: Promise<{ docType: string; id: string }> }) {
  const { docType, id } = await params;
  if (!(docType in titles)) notFound();
  const type = docType as DocType;
  // TODO: API 증명서 발급 (발급 번호·발급 이력 저장)
  const docNo = `제 ${new Date().getFullYear()}-${id.toUpperCase()} 호`;
  // 영수증은 DB 결제 (나머지 증명서는 아직 샘플) — 날짜 · 교육원 정보도 영수증일 때만 바꾼다
  const receipt = type === "payment-receipt" ? await loadReceipt(id) : null;
  const org = receipt?.org ?? institution;
  const issuedOn = receipt?.issuedOn ?? issueDate;

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
  } else if (type === "tuition") {
    // id: 연도(2026)면 그 해 결제 전체, 결제 번호면 그 한 건
    const { payments, period } = getTuitionPayments(id);
    if (payments.length === 0) notFound();
    const total = payments.reduce((s, p) => s + p.paid, 0);
    body = (
      <>
        <LearnerTable />
        <table className="doc-table ds-mt-16">
          <tbody>
            <tr>
              <th>교육기관</th>
              <td>{institution.name}</td>
            </tr>
            <tr>
              <th>사업자등록번호</th>
              <td>{institution.businessNo}</td>
            </tr>
            <tr>
              <th>납입 기간</th>
              <td>{period}</td>
            </tr>
          </tbody>
        </table>
        <table className="doc-table doc-table--list ds-mt-16">
          <thead>
            <tr>
              <th>납입일</th>
              <th>결제명</th>
              <th>결제 수단</th>
              <th>납입 금액</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{p.paidAt}</td>
                <td>{p.title}</td>
                <td>{p.method}</td>
                <td>{formatWon(p.paid)}</td>
              </tr>
            ))}
            <tr>
              <th colSpan={3}>합계</th>
              <th>{formatWon(total)}</th>
            </tr>
          </tbody>
        </table>
        <p className="doc-text">위 사람이 본 교육원에 위 금액을 교육비로 납입하였음을 증명합니다.</p>
        <p className="doc-foot">이 증명서는 연말정산 교육비 공제 신청용입니다. 환불된 금액은 들어가지 않습니다.</p>
      </>
    );
  } else {
    const { p, receiver } = receipt!;
    body = (
      <>
        <table className="doc-table">
          <tbody>
            <tr>
              <th>받는 분</th>
              <td>{receiver}</td>
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
            {p.courses.map((c, i) => (
              <tr key={`${i}-${c.title}`}>
                <td>{c.title}</td>
                <td>{formatWon(c.price)}</td>
              </tr>
            ))}
            {/* 과목 줄은 정가, 할인(쿠폰 · 할인가 · 장학 감면은 결제 금액에 이미 반영) 뒤 합계는 실제 결제 금액 */}
            <tr>
              <td>할인</td>
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
          사업자등록번호 {org.businessNo} · 대표 {org.representative} · {org.address}
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
        <p className="doc-date">{issuedOn}</p>
        <p className="doc-sign">
          {org.name}장
          <span className="doc-seal" aria-hidden>
            직인
          </span>
        </p>
        <p className="doc-foot">문의 {org.phone}</p>
      </article>
    </>
  );
}
