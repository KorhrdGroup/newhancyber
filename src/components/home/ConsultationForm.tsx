"use client";

import { useState, type FormEvent } from "react";
import CustomSelect from "@/components/common/CustomSelect";
import { CONTACT_PHONE, educationOptions, interestOptions, type SelectOption } from "./homeData";
import PrivacyConsentPopup from "./PrivacyConsentPopup";

interface SelectFieldProps {
  id: string;
  label: string;
  placeholder: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}

/**
 * 데스크톱은 기본 select, 모바일은 커스텀 드롭다운 (CSS 로 하나만 보임).
 * 둘 다 같은 값을 바라보므로 어느 쪽에서 골라도 제출 값이 같다.
 */
function SelectField({ id, label, placeholder, options, value, onChange }: SelectFieldProps) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <select
        id={id}
        name={id}
        className="form-select form-select-desktop"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <CustomSelect
        className="custom-select-mobile"
        optionClassName="custom-select-option"
        options={[{ value: "", label: placeholder }, ...options]}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

/** 회원가입 없는 간편상담 폼 */
export default function ConsultationForm() {
  const [interest, setInterest] = useState("");
  const [education, setEducation] = useState("");
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 상담 신청 API 연동 (new FormData(e.currentTarget))
    alert("상담 신청 API 연동 전입니다.");
  };

  return (
    <div className="consultation-form-area">
      <h3 className="form-title form-title-mobile">
        1:1 학습설계 담당자에게 <span className="highlight">무료</span> 상담받기
      </h3>
      <div className="consultation-form">
        <h3 className="form-title form-title-desktop">
          회원가입 필요없는 <span className="highlight">간편상담</span>
        </h3>
        <form className="consultation-form-content" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="이름을 입력해주세요"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              연락처
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              placeholder="-를 제외하고 입력하세요"
              required
            />
          </div>
          <SelectField
            id="interest"
            label="관심분야"
            placeholder="관심분야를 선택하세요"
            options={interestOptions}
            value={interest}
            onChange={setInterest}
          />
          <SelectField
            id="education"
            label="최종학력"
            placeholder="최종학력을 선택하세요"
            options={educationOptions}
            value={education}
            onChange={setEducation}
          />
          <div className="form-group form-checkbox-group">
            <label className="checkbox-label">
              <span className="checkbox-text">
                개인정보 활용 동의{" "}
                <a
                  href="#"
                  role="button"
                  className="checkbox-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsPrivacyOpen(true);
                  }}
                >
                  [내용보기]
                </a>
              </span>
              <input type="checkbox" id="privacy" name="privacy" className="checkbox-input" required />
            </label>
          </div>
          <button type="submit" className="form-submit-btn">
            상담 신청하기
          </button>
        </form>
        <div className="mobile-quick-phone">
          <p className="mobile-quick-phone-question">보다 빠른 학습상담을 원한다면?</p>
          <a href={`tel:${CONTACT_PHONE}`} className="mobile-quick-phone-number">
            {CONTACT_PHONE}
          </a>
        </div>
      </div>
      <PrivacyConsentPopup isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </div>
  );
}
