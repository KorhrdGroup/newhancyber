import type { Metadata } from "next";
import RequirementsTabs, { RequirementsSubTabs } from "@/components/social-worker/RequirementsTabs";

export const metadata: Metadata = { title: "급수별 자격요건" };

const qualification = (
  <>
    <div className="container">
      {/* 여기에 컨텐츠 추가 */}
      <h1 className="page-title">
        사회복지사 자격안내
      </h1>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <table className="page-table qualification-table">
          <thead>
            <tr>
              <th>
                자격등급
              </th>
              <th>
                자격기준
              </th>
              <th>
                자격발급
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                사회복지사 1급
              </td>
              <td>
                「사회복지사법」 제11조제3항에 따라 국가시험에 합격한 자
              </td>
              <td>
                보건복지부
              </td>
            </tr>
            <tr>
              <td>
                사회복지사 2급
              </td>
              <td>
                대학원, 대학, 전문대학 등을 통하여 사회복지사업법 시행령에 규정된 소정의 과목을 이수한 사람
              </td>
              <td>
                보건복지부
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul className="page-list" style={{ marginTop: "10px" }}>
        <li className="page-list-dangu" style={{ marginTop: "10px" }}>
          사회복지사 자격증: 국가자격증 (발급처: 한국사회복지사협회 자격관리센터)
        </li>
      </ul>
    </div>
    <div className="container">
      <h1 className="page-title">
        사회복지사자격증 신청절차
      </h1>
      <img src="/resources/images/social-worker/social-wooker01.png" alt="사회복지사자격증 신청절차" className="page-image" />
      <ul className="page-list" style={{ marginTop: "10px" }}>
        <li className="page-list-plain" style={{ marginTop: "10px" }}>
          (1) 자택이나 직장이 위치한 지역에 따라 지방협회를 선정
        </li>
        <li className="page-list-plain">
          (2) 해당지방협회로 구비 서류를 우편발송 또는 직접 방문하여 제출
        </li>
        <li className="page-list-plain">
          (3) 해당 지방 협회 계좌번호로 사회복지사 자격증 발급 수수로 (1만원)을 입금
        </li>
        <li className="page-list-plain">
          (4) 자격 심사 후 신청서에 기입한 주소지로 등기 발송된 자격증을 수령
        </li>
        <li className="page-list-dangu">
          제출하신 서류를 심사한 후 자격이 인정될 경우에만 자격증이 교부됩니다. 신원조회 또는 사실조회 실시 후 부적격자는 사안에 따라 자격증 교부취소 또는 무효처분을 받습니다.
        </li>
        <li className="page-list-dangu">
          민원처리기간: 사회복지사업법시행규칙 제4조에 한함 (7일 소요, 단 졸업 후 단체교부 시 지연될 수 있으니 양해해주시기 바랍니다.)
        </li>
      </ul>
    </div>
  </>
);

