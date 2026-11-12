"use client";

import Link from "next/link";
import { useState } from "react";
import { educationLevels, emailDomains, phonePrefixes, type sampleMember } from "../myPageDataB";

type Member = typeof sampleMember;

/** 한 줄: 왼쪽 항목 이름, 오른쪽 값·입력 칸 */
function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div className="mq-field">
      {htmlFor ? (
        <label className="mq-field-label" htmlFor={htmlFor}>
          {label}
        </label>
      ) : (
        <span className="mq-field-label">{label}</span>
      )}
      <div className="mq-field-control">{children}</div>
    </div>
  );
}

/** U35 내 정보 수정 2단계 — 회원 정보 수정 (항목은 회원가입 SignupForm 과 같음) */
export default function ProfileEditForm({ member }: { member: Member }) {
  const [phone, setPhone] = useState(member.phone);
  const [emailId, setEmailId] = useState(member.emailId);
  const [emailDomain, setEmailDomain] = useState(emailDomains.includes(member.emailDomain) ? member.emailDomain : "");
  const [emailDomainInput, setEmailDomainInput] = useState(emailDomains.includes(member.emailDomain) ? "" : member.emailDomain);
  // TODO: 우편번호 찾기 연결 시 setter 를 꺼내 씀
  const [postalCode] = useState(member.postalCode);
  const [address] = useState(member.address);
  const [addressDetail, setAddressDetail] = useState(member.addressDetail);
  const [education, setEducation] = useState(member.education);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [smsConsent, setSmsConsent] = useState(member.smsConsent);
  const [emailConsent, setEmailConsent] = useState(member.emailConsent);

  const setPhonePart = (i: 0 | 1 | 2, v: string) => {
    const next = [...phone] as Member["phone"];
    next[i] = v.replace(/\D/g, "");
    setPhone(next);
  };

  const findPostcode = () => {
    // TODO: 우편번호 찾기 (회원가입 SignupForm 처럼 다음 우편번호 서비스 연결 → 우편번호·주소 채움)
    alert("우편번호 찾기 연동 전입니다.");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone[1] || !phone[2]) {
      alert("휴대폰 번호를 입력해 주세요.");
      return;
    }
    if (!emailId || !(emailDomain || emailDomainInput)) {
      alert("이메일을 입력해 주세요.");
      return;
    }
    if (newPassword || newPasswordConfirm) {
      if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/.test(newPassword)) {
        alert("새 비밀번호는 8~20자의 영문·숫자·특수문자를 섞어 주세요.");
        return;
      }
      if (newPassword !== newPasswordConfirm) {
        alert("새 비밀번호가 서로 달라요. 다시 확인해 주세요.");
        return;
      }
    }
    // TODO: API 회원 정보 수정 (phone, email, address, education, newPassword, smsConsent, emailConsent)
    alert("내 정보 수정 API 연동 전입니다.");
  };

  const withdraw = () => {
    if (!confirm("정말 탈퇴할까요? 탈퇴하면 학습 기록을 다시 볼 수 없어요.")) return;
    // TODO: API 회원 탈퇴 (탈퇴 사유·안내 화면은 정해지면 추가)
    alert("회원 탈퇴 API 연동 전입니다.");
  };

  return (
    <form onSubmit={submit}>
      <section className="pp-box">
        <h3 className="pp-box-title">기본 정보</h3>
        <p className="pp-note">아이디·이름·생년월일은 바꿀 수 없어요. 이름이 바뀌었다면 학습지원센터로 문의해 주세요.</p>
        <div className="mq-fields ds-mt-12">
          <Field label="아이디">{member.userId}</Field>
          <Field label="이름">{member.name}</Field>
          <Field label="생년월일">{member.birth}</Field>
        </div>
      </section>

      <section className="pp-box">
        <h3 className="pp-box-title">연락처·주소</h3>
        <div className="mq-fields">
          <Field label="휴대폰" htmlFor="edit-phone">
            <div className="mq-phone">
              <select id="edit-phone" className="ds-select" value={phone[0]} onChange={(e) => setPhonePart(0, e.target.value)}>
                {phonePrefixes.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <input className="ds-input" inputMode="numeric" maxLength={4} aria-label="휴대폰 가운데 번호" value={phone[1]} onChange={(e) => setPhonePart(1, e.target.value)} />
              <input className="ds-input" inputMode="numeric" maxLength={4} aria-label="휴대폰 끝 번호" value={phone[2]} onChange={(e) => setPhonePart(2, e.target.value)} />
            </div>
          </Field>
          <Field label="이메일" htmlFor="edit-email">
            <div className="mq-inline">
              <input id="edit-email" className="ds-input" value={emailId} onChange={(e) => setEmailId(e.target.value)} />
              <span className="mq-at">@</span>
              <select className="ds-select" aria-label="이메일 도메인" value={emailDomain} onChange={(e) => setEmailDomain(e.target.value)}>
                <option value="">직접 입력</option>
                {emailDomains.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              {!emailDomain && (
                <input className="ds-input" placeholder="직접 입력" aria-label="이메일 도메인 직접 입력" value={emailDomainInput} onChange={(e) => setEmailDomainInput(e.target.value)} />
              )}
            </div>
          </Field>
          <Field label="주소" htmlFor="edit-postal">
            <div className="mq-inline">
              <input id="edit-postal" className="ds-input mq-postal" value={postalCode} readOnly placeholder="우편번호" />
              <button type="button" className="ds-btn ds-btn--secondary mq-fixed" onClick={findPostcode}>
                우편번호 찾기
              </button>
            </div>
            <input className="ds-input ds-mt-8" value={address} readOnly placeholder="주소" aria-label="주소" />
            <input className="ds-input ds-mt-8" value={addressDetail} placeholder="상세주소" aria-label="상세주소" onChange={(e) => setAddressDetail(e.target.value)} />
          </Field>
          <Field label="최종학력" htmlFor="edit-education">
            <select id="edit-education" className="ds-select" value={education} onChange={(e) => setEducation(e.target.value)}>
              <option value="">골라 주세요</option>
              {educationLevels.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className="pp-box">
        <h3 className="pp-box-title">비밀번호 변경</h3>
        <p className="pp-note">바꿀 때만 입력하세요. 비워 두면 지금 비밀번호를 그대로 써요.</p>
        <div className="mq-fields ds-mt-12">
          <Field label="새 비밀번호" htmlFor="edit-new-password">
            <input
              id="edit-new-password"
              type="password"
              className="ds-input"
              placeholder="8~20자 이내의 영문/숫자/특수문자"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Field>
          <Field label="새 비밀번호 확인" htmlFor="edit-new-password-confirm">
            <input
              id="edit-new-password-confirm"
              type="password"
              className="ds-input"
              placeholder="새 비밀번호를 한 번 더 입력해 주세요."
              autoComplete="new-password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
            />
          </Field>
        </div>
      </section>

      <section className="pp-box">
        <h3 className="pp-box-title">마케팅 수신 동의</h3>
        <div className="mq-checks">
          <label className="ds-check">
            <input type="checkbox" checked={smsConsent} onChange={(e) => setSmsConsent(e.target.checked)} />
            문자(SMS)
          </label>
          <label className="ds-check">
            <input type="checkbox" checked={emailConsent} onChange={(e) => setEmailConsent(e.target.checked)} />
            이메일
          </label>
        </div>
        <p className="pp-note ds-mt-8">
          동의하지 않으면 개강 안내, 학사일정, 할인 정보 같은 안내를 받지 못할 수 있어요. 출석·시험처럼 꼭 필요한 학습 안내는 동의와 관계없이 보내 드려요.
        </p>
      </section>

      <div className="pp-actions">
        <Link href="/my-page/certificates" className="ds-btn ds-btn--secondary ds-btn--lg">
          취소
        </Link>
        <button type="submit" className="ds-btn ds-btn--primary ds-btn--lg">
          저장
        </button>
      </div>
      <p className="mq-withdraw">
        <button type="button" className="ds-btn ds-btn--ghost ds-btn--sm" onClick={withdraw}>
          회원 탈퇴
        </button>
      </p>
    </form>
  );
}
