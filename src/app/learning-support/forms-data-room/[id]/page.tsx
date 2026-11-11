import type { Metadata } from "next";
import Link from "next/link";
import { TBD_HREF } from "@/lib/navigation";

export const metadata: Metadata = { title: "서식자료실 상세" };

// TODO: params.id 로 서식자료 상세를 조회한다 (지금은 원본 샘플 그대로)
export default function FormsDataRoomDetailPage() {
  return (
    <main className="wrapper">
      <div className="container" style={{ backgroundColor: "#fff" }}>
        <table className="schedule-detail-info-table">
          <tbody>
            <tr>
              <th>제목</th>
              <td>과제물 작성 가이드 라인</td>
            </tr>
            <tr>
              <th>작성일</th>
              <td>25.10.21</td>
            </tr>
            <tr>
              <th>다운로드</th>
              {/* TODO: 첨부파일 다운로드 링크 (원본은 파일명 글자만) */}
              <td>과제+작성+가이드+라인.PDF(25KB)</td>
            </tr>
          </tbody>
        </table>

        <div className="schedule-detail-title-container">
          <div className="schedule-detail-content">
            <div className="schedule-detail-text">
              <p>
                안녕하십니까? 한평생원격교육원입니다.
                <br />
                과제물 작성 가이드라인 파일 공유드립니다.
                <br />
                과제물과 관련된 자세한 내용은 [나의 강의실 &gt; 과목 &gt; 공지사항]을 참고해주시기 바랍니다.
              </p>
            </div>
          </div>
        </div>

        <table className="schedule-detail-navigation-table">
          <tbody>
            <tr>
              <th>이전글</th>
              <td>없음</td>
            </tr>
            <tr>
              <th>다음글</th>
              <td>
                {/* TODO: 다음글 주소 (원본도 href="#") */}
                <a href={TBD_HREF} className="schedule-detail-nav-link">
                  공결신청서
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="schedule-detail-actions">
          <Link href="/learning-support/forms-data-room" className="schedule-detail-list-btn">
            목록으로
          </Link>
        </div>
      </div>
    </main>
  );
}
