"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { saveProfile, type ProfileInput } from "@/app/my-page/profile/actions";
import { educationLevels, emailDomains, phonePrefixes } from "../myPageDataB";

const DAUM_POSTCODE_SRC = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

/** 수정 화면에 처음 채울 값 (서버가 회원 정보에서 만든다) */
export interface ProfileFormMember {
  userId: string;
  name: string;
  birth: string;
  phone: [string, string, string];
  emailId: string;
  emailDomain: string;
  postalCode: string;
  address: string;
  addressDetail: string;
  /** EDUCATION_LEVELS 의 value (모르는 값이면 "") */
  education: string;
  schoolName: string;
  major: string;
  smsConsent: boolean;
  emailConsent: boolean;
}

/** 필수 칸 표시 */
const Req = () => <span className="mp-req">*</span>;

/** 한 칸: 위에 항목 이름, 아래 값·입력 칸 (다른 신청서와 같은 모양) */
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

/**
 * U35 내 정보 수정 2단계 — 회원 정보 수정 (항목 · 검사는 회원가입과 같음). 저장은 서버 액션 saveProfile 이
 * 다시 검사하고, 1단계 확인(10분)이 끝났으면 1단계로 돌려보낸다. 알림 창 대신 화면 안에 안내한다.
 */
export default function ProfileEditForm({ member }: { member: ProfileFormMember }) {
  const router = useRouter();
  const [phone, setPhone] = useState(member.phone);
  const [emailId, setEmailId] = useState(member.emailId);
  const knownDomain = (emailDomains as readonly string[]).includes(member.emailDomain);
  const [emailDomain, setEmailDomain] = useState(knownDomain ? member.emailDomain : "");
  const [emailDomainInput, setEmailDomainInput] = useState(knownDomain ? "" : member.emailDomain);
  const [postalCode, setPostalCode] = useState(member.postalCode);
  const [address, setAddress] = useState(member.address);
  const [addressDetail, setAddressDetail] = useState(member.addressDetail);
  const [education, setEducation] = useState(member.education);
  const [schoolName, setSchoolName] = useState(member.schoolName);
  const [major, setMajor] = useState(member.major);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [smsConsent, setSmsConsent] = useState(member.smsConsent);
  const [emailConsent, setEmailConsent] = useState(member.emailConsent);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [withdrawInfo, setWithdrawInfo] = useState(false);
  const [pending, start] = useTransition();
  const detailRef = useRef<HTMLInputElement>(null);

  const setPhonePart = (i: 0 | 1 | 2, v: string) => {
    const next = [...phone] as ProfileFormMember["phone"];
    next[i] = i === 0 ? v : v.replace(/\D/g, "");
    setPhone(next);
  };

  const findPostcode = () => {
    if (!window.daum?.Postcode) {
      setNotice({ ok: false, text: "주소 검색을 불러오는 중이에요. 잠시 뒤 다시 눌러 주세요." });
      return;
    }
    new window.daum.Postcode({
      oncomplete: (data) => {
        setPostalCode(data.zonecode);
        setAddress(data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress);
        setAddressDetail("");
        detailRef.current?.focus();
      },
    }).open();
  };

  const fail = (text: string, field?: string) => {
    setNotice({ ok: false, text });
    if (field) document.getElementById(field)?.focus();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone[1] || !phone[2]) return fail("휴대폰 번호를 입력해 주세요.", "edit-phone");
    if (!emailId || !(emailDomain || emailDomainInput)) return fail("이메일을 입력해 주세요.", "edit-email");
    if (newPassword && newPassword !== newPasswordConfirm) return fail("새 비밀번호 확인이 새 비밀번호와 달라요.", "edit-new-password-confirm");
    const input: ProfileInput = {
      phonePrefix: phone[0],
      phoneMiddle: phone[1],
      phoneLast: phone[2],
      emailLocal: emailId,
      emailDomain: emailDomain || emailDomainInput,
      postalCode,
      address,
      addressDetail,
      education,
      schoolName,
      major,
      newPassword,
      newPasswordConfirm,
      smsAgree: smsConsent,
      emailAgree: emailConsent,
    };
    setNotice(null);
    start(async () => {
      const r = await saveProfile(input);
      if (r.expired) {
        router.push("/my-page/profile");
        return;
      }
      if (r.ok) {
        setNewPassword("");
        setNewPasswordConfirm("");
        setNotice({ ok: true, text: r.message });
        router.refresh();
      } else fail(r.message, r.field);
    });
  };

  return (
    <form onSubmit={submit} noValidate>
      <Script src={DAUM_POSTCODE_SRC} strategy="afterInteractive" />
      <section className="pp-box mp-form">
        <div className="mp-form-head">
          <h3 className="pp-box-title">기본 정보</h3>
          <p className="pp-note">
            <Req /> 표시는 필수 입력 사항입니다.
          </p>
        </div>
        <p className="pp-note mq-form-desc">아이디·이름·생년월일은 바꿀 수 없어요. 이름이 바뀌었다면 학습지원센터로 문의해 주세요.</p>
        <Field label="아이디">
          <p className="mp-static">{member.userId}</p>
        </Field>
        <Field label="이름">
          <p className="mp-static">{member.name}</p>
        </Field>
        <Field label="생년월일">
          <p className="mp-static">{member.birth || "-"}</p>
        </Field>
      </section>

      <section className="pp-box mp-form">
        <h3 className="pp-box-title mq-form-title">연락처·주소</h3>
        <Field label="휴대폰" htmlFor="edit-phone" req>
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
        <Field label="이메일" htmlFor="edit-email" req>
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
        <Field label="주소" htmlFor="edit-postal" req>
          <div className="mq-inline">
            <input id="edit-postal" className="ds-input mq-postal" value={postalCode} readOnly placeholder="우편번호" />
            <button type="button" className="ds-btn ds-btn--secondary mq-fixed" onClick={findPostcode}>
              우편번호 찾기
            </button>
          </div>
          <input className="ds-input ds-mt-8" value={address} readOnly placeholder="주소" aria-label="주소" />
          <input
            id="edit-address-detail"
            ref={detailRef}
            className="ds-input ds-mt-8"
            value={addressDetail}
            placeholder="상세주소"
            aria-label="상세주소"
            maxLength={200}
            onChange={(e) => setAddressDetail(e.target.value)}
          />
        </Field>
        <Field label="최종학력" htmlFor="edit-education" req>
          <select id="edit-education" className="ds-select" value={education} onChange={(e) => setEducation(e.target.value)}>
            <option value="">최종학력을 선택해 주세요.</option>
            {educationLevels.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="학교명" htmlFor="edit-school" req>
          <input id="edit-school" className="ds-input" maxLength={100} value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
        </Field>
        <Field label="전공" htmlFor="edit-major">
          <input id="edit-major" className="ds-input" maxLength={100} value={major} onChange={(e) => setMajor(e.target.value)} />
        </Field>
      </section>

      <section className="pp-box mp-form">
        <h3 className="pp-box-title mq-form-title">비밀번호 변경</h3>
        <p className="pp-note mq-form-desc">바꿀 때만 입력하세요. 비워 두면 지금 비밀번호를 그대로 써요. 바꾸면 다른 기기에서는 다시 로그인해야 해요.</p>
        <Field label="새 비밀번호" htmlFor="edit-new-password">
          <input
            id="edit-new-password"
            type="password"
            className="ds-input"
            placeholder="8~20자 이내의 영문/숫자/특수문자"
            autoComplete="new-password"
            maxLength={20}
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
            maxLength={20}
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
          />
        </Field>
      </section>

      <section className="pp-box mp-form">
        <h3 className="pp-box-title mq-form-title">마케팅 수신 동의</h3>
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

      {notice && (
        <p className={notice.ok ? "ds-text-success" : "ds-text-danger"} role={notice.ok ? "status" : "alert"}>
          {notice.text}
        </p>
      )}
      <div className="pp-actions">
        <Link href="/my-page/certificates" className="ds-btn ds-btn--secondary">
          취소
        </Link>
        <button type="submit" className="ds-btn ds-btn--primary" disabled={pending}>
          {pending ? "저장하는 중…" : "저장"}
        </button>
      </div>
      <p className="mq-withdraw">
        <button type="button" className="ds-btn ds-btn--ghost ds-btn--sm" onClick={() => setWithdrawInfo((v) => !v)} aria-expanded={withdrawInfo}>
          회원 탈퇴
        </button>
      </p>
      {withdrawInfo && (
        <p className="pp-note ds-text-center" role="status">
          회원 탈퇴는 수강 · 결제 기록 확인이 필요해 학습지원센터에서 도와드려요. 1:1 문의로 남겨 주세요.
        </p>
      )}
    </form>
  );
}