const level2 = (
  <>
    <div className="container">
      <h1 className="page-title">
        사회복지사 2급 취득 절차
      </h1>
      <img src="/resources/images/social-worker/social-wooker02.png" alt="사회복지사 2급 취득 절차" className="page-image" />
    </div>
    <div className="container">
      <h1 className="page-title">
        교과목 이수기준
      </h1>
      <ul className="page-list" style={{ marginTop: "10px" }}>
        <li className="page-list-plain" style={{ marginTop: "10px" }}>
          「사회복지사업법 시행규칙」 일부 개정에 따라 2020년 1월 1일부터 사회복지관련 교과목 이수학점 상향 조정 및 현장실습이 확대 되었습니다. 아래 해당되는 기준에 맞추어 교과목을 이수해야 자격취득이 가능합니다.
        </li>
      </ul>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <table className="page-table law-comparison-table">
          <thead>
            <tr>
              <th>
                개정법 적용자(2020.01.01 이후)
              </th>
              <th>
                종전법 적용자(2020.01.01 이전)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                - 2020년 1월 1일 이후 대학 전문대학 입학생
                <br />
                {" "}- 2020년 1월 1일 이후 평생학습과정(학점은행제, 시간제 등)으로 사회복지사 관련 교과목을 처음 이수하는 자
              </td>
              <td>
                - 2020년 1월 1일 이전 사회복지사 관련 1과목이라도 시작한 자
                <br />
                {" "}
                <span className="table-note">
                  *단, 실습을 2020년 1월 1일 이후 진행할 경우 실습 장소 선택은 개정 규정에 따라야 함
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div className="container">
      {/* 여기에 컨텐츠 추가 */}
      <h1 className="page-title">
        이수과목 수
      </h1>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <table className="page-table subject-count-table">
          <thead>
            <tr>
              <th>
                개정법
              </th>
              <th>
                종전법
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                필수 10과목, 선택 7과목
                <br />
                {" "}(총 17과목)
              </td>
              <td>
                필수 10과목, 선택 4과목
                <br />
                {" "}(총 14과목)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul className="page-list" style={{ marginTop: "10px" }}>
        <li className="page-list-dangu">
          비고: 교과목의 명칭이 동일하지 아니하더라도 교과의 내용이 동일하다고 보건복지부 장관이 인정하는 경우에는 동일 교과목으로 본다.
        </li>
      </ul>
    </div>
    <div className="container">
      {/* 여기에 컨텐츠 추가 */}
      <h1 className="page-title">
        사회복지 현장실습
      </h1>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <table className="page-table practice-table">
          <thead>
            <tr>
              <th>
                구분
              </th>
              <th>
                개정법(2020.01.01. 이후)
              </th>
              <th>
                종전법(2020.01.01. 이전)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                기관실습시간
              </td>
              <td>
                160시간
              </td>
              <td>
                120시간
              </td>
            </tr>
            <tr>
              <td rowSpan={2}>
                기관실습실시기관 선정
              </td>
              <td colSpan={2}>
                선정필요
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                (선정기준)
                <br />
                보건복지부장관으로부터 선정되어야 함
              </td>
            </tr>
            <tr>
              <td>
                실습 세미나
              </td>
              <td>
                30시간
                <br />
                {" "}1회당×2시간x총15회
              </td>
              <td>
                30시간
                <br />
                {" "}1회당×2시간x총15회
                <br />
                {" "}
                <span>
                  * 종전법은 세미나 기관에 따라 실시여부 달라짐
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul className="page-list" style={{ marginTop: "10px" }}>
        <li className="page-list-dangu">
          2020년부터 사회복지현장실습 과목을 이수하는 모든 학생은 지정된 기관에서 실습을 진행해야 함
        </li>
        <li className="page-list-dangu">
          실습세미나란? 사회복지시설 등 현장에서 이루어지는 기관실습에서 자신의 경험을 학교에서 실습 지도교수 및 동료들과 서로 공유하면서 자신의 사회복지실천을 점검하고
          <br />
          {" "}발전시키는 세미나 형식의 수업
        </li>
        <li className="page-list-dangu">
          정보통신망을 이용한 온라인 교육을 실시하는 교육기관의 실습 세미나에는 대면 방식의 세미나가 총 3회 이상 포함되어야 함
        </li>
      </ul>
    </div>
  </>
);

