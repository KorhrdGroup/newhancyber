"use client";

/** 팝업 창 닫기 (팝업이 아닌 창으로 열렸으면 뒤로 가기) */
export function closePopup() {
  if (window.opener) window.close();
  else window.history.back();
}

export function CloseButton({ variant = "icon", label = "닫기" }: { variant?: "icon" | "button"; label?: string }) {
  if (variant === "button") {
    return (
      <button type="button" className="ds-btn ds-btn--secondary" onClick={closePopup}>
        {label}
      </button>
    );
  }
  return (
    <button type="button" className="pp-close" onClick={closePopup} aria-label="창 닫기" title="창 닫기">
      ×
    </button>
  );
}

export function PrintButton() {
  return (
    <button type="button" className="ds-btn ds-btn--primary" onClick={() => window.print()}>
      인쇄하기
    </button>
  );
}

/** API 연동 전 버튼 */
export function TodoButton({
  className = "ds-btn ds-btn--primary",
  label,
  message,
  children,
}: {
  className?: string;
  label: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <button type="button" className={className} onClick={() => alert(`${message} API 연동 전입니다.`)}>
      {children}
      {label}
    </button>
  );
}
