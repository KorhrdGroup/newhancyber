import type { Metadata } from "next";
import Link from "next/link";
import { TBD_HREF } from "@/lib/navigation";

export const metadata: Metadata = { title: "수강후기 상세" };

// 추후 오픈 예정 — 메뉴·사이트맵에서 숨김 처리된 페이지
// TODO: params.id 로 베스트 수강후기 상세 API 조회 (지금은 원본 샘플 내용)

export default function CourseBestReviewDetailPage() {
  return (
    <main className="wrapper">
      <div className="container" style={{ backgroundColor: "#fff" }}>
        {/* 상세 정보 테이블 */}
        <table className="review-detail-info-table">
          <tbody>
            <tr>
              <th>
                제목
              </th>
              <td colSpan={3}>
                [사회복지사] 2025-1학기 성적우수장학생 김지현 학습자 장학후기
              </td>
            </tr>
            <tr>
              <th>
                작성자
              </th>
              <td>
                한*생
              </td>
              <th>
                작성일
              </th>
              <td>
                25.10.21
              </td>
            </tr>
            <tr>
              <th>
                수강 과정
              </th>
              <td>
                사회복지사
              </td>
              <th>
                조회
              </th>
              <td>
                5233
              </td>
            </tr>
          </tbody>
        </table>
        <img src="/resources/images/course-registration/best.png" alt="수강후기 상세" className="review-detail-best-image" />
        {/* 베스트 수강후기 내용 */}
        <div className="review-detail-content">
          <div className="review-detail-section">
            <div className="review-detail-question">
              <span className="review-detail-question-number">
                1
              </span>
              {" "}
              <span className="review-detail-question-text">
                간단한 자기소개 (이름, 하고 있는 일 등)
              </span>
            </div>
            <div className="review-detail-answer">
              안녕하세요, 저는 약 8년간 군복무 후 현재는 전역하여 새로운 미래를 위해 취업준비와 주부로서 육아를 병행하고 있는 김지현입니다.
            </div>
          </div>
          <div className="review-detail-section">
            <div className="review-detail-question">
              <span className="review-detail-question-number">
                2
              </span>
              {" "}
              <span className="review-detail-question-text">
                해당 과정 수강동기는?
              </span>
            </div>
            <div className="review-detail-answer">
              사회복지사 자격증을 선택한 이유는 미래지향적이고 지속가능한 자격증이며, 육아와 병행하여 일할 수 있는 직업이고, 다양한 진로 선택이 가능하며, 사회에 긍정적인 기여를 할 수 있는 기회가 되기 때문입니다.
            </div>
          </div>
          <div className="review-detail-section">
            <div className="review-detail-question">
              <span className="review-detail-question-number">
                3
              </span>
              {" "}
              <span className="review-detail-question-text">
                한평생원격교육원을 선택한 이유는?
              </span>
            </div>
            <div className="review-detail-answer">
              인터넷을 통해 찾게 되었고, 신뢰도가 높아 보여서 선택하게 되었습니다.
            </div>
          </div>
          <div className="review-detail-section">
            <div className="review-detail-question">
              <span className="review-detail-question-number">
                4
              </span>
              {" "}
              <span className="review-detail-question-text">
                나만의 학습 노하우가 있다면?
              </span>
            </div>
            <div className="review-detail-answer">
              효율적인 시간 관리로 꾸준한 노력이 중요합니다. 틈나는 시간마다 학습을 하였고, 교안을 책처럼 읽으며 시간을 활용했습니다. 또한 사회복지사 과정의 심리 관련 내용이 흥미롭고 도움이 되었습니다.
            </div>
          </div>
          <div className="review-detail-section">
            <div className="review-detail-question">
              <span className="review-detail-question-number">
                5
              </span>
              {" "}
              <span className="review-detail-question-text">
                다른 학습자들에게 해주고 싶은 조언이 있다면?
              </span>
            </div>
            <div className="review-detail-answer">
              모든 것을 미리미리 해두시는 것을 추천합니다. 학습을 바로바로 하시고, 뒤로 미루지 마시기 바랍니다. 강의계획서를 활용하여 과제와 토론 주제를 미리 파악하고, 여유 있게 완료하시면 자연스럽게 좋은 결과와 학업성취를 얻으실 수 있습니다.
            </div>
          </div>
          <div className="review-detail-section">
            <div className="review-detail-question">
              <span className="review-detail-question-number">
                6
              </span>
              {" "}
              <span className="review-detail-question-text">
                앞으로의 계획은?
              </span>
            </div>
            <div className="review-detail-answer">
              사회복지사 2급 자격증 취득을 위한 실습만 남아있습니다. 출산 후 여건이 허락한다면 빠르게 실습을 마치고 2급 자격증을 취득하고자 합니다. 최종 목표는 사회복지사 1급 자격증 취득이며, 이를 위해 학습을 가속화할 계획입니다.
            </div>
          </div>
        </div>
        {/* 이전글/다음글 네비게이션 */}
        <table className="schedule-detail-navigation-table">
          <tbody>
            <tr>
              <th style={{ width: "200px", textAlign: "center" }}>
                <div className="review-nav-header">
                  <img src="/resources/images/course-registration/arrow-up.png" alt="이전글" className="review-nav-arrow" />
                  {" "}
                  <span>
                    이전글
                  </span>
                </div>
              </th>
              <td>
                -
              </td>
            </tr>
            <tr>
              <th style={{ width: "200px", textAlign: "center" }}>
                <div className="review-nav-header">
                  <img src="/resources/images/course-registration/arrow-down.png" alt="다음글" className="review-nav-arrow" />
                  {" "}
                  <span>
                    다음글
                  </span>
                </div>
              </th>
              <td>
                <a href={TBD_HREF} className="schedule-detail-nav-link">
                  [한국어교원] 2024-2학기 성적우수장학생 진효성 학습자 장학후기
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        {/* 목록으로 버튼 */}
        <div className="schedule-detail-actions">
          <Link href="/course-registration/reviews" className="schedule-detail-list-btn">
            목록으로
          </Link>
        </div>
      </div>
    </main>
  );
}