const level1Qualification = (
  <>
    <div className="container">
      <h1 className="page-title">
        사회복지 현장실습
      </h1>
      <img src="/resources/images/social-worker/social-wooker03.png" alt="사회복지 현장실습" className="page-image" />
      <ul className="page-list" style={{ marginTop: "10px" }}>
        <li className="page-list-plain">
          관련법령: 사회복지사업법시행령 제4조관련
        </li>
        <br />
        <li className="page-list-plain">
          가. 「고등교육법」에 따른 대학원에서 사회복지학 또는 사회사업학을 전공하고 석사학위 또는 박사학위를 취득한 자. 다만, 대학에서 사회복지학 또는 사회사업학을 전공하지 아니하고 동 석사학위를 취득한 자는 보건복지부령이 정하는{" "}
          <span className="text-red">
            사회복지학&nbsp;전공교과목과&nbsp;사회복지관련 교과목 중 사회복지현장실습을 포함한(2004.7.31 이후 입학생부터 해당)
          </span>
          {" "}필수과목 6과목 이상(대학에서 이수한 교과목을 포함하되, 대학원에서 4과목 이상을 이수하여햐 한다)과 선택과목 2과목 이상을 각각 이수하여야 한다.
        </li>
        <br />
        <li className="page-list-plain">
          나. 「고등교육법」에 따른 대학에서{" "}
          <span className="text-red">
            보건복지부령이 정하는 사회복지학 전공교과목과 사회복지관련 교과목을 이수하고 학사학위를 취득한 자
          </span>
        </li>
        <br />
        <li className="page-list-plain">
          다. 법령에서 「고등교육법」에 따른{" "}
          <span className="text-red">
            대학을 졸업한 자와 동등 이상의 학력
          </span>
          이 있다고 인정하는 자로서{" "}
          <span className="text-red">
            보건복지부령이 정하는 사회복지학 전공교과목과 사회복지관련 교과목을 이수한 자
          </span>
        </li>
        <br />
        <li className="page-list-plain">
          라. 외국의 대학 또는 대학원에서 사회복지학 또는 사회사업학을 전공하고 학사학위 이상을 취득한 자로서 상기 가호 및 나호의 자격과 동등하다고 보건복지부장관이 인정하는 자
        </li>
        <br />
        <li className="page-list-plain">
          마. 다음 어느 하나에 해당하여{" "}
          <span className="text-red">
            사회복지사2급 자격증을 취득한 자 중에서 그 자격증을 취득한 날부터 시험일까지의 기간 동안
          </span>
          {" "}1년 이상 ※사회복지 사업의 실무경험이 있는 자
        </li>
        <br />
        <li className="page-list-plain">
          ① 「고등교육법」에 따른 전문대학에서 보건복지부령이 정하는 사회복지학 전공교과목과 사회복지관련 교과목을 이수하고 졸업한 자
        </li>
        <li className="page-list-plain">
          ② 법령에서 「고등교육법」에 따른 전문대학을 졸업한 자와 동등 이상의 학력이 있다고 인정하는 자로서 보건복지부령이 정하는 사회복지학 전공교과목과 사회복지관련 교과목을 이수한 자
        </li>
        <li className="page-list-plain">
          ③ 「고등교육법」에 따른 대학을 졸업(이와 동등 이상의 학력이 있는 경우 포함)한 이후 보건복지부장관이 지정하는 교육훈련기관에서 12주 이상의 사회복지사업에 관한 교육훈련을 이수한 자
        </li>
        <li className="page-list-plain">
          ④ 종전의 「사회복지사업법」 (법률 제14923호로 개정되기 전의 것을 말한다)에 따라 사회복지사 3급 자격증을 취득한 이후 3년 이상 사회복지사업의 실무경험이 있는 자
        </li>
        <br />
        <li className="page-list-dangu">
          사회복지사 실무경력 인정
        </li>
        <li className="page-list-plain">
          - 사회복지사 경력인정은 「사회복지사업법」 제2조제1호 각 목의 법률에 따라 “사회복지사업법”을 행할 목적으로 신고된 시설에서 사회복지사 직종으로 근무한 경력을 인정함. 동법에 따라 신고된 시설이 아닌 곳에서 근무할 경우, 경력증명서 상 직종이 “사회복지사”이거나 또는 채용 시 사회복지사 자격증이 필수 자격이었다는 것을 확인할 수 있는 공고문과 해당 기관의 공문 필요(해당 서류를 통해 추가 심사 진행)
        </li>
        <li className="page-list-plain">
          - 공무원 또는 사단법인 재직 및 경력자의 경우 [한국사회복지사협회 자격관리센터 일대일 문의]를 통해 해당 경력인정 별도 문의 필요
        </li>
        <li className="page-list-dangu">
          공무원 또는 사단법인 재직 및 경력자의 경우 해당 경력인정 별도 문의 필요
        </li>
        <li className="page-list-dangu">
          직장체험연수, 시설관리, 운전직, 조리원, 영양사, 운전사, 위생원, 배차원, 간병사 등 기능직종의 경력은 인정 불가
        </li>
        <li className="page-list-dangu">
          별도의 자격증 소지자가 해당 직종의 정원으로 근무한 경력은 인정 불가 (청소년지도사, 청소년상담사, 간호사, 간호조무사, 물리치료사, 보육교사, 수화통역사, 영양사, 요양보호사, 의사, 조산사, 직업재활사, 치과의사, 한의사 등)
        </li>
      </ul>
    </div>
  </>
);

