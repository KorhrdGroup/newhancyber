/**
 * 모바일 서브페이지 맨 위의 파란 제목 띠 (원본은 <main> 바깥, 헤더 바로 아래).
 * 클래스 이름이 페이지마다 달라서 name 으로 만든다: mobile-{name}-banner / mobile-{name}-banner-text
 * 섹션 CSS 가 body:has(.mobile-{name}-banner) 로 본문 여백을 잡으므로 꼭 넣어야 한다.
 */
export default function MobilePageBanner({ name, text }: { name: string; text: string }) {
  return (
    <div className={`mobile-${name}-banner mobile-only`}>
      <span className={`mobile-${name}-banner-text`}>{text}</span>
    </div>
  );
}
