import type { Metadata } from "next";
import PopupShell from "@/components/my-classroom/PopupShell";
import { findCourseByName, formatPrice } from "@/components/course-registration/courseData";

export const metadata: Metadata = { title: "맛보기 강의" };

export default async function SampleLecturePopup({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const courseName = decodeURIComponent(name);
  // TODO: API 과목 정보·맛보기 영상 주소 조회 (원본 /vod/(과목 번호)/pc/1/1.html)
  const course = findCourseByName(courseName);

  return (
    <PopupShell title="맛보기 강의" sub={courseName}>
      <div className="pp-video">
        <div>
          <strong>1주차 1차시 · 과목 오리엔테이션</strong>
          맛보기 영상 자리 (영상 서버 연동 전)
        </div>
      </div>
      <div className="pp-box ds-mt-16">
        <h2 className="pp-box-title">과목 정보</h2>
        <table className="ds-table ds-table--info">
          <tbody>
            <tr>
              <th>과목명</th>
              <td>{course?.name ?? courseName}</td>
            </tr>
            {course && (
              <tr>
                <th>전공 구분</th>
                <td>{course.majorType.join(" · ")}</td>
              </tr>
            )}
            <tr>
              <th>학점 · 수업</th>
              <td>3학점 · 15주</td>
            </tr>
            {course && (
              <tr>
                <th>수강료</th>
                <td>{formatPrice(course.fee)}원</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pp-box">
        <h2 className="pp-box-title">맛보기 안내</h2>
        <ul className="pp-list">
          <li>맛보기는 1주차 1차시만 볼 수 있어요. 학습 시간과 출석에는 들어가지 않아요.</li>
          <li>수강신청을 하면 15주 강의 전체와 강의 자료를 볼 수 있어요.</li>
          <li>영상이 나오지 않으면 학습지원센터의 학습 환경 안내를 확인해 주세요.</li>
        </ul>
      </div>
    </PopupShell>
  );
}
