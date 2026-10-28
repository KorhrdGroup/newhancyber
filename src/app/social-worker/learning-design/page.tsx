import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "대상별 학습설계" };

/** 원본 social-worker/learning-design.html */
export default function SocialWorkerLearningDesignPage() {
  return (
    <main className="wrapper">
      <section className="page-header">
        <div className="page-sub-dangu">
          * 본 예시는 최소한의 설계를 기준으로 한 학습설계이므로 개개인의 보유학점과 상황이 다르므로
          <br />
          {" "}정확한 학습설계를 위해서는 담당자와 상담 후 진행해주시기 바랍니다.
        </div>
        <div className="consultation-banner">
          <div className="consultation-banner-content">
            <p className="consultation-banner-title">
              잠깐! 학점은행제 도움을 받고싶다면
              <br />
              지금 바로{" "}
              <span className="text-consultations">
                상담신청
              </span>
              하세요!
            </p>
            <Link href="/course-registration/learning-design" className="consultation-banner-button">
              상담신청 하러가기{" "}
              <span className="consultation-banner-arrow">
                <img src="/resources/images/credit-bank/mark.png" alt="arrow" />
              </span>
            </Link>
          </div>
        </div>
        <div className="container">
          <h1 className="page-title">
            고등학교 졸업자
          </h1>
          <img src="/resources/images/social-worker/social-woorker04.png" alt="고등학교 졸업자" className="page-image" />
        </div>
        <div className="container">
          <h1 className="page-title">
            전문대/4년제 졸업자
          </h1>
          <img src="/resources/images/social-worker/social-woorker05.png" alt="고등학교 졸업자" className="page-image" />
        </div>
        <div className="container">
          <h1 className="page-title">
            사회복지 2년제 학위취득 과정
          </h1>
          <img src="/resources/images/social-worker/social-woorker07.png" alt="고등학교 졸업자" className="page-image" style={{ marginBottom: "30px" }} />
          <h1 className="page-title">
            사회복지 학사 학위취득 과정
          </h1>
          <img src="/resources/images/social-worker/social-woorker06.png" alt="고등학교 졸업자" className="page-image" />
          <ul className="page-list" style={{ marginTop: "10px" }}>
            <li className="page-list-dangu" style={{ marginTop: "10px" }}>
              전적대 성적증명서를 확인하여 이수한 학점을 전공, 교양, 일반으로 분류하여 부족한 학점만 추가적으로 이수하면 됩니다. 따라서 학습자에 따라 취득기간에 다소 차이가 있으므로 성적증명서를 토대로 학습설계를 받으셔야 합니다.
            </li>
            <li className="page-list-dangu">
              대학 중퇴자의 전적대 학점인정의 기준은 다음과 같습니다.
            </li>
            <li className="page-list-plain">
              (1) 전문대의 경우 최대 80학점 (수업연한이 3년인 경우 최대 120학점)까지 인정
            </li>
            <li className="page-list-plain">
              (2) 대학의 경우 최대 140학점까지 인정 (단, 중퇴한 학점에 한함)
            </li>
            <li className="page-list-plain">
              (3) 성적이 60점 또는 D- 이상인 학습과목 인정
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
