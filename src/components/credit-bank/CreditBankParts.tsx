import Link from "next/link";

/** 오른쪽 작은 화살표 (바로가기 버튼) */
export function ChevronRight() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6.25 4.5 9.75 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 학점은행제 안내 끝의 상담 신청 띠 (학점은행제란 · 주의사항) */
export function ConsultBanner() {
  return (
    <div className="cb-consult">
      <p className="cb-consult-text">
        잠깐! 학점은행제 도움을 받고싶다면 지금 바로 <strong>상담신청</strong>하세요!
      </p>
      <Link href="/course-registration/learning-design" className="ds-btn ds-btn--primary">
        상담신청 하러가기
        <ChevronRight />
      </Link>
    </div>
  );
}
