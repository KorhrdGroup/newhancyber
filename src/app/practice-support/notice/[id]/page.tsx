import "@/styles/learning-support.css";
import type { Metadata } from "next";
import Link from "next/link";
import { sampleNoticeDetail } from "@/components/practice-support/noticeData";
import SampleNoticeText from "@/components/practice-support/SampleNoticeText";
import MobilePageBanner from "@/components/layout/MobilePageBanner";

export const metadata: Metadata = { title: "공지사항 상세" };

type Props = { params: Promise<{ id: string }> };

const LIST_HREF = "/practice-support/notice";

export default async function PracticeNoticeDetailPage({ params }: Props) {
  // TODO: id 로 실습 공지 상세 API 조회 (지금은 원본처럼 모든 글이 같은 샘플)
  await params;
  const notice = sampleNoticeDetail;
  const { prev: mobilePrev, next: mobileNext } = notice.mobile;
  const { prev, next } = notice.desktop;

  return (
    <>
      <MobilePageBanner name="notice-detail" text="공지사항" />
      <main className="wrapper">
        {/* 모바일 상세 정보 */}
        <div className="mobile-notice-detail-info mobile-only">
          <table className="mobile-notice-detail-table">
            <tbody>
              <tr>
                <th>제목</th>
                <td>{notice.title}</td>
              </tr>
              <tr>
                <th>작성일</th>
                <td>{notice.date}</td>
              </tr>
              <tr>
                <th>다운로드</th>
                {/* TODO: 첨부파일 다운로드 버튼 */}
                <td>{notice.fileName}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 모바일 본문 내용 */}
        <div className="mobile-notice-detail-content mobile-only">
          <h1 className="mobile-notice-detail-title">{notice.shortTitle}</h1>

          <div className="mobile-notice-detail-body">
            <ul className="mobile-notice-detail-list">
              {notice.summary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="mobile-notice-detail-banner">
              <img src={notice.bannerImage} alt="공지사항 배너" className="mobile-notice-detail-banner-image" />
            </div>

            <div className="mobile-notice-detail-text">
              <SampleNoticeText />
            </div>
          </div>

          <div className="mobile-notice-detail-navigation">
            <table className="mobile-notice-detail-nav-table">
              <tbody>
                <tr>
                  <th>이전글</th>
                  <td>
                    <div className="mobile-notice-detail-nav-title">{mobilePrev.title}</div>
                    <div className="mobile-notice-detail-nav-subtitle">{mobilePrev.subtitle}</div>
                  </td>
                </tr>
                <tr>
                  <th>다음글</th>
                  <td>
                    <Link href={mobileNext.href ?? "#"} className="mobile-notice-detail-nav-link">
                      <div className="mobile-notice-detail-nav-title">{mobileNext.title}</div>
                      <div className="mobile-notice-detail-nav-subtitle">{mobileNext.subtitle}</div>
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mobile-notice-detail-actions">
            <Link href={LIST_HREF} className="mobile-notice-detail-list-btn">
              목록으로
            </Link>
          </div>
        </div>

        <div className="container desktop-only" style={{ backgroundColor: "#fff" }}>
          <table className="schedule-detail-info-table">
            <tbody>
              <tr>
                <th>제목</th>
                <td>{notice.shortTitle}</td>
              </tr>
              <tr>
                <th>작성일</th>
                <td>{notice.date}</td>
              </tr>
              <tr>
                <th>다운로드</th>
                <td>{notice.fileName}</td>
              </tr>
            </tbody>
          </table>

          <div className="schedule-detail-title-container">
            <h1 className="schedule-detail-title">{notice.shortTitle}</h1>

            <div className="schedule-detail-content">
              <ul className="schedule-detail-list">
                {notice.summary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="schedule-detail-banner">
                <img src={notice.bannerImage} alt="공지사항 배너" className="schedule-detail-banner-image" />
              </div>

              <div className="schedule-detail-text">
                <SampleNoticeText />
              </div>
            </div>

            <table className="schedule-detail-navigation-table">
              <tbody>
                <tr>
                  <th>이전글</th>
                  <td>
                    {prev ? (
                      <Link href={prev.href ?? "#"} className="schedule-detail-nav-link">
                        {prev.title}
                      </Link>
                    ) : (
                      "없음"
                    )}
                  </td>
                </tr>
                <tr>
                  <th>다음글</th>
                  <td>
                    {next ? (
                      <Link href={next.href ?? "#"} className="schedule-detail-nav-link">
                        {next.title}
                      </Link>
                    ) : (
                      "없음"
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="schedule-detail-actions">
              <Link href={LIST_HREF} className="schedule-detail-list-btn">
                목록으로
              </Link>
            </div>
          </div>
        </div>
        {/* 원본 main 안의 모바일 푸터는 공통 레이아웃(PageMobileFooter)이 그린다 */}
      </main>
    </>
  );
}
