"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { checkLoginId, signup, type IdCheckResult, type SignupState } from "@/app/member/actions";
import CustomSelect, { type CustomSelectOption } from "@/components/common/CustomSelect";
import { importantStyle } from "@/lib/importantStyle";
import {
  EDUCATION_LEVELS,
  EMAIL_DOMAINS,
  INTEREST_AREAS,
  JOIN_PATH_ROWS,
  PHONE_PREFIXES,
  SIGNUP_CONSENT_KEY,
  SIGNUP_DONE_KEY,
  type SignupConsent,
} from "@/lib/signupOptions";

const DAUM_POSTCODE_SRC = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

const phonePrefixes: CustomSelectOption[] = PHONE_PREFIXES.map((v) => ({ value: v, label: v }));

const emailDomains: CustomSelectOption[] = [
  { value: "", label: "직접 입력" },
  ...EMAIL_DOMAINS.map((v) => ({ value: v, label: v })),
];

const educationLevels: CustomSelectOption[] = [
  { value: "", label: "최종학력" },
  ...EDUCATION_LEVELS.map(({ value, label }) => ({ value, label })),
];

const interestAreas: CustomSelectOption[] = [
  { value: "", label: "관심분야를 선택해주세요." },
  ...INTEREST_AREAS.map(({ value, label }) => ({ value, label })),
];

/** 가입경로 체크박스 (화면의 줄 나눔 그대로) */
const registrationPathRows = JOIN_PATH_ROWS;

function Required() {
  return <span className="required">*</span>;
}

