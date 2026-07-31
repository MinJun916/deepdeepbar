# DeepDeepBar QR Menu

혼술바/칵테일바를 위한 모바일 우선 QR 메뉴판 프론트엔드입니다.  
고객용 메뉴판(`/`)과 운영용 어드민(`/admin/*`)을 분리하고, REST API + JWT로 메뉴/레시피를 관리합니다.

## 주요 기능

- 모바일 우선 UI (태블릿/PC 대응)
- 홈 메뉴판: 검색(API `keyword`) + 카테고리 필터 + 시그니처 우선 정렬
- 메뉴 가격 옵션 표시 (기본/샷/보틀 등)
- 어드민 메뉴 관리
  - 메뉴 추가 / 검색·수정·삭제
  - react-hook-form + Zod 폼 검증
- 어드민 레시피 관리
  - 레시피 추가 / 검색·수정·삭제
  - 잔 종류, 제조 방식, 단계(steps) 편집
- 소개 오버레이, 스크롤 탑 버튼, 푸터(관리자 진입 링크)

## 기술 스택

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- TanStack Query
- Axios
- react-hook-form + Zod
- Sonner

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버는 HTTPS(`--experimental-https`)로 실행됩니다.  
브라우저에서 `https://localhost:3000` 접속.

## 환경변수

프로젝트 루트 `.env.local`:

```env
NEXT_PUBLIC_API_URL=
```

- `NEXT_PUBLIC_API_URL`: 백엔드 API base URL

## 라우트

- `/` : 고객 메뉴판
- `/admin/login` : 어드민 로그인
- `/admin` : 어드민 허브
- `/admin/menu` : 메뉴 관리 허브
- `/admin/menu/add` : 메뉴 추가
- `/admin/menu/manage` : 메뉴 검색/수정/삭제
- `/admin/recipe` : 레시피 관리 허브
- `/admin/recipe/add` : 레시피 추가
- `/admin/recipe/manage` : 레시피 검색/수정/삭제

## 인증/보호 구조

- 로그인: `POST /auth/login` → `access_token`을 localStorage에 저장
- 요청: Axios 인터셉터로 Bearer 토큰 첨부
- 갱신: 401 시 `POST /auth/refresh`(httpOnly `refresh_token` 쿠키) 후 재시도
- 로그아웃: `POST /auth/logout` + 토큰 제거
- 어드민 보호 라우트: `AdminAuthGuard`에서 클라이언트 토큰 확인 (`/admin/login` 제외)

## API 연동 개요

| 영역        | 메서드 | 경로                |
| ----------- | ------ | ------------------- |
| 메뉴 목록   | GET    | `/menus?keyword=`   |
| 메뉴 생성   | POST   | `/menus`            |
| 메뉴 수정   | PATCH  | `/menus/:id`        |
| 메뉴 삭제   | DELETE | `/menus/:id`        |
| 레시피 목록 | GET    | `/recipes?keyword=` |
| 레시피 생성 | POST   | `/recipes`          |
| 레시피 수정 | PATCH  | `/recipes/:id`      |
| 레시피 삭제 | DELETE | `/recipes/:id`      |
| 로그인      | POST   | `/auth/login`       |
| 토큰 갱신   | POST   | `/auth/refresh`     |
| 로그아웃    | POST   | `/auth/logout`      |

서비스 레이어: `src/services/`  
쿼리/뮤테이션: `src/hooks/queries/`, `src/hooks/mutations/`

## 데이터 흐름

- 고객 메뉴판: `src/views/home/index.tsx`
  - `useMenusQuery`로 메뉴 조회
  - `is_display = true` 메뉴만 노출
  - 카테고리 필터는 클라이언트에서 처리
- 메뉴 카드: `src/components/menu/menuCard/index.tsx`
- Axios 클라이언트: `src/lib/axios.ts`
- 토큰 유틸: `src/lib/token.ts`

## 참고 파일

- 기본 폰트: `public/fonts/PretendardVariable.woff2`
