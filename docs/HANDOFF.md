# 이어서 작업하기 (맥북 · 다른 컴퓨터)

2026-11-26 윈도우 세션에서 한 일을 다른 컴퓨터에서 이어 가기 위한 메모. 남은 일 목록은 [`docs/TODO.md`](TODO.md), 보고 문구는 [`docs/reports/2026-11-26.md`](reports/2026-11-26.md).
이 저장소는 **공개**다 — 서버 주소 · 계정 이름 · 비밀번호 · 키는 여기에 쓰지 않는다.

## 지금 상태

| 저장소 | main | 배포 |
|---|---|---|
| KorhrdGroup/newhancyber (홈페이지) | `de37b4c` (#18 · #19 · #20 병합) | Vercel 운영 배포 완료 |
| KorhrdGroup/newhancyber-lms (관리자) | `15dab25` (#1 장바구니 현황 병합) | Vercel 운영 배포 완료 |

열린 PR · 커밋 안 한 변경 없음.

## 시작하기

1. 두 저장소를 받는다 (`newhancyber`, `newhancyber-lms`). 맥북에 이미 있으면 `git pull`.
2. `.env.local` (git 에 안 올라감) — `DB_*` · `SESSION_SECRET` 는 Vercel 환경 변수와 같은 값. 강의 영상을 보려면 `VIDEO_SIGNING_SECRET` (CDMS · video-gate Worker 와 같은 값)도.
3. 표를 새로 만들 때만 `.env.admin.local` 에 서버 관리자 계정(`DB_ADMIN_USER` · `DB_ADMIN_PASSWORD`)을 넣는다. 앱 계정은 데이터 읽기 · 쓰기만 된다.
4. `npm install` → `npm run dev`. 로컬에서도 **운영과 같은 DB** 에 붙는다.

## 작업 규칙

- **같은 DB 를 쓴다.** 홈페이지가 쓰는 표 · 상태 이름은 LMS 코드(`newhancyber-lms/src/lib/db/*.ts` 맨 위 주석, `src/lib/payments.ts` 등)를 그대로 따른다 — 홈페이지에서 한 일이 LMS 관리자 화면에 그대로 보여야 한다.
- **스키마는 Azure 에서 직접 읽는다** (`sys.columns`). 예전에 받은 `newhancyber-db` 는 옛 스키마다. CHECK 제약 · 필터 인덱스 조건은 관리자 계정으로만 보인다.
- **새 표:** `docs/db/*.sql` 에 쓰고 관리자 계정으로 실행. 회원 · 차수에 거는 외래키는 `ON DELETE CASCADE` (LMS 에서 지워도 안 깨지게). 맥북의 `newhancyber-db/sql/schema/` 에도 다음 번호로 넣는다.
- **시험 데이터:** 운영 DB 라서 먼저 사용자에게 묻고, `[테스트]` 를 붙여 만들고, 확인 뒤 지운다. 읽기만 하는 확인은 `BEGIN TRANSACTION … ROLLBACK` 안에서.
- **시간:** DB 는 UTC(`SYSDATETIME`). 한국 날짜는 `DATEADD(HOUR, 9, SYSUTCDATETIME())`.
- **화면:** `alert` · `confirm` 을 쓰지 않는다 (앱 안 브라우저가 막는다) — 화면 안 안내 · 두 번 누르기로.
- **`"use server"` 파일**은 async 함수만 내보낸다 (상수 · 목록은 `src/lib/*.ts` 로).
- **`.env.example` 에 실제 값을 넣지 않는다** — 두 번 들어간 적이 있다. 비밀 값은 `.env.local` 에만.

## 커밋 · 배포

- 브랜치 → PR → Vercel 미리보기 확인 → 병합 = **운영 배포** (같은 DB 라 바로 실사용).
- Vercel 팀은 팀원이 만든 커밋만 배포한다 → 커밋 작성자를 **KorhrdGroup** 으로:
  `git -c user.name=KorhrdGroup -c user.email="$(gh api user --jq .id)+KorhrdGroup@users.noreply.github.com" commit …` (gh 가 KorhrdGroup 으로 로그인돼 있을 때)
- 윈도우에서 `npm install` 하면 `package-lock.json` 이 바뀐다 — 커밋 전에 되돌린다.
- 윈도우 Turbopack 빌드는 mssql 의존성에서 멈춘다 → 윈도우에서는 `next build --webpack` 으로 확인. 맥 · Vercel 은 괜찮다.

## 화면 현황 페이지

https://claude.ai/artifact/Nwk4DN9YTnzf1Ha5qypCkK — 세 사이트 화면별 상태. 화면을 연결하면 그 줄 상태를 `live` 로 바꾸고 다시 올린다
(Claude 에서는 이 주소를 먼저 읽고(read) 같은 주소로 올린다).

## 남아 있는 시험 기록

시험 계정에 결제 #96 · #97, 환불 #22, 장학 #20, 쿠폰 WELCOME 이 남아 있다 (결제 · 환불 · 장학 흐름 확인용). 지울지 사용자에게 물어보고 정리한다.
강의 평가 · 학습 게시판 · 시험 확인용으로 만든 데이터는 모두 지웠다.
