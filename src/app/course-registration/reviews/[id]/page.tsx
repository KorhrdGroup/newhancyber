import type { Metadata } from "next";
import Link from "next/link";
import { TBD_HREF } from "@/lib/navigation";

export const metadata: Metadata = { title: "수강후기 상세" };

// 추후 오픈 예정 — 메뉴·사이트맵에서 숨김 처리된 페이지
// TODO: params.id 로 수강후기 상세 API 조회 (지금은 원본 샘플 내용)

export default function CourseReviewDetailPage() {
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
                [사회복지사] 2024-2학기 성적우수장학생 변지영 학습자 장학후기
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
        {/* 수강후기 내용 */}
        <div className="detail-normal-content">
          <div className="detail-normal-section">
            <div className="detail-normal-question">
              <span className="detail-normal-question-text">
                1. 간단한 자기소개 (이름, 하고 있는 일 등)
              </span>
            </div>
            <div className="review-detail-answer">
              안녕하세요, 저는 약 8년간 군복무 후 현재는 전역하여 새로운 미래를 위해 취업준비와 주부로서 육아를 병행하고 있는 변지영입니다.
            </div>
          </div>
          <div className="detail-normal-section">
            <div className="detail-normal-question">
              <span className="detail-normal-question-text">
                2. 해당 과정 수강동기는?
              </span>
            </div>
            <div className="review-detail-answer">
              미래지향적이고 지속 가능한 자격증이며, 연계된 직업군으로 취업 시 일과 육아의 병행이 가능한 분야를 찾아보던 중, 사회복지사 자격증을 알게 되었습니다. 제가 원하는 조건을 충족할 뿐만 아니라 폭넓고 다양한 직업 선택이 가능하다는 점, 그리고 사회에 긍정적인 기여를 할 수 있다는 점에서 수강을 결심하게 되었습니다.
            </div>
          </div>
          <div className="detail-normal-section">
            <div className="detail-normal-question">
              <span className="detail-normal-question-text">
                3. 한평생원격교육원을 선택한 이유는?
              </span>
            </div>
            <div className="review-detail-answer">
              인터넷을 통해 한평생원격교육원을 선택하였고 신뢰도가 높은것같아 선택 하였습니다.
            </div>
          </div>
          <div className="detail-normal-section">
            <div className="detail-normal-question">
              <span className="detail-normal-question-text">
                4. 나만의 학습 노하우가 있다면?
              </span>
            </div>
            <div className="review-detail-answer">
              저는 효율적인 시간관리를 위해 꾸준히 노력했습니다. 틈틈이 시간이 날 때마다 공부했고, 자투리시간에는 교안을 독서하듯 읽으며 학습했습니다. 사회복지사 과정은 특히 심리학과 관련된 내용이 많아 재미있게 공부할 수 있었고, 교양적인 측면에서도 유익한 시간이었습니다.
            </div>
          </div>
          <div className="detail-normal-section">
            <div className="detail-normal-question">
              <span className="detail-normal-question-text">
                5. 다른 학습자들에게 해주고 싶은 조언이 있다면?
              </span>
            </div>
            <div className="review-detail-answer">
              다른 학습자님들도 교육받고 자격증과 학위취득을 동시에 누리세요~ 화이팅입니다~~
            </div>
          </div>
          <div className="detail-normal-section">
            <div className="detail-normal-question">
              <span className="detail-normal-question-text">
                6. 앞으로의 계획은?
              </span>
            </div>
            <div className="review-detail-answer">
              앞으로 자격증과 학위취득을 하여 취업에 성공하고 싶습니다. 아자아자~~
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
                <Link href="/course-registration/reviews/1" className="schedule-detail-nav-link">
                  [사회복지사] 2025-1학기 성적우수장학생 김지현 학습자 장학후기
                </Link>
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
                  [보육교사] 2024-2학기 성적우수장학생 이지은 학습자 장학후기
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
