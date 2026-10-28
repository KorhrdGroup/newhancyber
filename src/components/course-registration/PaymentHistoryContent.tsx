import { cartSummary, formatPrice, sampleCartCourses } from "./courseData";
import MobilePaymentSummary from "./MobilePaymentSummary";

/** 결제내역 (모바일 전용 화면, 원본 payment-history.html) */
export default function PaymentHistoryContent() {
  // TODO: 결제내역 조회 API
  const payments = sampleCartCourses;
  const { totalFee, discount, finalAmount } = cartSummary(payments.map((course) => course.currentPrice));

  return (
    <main className="wrapper">
      <div className="container" style={{ backgroundColor: "#fff" }}>
        <div className="mobile-payment-history-list mobile-only">
          {payments.map((course, i) => (
            <div key={i} className="mobile-payment-history-item">
              <div className="mobile-payment-history-item-left">
                <div className="mobile-payment-history-item-header">
                  <div className="mobile-payment-history-icon">{course.icon}</div>
                  <div className="mobile-payment-history-title">{course.name}</div>
                </div>
                <div className="mobile-payment-history-item-content">
                  <div className="mobile-payment-history-buttons">
                    <button className="mobile-payment-history-sample-btn">샘플강의</button>
                    <button className="mobile-payment-history-syllabus-btn">강의계획서</button>
                  </div>
                </div>
              </div>
              <div className="mobile-payment-history-item-right">
                <div className="mobile-payment-history-price">
                  <span className="mobile-payment-history-price-original">{formatPrice(course.originalPrice)}원</span>
                  <span className="mobile-payment-history-price-current">{formatPrice(course.currentPrice)}원</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <MobilePaymentSummary
          totalFee={`${formatPrice(totalFee)} 원`}
          discount={`-${formatPrice(discount)} 원`}
          finalAmount={`${formatPrice(finalAmount)}원`}
          finalLabel="총 결제예정금액"
        />

        <div className="mobile-payment-refund-notice mobile-only">
          <p className="mobile-payment-refund-text">
            <span className="mobile-payment-refund-asterisk">*</span>환불신청/취소내역은 PC에서 확인 가능합니다.
          </p>
        </div>
      </div>
    </main>
  );
}
