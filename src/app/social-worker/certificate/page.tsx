import type { Metadata } from "next";
import DraftNote from "@/components/common/DraftNote";
import { PracticeSection, RefNotes } from "@/components/practice-support/PracticeParts";
import { DataTable } from "@/components/social-worker/SwParts";
import { IssueFlow } from "@/components/social-worker/SwSteps";

export const metadata: Metadata = { title: "자격증 발급 안내" };

/** 원본 social-worker/certificate.html — 흰 바탕 틀 + 디자인 시스템 표 */
export default function SocialWorkerCertificatePage() {
  return (
    <main className="wrapper">
      {/* 회색 판 색 시험: 이 화면만 푸른 회색 대신 밝은 회색 (ds2-pages.css .sw-cert) */}
      <div className="container lx-page lx-page--top lx-page--plain sw-cert">
        <h1 className="page-title">자격증 발급 안내</h1>
        <p className="lx-desc">사회복지사 자격증 교부·재교부 절차와 구비서류, 수수료를 안내합니다.</p>

        <PracticeSection title="교부 신청절차">
          <ul className="lx-notes sw-steps">
            <li className="page-list-plain">
              <strong>장소</strong> : 사회복지사업법 제11조제1항 및 동법시행규칙 제4조제4항과 사단법인 한국사회복지사협회
            </li>
            <li className="page-list-plain">
              <strong>자격증, 회원증 신청 접수처</strong> : 전국 시•도 지방협회
            </li>
          </ul>
          <IssueFlow />
          <RefNotes
            items={[
              "제출하신 서류를 심사한 후 자격이 인정될 경우에만 자격증이 발급됩니다. 신원조회 또는 사실조회 실시 후 부적격자는 사안에 따라 자격증 발급취소 또는 무효처분을 받습니다.",
              "민원처리기간: 사회복지사업법 시행규칙 제4조에 한함 (7일 소요, 단 졸업 후 단체발급 시 지연될 수 있으니 이해해주시기 바랍니다.)",
            ]}
          />
        </PracticeSection>

        <PracticeSection title="재교부 신청자(분실, 명의변경 등에 한함) 구비서류">
          <DataTable head={["구분", "내용"]}>
            <tr>
              <td>공통구비서류</td>
              <td className="is-left">
                1. 사회복지사 자격증 교부신청서 1부 (지방협회별 경유 원칙)
                <br />
                2. 사진명함판 (3.5cm X 4.5cm) 2매
              </td>
            </tr>
            <tr>
              <td>별도구비서류</td>
              <td className="is-left">
                1. 명의변경 및 주소변경: 주민등록초(등)본 1부
                <br />
                2. 사회복지사자격증 원본 1부
              </td>
            </tr>
          </DataTable>
        </PracticeSection>

        <PracticeSection title="수수료안내">
          <p className="lx-practice-text">
            사회복지사업법 제11조제4항 및 동법시행규칙 제4조제4항과 사단법인 한국사회복지사협회 정관 제5조 회원규정에 의거 사회복지사자격증
            및 회원증 발급수수료 및 연회비는 다음과 같습니다.
          </p>
          <DraftNote>
            원본의 수수료 표가 바로 위 재교부 구비서류 표와 같은 내용으로 복사되어 있습니다. 실제 발급수수료·연회비 금액으로 바꿔야 합니다.
          </DraftNote>
          <DataTable head={["구분", "내용"]}>
            <tr>
              <td>공통구비서류</td>
              <td className="is-left">
                1. 사회복지사 자격증 교부신청서 1부 (지방협회별 경유 원칙)
                <br />
                2. 사진명함판 (3.5cm X 4.5cm) 2매
              </td>
            </tr>
            <tr>
              <td>별도구비서류</td>
              <td className="is-left">
                1. 명의변경 및 주소변경: 주민등록초(등)본 1부
                <br />
                2. 사회복지사자격증 원본 1부
              </td>
            </tr>
          </DataTable>
          <RefNotes items={["발급 수수료는 지방협회로 서류 접수 시 계좌입금 하시면 됩니다."]} />
        </PracticeSection>
      </div>
    </main>
  );
}
