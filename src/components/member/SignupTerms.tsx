"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import MarketingText from "./terms/MarketingText";
import PrivacyCollectOptionalText from "./terms/PrivacyCollectOptionalText";
import PrivacyCollectRequiredText from "./terms/PrivacyCollectRequiredText";
import PrivacyProvideText from "./terms/PrivacyProvideText";
import TermsOfServiceText from "./terms/TermsOfServiceText";
import TermsBox from "./TermsBox";

type TermKey = "terms" | "agreement1" | "agreement2" | "privacy1" | "privacy2";

const terms: {
  key: TermKey;
  title: string;
  required: boolean;
  /** 동의 안 했을 때 안내 (필수 항목만) */
  message?: string;
  Text: () => React.ReactNode;
}[] = [
  {
    key: "terms",
    title: "덧셈원격평생교육원 웹사이트의 이용약관에 동의합니다.",
    required: true,
    message: "이용약관에 동의해주세요.",
    Text: TermsOfServiceText,
  },
  {
    key: "agreement1",
    title: "개인정보 수집 및 이용에 대한 동의",
    required: true,
    message: "개인정보 수집 및 이용에 동의해주세요.",
    Text: PrivacyCollectRequiredText,
  },
  {
    key: "agreement2",
    title: "개인정보 제공 및 이용동의",
    required: true,
    message: "개인정보 제공 및 이용동의에 동의해주세요.",
    Text: PrivacyProvideText,
  },
  { key: "privacy1", title: "개인정보 수집 및 이용에 대한 동의", required: false, Text: PrivacyCollectOptionalText },
  { key: "privacy2", title: "개인정보의 마케팅 및 광고 활용", required: false, Text: MarketingText },
];

const initialChecks: Record<TermKey, boolean> = {
  terms: false,
  agreement1: false,
  agreement2: false,
  privacy1: false,
  privacy2: false,
};

/** 회원가입 1단계: 약관 동의 */
export default function SignupTerms() {
  const router = useRouter();
  const [checks, setChecks] = useState(initialChecks);
  const allChecked = Object.values(checks).every(Boolean);

  const setAll = (checked: boolean) =>
    setChecks(Object.fromEntries(terms.map((t) => [t.key, checked])) as Record<TermKey, boolean>);

  const handleNext = () => {
    const missing = terms.find((t) => t.required && !checks[t.key]);
    if (missing) {
      alert(missing.message);
      return;
    }
    // TODO: 선택 약관 동의 여부(privacy1, privacy2)를 2단계로 넘기기
    router.push("/member/signup/step2");
  };

  return (
    <>
      <div className="step1-wrapper">
        <div className="all-chk-box">
          <div className="inner">
            <div className="input-box">
              <input type="checkbox" id="all_chk" checked={allChecked} onChange={(e) => setAll(e.target.checked)} />
              <label htmlFor="all_chk">
                <strong>모든 약관을 확인하고 모두 동의합니다.</strong>
                <span className="all-chk-detail">
                  이용약관, 개인정보 수집 및 이용(필수/선택), 정보수집 및 이용(선택), 마케팅 및
                  광고활용(선택)에 모두 동의합니다.
                </span>
              </label>
            </div>
          </div>
        </div>

        {terms.map(({ key, title, required, Text }) => (
          <TermsBox
            key={key}
            id={`${key}-chk`}
            title={title}
            required={required}
            checked={checks[key]}
            onChange={(checked) => setChecks((prev) => ({ ...prev, [key]: checked }))}
          >
            <Text />
          </TermsBox>
        ))}
      </div>

      <div className="signup-btn-wrapper">
        <button type="button" className="signup-next-btn" id="nextBtn" onClick={handleNext}>
          다음
        </button>
      </div>
    </>
  );
}
