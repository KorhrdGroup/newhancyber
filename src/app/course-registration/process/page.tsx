import type { Metadata } from "next";

export const metadata: Metadata = { title: "수강신청 절차" };

export default function CourseProcessPage() {
  return (
    <main className="wrapper">
      <div className="container">
        <h1 className="page-title">
          수강신청 절차
        </h1>
        <div className="content-section">
          {/* STEP 1 */}
          <div className="process-step">
            <div className="process-step-content">
              <div className="process-step-text">
                <h2 className="process-step-title">
                  STEP 1 회원가입
                </h2>
                <p className="process-step-description">
                  수강신청을 하기 위해서는 홈페이지 메인페이지 우측 상단 [회원가입]을 클릭하신 후 이용약관에 동의하셔야 합니다. 그 후, 회원정보를 입력하시면 회원가입이 완료됩니다.
                </p>
              </div>
              <div className="process-step-icon">
                <img src="/resources/images/course-registration/process-01.png" alt="회원가입" />
              </div>
            </div>
          </div>
          {/* 구분선 */}
          <div className="process-divider">
            <img src="/resources/images/course-registration/wrapper_divider.png" alt="구분선" />
          </div>
          {/* STEP 2 */}
          <div className="process-step">
            <div className="process-step-content">
              <div className="process-step-text">
                <h2 className="process-step-title">
                  STEP 2 로그인
                </h2>
                <p className="process-step-description">
                  회원가입 시 생성된 아이디와 비밀번호를 입력하여 로그인합니다.
                  <br />
                  {" "}* 수강신청 이후 학습을 위해서는 나의강의실에 입장하셔야 합니다.
                </p>
              </div>
              <div className="process-step-icon">
                <img src="/resources/images/course-registration/process-02.png" alt="회원가입" />
              </div>
            </div>
          </div>
          {/* 구분선 */}
          <div className="process-divider">
            <img src="/resources/images/course-registration/wrapper_divider.png" alt="구분선" />
          </div>
          {/* STEP 3 */}
          <div className="process-step">
            <div className="process-step-content">
              <div className="process-step-text">
                <h2 className="process-step-title">
                  STEP 3 학습설계
                </h2>
                <p className="process-step-description">
                  학점은행제를 이용한 학위 취득에 필요한 기간과, 어떠한 과목 및 자격증을 이수(취득) 해야 하는지 나에게 딱 맞는 학습설계를 해드립니다.
                </p>
              </div>
              <div className="process-step-icon">
                <img src="/resources/images/course-registration/process-03.png" alt="회원가입" />
              </div>
            </div>
          </div>
          {/* 구분선 */}
          <div className="process-divider">
            <img src="/resources/images/course-registration/wrapper_divider.png" alt="구분선" />
          </div>
          {/* STEP 4 */}
          <div className="process-step">
            <div className="process-step-content">
              <div className="process-step-text">
                <h2 className="process-step-title">
                  STEP 4 수강신청
                </h2>
                <p className="process-step-description">
                  수강신청 메뉴에서 수강신청 가능한 강좌리스트를 확인하실 수 있습니다. 과목의 강의내용 및 강의 샘플보기를 확인하신 후, 수강신청 버튼을 통해 수강신청을 하시기 바랍니다.
                </p>
              </div>
              <div className="process-step-icon">
                <img src="/resources/images/course-registration/process-04.png" alt="회원가입" />
              </div>
            </div>
          </div>
          {/* 구분선 */}
          <div className="process-divider">
            <img src="/resources/images/course-registration/wrapper_divider.png" alt="구분선" />
          </div>
          {/* STEP 5 */}
          <div className="process-step">
            <div className="process-step-content">
              <div className="process-step-text">
                <h2 className="process-step-title">
                  STEP 5 수강료 결제
                </h2>
                <p className="process-step-description">
                  수강신청 접수하신 과목의 수강료를 결제 하시면 수강신청 절차가 완료됩니다. 수강료는 카드, 실시간 계좌이체, 무통장 입금(가상계좌) 등의 결제 방법 중 하나를 선택하셔서 결제(납부) 해주시면 됩니다.
                </p>
              </div>
              <div className="process-step-icon">
                <img src="/resources/images/course-registration/process-05.png" alt="회원가입" />
              </div>
            </div>
          </div>
          {/* 구분선 */}
          <div className="process-divider">
            <img src="/resources/images/course-registration/wrapper_divider.png" alt="구분선" />
          </div>
          {/* STEP 6 */}
          <div className="process-step">
            <div className="process-step-content">
              <div className="process-step-text">
                <h2 className="process-step-title">
                  STEP 6 수강승인
                </h2>
                <p className="process-step-description">
                  결제를 완료 하신 후 [나의강의실 - 결제내역]에서 내가 수강 신청한 과목의 수강정보를 확인 하실 수 있습니다. 결제방법 중 카드결제를 이용하여 결제하신 경우에는 바로 수강 승인이 되지만 무통장입금(가상계좌)인 경우에는 관리자의 승인이 이루어진 후에 개강일로부터 학습이 이루어집니다.
                </p>
              </div>
              <div className="process-step-icon">
                <img src="/resources/images/course-registration/process-06.png" alt="회원가입" />
              </div>
            </div>
          </div>
          {/* 구분선 */}
          <div className="process-divider">
            <img src="/resources/images/course-registration/wrapper_divider.png" alt="구분선" />
          </div>
          {/* STEP 7 */}
          <div className="process-step">
            <div className="process-step-content">
              <div className="process-step-text">
                <h2 className="process-step-title">
                  STEP 7 개강
                </h2>
                <p className="process-step-description">
                  수강승인이 완료된 학습자께서는 개강일부터 수강 신청한 과목의 학습이 가능합니다. 회원정보가 제대로 등록되어있는지 체크해 주시고, 공지사항은 접속 시마다 반드시 확인하시기 바랍니다.
                </p>
              </div>
              <div className="process-step-icon">
                <img src="/resources/images/course-registration/process-07.png" alt="회원가입" />
              </div>
            </div>
          </div>
          {/* 구분선 */}
          <div className="process-divider">
            <img src="/resources/images/course-registration/wrapper_divider.png" alt="구분선" />
          </div>
          {/* STEP 8 */}
          <div className="process-step">
            <div className="process-step-content">
              <div className="process-step-text">
                <h2 className="process-step-title">
                  STEP 8 학습
                </h2>
                <p className="process-step-description">
                  학습은 나의 강의실에서 하실 수 있습니다. 로그인을 하신 후 [나의강의실]에서 확인하시기 바랍니다.
                </p>
              </div>
              <div className="process-step-icon">
                <img src="/resources/images/course-registration/process-08.png" alt="회원가입" />
              </div>
            </div>
          </div>
          {/* 구분선 */}
          <div className="process-divider">
            <img src="/resources/images/course-registration/wrapper_divider.png" alt="구분선" />
          </div>
          {/* STEP 9 */}
          <div className="process-step">
            <div className="process-step-content">
              <div className="process-step-text">
                <h2 className="process-step-title">
                  STEP 9 종강
                </h2>
                <p className="process-step-description">
                  15주간의 학습이 종료되면 과목이 종강됩니다. 종강일 이전에 마치셔야 하는 부분을 확인해서 완료하시기 바랍니다. 최종성적은 기말고사 응시 후 강의평가를 마치면 확인 하실 수 있습니다.
                </p>
              </div>
              <div className="process-step-icon">
                <img src="/resources/images/course-registration/process-09.png" alt="회원가입" />
              </div>
            </div>
          </div>
          {/* 구분선 */}
          <div className="process-divider">
            <img src="/resources/images/course-registration/wrapper_divider.png" alt="구분선" />
          </div>
          {/* STEP 10 */}
          <div className="process-step">
            <div className="process-step-content">
              <div className="process-step-text">
                <h2 className="process-step-title">
                  STEP 10 학점인정 신청
                </h2>
                <p className="process-step-description">
                  수료조건을 모두 충족하면 종강 이후 1, 4, 7, 10월에 국가평생교육진흥원 학점은행센터에 학점인정 신청을 할 수 있습니다.
                </p>
              </div>
              <div className="process-step-icon">
                <img src="/resources/images/course-registration/process-10.png" alt="회원가입" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
