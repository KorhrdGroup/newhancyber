"use client";

import { useEffect, useState } from "react";
import { SIGNUP_DONE_KEY, type SignupDone } from "@/lib/signupOptions";

/** 회원가입 완료 화면의 가입 정보 — 2단계가 가입을 마치고 브라우저 저장소에 잠깐 둔 값을 보여 준다 */
export default function SignupCompleteInfo() {
  const [member, setMember] = useState<SignupDone | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(SIGNUP_DONE_KEY) ?? "null") as SignupDone | null;
      // 공용 PC 에 개인정보가 남지 않게 읽자마자 지운다 (새로 고치면 가입 정보 칸만 사라진다)
      sessionStorage.removeItem(SIGNUP_DONE_KEY);
      // 브라우저 저장소에서 한 번 읽어 화면 상태로 옮긴다 (서버 렌더에서는 읽을 수 없다)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved && typeof saved.loginId === "string") setMember(saved);
    } catch {
      // 저장소를 못 쓰면 가입 정보 칸 없이 완료 문구만 보인다
    }
  }, []);

  if (!member) return null;
  const rows = [
    { label: "이름", value: member.name },
    { label: "아이디", value: member.loginId },
    { label: "핸드폰", value: member.phone },
    { label: "이메일", value: member.email },
  ];

  return (
    <div className="member-info-section">
      <h3 className="member-info-title">회원님의 가입정보입니다.</h3>
      <div className="member-info-table">
        {rows.map((row) => (
          <div key={row.label} className="member-info-row">
            <div className="member-info-label">{row.label}</div>
            <div className="member-info-value">{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
