"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

const categories = ["학위과정", "자격증과정", "기타"];

/** 랜딩 간편 무료 학습상담 (원본 quick_frm: 구분 · 연락처 · 약관 동의) */
export default function LandingConsultForm() {
  const [agree, setAgree] = useState({ privacy: false, marketing: false });
  const allAgreed = agree.privacy && agree.marketing;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 상담 신청 API 연동 (원본 /main/ajax_coun.asp, coun_type 045002)
    alert("상담 신청 API 연동 전입니다.");
  };

  return (
    <form className="ld-form" onSubmit={handleSubmit}>
      <h3 className="ld-form-title">
        <span>간편 무료</span> 학습상담
      </h3>
      <div className="ld-form-fields">
        <select name="cate" className="ld-input" required defaultValue="" aria-label="구분">
          <option value="" disabled>
            구분 선택
          </option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div className="ld-phone">
          <input name="pn1" className="ld-input" defaultValue="010" inputMode="numeric" maxLength={4} aria-label="연락처 앞자리" required />
          <span>-</span>
          <input name="pn2" className="ld-input" inputMode="numeric" maxLength={4} aria-label="연락처 가운데 자리" required />
          <span>-</span>
          <input name="pn3" className="ld-input" inputMode="numeric" maxLength={4} aria-label="연락처 끝자리" required />
        </div>
      </div>
      <div className="ld-agree">
        <label className="ld-agree-all">
          <input
            type="checkbox"
            checked={allAgreed}
            onChange={(e) => setAgree({ privacy: e.target.checked, marketing: e.target.checked })}
          />
          모두 동의합니다.
        </label>
        <label>
          <input
            type="checkbox"
            required
            checked={agree.privacy}
            onChange={(e) => setAgree({ ...agree, privacy: e.target.checked })}
          />
          <span>
            <Link href="/footer/privacy" target="_blank">
              개인정보 처리방침
            </Link>
            에 동의합니다.
          </span>
        </label>
        <label>
          <input
            type="checkbox"
            required
            checked={agree.marketing}
            onChange={(e) => setAgree({ ...agree, marketing: e.target.checked })}
          />
          마케팅 수신 정보를 확인했습니다.
        </label>
      </div>
      <button type="submit" className="ld-form-btn">
        상담 신청하기
      </button>
    </form>
  );
}
