/**
 * 퍼블리싱의 style="max-width: 130px !important" 처럼 !important 가 붙은 인라인 스타일.
 * React style 객체는 !important 를 못 쓰므로 ref 로 직접 넣는다.
 */
export const importantStyle =
  (property: string, value: string) =>
  (el: HTMLElement | null) => {
    el?.style.setProperty(property, value, "important");
  };

/** importantStyle 을 여러 속성에 한 번에 적용 (style="a: x !important; b: y !important") */
export const importantStyles =
  (styles: Record<string, string>) =>
  (el: HTMLElement | null) => {
    for (const [property, value] of Object.entries(styles)) importantStyle(property, value)(el);
  };
