import type { Metadata } from "next";
import Link from "next/link";
import { sampleFoundUser } from "@/components/course-registration/extra/extraData";
import "@/styles/classroom.css";
import "@/styles/extra-pages.css";

export const metadata: Metadata = { title: "아이디 찾기/비밀번호 재발급 결과" };

/** 아이디 찾기(?type=id) · 비밀번호 재발급(?type=pw) 결과 */
export default async function FindUserResultPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const isPassword = type === "pw";
  // TODO: API 찾기 결과 (지금은 샘플)
  const user = sampleFoundUser;

  return (
    <main className="wrapper">
      <div className="find-id-wrapper">
        <h1 className="find-id-main-title">{isPassword ? "비밀번호 재발급 결과" : "아이디 찾기 결과"}</h1>
        <div className="ex-find-card">
          <span className="ex-find-icon" aria-hidden="true">
            ✓
          </span>
          {isPassword ? (
            <>
              <h2 className="ex-find-title">임시 비밀번호를 보내 드렸어요</h2>
              <p className="ex-find-desc">
                <strong>{user.maskedPhone}</strong> 번호로 임시 비밀번호를 문자로 보냈어요.
                <br />
                로그인한 뒤 마이페이지에서 비밀번호를 꼭 바꿔 주세요.
              </p>
              <p className="ex-note">문자가 오지 않으면 스팸 문자함을 확인하거나 잠시 뒤 다시 시도해 주세요.</p>
              <div className="ex-actions">
                <Link href="/member/login" className="ds-btn ds-btn--primary ds-btn--lg">
                  로그인
                </Link>
                <Link href="/member/find-user" className="ds-btn ds-btn--secondary ds-btn--lg">
                  아이디 찾기
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="ex-find-title">회원님의 아이디를 찾았어요</h2>
              <p className="ex-find-desc">개인정보 보호를 위해 아이디 일부는 * 로 가려서 보여 드려요.</p>
              <div className="ex-find-value">
                <p className="ex-find-id">{user.maskedId}</p>
                <p className="ex-find-meta">가입일 {user.joinedAt}</p>
              </div>
              <div className="ex-actions">
                <Link href="/member/login" className="ds-btn ds-btn--primary ds-btn--lg">
                  로그인
                </Link>
                <Link href="/member/find-user" className="ds-btn ds-btn--secondary ds-btn--lg">
                  비밀번호 찾기
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
