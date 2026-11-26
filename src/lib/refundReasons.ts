/** 환불 신청 사유 — 화면(RefundForm)과 서버 액션이 같이 쓴다. DB refunds.reason 에 그대로 남는다 (50자 안) */
export const REFUND_REASONS = ["개인 사정으로 수강이 어려움", "다른 과목으로 바꾸고 싶음", "학습 사이트 이용이 불편함", "기타"] as const;

/** 돌려받을 계좌가 필요한 결제인가 — 카드 결제는 카드 취소로 돌려주므로 계좌가 필요 없다 */
export const refundNeedsAccount = (method: string) => !method.includes("카드");
