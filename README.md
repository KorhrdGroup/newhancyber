# 덧셈원격평생교육원 — Next.js

`~/Desktop/중요한거/src/main/webapp` 의 HTML 퍼블리싱을 Next.js(App Router) + TypeScript 로 옮긴 프로젝트입니다.
49개 페이지 본문과 jQuery 동작을 모두 옮겼습니다. DB/API 는 아직 붙이지 않았습니다 — 폼 제출·로그인 등은 안내창(alert)만 뜨고, 목록은 샘플 데이터입니다.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run lint
npm run build
```

## 폴더 구조

```
public/resources/        원본 images, fonts (경로 그대로: /resources/images/...)
scripts/html-to-jsx.py   퍼블리싱 HTML 조각 → JSX 1차 변환 도구
src/
  app/                   라우트 — 원본 폴더 구조 그대로, .html 만 뺌
    layout.tsx           공통 CSS + MobileHeader + Header + Footer
    <섹션>/layout.tsx    섹션 전용 CSS import (credit-bank.css 등)
  components/
    layout/              Header(GNB·스크롤 고정), MobileHeader(햄버거 사이드바), Footer,
                         MobileFooter·PageMobileFooter(모바일 푸터), MobileMenuContext(사이드바 상태 공유)
    common/              CustomSelect(커스텀 드롭다운)
    home/ member/ credit-bank/ social-worker/ practice-support/
    learning-support/ course-registration/ footer/ event/
                         섹션별 컴포넌트 + 샘플 데이터(*Data.ts, TODO: API)
  hooks/                 useBodyScrollLock
  lib/navigation.ts      GNB·모바일 메뉴·푸터 링크, 페이지별 모바일 헤더 줄·모바일 푸터 표시 규칙
  lib/importantStyle.ts  원본의 style="... !important" 인라인 재현
  types/                 공용 타입 (메뉴, 다음 우편번호)
  styles/                원본 CSS (url 경로만 /resources/... 로 수정)
```

## 주소 매핑

| 원본 | Next.js |
| --- | --- |
| `index.html` | `/` |
| `credit-bank/info.html` | `/credit-bank/info` |
| `learning-support/notice-detail.html` | `/learning-support/notice/[id]` |
| `learning-support/schedule-detail.html` | `/learning-support/schedule/[id]` |
| `learning-support/forms-data-room-detail.html` | `/learning-support/forms-data-room/[id]` |
| `practice-support/notice-detail.html` | `/practice-support/notice/[id]` |
| `course-registration/reviews-detail-normal.html` | `/course-registration/reviews/[id]` |
| `course-registration/reviews-detail.html` | `/course-registration/reviews/best/[id]` |
| `member/signup-step2.html`, `signup-step3.html` | `/member/signup/step2`, `/member/signup/step3` |
| `event/event.html` | `/event` |

옛 주소(`*.html`)로 들어오면 `next.config.ts` 의 redirect 가 새 주소로 보냅니다.
상세 페이지(`*-detail.html`)는 원본에 글 번호가 없었으므로 목록 페이지로 보냅니다.

## 다음 작업

1. API 연동 — 코드에서 `TODO` 를 찾으면 연동할 자리(폼 제출, 로그인, 목록·상세 데이터)가 나옵니다.
   상세 페이지(`[id]`)는 지금 번호와 관계없이 원본 샘플을 보여 줍니다.
2. "추후 오픈 예정" 메뉴는 `lib/navigation.ts` 의 `hidden: true` 를 지우면 열립니다. (해당 페이지 마크업은 이미 옮겨 둠)
3. `href="#"` 였던 링크는 `TBD_HREF` 로 표시해 두었습니다 (나의 강의실, SNS, 카카오톡 상담 등).

## 알아둘 점

- 빌드 폴더는 `.next` 가 아니라 `.next.nosync` 입니다. 이 폴더가 iCloud 동기화 안에 있어서,
  이름 끝을 `.nosync` 로 해 iCloud 가 빌드 파일을 건드리지 않게 했습니다 (`next.config.ts` 의 `distDir`).
- Swiper 는 `swiper` npm 패키지(`swiper/react`)를 씁니다. 원본은 11.2.10 이었지만 보안 취약점 때문에 12.2.0 으로 올렸습니다.
- 섹션 CSS 가 전역 클래스(`.page-title` 등)를 서로 다르게 정의하고 있습니다.
  Next.js 는 페이지를 옮겨 다녀도 한 번 불러온 CSS 를 내리지 않으므로, 섹션을 오가면 스타일이 섞일 수 있습니다.
  겹치는 부분이 보이면 CSS Modules 로 바꾸는 걸 권장합니다.
- `practice-support/notice/[id]` 는 원본처럼 `learning-support.css` 도 함께 불러옵니다.
