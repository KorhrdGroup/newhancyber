import type { Metadata } from "next";
import MyPageShell from "@/components/my-page/MyPageShell";
import CertificateList from "@/components/my-page/b/CertificateList";
import { getEnrollmentRows } from "@/components/my-page/myPageDataB";

export const metadata: Metadata = { title: "수강 확인서 - 증명서 발급 - 마이페이지" };

/** U32 증명서 발급 — 수강 확인서 */
export default function EnrollmentCertificatePage() {
  return (
    <MyPageShell title="증명서 발급" desc="필요한 증명서를 골라 바로 출력할 수 있어요.">
      <CertificateList
        guide={[
          "지금 수강 중인 과목의 수강 확인서를 발급받을 수 있어요.",
          "발급받기를 누르면 출력 창이 열려요. 인쇄하거나 PDF로 저장해 쓰세요.",
          "수강 확인서에는 현재 수강 중인 과목이 모두 함께 표시돼요.",
        ]}
        rows={getEnrollmentRows()}
        emptyText="지금 수강 중인 과목이 없어요."
      />
    </MyPageShell>
  );
}
