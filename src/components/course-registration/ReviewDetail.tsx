import { notFound } from "next/navigation";
import { Fragment } from "react";
import BestReviewBanner from "@/components/course-registration/BestReviewBanner";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import PostView from "@/components/learning-support/PostView";
import {
  findReviewWithSiblings,
  REVIEWS_HREF,
  reviewCourse,
  SAMPLE_REVIEW_VIEWS,
  sampleBestReviewQna,
  sampleReviewQna,
} from "@/components/course-registration/reviewData";
// 글 상세 틀(PostView)·모바일 파란 제목 띠 스타일은 학습지원 CSS 에 있어서 같이 불러온다
import "@/styles/learning-support.css";
import "@/styles/classroom.css";
import "@/styles/learning-extra.css";

/** 수강후기 · 베스트 수강후기 상세 (같은 글 상세 틀, 베스트는 본문 위에 BEST 배너)
 *  TODO: API — id 로 후기 상세와 이전글/다음글을 조회한다 (지금은 목록 샘플에서 찾고 본문은 원본 샘플) */
export default function ReviewDetail({ id, best = false }: { id: string; best?: boolean }) {
  const found = findReviewWithSiblings(id, best);
  if (!found) notFound();
  const { review } = found;
  const qna = best ? sampleBestReviewQna : sampleReviewQna;

  return (
    <>
      <MobilePageBanner name="notice-detail" text="수강후기" />
      <main className="wrapper">
        <PostView
          title={review.title}
          date={review.date}
          meta={[
            { label: "작성자", value: review.writer },
            { label: "작성일", value: review.date },
            { label: "수강 과정", value: reviewCourse(review) },
            { label: "조회", value: SAMPLE_REVIEW_VIEWS },
          ]}
          prev={found.prev}
          next={found.next}
          listHref={REVIEWS_HREF}
        >
          {best && <BestReviewBanner review={review} />}
          {qna.map(([question, answer]) => (
            <Fragment key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </Fragment>
          ))}
        </PostView>
      </main>
    </>
  );
}
