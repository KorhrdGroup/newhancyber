/**
 * 회원가입 화면의 고르는 값 — 화면(SignupForm)과 서버 검사(member/actions.ts)가 같이 쓴다.
 * DB 에는 관리자 화면에서 바로 읽히도록 이름표(label)를 저장한다.
 */

export const PHONE_PREFIXES = ["010", "011", "016", "017", "018", "019"] as const;

export const EMAIL_DOMAINS = ["naver.com", "gmail.com", "daum.net", "hanmail.net", "yahoo.com"] as const;

export const EDUCATION_LEVELS = [
  { value: "high-school", label: "고등학교 졸업" },
  { value: "college-2", label: "전문대학 졸업(2년제)" },
  { value: "college-3", label: "전문대학 졸업(3년제)" },
  { value: "university-enrolled", label: "대학교 재학" },
  { value: "university-dropout", label: "대학교 중퇴" },
  { value: "university-4", label: "대학교 졸업(4년제)" },
  { value: "other", label: "기타" },
] as const;

export const INTEREST_AREAS = [
  { value: "social-welfare", label: "사회복지" },
  { value: "etc", label: "기타" },
] as const;

/** 가입경로 (화면의 줄 나눔 그대로) */
export const JOIN_PATH_ROWS = [
  [
    { id: "pathNaver", value: "naver", label: "네이버검색" },
    { id: "pathDaum", value: "daum", label: "다음검색" },
    { id: "pathOtherSite", value: "other-site", label: "기타사이트검색" },
  ],
  [
    { id: "pathFriend", value: "friend", label: "지인 추천" },
    { id: "pathAd", value: "ad", label: "인터넷 광고물 이미지" },
  ],
  [
    { id: "pathPoster", value: "poster", label: "포스터(길거리, 버스, 지하철)" },
    { id: "pathOther", value: "other", label: "기타" },
  ],
] as const;

export const JOIN_PATHS = JOIN_PATH_ROWS.flat();

/** 아이디: 6~10자 영문 소문자·숫자 */
export const LOGIN_ID_PATTERN = /^[a-z0-9]{6,10}$/;
export const LOGIN_ID_RULE = "아이디는 6~10자의 영문 소문자와 숫자로 입력해 주세요.";

/** 비밀번호: 8~20자, 영문 · 숫자 · 특수문자를 모두 넣는다 */
export function passwordProblem(password: string): string | null {
  if (password.length < 8 || password.length > 20) return "비밀번호는 8~20자로 입력해 주세요.";
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return "비밀번호에 영문, 숫자, 특수문자를 모두 넣어 주세요.";
  }
  if (/\s/.test(password)) return "비밀번호에 공백은 쓸 수 없어요.";
  return null;
}

/**
 * 생년월일 — 8자리 숫자(예: 19900101). 실제로 있는 날짜이고 1900년 이후 · 오늘 이전이어야 한다.
 * 맞으면 "YYYY-MM-DD", 아니면 null. 오늘은 한국 날짜 기준이다.
 */
export function parseBirthDate(value: string): string | null {
  // 19900101 과 1990-01-01(자동완성) 두 모양만 받는다. 그 밖(9자리, 섞인 글자)은 거절
  const m = /^(\d{4})-?(\d{2})-?(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const [, y, mo, d] = m;
  const iso = `${y}-${mo}-${d}`;
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso) return null;
  return Number(y) >= 1900 && iso <= todayKst() ? iso : null;
}

/** 가입할 수 있는 나이 — 만 14세 미만은 개인정보 처리에 법정대리인 동의가 필요해 받지 않는다 */
export const MIN_SIGNUP_AGE = 14;

/**
 * 만 나이가 기준 이상인지 — 생년월일(YYYY-MM-DD)과 오늘(한국 날짜)로 센다.
 * 생일이 지났으면(생일 당일 포함) 한 살을 더한 것으로 본다. 2월 29일생은 평년에는 3월 1일에 나이를 먹는다.
 */
export function isAtLeastAge(birthIso: string, age: number, todayIso = todayKst()): boolean {
  const [ty, tmd] = [Number(todayIso.slice(0, 4)), todayIso.slice(5)];
  // 기준 날짜 = 오늘에서 age 년 전 (같은 월·일). 그날이나 그 전에 태어났으면 만 age 세 이상.
  // 오늘이 2월 29일이면 기준이 없는 날짜(평년 2월 29일)가 되지만, 날짜 순서로만 비교하므로 결과는 맞다 — 날짜 검사를 덧붙이지 말 것
  const cutoff = `${ty - age}-${tmd}`;
  return birthIso <= cutoff;
}

function todayKst(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** 1단계(약관)에서 2단계로 넘기는 동의 — sessionStorage 에 잠깐 둔다 */
export const SIGNUP_CONSENT_KEY = "hc.signup.consent";
/** 가입을 마친 뒤 3단계(완료) 화면에 보여 줄 정보 — sessionStorage */
export const SIGNUP_DONE_KEY = "hc.signup.done";

export interface SignupConsent {
  /** 필수 약관 3개에 모두 동의했는지 */
  required: true;
  privacyOptional: boolean;
  marketing: boolean;
}

export interface SignupDone {
  name: string;
  loginId: string;
  phone: string;
  email: string;
}
