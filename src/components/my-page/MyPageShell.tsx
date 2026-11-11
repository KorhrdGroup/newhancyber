import PageTabs from "@/components/common/PageTabs";
import MobilePageBanner from "@/components/layout/MobilePageBanner";
import { myPageTabs } from "@/lib/navigation";

/**
 * 마이페이지 공통 틀: 마이페이지 탭 메뉴 + 화면 제목.
 * 원본 마이페이지(/stdMng/...)는 로그인한 학습자만 들어간다. TODO: 로그인 확인 후 아니면 로그인 화면으로 보냄
 */
export default function MyPageShell({
  title,
  desc,
  actions,
  children,
}: {
  title: string;
  desc?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <MobilePageBanner name="my-page" text="마이페이지" />
      <main className="wrapper">
        <div className="container cr-page">
          <PageTabs items={myPageTabs} />
          <div className="cr-head">
            <div>
              <h2 className="cr-title">{title}</h2>
              {desc && <p className="cr-desc">{desc}</p>}
            </div>
            {actions && <div className="cr-actions">{actions}</div>}
          </div>
          {children}
        </div>
      </main>
    </>
  );
}
