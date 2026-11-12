import Link from "next/link";
import { TBD_HREF } from "@/lib/navigation";
import PostView from "./PostView";

/** 이전글/다음글 제목 (모바일은 제목·부제목 두 줄로 나눠 보여준다) */
export interface NavPost {
  title: string;
  subtitle?: string;
}

export interface PostDetailProps {
  /** 정보 표(제목 칸)에 들어가는 제목 — 모바일 */
  mobileInfoTitle: string;
  /** 정보 표(제목 칸)와 본문 제목 — 데스크톱·모바일 본문 */
  title: string;
  date: string;
  /** TODO: 첨부파일 다운로드 링크 (원본은 파일명 글자만) */
  fileName: string;
  bannerAlt: string;
  mobilePrev?: NavPost;
  mobileNext: NavPost;
  desktopNext: string;
  listHref: string;
}

const lessonPoints = [
  "선 이수과목 확인 후 수강신청 시 성적증명서 반드시 제출",
  "1명(한국어학이, 3명(한국어교육)을 합하여 24학점 이상 이수자",
  "반드시 선 이수과목을 이수한 학습자이어야 수강 가능",
];

/** 본문 샘플 (원본 퍼블리싱 그대로). TODO: 글 상세 API 의 본문 HTML 로 바꾼다 */
function SampleText() {
  return (
    <>
      <h2>3. 한국어교육실습 구성 및 운영 기준</h2>
      <h3>1) 이론수업</h3>
      <p>온라인 이론 수업으로 진행되며, 강의 주차는 1-3주차입니다. 6강의 중 2강 이상 결석 시 불합격 처리됩니다.</p>
      <h3>2) 강의참관</h3>
      <h4>현장 강의참관</h4>
      <p>국립국어원 인증 프로그램 수강생을 위한 강의참관 과정입니다.</p>
      <ul>
        <li>온라인 실시간 참관으로 진행됩니다.</li>
        <li>
          필수 참관 강의: 세종학당 + 위더스 (세종학당 우수 강의 3개, 위더스 강의 3개, 하루 최대 4개까지 참관 가능)
        </li>
        <li>온라인 강의 주차: 4-6주차</li>
        <li>&apos;강의참관 완료증&apos; 제출 필수 (미제출 시 불합격)</li>
        <li>별도 &apos;강의참관 가이드&apos; 참고</li>
      </ul>
      <h4>동영상 강의참관</h4>
      <p>온라인 동영상 참관으로 진행되며, 강의 주차는 7-8주차입니다. 1일이라도 결석 시 불합격 처리됩니다.</p>
      <h3>3) 모의수업</h3>
      <p>강사의 지도 하에 한국어 학습자 또는 동료 학습자에게 수업을 진행하는 과정입니다.</p>
      <ul>
        <li>수업 계획서 및 수업 자료 제출 필수</li>
        <li>모의수업 진행: 최소 1회 이상, 평가 포함 30분, 준비 시간 20-25분</li>
        <li>2회 결석 시 불합격 처리</li>
        <li>피드백을 바탕으로 수업 계획서 수정</li>
        <li>수업 시연을 위한 PPT 자료 준비 및 제출</li>
        <li>수업 계획서 및 자료 미제출 시 불합격</li>
      </ul>
    </>
  );
}

function MobileNavPost({ post }: { post: NavPost }) {
  return (
    <>
      <div className="mobile-notice-detail-nav-title">{post.title}</div>
      {post.subtitle && <div className="mobile-notice-detail-nav-subtitle">{post.subtitle}</div>}
    </>
  );
}

/**
 * 공지사항·학사일정 상세 (모바일·데스크톱 마크업이 따로 있다).
 * 원본 notice-detail.html / schedule-detail.html 은 글자만 다르고 구조가 같다.
 */
export default function PostDetail({
  mobileInfoTitle,
  title,
  date,
  fileName,
  bannerAlt,
  mobilePrev,
  mobileNext,
  desktopNext,
  listHref,
}: PostDetailProps) {
  const infoRows = (infoTitle: string) => (
    <tbody>
      <tr>
        <th>제목</th>
        <td>{infoTitle}</td>
      </tr>
      <tr>
        <th>작성일</th>
        <td>{date}</td>
      </tr>
      <tr>
        <th>다운로드</th>
        <td>{fileName}</td>
      </tr>
    </tbody>
  );

  return (
    <>
      <div className="mobile-notice-detail-info mobile-only">
        <table className="mobile-notice-detail-table">{infoRows(mobileInfoTitle)}</table>
      </div>

      <div className="mobile-notice-detail-content mobile-only">
        <h1 className="mobile-notice-detail-title">{title}</h1>
        <div className="mobile-notice-detail-body">
          <ul className="mobile-notice-detail-list">
            {lessonPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="mobile-notice-detail-banner">
            <img
              src="/resources/images/learning-support/exbanner.png"
              alt={bannerAlt}
              className="mobile-notice-detail-banner-image"
            />
          </div>
          <div className="mobile-notice-detail-text">
            <SampleText />
          </div>
        </div>

        {/* TODO: 이전글/다음글 주소 (원본도 href="#") */}
        <div className="mobile-notice-detail-navigation">
          <table className="mobile-notice-detail-nav-table">
            <tbody>
              <tr>
                <th>이전글</th>
                <td>{mobilePrev ? <MobileNavPost post={mobilePrev} /> : "없음"}</td>
              </tr>
              <tr>
                <th>다음글</th>
                <td>
                  <a href={TBD_HREF} className="mobile-notice-detail-nav-link">
                    <MobileNavPost post={mobileNext} />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mobile-notice-detail-actions">
          <Link href={listHref} className="mobile-notice-detail-list-btn">
            목록으로
          </Link>
        </div>
      </div>

      <PostView
        className="desktop-only"
        title={title}
        date={date}
        fileName={fileName}
        next={{ title: desktopNext }}
        listHref={listHref}
      >
        <ul>
          {lessonPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <img src="/resources/images/learning-support/exbanner.png" alt={bannerAlt} className="lx-article-banner" />
        <SampleText />
      </PostView>
    </>
  );
}
