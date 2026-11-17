"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import "@/styles/classroom.css";

/** 아이디 찾기 · 비밀번호 재발급 (PC 2칸, 휴대폰은 세로로) */
export default function FindUserForms() {
  const router = useRouter();

  const handleFindId = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 아이디 찾기 API 연동 (findIdName, findIdPhone)
    router.push("/member/find-user/result?type=id");
  };

  const handleFindPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 비밀번호 재발급 API 연동 (findPwName, findPwUserId, findPwPhone)
    router.push("/member/find-user/result?type=pw");
  };

  return (
    <div className="member-cols member-cols--2">
      <section className="member-col">
        <h2 className="member-col-title">아이디 찾기</h2>
        <form className="member-form" onSubmit={handleFindId}>
          <input type="text" id="findIdName" name="findIdName" className="ds-input" placeholder="이름을 입력해주세요." aria-label="이름" required />
          <input
            type="tel"
            id="findIdPhone"
            name="findIdPhone"
            className="ds-input"
            placeholder="핸드폰 번호를 입력해주세요."
            aria-label="핸드폰 번호"
            required
          />
          <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg member-submit">
            확인
          </button>
        </form>
        <p className="member-note">
          이름 · 핸드폰 번호를 입력하시면,
          <br />
          핸드폰 번호로 아이디를 전송해드립니다.
        </p>
      </section>

      <section className="member-col">
        <h2 className="member-col-title">비밀번호 재발급</h2>
        <form className="member-form" onSubmit={handleFindPassword}>
          <input type="text" id="findPwName" name="findPwName" className="ds-input" placeholder="이름을 입력해주세요." aria-label="이름" required />
          <input
            type="text"
            id="findPwUserId"
            name="findPwUserId"
            className="ds-input"
            placeholder="아이디를 입력해주세요."
            aria-label="아이디"
            required
          />
          <input
            type="tel"
            id="findPwPhone"
            name="findPwPhone"
            className="ds-input"
            placeholder="핸드폰 번호를 입력해주세요."
            aria-label="핸드폰 번호"
            required
          />
          <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg member-submit">
            확인
          </button>
        </form>
        <p className="member-note">
          이름 · 아이디 · 핸드폰 번호를 입력하시면,
          <br />
          핸드폰 번호로 임시 비밀번호를 전송해드립니다.
        </p>
      </section>
    </div>
  );
}
