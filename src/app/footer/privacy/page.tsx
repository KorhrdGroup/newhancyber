import type { Metadata } from "next";
import { CONTACT_EMAIL, SUPPORT_PHONE } from "@/lib/contact";

export const metadata: Metadata = { title: "개인정보처리방침" };

export default function PrivacyPage() {
  return (
    <main className="wrapper">
      <div className="container">
        <div className="privacy-content">
          <div className="privacy-article">
            <h2 className="privacy-article-title">제1조. 서문</h2>
            <p className="privacy-article-text">
              한평생원격교육원(이하 &quot;교육원&quot;)은 이용자의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다. 이에 「개인정보 보호법」에 따라 이용자에게 개인정보 처리에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
            </p>
          </div>
          {/* 개인정보 처리 표시(라벨링) */}
          <div className="privacy-labeling-section">
            <div className="privacy-labeling-table-wrapper">
              <table className="privacy-labeling-table">
                <thead>
                  <tr>
                    <th className="privacy-labeling-title" colSpan={5}>개인정보 처리 표시(라벨링)</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 첫 번째 행 */}
                  <tr>
                    <td className="privacy-labeling-cell">
                      <div className="privacy-labeling-icon">
                        <img src="/resources/images/footer/privacy/privacy-01.png" alt="일반 개인정보 수집" className="privacy-labeling-icon-img" />
                      </div>
                      <h3 className="privacy-labeling-item-title">일반 개인정보 수집</h3>
                      <p className="privacy-labeling-item-desc">이름, 생년월일, 휴대전화번호 등</p>
                    </td>
                    <td className="privacy-labeling-cell">
                      <div className="privacy-labeling-icon">
                        <img src="/resources/images/footer/privacy/privacy-02.png" alt="개인정보 이용 목적" className="privacy-labeling-icon-img" />
                      </div>
                      <h3 className="privacy-labeling-item-title">개인정보 이용 목적</h3>
                      <p className="privacy-labeling-item-desc">회원 가입 시 의사 확인, 회사의 서비스 제공, 광고성 정보 제공 등</p>
                    </td>
                    <td className="privacy-labeling-cell">
                      <div className="privacy-labeling-icon">
                        <img src="/resources/images/footer/privacy/privacy-03.png" alt="개인정보의 보유 기간" className="privacy-labeling-icon-img" />
                      </div>
                      <h3 className="privacy-labeling-item-title">개인정보의 보유 기간</h3>
                      <p className="privacy-labeling-item-desc">법령이 정하는 경우를 제외하고는 회원 탈퇴시까지</p>
                    </td>
                    <td className="privacy-labeling-cell">
                      <div className="privacy-labeling-icon">
                        <img src="/resources/images/footer/privacy/privacy-04.png" alt="개인정보 수집 방법" className="privacy-labeling-icon-img" />
                      </div>
                      <h3 className="privacy-labeling-item-title">개인정보 수집 방법</h3>
                      <p className="privacy-labeling-item-desc">웹사이트, 이메일, 전화 등</p>
                    </td>
                    <td className="privacy-labeling-cell">
                      <div className="privacy-labeling-icon">
                        <img src="/resources/images/footer/privacy/privacy-05.png" alt="개인정보 처리위탁" className="privacy-labeling-icon-img" />
                      </div>
                      <h3 className="privacy-labeling-item-title">개인정보 처리위탁</h3>
                      <p className="privacy-labeling-item-desc">
                        나이스페이먼츠, 교강사, NICE평가정보(주), (주)교보문고, (주)버킷스튜디오, (주)케이티알파, 한국모바일인증(주)
                      </p>
                    </td>
                  </tr>
                  {/* 두 번째 행 */}
                  <tr>
                    <td className="privacy-labeling-cell">
                      <div className="privacy-labeling-icon">
                        <img src="/resources/images/footer/privacy/privacy-06.png" alt="개인정보 제3자 제공" className="privacy-labeling-icon-img" />
                      </div>
                      <h3 className="privacy-labeling-item-title">개인정보 제3자 제공</h3>
                      <p className="privacy-labeling-item-desc">국가평생교육진흥원, 국세청, 보훈처, 교육부, 남북하나재단</p>
                    </td>
                    <td className="privacy-labeling-cell">
                      <div className="privacy-labeling-icon">
                        <img src="/resources/images/footer/privacy/privacy-07.png" alt="개인정보 파기" className="privacy-labeling-icon-img" />
                      </div>
                      <h3 className="privacy-labeling-item-title">개인정보 파기</h3>
                      <p className="privacy-labeling-item-desc">
                        분쇄기에 의한 파쇄 또는 소각, 기록을 재생할 수 없는 기술적 방법을 사용한 삭제
                      </p>
                    </td>
                    <td className="privacy-labeling-cell">
                      <div className="privacy-labeling-icon">
                        <img src="/resources/images/footer/privacy/privacy-08.png" alt="권리와 행사 방법" className="privacy-labeling-icon-img" />
                      </div>
                      <h3 className="privacy-labeling-item-title">권리와 행사 방법</h3>
                      <p className="privacy-labeling-item-desc">개인정보의 조회 및 수정, 회원 탈퇴 및 동의 철회</p>
                    </td>
                    <td className="privacy-labeling-cell">
                      <div className="privacy-labeling-icon">
                        <img src="/resources/images/footer/privacy/privacy-09.png" alt="정보보호 대책 수립" className="privacy-labeling-icon-img" />
                      </div>
                      <h3 className="privacy-labeling-item-title">정보보호 대책 수립</h3>
                      <p className="privacy-labeling-item-desc">개인정보처리시스템 등의 접근권한 관리, 접근통제 시스템 설치 등</p>
                    </td>
                    <td className="privacy-labeling-cell">
                      <div className="privacy-labeling-icon">
                        <img src="/resources/images/footer/privacy/privacy-10.png" alt="개인정보 보호책임자" className="privacy-labeling-icon-img" />
                      </div>
                      <h3 className="privacy-labeling-item-title">개인정보 보호책임자</h3>
                      <p className="privacy-labeling-item-desc">양병웅, {SUPPORT_PHONE}, {CONTACT_EMAIL}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <ul className="privacy-labeling-list">
            <li className="page-list-dangu">자세한 내용은 아래의 개인정보 처리방침 본문을 확인해주세요.</li>
          </ul>
          {/* 목차 테이블 */}
          <div className="privacy-toc-section">
            <div className="privacy-toc-table-wrapper">
              <table className="privacy-toc-table">
                <thead>
                  <tr>
                    <th className="privacy-toc-title" colSpan={2}>목차</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="privacy-toc-cell privacy-toc-cell-left">
                      개인정보의 수집 · 이용 목적, 항목, 보유기간
                      <br />
                      개인정보의 수집 방법
                      <br />
                      개인정보 처리의 위탁
                      <br />
                      개인정보 제3자 제공
                      <br />
                      개인정보의 파기
                      <br />
                      개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항
                    </td>
                    <td className="privacy-toc-cell privacy-toc-cell-right">
                      이용자와 법정대리인의 권리 · 의무 및 행사 방법
                      <br />
                      개인정보보호를 위한 대책 수립
                      <br />
                      개인정보보호책임자 및 개인정보 열람청구
                      <br />
                      권익침해 구제방법
                      <br />
                      부칙
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="privacy-article-section">
            <h2 className="privacy-article-title-icons">
              제2조. 개인정보의 수집 · 이용 목적, 항목, 보유기간{" "}
              <span className="privacy-article-icons">
                <img src="/resources/images/footer/privacy/privacy-01.png" alt="개인정보의 수집 · 이용 목적, 항목, 보유기간" className="privacy-article-icon" />
                {" "}
                <img src="/resources/images/footer/privacy/privacy-02.png" alt="개인정보의 수집 · 이용 목적, 항목, 보유기간" className="privacy-article-icon" />
                {" "}
                <img src="/resources/images/footer/privacy/privacy-03.png" alt="개인정보의 수집 · 이용 목적, 항목, 보유기간" className="privacy-article-icon" />
              </span>
            </h2>
          </div>
          <ul className="privacy-article-list">
            <li className="page-list-dangu">이용자는 동의를 거부할 권리가 있으나, 동의를 거부하는 경우 회원가입 및 서비스의 이용이 제한됩니다.</li>
          </ul>
          {/* 개인정보 수집·이용 목적, 항목, 보유기간 테이블 */}
          <div className="privacy-data-section">
            <div className="privacy-data-table-wrapper">
              <table className="privacy-data-table">
                <thead>
                  <tr>
                    <th className="privacy-data-header">수집 단계</th>
                    <th className="privacy-data-header">수집/이용 목적</th>
                    <th className="privacy-data-header">수집 항목</th>
                    <th className="privacy-data-header">보유 및 이용기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="privacy-data-cell" rowSpan={2} style={{ textAlign: "center" }}>회원가입</td>
                    <td className="privacy-data-cell" rowSpan={2}>
                      <ul>
                        <li>
                          1) 회원 가입 시 의사 확인, 연령 확인, 본인 확인, 서비스 제공 시 이용자 식별 등 회원 관리, 통계학적 분석을 통한 마케팅에 이용, 서비스 부정이용자 식별 및 차단, 이벤트 등에 따른 혜택 중복 수령 방지
                        </li>
                        <li>* 한평생원격교육원의 추가 수집/이용 목적 : 학사 및 평가일정 안내 목적</li>
                        <li>
                          2)“회사”의 “서비스” 제공, 고지사항 전달, 학습독려, 본인의사 확인 등 소통, “웹사이트”에서 제공하는 이벤트 참여, 혜택발송 및 문의사항 응대
                        </li>
                        <li>
                          3) 광고성 정보 수신에 대하여 별도의 동의를 한 회원에 한하여 “회사”와 각 제휴사의 새로운 서비스, 신상품이나 이벤트, 최신 정보의 안내 등 회원의 취향에 맞는 최적의 정보 제공
                        </li>
                      </ul>
                    </td>
                    <td className="privacy-data-cell">
                      14세이상 국내거주자
                      <br />
                      <ul>
                        <li>(필수) ID, 이름, 생년월일, 비밀번호,휴대전화번호, 이메일주소</li>
                        <li>(선택) 추천인 아이디, 가입경로, 최종학력, 희망과정, 성별</li>
                        <li>*한평생원격교육원에서 선택 사항으로 추가 수집하는 수집 항목 : 학교명, 학점취득목적, 학점 목표학위</li>
                      </ul>
                    </td>
                    <td className="privacy-data-cell" rowSpan={2}>
                      <ul>
                        <li>법령이 정하는 경우를 제외하고는 회원탈퇴시까지 보유 및 이용합니다.</li>
                        <li>단, 이름, 휴대전화번호는 아래의 경우를 방지하기 위하여 회원 탈퇴 이후에도 보유 및 이용합니다.</li>
                      </ul>
                      <li>
                        1) 이벤트 혜택 등 중복수령 방지를 목적으로 중복수령이 불가한 이벤트 혜택을 수령한 회원에 한하여 회원 탈퇴시점으로부터 1년 간 보유 및 이용합니다.
                      </li>
                      <li>2) 아이디 공유/양도 및 불법녹화 등의 부정한 이용으로 적발된 부정이용자에 한하여 회원탈퇴시점으로부터 1년 간 보유 및 이용합니다.</li>
                    </td>
                  </tr>
                  <tr>
                    <td className="privacy-data-cell">
                      만 14세 이상 해외 거주자:
                      <br />
                      <ul>
                        <li>
                          [필수] 아이디, 이름, 생년월일, 비밀번호, 이메일 주소
                          <br />
                        </li>
                        <li>(선택) 추천인 아이디, 가입경로, 최종학력, 희망과정, 성별</li>
                        <li>*한평생원격교육원에서 선택 사항으로 추가 수집하는 수집 항목 : 학교명, 학점취득목적, 학점 목표학위</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="privacy-data-cell" style={{ textAlign: "center" }}>
                      서비스 이용과정에서 자동으로
                      <br />
                      생성 · 수집되는 정보
                    </td>
                    <td className="privacy-data-cell">공인인증서 로그인, 결제, 서비스 이용 기록 확인, 서비스 부정 이용 방지</td>
                    <td className="privacy-data-cell">
                      쿠키(Cookie), 기기고유번호, CPU Serial, Mac Address, 이용기록(닉네임 포함), 접속기록(접속 IP 포함), 결제기록, 수강기록(학습과목 이수내역, 출석 정보 포함), 성적 관련 정보, 컨텐츠 다운로드 기록 등 서비스 이용정보, 부정이용기록, 장애 여부
                    </td>
                    <td className="privacy-data-cell">
                      <ul>
                        <li>법령이 정하는 경우를 제외하고는 회원탈퇴시까지 보유 및 이용합니다.</li>
                        <li>
                          단, 중복수령이 불가한 이벤트 혜택을 수령한 회원과 아이디 공유/양도 및 불법녹화 등의 부정한 이용으로 적발된 부정이용자에 한하여 서비스이용기록과 부정이용기록을 회원탈퇴시점으로부터 1년 간 보유 및 이용합니다.
                        </li>
                        <li>쿠키의 경우 로그아웃 또는 브라우저 종료시 삭제됩니다.</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <ul>
            <li className="page-list-plain">
              다음의 항목은 선택사항으로서 해당 서비스를 제공하는 때에 별도로 수집 또는 동의절차를 진행합니다.
              <br />
              * 이 경우 동의하지 않아도 기본 서비스를 이용하실 수 있으나, 동의를 요하는 해당 부가서비스 또는 이벤트 참여나 혜택 제공, 학점인정 과목 수강이 제한될 수 있습니다.
            </li>
          </ul>
          {/* 추가 개인정보 수집·이용 목적, 항목, 보유기간 테이블 */}
          <div className="privacy-data-section">
            <div className="privacy-data-table-wrapper">
              <table className="privacy-data-table">
                <thead>
                  <tr>
                    <th className="privacy-data-header" scope="col" style={{ width: "200px" }}>수집 단계</th>
                    <th className="privacy-data-header" scope="col">수집/이용 목적</th>
                    <th className="privacy-data-header" scope="col">수집 항목</th>
                    <th className="privacy-data-header" scope="col">보유 및 이용기간</th>
                  </tr>
                </thead>
                <tbody className="left">
                  <tr>
                    <th className="privacy-data-cell" scope="row">불편사항신고</th>
                    <td className="privacy-data-cell">민원인 확인, 민원처리결과 통지, 서비스 개선 및 불만신고 접수/처리</td>
                    <td className="privacy-data-cell">
                      <ul>
                        <li>(필수) 이름, 이메일주소, 휴대전화번호, 상담내역</li>
                        <li>(선택) 단말기기명, OS버젼</li>
                      </ul>
                      단말기기명, OS버젼
                    </td>
                    <td className="privacy-data-cell">
                      법령상 정하는 경우를 제외하고는 회원탈퇴시까지 이용 및 보관합니다. 단, 비회원이거나 상담시로부터 3년 이내 탈퇴하는 자의 경우, 소비자 불만 또는 분쟁처리를 위해 3년간 보관합니다.
                    </td>
                  </tr>
                  <tr>
                    <th className="privacy-data-cell" scope="row">환불요청 시</th>
                    <td className="privacy-data-cell">회원이 결제한 거래의 환불조치</td>
                    <td className="privacy-data-cell">
                      <ul>
                        <li>(필수) 계좌정보 (은행명, 예금주, 계좌번호)</li>
                        <li>(*단, 계좌정보는 현금으로 결제하는 경우에 한하여 수집 및 이용합니다.)</li>
                      </ul>
                    </td>
                    <td className="privacy-data-cell">법령이 정하는 경우를 제외하고는 회원 탈퇴 시까지 보유 및 이용합니다.</td>
                  </tr>
                  <tr>
                    <th className="privacy-data-cell" scope="row">
                      한평생원격교육원 학점인정과목
                      <br />
                      학습과정 등록
                    </th>
                    <td className="privacy-data-cell">학점인정 관련 사무 처리, 학적 관리, 학적부 작성</td>
                    <td className="privacy-data-cell">
                      <ul>
                        <li>(필수) 이름, 주민등록번호, 휴대전화번호, 주소 이메일주소, 출신학교 정보, 학습과목 이수내역</li>
                        <li>(선택) 은행명, 예금주명, 계좌번호, 최종학력정보</li>
                      </ul>
                    </td>
                    <td className="privacy-data-cell">
                      「평가인정 학습과정 운영에 관한 규정」 제9조 및 교육부고시 「평가인정 학습과정 운영지침」 [별표 2]에 따라 영구 보관합니다. * 주민등록번호는 「학점인정 등에 관한 법률 시행령」 제19조의2 및 「학점인정 등에 관한 법률 시행규칙」 제4조를 근거로 처리하고 있으며, 암호화하여 저장·관리합니다.
                    </td>
                  </tr>
                  <tr>
                    <th className="privacy-data-cell" scope="row">1:1 빠른 상담신청</th>
                    <td className="privacy-data-cell" rowSpan={2}>
                      <ul>
                        <li>1) 상담 진행, 교육과정 설계, 문의사항 응대, 민원해결</li>
                        <li>
                          2) 광고성 정보 수신에 대하여 별도의 동의를 한 회원에 한하여 &quot;회사&quot;와 각 제휴사의 새로운 서비스, 신상품이나 이벤트, 최신 정보의 안내 등 회원의 취향에 맞는 최적의 정보 제공
                        </li>
                      </ul>
                    </td>
                    <td className="privacy-data-cell">
                      <ul>
                        <li>1) 간편 상담 : (필수) 휴대전화번호, 상담내역</li>
                        <li>2) 문자 상담 : (필수) 휴대전화번호, 상담내역/(선택) 제출된 상담 문의 내용 또는 첨부파일에 기재된 개인정보</li>
                        <li>
                          3) 무료 1:1 상담 : (필수) 이름, 휴대폰 번호, 이메일주소, 상담내역/(선택) 제출된 상담 문의 내용 또는 첨부파일에 기재된 개인정보
                        </li>
                        <li>4) 전화 상담 : (필수) 이름, 휴대폰 번호, 이메일주소, 상담내역/(선택) 제출된 상담 문의 내용 또는 첨부파일에 기재된 개인정보</li>
                        <li>
                          5) 방문 상담 : (필수) 이름, 휴대폰번호, 이메일주소, 상담내역/ (선택) 최종학력, 제출된 상담 문의 내용 또는 첨부파일에 기재된 개인정보
                        </li>
                        <li>6) 카카오톡 상담 : (필수) 휴대전화번호, 상담내역 / (선택) 이름, 희망과정, 최종학력, 거주지역, 학습과목</li>
                      </ul>
                    </td>
                    <td className="privacy-data-cell" rowSpan={2}>
                      법령상 정하는 경우를 제외하고는 회원탈퇴시까지 이용 및 보관합니다. 단, 비회원이거나 상담시로부터 3년 이내 탈퇴하는 자의 경우, 소비자 불만 또는 분쟁처리를 위해 3년간 보관합니다.
                    </td>
                  </tr>
                  <tr>
                    <th className="privacy-data-cell" scope="row">
                      사회복지사,
                      <br />
                      보육교사,
                      <br />
                      평생교육사,
                      <br />
                      한국어교원,
                      <br />
                      건강가정사,
                      <br />
                      미용종합면허
                      <br />
                      상담신청
                    </th>
                    <td className="privacy-data-cell">
                      <ul>
                        <li>1) 간편상담 : (필수) 이름, 휴대폰 번호, 상담내역</li>
                        <li>2) 전화상담 : (필수) 이름, 이메일주소, 연락처, 상담내역/(선택) 희망전공, 제출된 상담 문의 내용 또는 첨부파일에 기재된 개인정보</li>
                        <li>3) 카카오톡 상담 : (필수) 전화번호, 상담내역 / (선택) 이름</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <th className="privacy-data-cell" scope="row">기타 이벤트 참여</th>
                    <td className="privacy-data-cell">
                      <ul>
                        <li>1) 이벤트 응모</li>
                        <li>2) 경품 등을 배송을 통해 수령하는 이벤트인 경우 혜택 발송을 위함</li>
                        <li>3) 이벤트 참여 내역 관리를 통한 혜택 중복 수령 방지 등</li>
                        <li>* 진행되는 이벤트 특성에 따라 개인정보 수집/이용 목적이 추가 또는 수정될 수 있습니다. 이 경우 해당 이벤트 진행 시 별도 안내합니다.</li>
                      </ul>
                    </td>
                    <td className="privacy-data-cell">
                      <ul>
                        <li>(필수) 이름, 휴대폰번호, 이메일 주소</li>
                        <li>(선택) ID, 주소, 사진, 성적표</li>
                        <li>*이벤트에 따라 추가로 개인정보를 수집하는 경우가 있을 수 있습니다. 추가 개인정보 수집 하는 경우 해당 이벤트 진행 시 안내합니다.</li>
                      </ul>
                    </td>
                    <td className="privacy-data-cell">
                      <ul>
                        <li>
                          [비회원 이벤트의 경우]
                          <br />
                          수집한 개인정보는 수집 시로부터 1년 간 이용하며, 내역 관리를 위해 추가1년을 보관한 후 파기합니다. (총 2년 보유)
                        </li>
                        <li>
                          [회원 이벤트의 경우]
                          <br />
                          수집한 개인정보는 회원 탈퇴시까지 보관합니다. 단, 이벤트 참여일로부터 2년 이내 회원 탈퇴한 경우에는 참여일로부터 2년 동안 보관 후 파기합니다.
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <th className="privacy-data-cell" scope="row">평생교육사 자격증 신청 시</th>
                    <td className="privacy-data-cell">본인실명확인, 자격검정, 자격증 교부</td>
                    <td className="privacy-data-cell">
                      (필수) 성명, 주민등록번호, 주소, 전화번호, 최종학력(학교명, 전공, 입학 및 졸업시기, 학위등록번호), 이수기관(기관명, 이수기간)
                    </td>
                    <td className="privacy-data-cell">자격증 교부 시까지 보관합니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <h2 className="privacy-article-title-icons">
            제3조(개인정보의 처리 및 보유기간){" "}
            <span className="privacy-article-icons">
              <img src="/resources/images/footer/privacy/privacy-03.png" alt="개인정보의 처리 및 보유기간" className="privacy-article-icon" />
            </span>
          </h2>
          <ul style={{ marginTop: "16px", marginBottom: "24px" }}>
            <li className="page-list-plain">“회사”는 다음의 방법을 통하여 이용자의 개인정보를 수집합니다.</li>
            <li className="page-list-plain">1. “웹사이트” 또는 이메일을 통한 수집</li>
            <li className="page-list-plain">2. 전화, 팩스, “회사”가 서비스를 제공하기 위하여 작성하는 신청서 등 서면 및 대면방식의 수집</li>
            <li className="page-list-plain">
              3. 그 분석 프로그램을 통한 생성정보 수집, ‘쿠키(Cookie)’에 의한 정보 수집 기타 서비스 이용과정에서의 생성정보 자동 수집
            </li>
          </ul>
          <h2 className="privacy-article-title-icons">
            제4조. 개인정보 처리의 위탁{" "}
            <img src="/resources/images/footer/privacy/privacy-05.png" alt="개인정보의 처리 및 보유기간" className="privacy-article-icon" />
          </h2>
          <ul style={{ marginTop: "16px", marginBottom: "24px" }}>
            <li className="page-list-plain">
              1. “회사”는 서비스 제공에 관한 계약을 이행하고 이용자의 편의 증진을 위하여 개인정보 처리 업무의 일부를 외부 전문업체에 위탁하고 있으며, 수탁자에 대해서는 개인정보보호법상 “개인정보 위탁 계약서”등을 통하여 관련 법규 및 지침의 준수, 정보보호 및 비밀유지, 제3자 제공 금지, 사고 시 책임부담, 위탁기간 종료 즉시 개인정보의 반납/파기의무 등을 규정하여 관리하고 있습니다
            </li>
            <li className="page-list-plain">2. 위탁한 개인정보는 회원탈퇴, 위탁계약 종료, 이용자의 삭제 요청이 있는 경우 지체 없이 파기합니다.</li>
            <li className="page-list-plain">2. 전화, 팩스, “회사”가 서비스를 제공하기 위하여 작성하는 신청서 등 서면 및 대면방식의 수집</li>
            <li className="page-list-plain">3. 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체 없이 본 개인정보처리방침을 통하여 공개합니다.</li>
            <li className="page-list-plain">
              4. 개인정보 위탁 업체 및 위탁 내용
              <br />
              아래의 경우 서비스 제공에 관한 계약을 이행하고 이용자 편의 증진 등을 위해 필요한 개인정보 처리위탁으로서, 개인정보처리방침에 공개하는 것으로 동의를 갈음합니다. “회사”는 서비스운영 및 인프라 유지에 관하여 아래와 같이 개인정보의 처리업무를 위탁합니다.
            </li>
          </ul>
          {/* 개인정보 처리 위탁 테이블 */}
          <div className="privacy-entrust-section">
            <div className="privacy-entrust-table-wrapper">
              <table className="privacy-entrust-table">
                <thead>
                  <tr>
                    <th className="privacy-entrust-header" scope="col">수탁자</th>
                    <th className="privacy-entrust-header" scope="col">수탁업무</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="privacy-entrust-cell">나이스페이먼츠주식회사</td>
                    <td className="privacy-entrust-cell">온라인 결제대행</td>
                  </tr>
                  <tr>
                    <td className="privacy-entrust-cell">교강사</td>
                    <td className="privacy-entrust-cell">학습자 관리 및 평가, 수업 관리 및 진행, 출석 관리, 성적 입력 및 관리</td>
                  </tr>
                  <tr>
                    <td className="privacy-entrust-cell">
                      NICE평가정보(주),
                      <br />
                      한국모바일인증(주)
                    </td>
                    <td className="privacy-entrust-cell">실명확인 서비스</td>
                  </tr>
                  <tr>
                    <td className="privacy-entrust-cell">(주)케이티알파</td>
                    <td className="privacy-entrust-cell">기프티콘 비즈콘 서비스를 이용한 기프티콘 발송</td>
                  </tr>
                  <tr>
                    <td className="privacy-entrust-cell">(주)교보문고</td>
                    <td className="privacy-entrust-cell">전자도서관 운영</td>
                  </tr>
                  <tr>
                    <td className="privacy-entrust-cell">(주)엘지유플러스</td>
                    <td className="privacy-entrust-cell">SMS/LMS 문자메세지 발송</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <h2 className="privacy-article-title-icons">
            제5조. 개인정보 제3자 제공{" "}
            <span className="privacy-article-icons">
              <img src="/resources/images/footer/privacy/privacy-03.png" alt="개인정보의 처리 및 보유기간" className="privacy-article-icon" />
            </span>
            {" "}
            <span className="privacy-article-icons">
              <img src="/resources/images/footer/privacy/privacy-07.png" alt="개인정보의 처리 및 보유기간" className="privacy-article-icon" />
            </span>
          </h2>
          <ul style={{ marginTop: "16px", marginBottom: "24px" }}>
            <li className="page-list-plain">
              1. “회사”는 법령이 정하는 경우를 제외하고는 이용자의 개인정보를 사전 동의절차 없이, 또는 동의 받은 범위를 초과하여 제3자에게 제공하지 아니합니다.
            </li>
            <li className="page-list-plain">
              2. “회사”는 다음의 경우와 같이 법령이 정하는 제3자 제공 사유가 있는 경우 제3자에게 개인정보를 제공하고 있습니다.
            </li>
          </ul>
          {/* 개인정보 제3자 제공 테이블 */}
          <div className="privacy-thirdparty-section">
            <div className="privacy-thirdparty-table-wrapper">
              <table className="privacy-thirdparty-table">
                <thead>
                  <tr>
                    <th className="privacy-thirdparty-header" scope="col">제공받는 자</th>
                    <th className="privacy-thirdparty-header" scope="col">제공받는 자의 이용 목적</th>
                    <th className="privacy-thirdparty-header" scope="col">제공하는 개인정보 항목</th>
                    <th className="privacy-thirdparty-header" scope="col">제공받는 자의 보유기간</th>
                    <th className="privacy-thirdparty-header" scope="col">제공 근거</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="privacy-thirdparty-cell" scope="row">국가평생교육진흥원</th>
                    <td className="privacy-thirdparty-cell">
                      학점은행 사전보고, 성적보고, 평가 인정, 학점인정, 학위수여, 학습과목 평가인정에 관한 제반 업무처리 목적
                    </td>
                    <td className="privacy-thirdparty-cell">
                      (필수) 이름,주민등록번호(외국인등록증), 이메일주소, 휴대전화번호, 주소, 이메일주소, 성적, 학습과목 이수내역, 학력
                      <br />
                      *주민등록번호는 암호화하여 저장·관리·전달되며 법률이 정하는 목적 이외의 용도로는 절대 사용되지 않습니다.
                    </td>
                    <td className="privacy-thirdparty-cell">영구</td>
                    <td className="privacy-thirdparty-cell">
                      「학점인정 등에 관한 법률」제7조 제1항 및「학점인정 등에 관한 법률 시행규칙」 제4조
                    </td>
                  </tr>
                  <tr>
                    <th className="privacy-thirdparty-cell" scope="row">국세청</th>
                    <td className="privacy-thirdparty-cell">국세의 부과 및 징수, 환급</td>
                    <td className="privacy-thirdparty-cell">
                      이름/환급금액(신고금액)/주민등록번호
                      <br />
                      *주민등록번호는 암호화하여 저장·관리·전달되며 법률이 정하는 목적 이외의 용도로는 절대 사용되지 않습니다.
                    </td>
                    <td className="privacy-thirdparty-cell">
                      5년
                      <br />
                      *원천징수사무처리규정 제45조 및 국세청 기록관리기준표
                    </td>
                    <td className="privacy-thirdparty-cell">소득세법 제128조</td>
                  </tr>
                  <tr>
                    <th className="privacy-thirdparty-cell" scope="row">보훈처</th>
                    <td className="privacy-thirdparty-cell">학적현황 보고 및 국고 보조금 신청</td>
                    <td className="privacy-thirdparty-cell">
                      성명, 학번, 생년월일, 보훈번호, 학과, 성적, 신청학점, 수업료, 총이수학점, 수강과목
                    </td>
                    <td className="privacy-thirdparty-cell">
                      5년
                      <br />
                      (국가보훈처 보유기간에 따름)
                    </td>
                    <td className="privacy-thirdparty-cell">
                      국가유공자 등 예우 및 지원에 관한 법률, 국가유공자 등 예우 및 지원에 관한 법률 시행령
                    </td>
                  </tr>
                  <tr>
                    <th className="privacy-thirdparty-cell" scope="row">
                      남북하나재단,
                      <br />
                      북한이탈주민지원재단
                    </th>
                    <td className="privacy-thirdparty-cell">학적현황 보고 및 국고 보조금 신청</td>
                    <td className="privacy-thirdparty-cell">
                      성명, 학번, 생년월일, 학과, 성적, 신청학점, 수업료, 총이수학점, 수강료, 학력인정 증명서류, 수료증
                    </td>
                    <td className="privacy-thirdparty-cell">
                      5년
                      <br />
                      (남북하나재단 보유기간에 따름)
                    </td>
                    <td className="privacy-thirdparty-cell">통일부의 「북한이탈주민 교육지원 예규」</td>
                  </tr>
                  <tr>
                    <th className="privacy-thirdparty-cell" scope="row">국가평생교육진흥원, 교육부</th>
                    <td className="privacy-thirdparty-cell">본인실명확인, 자격검정, 자격증 교부</td>
                    <td className="privacy-thirdparty-cell">
                      성명, 주민등록번호, 주소, 전화번호, 최종학력(학교명, 전공, 입학 및 졸업시기, 학위등록번호), 이수기관(기관명, 이수기간)
                    </td>
                    <td className="privacy-thirdparty-cell">준영구</td>
                    <td className="privacy-thirdparty-cell">평생교육법 시행령 제20조, 평생교육법 시행규칙 제6조</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <h2 className="privacy-article-title-icons">
            제6조. 개인정보의 파기{" "}
            <span className="privacy-article-icons">
              <img src="/resources/images/footer/privacy/privacy-03.png" alt="개인정보의 처리 및 보유기간" className="privacy-article-icon" />
            </span>
            {" "}
            <span className="privacy-article-icons">
              <img src="/resources/images/footer/privacy/privacy-07.png" alt="개인정보의 처리 및 보유기간" className="privacy-article-icon" />
            </span>
          </h2>
          <ul style={{ marginTop: "16px", marginBottom: "24px" }}>
            <li className="page-list-plain">
              1. “회사”는 개인정보 보유기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </li>
            <li className="page-list-plain">
              2. 이용자로부터 동의를 받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스로 옮기거나 보관 장소를 달리하여 보존합니다.
            </li>
            <li className="page-list-plain">3. 관계법령에 의하여 개인정보를 일정 기간 보관해야 하는 대표적인 경우는 다음과 같습니다.</li>
          </ul>
          {/* 관계법령에 의한 개인정보 보관 테이블 */}
          <div className="privacy-retention-section">
            <div className="privacy-retention-table-wrapper">
              <table className="privacy-retention-table">
                <tbody>
                  <tr>
                    <th className="privacy-retention-cell" scope="row">표시, 광고에 관한 기록</th>
                    <td className="privacy-retention-cell">6개월</td>
                    <td className="privacy-retention-cell" rowSpan={4}>전자상거래등에서의 소비자 보호에 관한 법률</td>
                  </tr>
                  <tr>
                    <th className="privacy-retention-cell" scope="row">계약 또는 청약철회 등에 관한 기록</th>
                    <td className="privacy-retention-cell">5년</td>
                  </tr>
                  <tr>
                    <th className="privacy-retention-cell" scope="row">대금결제 및 재화 등의 공급에 관한 기록</th>
                    <td className="privacy-retention-cell">5년</td>
                  </tr>
                  <tr>
                    <th className="privacy-retention-cell" scope="row">소비자의 불만 또는 분쟁처리에 관한 기록</th>
                    <td className="privacy-retention-cell">3년</td>
                  </tr>
                  <tr>
                    <th className="privacy-retention-cell" scope="row">서비스 방문 기록</th>
                    <td className="privacy-retention-cell">3개월</td>
                    <td className="privacy-retention-cell">통신비밀보호법</td>
                  </tr>
                  <tr>
                    <th className="privacy-retention-cell" scope="row">원천징수사무처리를 위해 필요한 정보</th>
                    <td className="privacy-retention-cell">국세의 법정신고기한이 지난 날로부터 5년</td>
                    <td className="privacy-retention-cell">국세기본법 제85조의3</td>
                  </tr>
                  <tr>
                    <th className="privacy-retention-cell" scope="row">학습자 대장(학적부)</th>
                    <td className="privacy-retention-cell">영구</td>
                    <td className="privacy-retention-cell" rowSpan={4}>교육부고시 「평가인정 학습과정 운영지침」 [별표 2]</td>
                  </tr>
                  <tr>
                    <th className="privacy-retention-cell" scope="row">학습비 및 회계장부(학습자 결재내역, 환불정보 등)</th>
                    <td className="privacy-retention-cell">5년</td>
                  </tr>
                  <tr>
                    <th className="privacy-retention-cell" scope="row">출석 관련 서류(출석기록 및 접속 IP 등)</th>
                    <td className="privacy-retention-cell">5년</td>
                  </tr>
                  <tr>
                    <th className="privacy-retention-cell" scope="row">
                      성적표 및 성적근거자료(시험답안지, 과제물 등
                      <br />
                      평가요소별 성적근거자료, 각종 실습관련 서류)
                    </th>
                    <td className="privacy-retention-cell">
                      5년
                      <br />
                      (단, 보육실습생의 경우, 실습생 기록대장은 영구)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <ul style={{ marginTop: "4px", marginBottom: "24px" }}>
            <li className="page-list-plain">
              4. 개인정보 파기의 절차 및 방법은 다음과 같습니다.
              <br />
              1) 파기 절차: “회사”는 파기 사유가 발생한 개인정보를 선정하고, “회사”의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.
              <br />
              2) 파기 방법: “회사”는 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
            </li>
          </ul>
          <h2 className="privacy-article-title-icons">
            제7조. 개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항{" "}
            <span className="privacy-article-icons">
              <img src="/resources/images/footer/privacy/privacy-04.png" alt="개인정보의 처리 및 보유기간" className="privacy-article-icon" />
            </span>
          </h2>
          <ul style={{ marginTop: "16px", marginBottom: "24px" }}>
            <li className="page-list-plain">
              1.“회사”는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 ‘쿠키(cookie)’를 사용합니다.
              <br />
            </li>
            <li className="page-list-plain">
              2. 쿠키는 웹사이트를 운영하는 데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터 내의 하드디스크에 저장되기도 합니다.
              <br />
              &nbsp;1) 쿠키의 사용 목적
              <br />
              이용자의 접속빈도나 방문시간 등을 파악하여 이용자에게 보다 편리한 서비스를 제공하기 위해 사용됩니다.
              <br />
              &nbsp;2) 쿠키 설치·운영 및 거부
              <br />
              브라우저 옵션 설정을 통해 쿠키 허용, 쿠키 차단 등의 설정을 할 수 있습니다.
              <br />
              &nbsp;&nbsp;- Internet Explorer : 웹브라우저 우측 상단의 도구 메뉴 &gt; 인터넷 옵션 &gt; 개인정보 &gt; 설정 &gt; 고급{" "}
              <br />
              &nbsp;&nbsp;- Edge: 웹브라우저 우측 상단의 설정 메뉴 &gt; 쿠키 및 사이트 권한 &gt; 쿠키 및 사이트 데이터 관리 및 삭제
              <br />
              &nbsp;&nbsp;- Chrome: 웹브라우저 우측 상단의 설정 메뉴 &gt; 개인정보 및 보안 &gt; 쿠키 및 기타 사이트 데이터
              <br />
            </li>
            <li className="page-list-plain">3.쿠키 저장을 거부할 경우 서비스 이용에 어려움이 발생할 수 있습니다.</li>
          </ul>
          <h2 className="privacy-article-title-icons">
            제8조. 이용자와 법정대리인의 권리 · 의무 및 행사 방법{" "}
            <span className="privacy-article-icons">
              <img src="/resources/images/footer/privacy/privacy-08.png" alt="개인정보의 처리 및 보유기간" className="privacy-article-icon" />
            </span>
          </h2>
          <ul style={{ marginTop: "16px", marginBottom: "24px" }}>
            <li className="page-list-plain">
              1. 이용자는 “회사”에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
            </li>
            <li className="page-list-plain">
              2. 권리행사는 “회사”에 대해 「개인정보 보호법」시행령에 따라 서면, 전자우편, 모사전송 등을 통하여 할 수 있으며, “회사”는 이에 대해 조치하겠습니다.
            </li>
            <li className="page-list-plain">
              3.권리행사는 이용자의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수도 있습니다. 이 경우 위임장을 제출하셔야 합니다.
            </li>
            <li className="page-list-plain">4. 개인정보 열람 및 처리정지 요구는 「개인정보 보호법」에 의하여 이용자의 권리가 제한될 수 있습니다.</li>
            <li className="page-list-plain">
              5. 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.
            </li>
            <li className="page-list-plain">
              6. “회사”는 이용자 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리 정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.
            </li>
          </ul>
          <h2 className="privacy-article-title-icons">
            제9조. 개인정보보호를 위한 대책 수립{" "}
            <span className="privacy-article-icons">
              <img src="/resources/images/footer/privacy/privacy-09.png" alt="개인정보의 처리 및 보유기간" className="privacy-article-icon" />
            </span>
          </h2>
          {/* 개인정보보호를 위한 기술적, 관리적, 물리적 조치 테이블 */}
          <div className="privacy-protection-section">
            <div className="privacy-protection-table-wrapper">
              <table className="privacy-protection-table">
                <caption>개인정보보호를 위한 기술적, 관리적, 물리적 조치에 대한 설명</caption>
                <thead>
                  <tr>
                    <th className="privacy-protection-header" scope="col">기술적 조치</th>
                    <th className="privacy-protection-header" scope="col">관리적 조치</th>
                    <th className="privacy-protection-header" scope="col">물리 조치</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="privacy-protection-cell">
                      <ul>
                        <li className="page-list-clasic">개인정보처리시스템 등의 접근권한 관리</li>
                        <li className="page-list-clasic">접근통제시스템 설치</li>
                        <li className="page-list-clasic">비밀번호 일방향 암호화 적용보안프로그램 설치 및 주기적 업데이트 관리</li>
                        <li className="page-list-clasic">개인정보의 안전한 전송을 위한 SSL 적용</li>
                      </ul>
                    </td>
                    <td className="privacy-protection-cell">
                      <ul>
                        <li className="page-list-clasic">내부관리 계획의 수립 및 시행개인정보 취급자에 대한 정기적 교육 및 보안서약서 징구</li>
                        <li className="page-list-clasic">접근권한의 차등적 관리 및 접근권한 부여 내역의 보관</li>
                      </ul>
                    </td>
                    <td className="privacy-protection-cell">
                      <ul>
                        <li className="page-list-clasic">보안카드 운영에 따른 개인정보취급자 이외의 자에 대한 물리적 접근통제</li>
                        <li className="page-list-clasic">개인정보 출력물의 잠금 장치 보관</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <h2 className="privacy-article-title-icons">
            제10조. 개인정보보호책임자 및 개인정보 열람청구{" "}
            <span className="privacy-article-icons">
              <img src="/resources/images/footer/privacy/privacy-10.png" alt="개인정보의 처리 및 보유기간" className="privacy-article-icon" />
            </span>
          </h2>
          <ul style={{ marginTop: "16px", marginBottom: "24px" }}>
            <li className="page-list-plain">
              1. “회사”는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다.
            </li>
            <li className="page-list-plain">
              2. 이용자는 「개인정보 보호법」에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다. “회사”는 이용자의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.
            </li>
          </ul>
          {/* 개인정보보호책임자 및 담당부서 테이블 */}
          <div className="privacy-officer-section">
            <div className="privacy-officer-table-wrapper">
              <table className="privacy-officer-table">
                <caption>개인정보보호책임자 및 담당자의 정보와 개인정보침해에 대한 신고나 상담 기관 안내</caption>
                <thead>
                  <tr>
                    <th className="privacy-officer-header" scope="col">개인정보보호책임자</th>
                    <th className="privacy-officer-header" scope="col">개인정보보호담당부서</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="privacy-officer-cell">
                      <ul>
                        <li className="page-list-clasic">성 명: 양병웅</li>
                        <li className="page-list-clasic">전화번호: {SUPPORT_PHONE}</li>
                        <li className="page-list-clasic">
                          전자우편:{" "}
                          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                        </li>
                      </ul>
                    </td>
                    <td className="privacy-officer-cell">
                      <ul>
                        <li className="page-list-clasic">담 당: 학사운영팀</li>
                        <li className="page-list-clasic">전화번호: {SUPPORT_PHONE}</li>
                        <li className="page-list-clasic">
                          전자우편:{" "}
                          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <ul style={{ marginBottom: "24px" }}>
            <li className="page-list-plain">
              3. 이용자는 “회사”의 서비스(또는 사업)를 이용하시면서 발생한 모든 개인정보보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의할 수 있습니다. “회사”는 정보 주체의 문의에 대해 답변 및 처리해드릴 것입니다.
            </li>
          </ul>
          <h2 className="privacy-article-title-icons">
            제11조. 권익침해 구제방법{" "}
            <span className="privacy-article-icons">
              <img src="/resources/images/footer/privacy/privacy-09.png" alt="개인정보의 처리 및 보유기간" className="privacy-article-icon" />
            </span>
          </h2>
          <ul style={{ marginTop: "16px", marginBottom: "24px" }}>
            <li className="page-list-plain">
              이용자는 개인정보 침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타 개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.
            </li>
            <li className="page-list-plain">1) 개인정보분쟁조정위원회: 1833-6279 (www.kopico.go.kr)</li>
            <li className="page-list-plain">2) 개인정보침해신고센터: 국번없이 118 (http://privacy.kisa.or.kr)</li>
            <li className="page-list-plain">3) 대검찰청 사이버수사과: 국번없이 1301 (www.spo.go.kr)</li>
            <li className="page-list-plain">4) 경찰청 사이버수사국: 국번없이 182 (https://ecrm.police.go.kr)</li>
          </ul>
          <h2 className="privacy-article-title-icons">[ 부 칙 ]</h2>
          <ul style={{ marginTop: "16px", marginBottom: "24px" }}>
            <li className="page-list-plain">
              • 본 개인정보처리방침의 내용은 법령개정, 관련 기관의 세부기준 변경, 기술수준 변동 등의 사정에 의하여 개정될 수 있으며, 개정 시 &quot;웹사이트&quot;를 통해 사전 공지합니다. 단, 관계 법령에 따라 필요한 경우 사전 공지와 함께 고객의 별도 동의를 받을 수 있으며, 이 경우 동의한 자에 한하여 개정된 개인정보처리방침이 적용 됩니다.
            </li>
            <li className="page-list-plain">• 본 개인정보처리방침은 2023년 9월 11일 부터 적용됩니다.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