/** 회원가입 2단계: 정보 입력 */
export default function SignupForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<SignupState, FormData>(signup, {});
  // 1단계(약관)에서 넘어온 동의 — 없으면 1단계로 돌려보낸다
  const [consent, setConsent] = useState<SignupConsent | null>(null);
  const [idCheck, setIdCheck] = useState<IdCheckResult | null>(null);
  const [checkingId, setCheckingId] = useState(false);
  const [phonePrefix, setPhonePrefix] = useState("010");
  const [emailDomain, setEmailDomain] = useState("");
  // 원본: 처음엔 클래스 없음, 도메인을 고르면 hide, "직접 입력"을 고르면 show
  const [domainInputMode, setDomainInputMode] = useState<"show" | "hide" | null>(null);
  const [educationLevel, setEducationLevel] = useState("");
  const [interestArea, setInterestArea] = useState("");
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
    setEmailDomain(value);
    const input = domainInputRef.current;
    if (!input) return;
    input.value = "";
    if (value === "") {
      // 칸이 화면에 보이게 먼저 반영한 뒤 포커스 (숨겨진 칸에는 포커스가 안 간다)
      flushSync(() => setDomainInputMode("show"));
      input.focus();
    } else {
      setDomainInputMode("hide");
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
    <div className="step2-wrapper">
      <Script src={DAUM_POSTCODE_SRC} strategy="afterInteractive" />
      <h2 className="step2-title">개인정보</h2>
      <form className="signup-form" id="signupForm" method="post" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userName" className="form-label">
            이름 <Required />
          </label>
          <div className="form-group-content">
            <input
              type="text"
              id="userName"
              name="userName"
              className="form-input"
              placeholder="이름을 입력해주세요."
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="birthDate" className="form-label">
            생년월일 <Required />
          </label>
          <div className="form-group-content">
            <input
              type="text"
              id="birthDate"
              name="birthDate"
              className="form-input"
              placeholder="8자리 숫자로 입력해주세요. 예) 19900101"
              inputMode="numeric"
              autoComplete="bday"
              maxLength={10}
              // 자동완성은 1990-01-01 처럼 넣기도 해서 두 모양을 다 받는다
              pattern="[0-9]{8}|[0-9]{4}-[0-9]{2}-[0-9]{2}"
              title="8자리 숫자로 입력해 주세요. 예) 19900101"
              required
            />
            <p className="form-consent-text">만 14세 이상만 회원가입할 수 있어요.</p>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="userId" className="form-label">
            아이디 <Required />
          </label>
          <div className="form-group-content">
            <div className="form-input-group">
              <input
                ref={userIdRef}
                type="text"
                id="userId"
                name="userId"
                className="form-input"
                placeholder="6~10자 이내의 영문 소문자/숫자"
                autoComplete="username"
                maxLength={10}
                onChange={() => setIdCheck(null)}
                required
              />
              <button type="button" className="btn-check-duplicate" onClick={handleCheckId} disabled={checkingId}>
                중복확인
              </button>
            </div>
            {idCheck && (
              <p className={`form-id-check ${idCheck.ok ? "ok" : "fail"}`} role="status">
                {idCheck.message}
              </p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="userPassword" className="form-label">
            비밀번호 <Required />
          </label>
          <div className="form-group-content">
            <input
              type="password"
              id="userPassword"
              name="userPassword"
              className="form-input"
              placeholder="8~20자 이내의 영문/숫자/특수문자"
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="userPasswordConfirm" className="form-label">
            비밀번호 확인 <Required />
          </label>
          <div className="form-group-content">
            <input
              type="password"
              id="userPasswordConfirm"
              name="userPasswordConfirm"
              className="form-input"
              placeholder="비밀번호를 한번 더 입력해주세요."
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="userPhone" className="form-label">
            핸드폰 <Required />
          </label>
          <div className="form-group-content">
            <div className="form-phone-group">
              <CustomSelect
                name="phonePrefix"
                options={phonePrefixes}
                value={phonePrefix}
                onChange={setPhonePrefix}
                markInitial
              />
              <span className="phone-separator">-</span>
              <input
                type="tel"
                id="phoneMiddle"
                name="phoneMiddle"
                className="form-input form-phone-input"
                maxLength={4}
                required
              />
              <span className="phone-separator">-</span>
              <input
                type="tel"
                id="phoneLast"
                name="phoneLast"
                className="form-input form-phone-input"
                maxLength={4}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="userAddress" className="form-label">
            주소 <Required />
          </label>
          <div className="form-group-content">
            <div className="form-address-group">
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                className="form-input form-postal-code"
                placeholder="우편번호"
                value={postalCode}
                readOnly
                required
              />
              <button type="button" className="btn-find-address" onClick={handleFindAddress}>
                주소 찾기
              </button>
            </div>
            <div className="form-address-row">
              <input
                type="text"
                id="userAddress"
                name="userAddress"
                className="form-input form-address-input"
                placeholder="주소"
                value={address}
                readOnly
                required
              />
              <input
                ref={addressDetailRef}
                type="text"
                id="userAddressDetail"
                name="userAddressDetail"
                className="form-input form-address-input"
                placeholder="상세주소"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="userEmail" className="form-label">
            이메일 <Required />
          </label>
          <div className="form-group-content">
            <div className="form-email-group">
              <input
                ref={importantStyle("max-width", "130px")}
                type="text"
                id="userEmail"
                name="userEmail"
                className="form-input form-email-input"
                placeholder="이메일"
                required
              />
              <span className="email-separator">@</span>
              <CustomSelect
                className="custom-email-select"
                name="emailDomain"
                options={emailDomains}
                value={emailDomain}
                onChange={handleEmailDomain}
                markInitial
              />
              <input
                ref={domainInputRef}
                type="text"
                id="emailDomainInput"
                name="emailDomainInput"
                className={`form-input form-email-domain-input${domainInputMode ? ` ${domainInputMode}` : ""}`}
                placeholder="직접 입력"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            SMS/이메일
            <br />
            수신동의
          </label>
          <div className="form-group-content">
            <div className="form-consent-group">
              <label className="consent-checkbox">
                <span>문자(SMS)</span>
                <input type="checkbox" id="smsConsent" name="smsConsent" />
              </label>
              <label className="consent-checkbox">
                <span>이메일</span>
                <input type="checkbox" id="emailConsent" name="emailConsent" />
              </label>
            </div>
            <p className="form-consent-text">
              학습안내, 출석 관리 등의 SMS, 이메일 수신을 위하여 동의하여 주시기 바랍니다. 수신 미동의 시 개강
              안내, 학사일정, 할인정보 등의 주요 안내가 누락될 수 있습니다.
            </p>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="couponNumber" className="form-label">
            쿠폰번호
          </label>
          <div className="form-group-content">
            <div className="form-input-group">
              <input
                type="text"
                id="couponNumber"
                name="couponNumber"
                className="form-input"
                placeholder="쿠폰번호를 입력해주세요."
              />
              {/* TODO: 쿠폰 확인 API */}
              <button type="button" className="btn-check-coupon">
                쿠폰 확인
              </button>
            </div>
          </div>
        </div>

        <div className="additional-info-section">
          <h3 className="additional-info-title">부가정보</h3>

          <div className="form-group">
            <label htmlFor="educationLevel" className="form-label">
              최종학력 <Required />
            </label>
            <div className="form-group-content">
              <div className="form-education-group">
                <CustomSelect
                  className="custom-education-select"
                  name="educationLevel"
                  options={educationLevels}
                  value={educationLevel}
                  onChange={setEducationLevel}
                  markInitial
                />
                <input
                  type="text"
                  id="schoolName"
                  name="schoolName"
                  className="form-input form-school-input"
                  placeholder="학교명을 입력해주세요."
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="major" className="form-label">
              학과
            </label>
            <div className="form-group-content">
              <input type="text" id="major" name="major" className="form-input" placeholder="학과명을 입력해주세요." />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="interestArea" className="form-label">
              관심분야
            </label>
            <div className="form-group-content">
              <CustomSelect
                className="custom-interest-select"
                name="interestArea"
                options={interestAreas}
                value={interestArea}
                onChange={setInterestArea}
                markInitial
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">가입경로</label>
            <div className="form-group-content">
              <div className="form-registration-path">
                {registrationPathRows.map((row) => (
                  <div key={row[0].id} className="registration-path-row">
                    {row.map((path) => (
                      <label key={path.id} className="path-checkbox">
                        <span>{path.label}</span>
                        <input type="checkbox" id={path.id} name="registrationPath" value={path.value} />
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="refundAccount" className="form-label">
              환불계좌
            </label>
            <div className="form-group-content">
              <div className="form-refund-group">
                <input
                  ref={importantStyle("max-width", "90px")}
                  type="text"
                  id="bankName"
                  name="bankName"
                  className="form-input form-bank-input"
                  placeholder="은행명"
                />
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  className="form-input form-account-input"
                  placeholder="계좌번호를 입력해주세요"
                />
              </div>
              <p className="form-refund-notice">
                * 원활한 환불 처리를 위해 환불 계좌 정보는 반드시 정확하게 입력해 주시기 바랍니다. 학습자 본인의
                계좌 정보 오기재로 인해 발생하는 환불 관련 문제에 대해서는 교육원에서 책임지지 않으니 이 점 양해
                부탁드립니다.
              </p>
            </div>
          </div>
        </div>

        <div className="signup-btn-wrapper">
          <button type="submit" className="signup-next-btn" disabled={pending || !consent}>
            {pending ? "가입하는 중…" : "가입하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