const level1ExamDocuments = (
  <>
    <div className="container">
      {/* 여기에 컨텐츠 추가 */}
      <h1 className="page-title">
        시험과목
      </h1>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <table className="page-table exam-subject-table">
          <thead>
            <tr>
              <th>
                영역
              </th>
              <th>
                과목
              </th>
              <th>
                문항
              </th>
              <th>
                시험시간
              </th>
              <th>
                시험방법
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                사회복지기초
              </td>
              <td>
                인간행동과사회환경, 사회복지조사론
              </td>
              <td>
                50문항
              </td>
              <td>
                09:30~10:20 (50분)
              </td>
              <td rowSpan={3}>
                객관식 5지 선택형
                <br />
                (영역별 25문항 총 200문항)
              </td>
            </tr>
            <tr>
              <td>
                사회복지실천
              </td>
              <td>
                사회복지실천론, 사회복지실천기술론, 지역사회복지론
              </td>
              <td>
                75문항
              </td>
              <td>
                10:50~12:05 (75분)
              </td>
            </tr>
            <tr>
              <td>
                사회복지정책과제도
              </td>
              <td>
                사회복지정책론, 사회복지행정론, 사회복지법제론
              </td>
              <td>
                75문항
              </td>
              <td>
                12:35~13:50 (75분)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul className="page-list" style={{ marginTop: "10px" }}>
        <li className="page-list-dangu">
          매 과목 만점의 40% 이상, 전 과목 총점의 60% 이상 득점한 자를 합격예정자로 결정
        </li>
        <li className="page-list-dangu">
          사회복지사 1급 국가시험 합격예정자에 대해서는 한국사회복지사협회에서 응시자격 서류심사를 실시하며, 심사결과 부적격 사유에 해당되거나, 응시자격 서류를 정해진 기한 내에 제출하지 않은 경우 최종 불합격 처리
        </li>
        <li className="page-list-dangu">
          최종 합격자 발표 후라도 제출된 서류 등의 기재사항이 사실과 다르거나 응시자격 부적격 사유가 발견될 때는 합격을 취소함
        </li>
      </ul>
    </div>
  </>
);

// 원본에서 서브 탭 패널 밖(1급 탭 안)에 있어 서브 탭과 관계없이 항상 보이는 블록
const level1Documents = (
  <>
    <div className="container">
      {/* 여기에 컨텐츠 추가 */}
      <h1 className="page-title">
        제출서류
      </h1>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <table className="page-table document-submission-table">
          <thead>
            <tr>
              <th>
                구분
              </th>
              <th>
                제출서류
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                공통서류
              </td>
              <td>
                - 응시자격 서류심사 신청서 1부
                <br />
                {" "}- 응시 수수료 (25,000원)
              </td>
            </tr>
            <tr>
              <td>
                대학원, 대학교 졸업자
              </td>
              <td>
                - 대학원 학위수여증명서 1부
                <br />
                {" "}- 최종학력 졸업증명서 1부
                <br />
                {" "}- 성적증명서 1부
                <br />
                {" "}- 사회복지현장실습 확인서 1부
              </td>
            </tr>
            <tr>
              <td>
                전문대학 졸업자
              </td>
              <td>
                - 성적증명서 1부
                <br />
                {" "}- 졸업증명서 1부
                <br />
                {" "}- 사회복지현장실습 확인서 1부
              </td>
            </tr>
            <tr>
              <td>
                양성교육 수료자
              </td>
              <td>
                - 수료증 사본 1부
                <br />
                {" "}- 재직증명서 또는 경력증명서 1부
                <br />
                {" "}- 사회복지현장실습 확인서 1부
              </td>
            </tr>
            <tr>
              <td>
                외국대학 졸업자
              </td>
              <td>
                - 졸업증명서(학위증), 성적증명서 각 1부
                <br />
                {" "}
                <span className="table-note">
                  * 원본을 한국어로 번역하여 해당 국가 주재 공관에서 확인 후 공증한 서류를 첨부하여야 하며, 원본 제출이 어려운 경우에는 원본과 대조 후 공증한 사본을 제출하여야 함
                </span>
                <br />
                {" "}- 학력인정확인서 또는 아포스티유 1부
                <br />
                {" "}
                <span className="table-note">
                  * 아포스티유는 아포스티유 협약 가입국만 발급 가능
                </span>
                <br />
                {" "}
                <span className="table-note">
                  * 원본을 한국어로 번역하여 해당 국가 주재 공관에서 확인 후 공증한 서류를 첨부하여야 함
                </span>
                <br />
                {" "}- 출입국사실증명서 1부
                <br />
                {" "}- 사회복지현장실습 확인서 1부
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </>
);

/** 원본 social-worker/requirements.html */
export default function SocialWorkerRequirementsPage() {
  return (
    <main className="wrapper">
      <RequirementsTabs
        panels={[
          { key: "qualification", label: "사회복지사 자격", content: qualification },
          { key: "level2", label: "사회복지사 2급", content: level2 },
          {
            key: "level1",
            label: "사회복지사 1급",
            content: (
              <>
                <RequirementsSubTabs
                  panels={[
                    { key: "qualification", label: "응시자격", content: level1Qualification },
                    { key: "exam-documents", label: "시험과목/제출서류", content: level1ExamDocuments },
                  ]}
                />
                {level1Documents}
              </>
            ),
          },
        ]}
      />
    </main>
  );
}
