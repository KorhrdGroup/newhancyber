import { CloseButton } from "./PopupActions";

/** 팝업 틀 (Figma Modal 머리·몸통·바닥 구성) */
export default function PopupShell({
  title,
  sub,
  footer,
  children,
}: {
  title: string;
  sub?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="pp-header no-print">
        <h1 className="pp-title">
          {title}
          {sub && <span className="pp-sub">{sub}</span>}
        </h1>
        <CloseButton />
      </header>
      <div className="pp-body">{children}</div>
      {footer !== null && <div className="pp-footer no-print">{footer ?? <CloseButton variant="button" />}</div>}
    </>
  );
}
