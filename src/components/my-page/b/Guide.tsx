/** 화면 위 안내 상자 (짧은 안내 문장 목록) */
export default function Guide({ title = "안내", items }: { title?: string; items: React.ReactNode[] }) {
  return (
    <div className="mq-guide">
      <p className="mq-guide-title">{title}</p>
      <ul className="pp-list">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
