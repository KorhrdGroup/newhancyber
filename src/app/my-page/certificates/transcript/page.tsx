import type { Metadata } from "next";
import MyPageShell from "@/components/my-page/MyPageShell";
import CertificateList from "@/components/my-page/b/CertificateList";
import PopupButton from "@/components/my-classroom/PopupButton";
import { getTranscriptRows } from "@/components/my-page/myPageDataB";

export const metadata: Metadata = { title: "성적 증명서 - 증명서 발급 - 마이페이지" };

/** U32 증명서 발급 — 성적 증명서 */
export default function TranscriptCertificatePage() {
  return (
    <MyPageShell title="증명서 발급" desc="필요한 증명서를 골라 바로 출력할 수 있어요.">
      <CertificateList
        guide={[
          "성적이 확정된 과목만 성적 증명서를 발급받을 수 있어요.",
          "과목별로 한 장씩 받거나, 전체 성적을 한 장에 모아 받을 수 있어요.",
          "수강 중인 과목은 성적이 공개된 뒤에 발급할 수 있어요.",
        ]}
        rows={getTranscriptRows()}
        emptyText="성적이 확정된 과목이 없어요."
        actions={<PopupButton href="/popup/print/transcript/all">전체 성적 증명서 발급받기</PopupButton>}
      />
    </MyPageShell>
  );
}
