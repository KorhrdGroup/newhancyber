import Link from "next/link";
import DraftNote from "@/components/common/DraftNote";
import PageTabs from "@/components/common/PageTabs";
import { appealPeriodDays, getAppeals, type AppealKind } from "../myPageDataB";
import AppealAccordion from "./AppealAccordion";
import Guide from "./Guide";
import { myPageRequestTabs } from "@/lib/navigation";

const base = { grade: "/my-page/appeals", etc: "/my-page/appeals/etc" } as const;

/** U34 성적 이의신청 — 목록 (성적 / 기타). 1:1 문의와 같은 펼침 목록 */
export default function AppealList({ kind }: { kind: AppealKind }) {
  const appeals = getAppeals(kind);
  const isGrade = kind === "grade";

  return (
    <>
      <PageTabs items={myPageRequestTabs} />
      <Guide
        title="이의신청 기간"
        items={
          isGrade
            ? [
                `성적 공개일부터 ${appealPeriodDays}일 동안 신청할 수 있어요. 기간이 지나면 신청할 수 없어요.`,
                "과목과 평가 항목을 고르고, 이의가 있는 까닭을 구체적으로 적어 주세요.",
                "담당 교수님이 검토한 뒤 이 화면에서 처리 결과를 알려 드려요.",
              ]
            : [
                "출석·진도 인정, 수료 판정처럼 성적 말고 다른 학사 처리에 이의가 있을 때 신청해요.",
                `수강 기간이 끝나고 성적이 공개된 날부터 ${appealPeriodDays}일 안에 신청해 주세요.`,
                "담당자가 확인한 뒤 이 화면에서 처리 결과를 알려 드려요.",
              ]
        }
      />
      <DraftNote>
        원본 화면(/stdMng/bbsAppealList.asp, appealEtcList.asp)이 개발 서버에서 오류로 열리지 않아, 안내 문구(신청
        기간 {appealPeriodDays}일 등)와 목록 칸을 임시로 정했습니다.
      </DraftNote>
      <div className="lx-board-bar lx-inquiry-bar">
        <p className="lx-board-count">
          총 <strong>{appeals.length}</strong>건
        </p>
        <Link href={`${base[kind]}/new`} className="ds-btn ds-btn--primary">
          신청하기
        </Link>
      </div>
      <AppealAccordion items={appeals} />
    </>
  );
}
