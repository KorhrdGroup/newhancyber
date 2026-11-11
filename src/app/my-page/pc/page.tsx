import type { Metadata } from "next";
import Link from "next/link";
import MyPageShell from "@/components/my-page/MyPageShell";
import PcList from "@/components/my-page/a/PcList";
import { MAX_PCS, registeredPcs } from "@/components/my-page/myPageDataA";

export const metadata: Metadata = { title: "학습자 PC 등록 - 마이페이지" };

/** U33 학습자 PC 등록 */
export default function PcPage() {
  // TODO: API 등록 PC 목록 조회
  return (
    <MyPageShell title="학습자 PC 등록" desc="수강할 PC를 미리 등록해 두면, 등록한 PC에서만 강의를 듣고 시험을 볼 수 있습니다.">
      <div className="pp-box">
        <h3 className="pp-box-title">왜 PC를 등록하나요?</h3>
        <ul className="pp-list">
          <li>다른 사람이 대신 수강하는 부정 수강을 막기 위해, 학습자 본인이 쓰는 PC에서만 수강할 수 있게 합니다.</li>
          <li>등록하지 않은 PC에서는 강의를 듣거나 시험·과제에 참여할 수 없습니다.</li>
          <li>PC는 최대 {MAX_PCS}대까지 등록할 수 있습니다. 바꾼 PC가 있으면 예전 PC를 삭제한 뒤 새로 등록해 주세요.</li>
          <li>
            가족과 같은 PC를 쓰는 등 다른 학습자와 PC를 함께 써야 하면{" "}
            <Link href="/my-page/exceptions/duplicate-pc" className="mp-title-link ds-text-brand">
              중복 PC 등록 신청
            </Link>
            을 해 주세요.
          </li>
        </ul>
      </div>
      <PcList initialPcs={registeredPcs} max={MAX_PCS} />
    </MyPageShell>
  );
}
