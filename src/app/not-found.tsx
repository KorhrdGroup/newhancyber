import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrapper">
      <section className="page-header">
        <h1 className="page-title">페이지를 찾을 수 없습니다</h1>
        <p className="page-sub-title">
          <Link href="/">메인으로 이동</Link>
        </p>
      </section>
    </main>
  );
}
