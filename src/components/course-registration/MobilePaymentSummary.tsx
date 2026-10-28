interface MobilePaymentSummaryProps {
  /** 화면에 그대로 찍을 문구 (페이지마다 "원" 앞 띄어쓰기가 원본에서 다르다) */
  totalFee: string;
  discount: string;
  finalAmount: string;
  finalLabel?: string;
}

/** 모바일 결제 요약 (총 수강료 / 총 할인액 / 총 결제 예정 금액) */
export default function MobilePaymentSummary({
  totalFee,
  discount,
  finalAmount,
  finalLabel = "총 결제 예정 금액",
}: MobilePaymentSummaryProps) {
  return (
    <div className="mobile-payment-info mobile-only">
      <div className="mobile-payment-summary">
        <div className="mobile-payment-item">
          <span className="mobile-payment-label">총 수강료</span>
          <span className="mobile-payment-value" id="mobileTotalFee">
            {totalFee}
          </span>
        </div>
        <div className="mobile-payment-item">
          <span className="mobile-payment-label">총 할인액</span>
          <span className="mobile-payment-value mobile-payment-discount" id="mobileTotalDiscount">
            {discount}
          </span>
        </div>
        <div className="mobile-payment-item mobile-payment-total">
          <span className="mobile-payment-label">{finalLabel}</span>
          <span className="mobile-payment-value mobile-payment-final" id="mobileFinalAmount">
            {finalAmount}
          </span>
        </div>
      </div>
    </div>
  );
}
