"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { checkLoginId, signup, type IdCheckResult, type SignupState } from "@/app/member/actions";
import {
  EDUCATION_LEVELS,
  EMAIL_DOMAINS,
  INTEREST_AREAS,
  JOIN_PATHS,
  PHONE_PREFIXES,
  SIGNUP_CONSENT_KEY,
  SIGNUP_DONE_KEY,
  type SignupConsent,
} from "@/lib/signupOptions";
import "@/styles/classroom.css";
import "@/styles/mypage.css";
import "@/styles/mypage2.css";

const DAUM_POSTCODE_SRC = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

/** 필수 칸 표시 */
const Req = () => <span className="mp-req">*</span>;

/** 한 칸: 위에 항목 이름, 아래 입력 칸 (마이페이지 내 정보 수정과 같은 모양) */
function Field({ label, htmlFor, req, children }: { label: string; htmlFor?: string; req?: boolean; children: React.ReactNode }) {
  const name = (
    <>
      {label}
      {req && <Req />}
    </>
  );
  return (
    <div className="pp-field">
      {htmlFor ? (
        <label className="ds-label" htmlFor={htmlFor}>
          {name}
        </label>
      ) : (
        <span className="ds-label">{name}</span>
      )}
      {children}
    </div>
  );
}

/** 회원가입 2단계: 정보 입력 */
export default function SignupForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<SignupState, FormData>(signup, {});
  // 1단계(약관)에서 넘어온 동의 — 없으면 1단계로 돌려보낸다
  const [consent, setConsent] = useState<SignupConsent | null>(null);
  const [idCheck, setIdCheck] = useState<IdCheckResult | null>(null);
  const [checkingId, setCheckingId] = useState(false);
  const [emailDomain, setEmailDomain] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");

  const domainInputRef = useRef<HTMLInputElement>(null);
  const addressDetailRef = useRef<HTMLInputElement>(null);
  const userIdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let saved: SignupConsent | null = null;
    try {
      saved = JSON.parse(sessionStorage.getItem(SIGNUP_CONSENT_KEY) ?? "null");
    } catch {
      saved = null;
    }
    if (saved?.required === true) {
      // 브라우저 저장소에서 한 번 읽어 화면 상태로 옮긴다 (서버 렌더에서는 읽을 수 없다)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConsent(saved);
    } else {
      alert("약관 동의 후 가입할 수 있어요.");
      router.replace("/member/signup");
    }
  }, [router]);

  // 가입 결과 — 끝났으면 완료 화면으로, 문제가 있으면 알리고 그 칸으로 커서를 옮긴다
  useEffect(() => {
    if (state.done) {
      try {
        sessionStorage.setItem(SIGNUP_DONE_KEY, JSON.stringify(state.done));
        sessionStorage.removeItem(SIGNUP_CONSENT_KEY);
      } catch {
        // 저장소를 못 써도 가입은 끝났다 — 완료 화면이 기본 문구만 보인다
      }
      router.push("/member/signup/step3");
    } else if (state.error) {
      alert(state.error);
      if (state.field) document.getElementById(state.field)?.focus();
    }
  }, [state, router]);

  const handleCheckId = async () => {
    const id = userIdRef.current?.value ?? "";
    setCheckingId(true);
    try {
      setIdCheck(await checkLoginId(id));
    } catch {
      setIdCheck({ ok: false, message: "지금은 확인할 수 없어요. 잠시 뒤 다시 시도해 주세요." });
    } finally {
      setCheckingId(false);
    }
  };

  const handleEmailDomain = (value: string) => {
    if (value === "") {
      // 칸이 화면에 나온 뒤 포커스 (숨겨진 칸에는 포커스가 안 간다)
      flushSync(() => setEmailDomain(value));
      domainInputRef.current?.focus();
    } else {
      setEmailDomain(value);
    }
  };

  const handleFindAddress = () => {
    if (!window.daum?.Postcode) {
      alert("주소 검색을 불러오는 중입니다. 잠시 후 다시 눌러주세요.");
      return;
    }
    new window.daum.Postcode({
      oncomplete: (data) => {
        // 사용자가 고른 주소 종류(도로명/지번)에 맞춰 넣는다. 원본도 참고항목은 쓰지 않는다.
        setPostalCode(data.zonecode);
        setAddress(data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress);
        addressDetailRef.current?.focus();
      },
    }).open();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending || !consent) return;
    const formData = new FormData(e.currentTarget);
    formData.set("consentRequired", "1");
    formData.set("consentPrivacyOptional", consent.privacyOptional ? "1" : "0");
    formData.set("consentMarketing", consent.marketing ? "1" : "0");
    // form 의 action 으로 넘기면 끝난 뒤 칸이 모두 비워진다 — 오류가 나도 입력이 남도록 직접 부른다
    startTransition(() => formAction(formData));
  };

  return (
    <form className="signup-panel" id="signupForm" onSubmit={handleSubmit}>
      <Script src={DAUM_POSTCODE_SRC} strategy="afterInteractive" />

      <section className="pp-box mp-form">
        <div className="mp-form-head">
          <h2 className="pp-box-title">개인정보</h2>
          <p className="pp-note">
            <Req /> 표시는 필수 입력 사항입니다.
          </p>
        </div>

        <Field label="이름" htmlFor="userName" req>
          <input type="text" id="userName" name="userName" className="ds-input" placeholder="이름을 입력해주세요." required />
        </Field>

        <Field label="생년월일" htmlFor="birthDate" req>
          <input
            type="text"
            id="birthDate"
            name="birthDate"
            className="ds-input"
            placeholder="8자리 숫자로 입력해주세요. 예) 19900101"
            inputMode="numeric"
            autoComplete="bday"
            maxLength={10}
            // 자동완성은 1990-01-01 처럼 넣기도 해서 두 모양을 다 받는다
            pattern="[0-9]{8}|[0-9]{4}-[0-9]{2}-[0-9]{2}"
            title="8자리 숫자로 입력해 주세요. 예) 19900101"
            required
          />
          <p className="pp-note ds-mt-8">만 14세 이상만 회원가입할 수 있어요.</p>
        </Field>

        <Field label="아이디" htmlFor="userId" req>
          <div className="mq-inline">
            <input
              ref={userIdRef}
              type="text"
              id="userId"
              name="userId"
              className="ds-input"
              placeholder="6~10자 이내의 영문 소문자/숫자"
              autoComplete="username"
              maxLength={10}
              onChange={() => setIdCheck(null)}
              required
            />
            <button type="button" className="ds-btn ds-btn--secondary mq-fixed" onClick={handleCheckId} disabled={checkingId}>
              중복확인
            </button>
          </div>
          {idCheck && (
            <p className={`form-id-check ${idCheck.ok ? "ok" : "fail"}`} role="status">
              {idCheck.message}
            </p>
          )}
        </Field>

        <Field label="비밀번호" htmlFor="userPassword" req>
          <input
            type="password"
            id="userPassword"
            name="userPassword"
            className="ds-input"
            placeholder="8~20자 이내의 영문/숫자/특수문자"
            autoComplete="new-password"
            required
          />
        </Field>

        <Field label="비밀번호 확인" htmlFor="userPasswordConfirm" req>
          <input
            type="password"
            id="userPasswordConfirm"
            name="userPasswordConfirm"
            className="ds-input"
            placeholder="비밀번호를 한번 더 입력해주세요."
            autoComplete="new-password"
            required
          />
        </Field>

        <Field label="핸드폰" htmlFor="phonePrefix" req>
          <div className="mq-phone">
            <select id="phonePrefix" name="phonePrefix" className="ds-select" defaultValue="010">
              {PHONE_PREFIXES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <input type="tel" id="phoneMiddle" name="phoneMiddle" className="ds-input" inputMode="numeric" maxLength={4} aria-label="핸드폰 가운데 번호" required />
            <input type="tel" id="phoneLast" name="phoneLast" className="ds-input" inputMode="numeric" maxLength={4} aria-label="핸드폰 끝 번호" required />
          </div>
        </Field>

        <Field label="주소" htmlFor="postalCode" req>
          <div className="mq-inline">
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              className="ds-input mq-postal"
              placeholder="우편번호"
              value={postalCode}
              readOnly
              required
            />
            <button type="button" className="ds-btn ds-btn--secondary mq-fixed" onClick={handleFindAddress}>
              주소 찾기
            </button>
          </div>
          <input
            type="text"
            id="userAddress"
            name="userAddress"
            className="ds-input ds-mt-8"
            placeholder="주소"
            aria-label="주소"
            value={address}
            readOnly
            required
          />
          <input
            ref={addressDetailRef}
            type="text"
            id="userAddressDetail"
            name="userAddressDetail"
            className="ds-input ds-mt-8"
            placeholder="상세주소"
            aria-label="상세주소"
            required
          />
        </Field>

        <Field label="이메일" htmlFor="userEmail" req>
          <div className="mq-inline">
            <input type="text" id="userEmail" name="userEmail" className="ds-input" placeholder="이메일" required />
            <span className="mq-at">@</span>
            <select
              name="emailDomain"
              className="ds-select"
              aria-label="이메일 도메인"
              value={emailDomain}
              onChange={(e) => handleEmailDomain(e.target.value)}
            >
              <option value="">직접 입력</option>
              {EMAIL_DOMAINS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            {!emailDomain && (
              <input
                ref={domainInputRef}
                type="text"
                id="emailDomainInput"
                name="emailDomainInput"
                className="ds-input"
                placeholder="직접 입력"
                aria-label="이메일 도메인 직접 입력"
                required
              />
            )}
          </div>
        </Field>

        <Field label="SMS/이메일 수신동의">
          <div className="mq-checks">
            <label className="ds-check">
              <input type="checkbox" id="smsConsent" name="smsConsent" />
              문자(SMS)
            </label>
            <label className="ds-check">
              <input type="checkbox" id="emailConsent" name="emailConsent" />
              이메일
            </label>
          </div>
          <p className="pp-note ds-mt-8">
            학습안내, 출석 관리 등의 SMS, 이메일 수신을 위하여 동의하여 주시기 바랍니다. 수신 미동의 시 개강 안내, 학사일정, 할인정보 등의 주요
            안내가 누락될 수 있습니다.
          </p>
        </Field>

        <Field label="쿠폰번호" htmlFor="couponNumber">
          <div className="mq-inline">
            <input type="text" id="couponNumber" name="couponNumber" className="ds-input" placeholder="쿠폰번호를 입력해주세요." />
            {/* TODO: 쿠폰 확인 API */}
            <button type="button" className="ds-btn ds-btn--secondary mq-fixed">
              쿠폰 확인
            </button>
          </div>
        </Field>
      </section>

      <section className="pp-box mp-form">
        <h2 className="pp-box-title mq-form-title">부가정보</h2>

        <Field label="최종학력" htmlFor="educationLevel" req>
          <div className="mq-inline">
            <select id="educationLevel" name="educationLevel" className="ds-select" defaultValue="" required>
              <option value="">최종학력</option>
              {EDUCATION_LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            <input type="text" id="schoolName" name="schoolName" className="ds-input" placeholder="학교명을 입력해주세요." aria-label="학교명" required />
          </div>
        </Field>

        <Field label="학과" htmlFor="major">
          <input type="text" id="major" name="major" className="ds-input" placeholder="학과명을 입력해주세요." />
        </Field>

        <Field label="관심분야" htmlFor="interestArea">
          <select id="interestArea" name="interestArea" className="ds-select" defaultValue="">
            <option value="">관심분야를 선택해주세요.</option>
            {INTEREST_AREAS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="가입경로">
          <div className="mq-checks">
            {JOIN_PATHS.map((path) => (
              <label key={path.id} className="ds-check">
                <input type="checkbox" id={path.id} name="registrationPath" value={path.value} />
                {path.label}
              </label>
            ))}
          </div>
        </Field>

        <Field label="환불계좌" htmlFor="bankName">
          <div className="mq-inline">
            <input type="text" id="bankName" name="bankName" className="ds-input signup-bank" placeholder="은행명" />
            <input type="text" id="accountNumber" name="accountNumber" className="ds-input" placeholder="계좌번호를 입력해주세요" aria-label="계좌번호" />
          </div>
          <p className="pp-note ds-mt-8">
            * 원활한 환불 처리를 위해 환불 계좌 정보는 반드시 정확하게 입력해 주시기 바랍니다. 학습자 본인의 계좌 정보 오기재로 인해 발생하는 환불
            관련 문제에 대해서는 교육원에서 책임지지 않으니 이 점 양해 부탁드립니다.
          </p>
        </Field>
      </section>

      <div className="signup-actions">
        <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg signup-submit" disabled={pending || !consent}>
          {pending ? "가입하는 중…" : "가입하기"}
        </button>
      </div>
    </form>
  );
}
