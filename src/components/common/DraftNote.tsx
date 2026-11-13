import "@/styles/learning-extra.css";

/**
 * '검토 필요' 표시 — 원본에 내용이 없어 안내 문구를 임시로 쓴 곳에 붙인다.
 * 실제 규정·자료로 내용을 바꾸면 이 표시도 함께 지운다.
 */
export default function DraftNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="lx-draft-note" role="note">
      <strong>검토 필요</strong> {children}
    </p>
  );
}
