"use client";

import { importantStyle } from "@/lib/importantStyle";
import { importantStyles } from "@/lib/importantStyle";

/** 원본 refund.html 본문. 인라인 !important 스타일(ref)을 쓰려고 클라이언트 컴포넌트로 둔다. */
export default function RefundContent() {
  return (
    <main className="wrapper">
      <div className="container">
        <h1 className="page-title">
          환불 절차
        </h1>
        <div className="content-section">
          <img src="/resources/images/course-registration/refund-01.png" alt="학습비 반환규정" className="refund-image" />
        </div>
        <ul className="page-list" style={{ textAlign: "center" }}>
          <li className="page-list-plain">
            ⌈평가인정 학습과정 운영에 관한 규정⌋ &lt;별표&gt;학습비 반환 기준 [제 4조 제2항 관련]에 의거하여 중간고사 이후 환불은 진행불가합니다.
          </li>
        </ul>
      </div>
      <div className="container">
        <h1 className="page-title">
          환불 규정 (환불/취소 안내)
        </h1>
        <ul className="page-list">
          <li className="page-list-item">
            수강료 반환은 교육부 [평가인정 학습과정 운영에 관한 규정] &lt;별표&gt;학습비 반환 기준(제4조제2항관련)에 따릅니다.
          </li>
          <li className="page-list-item">
            본 환불/취소 신청 건은 환불 요청 당일 기준 금액으로 환불이 진행됩니다.
          </li>
          <li className="page-list-item">
            환불요청일이 포함된 주차의 학습범위까지 학습을 하지 않았어도 해당 주차까지 학습한 것으로 간주하여 수강료에서 감안 후 환불됩니다.
          </li>
          <li className="page-list-item">
            신용카드 결제의 경우 청구기간 이전이면 결제되지 않으며, 청구기간 이후면 익월 결제내역에서 차감됩니다.
          </li>
          <li className="page-list-item">
            실시간 계좌이체, 무통장 입금의 경우 지정한 계좌로 입금되며, 환불/취소일자 및 금액이 노출됩니다.
          </li>
          <li className="page-list-item">
            환불완료 시 안내문자를 발송드리며, 관련하여 추가 문의사항이 있으신 학습자님께서는 한평생원격교육원 02-2135-5126로 연락주시기 바랍니다.
          </li>
        </ul>
      </div>
      <div className="container">
        <h1 className="page-title">
          평가인정 학습과정 운영에 관한 규정, 학습비 반환 기준 (제 4조 제 2항 관련)
        </h1>
        <ul className="page-list">
          <li className="page-list-plain">
            1) 반환금은 학습자가 실제 납부한 금액을 기준으로 반환한다.
          </li>
          <li className="page-list-plain">
            2) 학습자의 학습포기 의사 표시일로부터 5일 이내에 학습비를 반환한다.
          </li>
          <li className="page-list-item">
            3) 반환기일 종료일이 토요일 또는 공휴일인 경우 공휴일이 끝나는 익일을 반환기간 만료일로 한다.
            <br />
            {" "}*민법 제 161조 공휴일 등과 기간의 만료점에 의거 / 기간의 말일이 토요일 또는 공휴일에 해당하는 때에는 기간은 그 익일로 만료한다.
          </li>
        </ul>
        <table className="refund-table">
          <thead>
            <tr>
              <th>
                반환사유
              </th>
              <th>
                반환 사유 발생 시점
              </th>
              <th>
                반환 금액
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                제 4조 제 2항 제 1호에 해당하는 경우
              </td>
              <td></td>
              <td>
                과오납된 금액 전액
              </td>
            </tr>
            <tr>
              <td rowSpan={5}>
                제 4조 제 2항 제 1호에 해당하는 경우
                <br />
                {" "}제 4조 제 2항 제 2호부터 제 4호까지의 규정에 해당하는 경우
              </td>
              <td>
                수업 시작일 전까지
              </td>
              <td>
                학습비 전액
              </td>
            </tr>
            <tr>
              <td ref={importantStyles({ "background-color": "#fff", "font-size": "12px" })}>
                수업 시작일부터 총 수업시간의 1/6 경과 전
              </td>
              <td style={{ fontSize: "12px" }} ref={importantStyle("background-color", "#fff")}>
                학습비의 6분의 5에 해당하는 금액
              </td>
            </tr>
            <tr>
              <td ref={importantStyles({ "background-color": "#fff", "font-size": "12px" })}>
                총 수업시간의 1/6 이상부터 1/3 미만까지의 기간동안
              </td>
              <td ref={importantStyles({ "background-color": "#fff", "font-size": "12px" })}>
                학습비의 3분의 2에 해당하는 금액
              </td>
            </tr>
            <tr>
              <td ref={importantStyles({ "background-color": "#fff", "font-size": "12px" })}>
                총 수업시간의 1/3 이상부터 1/2 미만까지의 기간동안
              </td>
              <td ref={importantStyles({ "background-color": "#fff", "font-size": "12px" })}>
                학습비의 2분의 1에 해당하는 금액
              </td>
            </tr>
            <tr>
              <td ref={importantStyles({ "background-color": "#fff", "font-size": "12px" })}>
                총 수업시간의 1/2 이상 경과
              </td>
              <td>
                반환하지 않음
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button className="refund-button">
          <span>
            환불하러 가기
          </span>
          {" "}
          <img src="/resources/images/course-registration/right-arrow.png" alt="화살표" className="refund-button-arrow" />
        </button>
      </div>
    </main>
  );
}
