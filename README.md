# DeepDeepBar QR Menu

혼술바/칵테일바를 위한 모바일 우선 QR 메뉴판 프로젝트입니다.

- Next.js App Router 기반 메뉴판 화면
- Supabase 연동으로 메뉴 데이터 조회
- `/admin`에서 Dashboard 없이 메뉴 추가/수정/삭제
- `/admin` 경로 Basic Auth 최소 보안 적용

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## 환경변수

프로젝트 루트 `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SECRET_KEY=

# optional (기본값: Menu)
NEXT_PUBLIC_SUPABASE_COCKTAILS_TABLE=Menu

# /admin 보호용 Basic Auth
ADMIN_BASIC_AUTH_USERNAME=
ADMIN_BASIC_AUTH_PASSWORD=
```

설명:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`: 공개 키(읽기/기본 클라이언트)
- `SUPABASE_SECRET_KEY`: 서버 전용 비밀 키(어드민 CRUD용)
- `NEXT_PUBLIC_SUPABASE_COCKTAILS_TABLE`: 메뉴 테이블명 (기본 `Menu`)
- `ADMIN_BASIC_AUTH_*`: `/admin` 접근 보호 계정

## Supabase 테이블 컬럼 기준

현재 앱은 아래 컬럼명을 기준으로 동작합니다.

- `id` (uuid)
- `category` (enum: `cocktail`, `whisky`, `non-alcohol`, `highball`, `side`)
- `name`
- `name_en`
- `description`
- `price` (int)
- `abv` (float/numeric nullable)
- `taste_note`
- `tags` (jsonb array)
- `is_signature` (bool)

## 라우트

- `/` : 사용자 메뉴판
- `/admin` : 어드민 허브
- `/admin/add` : 메뉴 추가
- `/admin/manage` : 검색/카테고리 필터 + 수정/삭제

## 데이터 불러오기/관리 구조

- 사용자 메뉴판: `src/app/page.tsx`에서 Supabase 조회 후 `src/views/home`로 전달
- 어드민 CRUD: `src/app/admin/actions.ts` 서버 액션 + `src/lib/supabase/admin.ts`
- `/admin` 보호: `src/middleware.ts` Basic Auth

## 참고 파일

- 샘플 CSV: `cocktails_mock.csv`
- 기본 폰트: `public/fonts/PretendardVariable.woff2`
