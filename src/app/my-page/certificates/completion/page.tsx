import type { Metadata } from "next";
import MyPageShell from "@/components/my-page/MyPageShell";
import CertificateList from "@/components/my-page/b/CertificateList";
import { getCompletionRows } from "@/components/my-page/myPageDataB";

export const metadata: Metadata = { title: "수료증 - 증명서 발급 - 마이페이지" };

/** U32 증명서 발급 — 수료증 */
export default function CompletionCertificatePage() {
  return (
    <MyPageShell title="증명서 발급" desc="필요한 증명서를 골라 바로 출력할 수 있어요.">
      <CertificateList
        guide={[
          "수료 기준(출석·성적)을 채운 과목은 수료증을 발급받을 수 있어요.",
          "수강 중인 과목은 수강 기간이 끝나고 수료가 확정된 뒤에 발급할 수 있어요.",
        ]}
        rows={getCompletionRows()}
        emptyText="수료한 과목이 없어요."
      />
    </MyPageShell>
  );
}
