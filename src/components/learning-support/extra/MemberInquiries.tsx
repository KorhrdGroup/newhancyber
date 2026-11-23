import Link from "next/link";
import type { InquiryRow } from "@/lib/db/boardPosts";
import { kstDate } from "../DbBoard";
import type { Inquiry } from "./InquiryList";

/** DB 줄 → 1:1 문의 목록(InquiryList) 모양. 답변은 answer_content 가 있을 때만 */
export function toInquiries(rows: InquiryRow[]): Inquiry[] {
  return rows.map((r) => ({
    id: String(r.postId),
    title: r.title,
    date: kstDate(r.createdAt),
    body: r.content ?? "",
    answer: r.answerContent?.trim()
      ? { date: r.answeredAt ? kstDate(r.answeredAt) : "", body: r.answerContent }
      : undefined,
  }));
}

/** 로그인하지 않았을 때 1:1 문의 자리 — 목록 대신 로그인 안내 */
export function InquiryLoginNeeded() {
  return (
    <div className="cr-empty">
      <p>1:1 문의는 로그인한 뒤 이용할 수 있어요. 내가 남긴 문의와 답변도 로그인하면 볼 수 있습니다.</p>
      <p className="ds-mt-16">
        <Link href="/member/login" className="ds-btn ds-btn--primary">
          로그인
        </Link>
      </p>
    </div>
  );
}

/** 로그인 상태를 읽지 못했을 때 (DB 장애 등) */
export function InquiryUnavailable() {
  return <p className="cr-empty">지금은 문의를 불러올 수 없어요. 잠시 뒤 다시 시도해 주세요.</p>;
}
