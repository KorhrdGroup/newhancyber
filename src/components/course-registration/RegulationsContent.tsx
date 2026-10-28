"use client";

import { importantStyle } from "@/lib/importantStyle";
import { importantStyles } from "@/lib/importantStyle";

/** 원본 regulations.html 본문. 인라인 !important 스타일(ref)을 쓰려고 클라이언트 컴포넌트로 둔다. */
export default function RegulationsContent() {
  return (
    <main className="wrapper">
      <div className="container">
        <h1 className="page-title">
          수료기준
        </h1>
        <table className="regulations-table">
          <thead>
            <tr>
              <th>
                과정
              </th>
              <th>
                총점
              </th>
              <th>
                출석률
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td ref={importantStyle("font-size", "12px")}>
                일반과정
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                총점 60점 이상
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                출석률 80% 이상
              </td>
            </tr>
            <tr>
              <td ref={importantStyle("font-size", "12px")}>
                사회복지현장실습
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                총점 60점 이상
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                온라인 수업 출석률 80% 이상,
                <br />
                {" "}오프라인 수업 100% 이수
              </td>
            </tr>
          </tbody>
        </table>
        <h1 className="page-title" style={{ margin: "30px 0 30px 0" }}>
          과정별 평가항목 및 비율
        </h1>
        <h1 className="page-title" style={{ fontWeight: "600" }}>
          일반과정
        </h1>
        <table className="grade-breakdown-table">
          <thead>
            <tr>
              <th>
                온라인 출석
              </th>
              <th>
                중간고사
              </th>
              <th>
                기말고사
              </th>
              <th>
                과제
              </th>
              <th>
                토론
              </th>
              <th>
                퀴즈
              </th>
              <th>
                수업참여도
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td ref={importantStyle("font-size", "12px")}>
                15%
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                30%
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                30%
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                15%
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                5%
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                3%
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                2%
              </td>
            </tr>
          </tbody>
        </table>
        <ul className="page-list">
          <li className="page-list-plain">
            터치되는 노트북 시험 불가
          </li>
          <li className="page-list-plain">
            태블릿 PC 시험 불가
          </li>
          <li className="page-list-plain">
            데스크탑 PC로만 시험 응시 가능
          </li>
        </ul>
        <h1 className="page-title" style={{ fontWeight: "600" }}>
          사회복지사현장실습
        </h1>
        <table className="grade-breakdown-table">
          <thead>
            <tr>
              <th>
                출결(온/오)
              </th>
              <th>
                과제물
              </th>
              <th>
                기관실습평가서
              </th>
              <th>
                실습일지
              </th>
              <th>
                학습계획서
              </th>
              <th>
                방문지도교수평가
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td ref={importantStyle("font-size", "12px")}>
                15%
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                10%
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                50%
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                15%
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                5%
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                5%
              </td>
            </tr>
          </tbody>
        </table>
        <ul className="page-list">
          <li className="page-list-plain">
            퀴즈 . 중간/기말 시험X
          </li>
        </ul>
      </div>
      <div className="container">
        <h1 className="page-title">
          평가방법
        </h1>
        <ul className="page-list" ref={importantStyles({ "margin-bottom": "10px", "margin-top": "10px" })}>
          <li className="page-list-item">
            각 평가항목별 참여(응시)기간이 별도 지정되어 있습니다.
          </li>
          <li className="page-list-item">
            각 학습과정별 평가방법 및 기간과 배정이 상이하오니 과정별 강의(수업)계획서를 반드시 확인하시기 바랍니다.
          </li>
        </ul>
        <table className="evaluation-method-table">
          <thead>
            <tr>
              <th>
                과정
              </th>
              <th>
                총점
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                온라인 수업
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                콘텐츠 100% 수강해야 출석으로 인정됩니다.
                <br />
                {" "}실습 과목은 1강 이상 미수강 시 미수료(100% 수강해야 함)
              </td>
            </tr>
            <tr>
              <td>
                정기시험
                <br />
                {" "}(중간고사/기말고사)
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                중간고사: 8주차 학습기간 중 5일간 시험 (객관식 20문항 / 주관식 5문항: 총 25문항 출제)
                <br />
                {" "}기말고사: 15주차 학습기간 중 5일간 시험 (객관식 20문항 / 주관식 5문항: 총 25문항 출제)
                <br />
                {" "}※ 사회복지사 실습 시험X
              </td>
            </tr>
            <tr>
              <td>
                퀴즈
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                4주차 학습기간 중 7일간 시험 (객관식 3문항)
              </td>
            </tr>
            <tr>
              <td>
                과제
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                9주차 학습기간 동안 제출가능 (4주간)
                <br />
                {" "}각 학습과정별 과제 주제 확인 후 과제 작성
                <br />
                {" "}작성완료된 과제는 파일로 첨부
              </td>
            </tr>
            <tr>
              <td>
                토론
              </td>
              <td ref={importantStyle("font-size", "12px")}>
                12주차 학습기간 동안 응시가능 (2주간)
                <br />
                {" "}각 학습과정별 토론 주제 확인 후 토론 응시
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="container">
        <h1 className="page-title">
          성적부여 방법 및 성적분포 비율
        </h1>
        <ul className="page-list" ref={importantStyles({ "margin-bottom": "10px", "margin-top": "10px" })}>
          <li className="page-list-item">
            상대평가 실시, 단 실습과정 또는 10명 미만의 학습과정의 경우 절대평가 실시
          </li>
          <li className="page-list-item">
            원 점수 60점 미만 및 출석률 80% 미만 시 과락처리
          </li>
        </ul>
        <table className="grade-distribution-table">
          <thead>
            <tr>
              <th>
                취득점수 (상대평가 변화점수)
              </th>
              <th>
                평점
              </th>
              <th>
                등급
              </th>
              <th>
                성적분포
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                95점 이상
              </td>
              <td>
                4.5
              </td>
              <td>
                A+
              </td>
              <td rowSpan={2}>
                20%
              </td>
            </tr>
            <tr>
              <td>
                90~94점
              </td>
              <td>
                4.0
              </td>
              <td>
                A
              </td>
            </tr>
            <tr>
              <td>
                85~90점
              </td>
              <td>
                3.5
              </td>
              <td>
                B+
              </td>
              <td rowSpan={2}>
                40%
              </td>
            </tr>
            <tr>
              <td>
                80~84점
              </td>
              <td>
                3.0
              </td>
              <td>
                B
              </td>
            </tr>
            <tr>
              <td>
                75~79점
              </td>
              <td>
                2.5
              </td>
              <td>
                C+
              </td>
              <td rowSpan={2}>
                30%
              </td>
            </tr>
            <tr>
              <td>
                70~74점
              </td>
              <td>
                2.0
              </td>
              <td>
                C
              </td>
            </tr>
            <tr>
              <td>
                65~69점
              </td>
              <td>
                1.5
              </td>
              <td>
                D+
              </td>
              <td rowSpan={2}>
                10%
              </td>
            </tr>
            <tr>
              <td>
                60~64점
              </td>
              <td>
                1.0
              </td>
              <td>
                D
              </td>
            </tr>
            <tr>
              <td>
                60점 미만
              </td>
              <td>
                없음
              </td>
              <td>
                F
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="container">
        <h1 className="page-title">
          상대평가 안내사항
        </h1>
        <ul className="page-list" ref={importantStyles({ "margin-bottom": "10px", "margin-top": "10px" })}>
          <li className="page-list-item">
            상대평가는 최종성적 공지 시 획득점수 (원점수)에 비례하여 반영됩니다. (수강 중 상대평가 점수는 확인 불가합니다.)
          </li>
          <li className="page-list-item">
            상대평가는 각 학습과정 학급별 수강인원을 기준으로 진행됩니다.
          </li>
          <li className="page-list-item">
            동점 자 발생 시: 출석 &gt; 시험 &gt; 과제 토론 점수 순으로 석차를 산출합니다.
          </li>
          <li className="page-list-dangu">
            실습과목은 해당사항 없음(절대평가로 진행)
          </li>
        </ul>
      </div>
    </main>
  );
}
